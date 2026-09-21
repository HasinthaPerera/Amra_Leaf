import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { verifyAdminApi } from '@/lib/auth';
import { logAuditActivity } from '@/lib/audit';
import { sendWelcomeEmail } from '@/lib/email';

export async function GET() {
  const auth = await verifyAdminApi();
  if (auth.response) return auth.response;

  try {
    const employees = await prisma.user.findMany({
      where: { role: 'EMPLOYEE' },
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        department: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

/**
 * Auto-generates the next employee ID in EMP-XXX format.
 * Queries existing EMPLOYEE users, finds the highest EMP-XXX number, and increments.
 */
async function generateNextEmployeeId(): Promise<string> {
  const employees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' },
    select: { employeeId: true },
  });

  let maxNum = 0;
  for (const emp of employees) {
    // Match both EMP-001 and EMP001 formats
    const match = emp.employeeId.match(/^EMP-?(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }

  const nextNum = maxNum + 1;
  return `EMP-${String(nextNum).padStart(3, '0')}`;
}

export async function POST(request: Request) {
  const auth = await verifyAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    let { name, email, department, password, status } = body;

    if (!name || !name.trim()) return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    if (!email || !email.trim()) return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    if (!department || !department.trim()) return NextResponse.json({ error: 'Department is required' }, { status: 400 });
    if (!password || password.length < 8) return NextResponse.json({ error: 'Password must contain at least 8 characters.' }, { status: 400 });

    email = email.trim().toLowerCase();

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (status !== 'ACTIVE' && status !== 'INACTIVE') {
      status = 'ACTIVE';
    }

    // Auto-generate the next employee ID
    const employeeId = await generateNextEmployeeId();

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newEmployee = await prisma.user.create({
      data: {
        employeeId,
        name: name.trim(),
        email,
        department: department.trim(),
        passwordHash,
        role: 'EMPLOYEE',
        status,
      },
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        department: true,
        status: true,
        createdAt: true,
      },
    });

    await logAuditActivity(auth.user.id, 'EMPLOYEE_CREATED', 'User', newEmployee.id);

    // Send welcome email (non-blocking — failure does not affect response)
    sendWelcomeEmail(newEmployee.email, newEmployee.name, newEmployee.employeeId, password)
      .catch((err) => console.error('[Email] Non-blocking welcome email error:', err));

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    console.error('Error creating employee:', error);

    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('employeeId')) {
        return NextResponse.json({ error: 'Employee ID already exists.' }, { status: 400 });
      }
      if (error.meta?.target?.includes('email')) {
        return NextResponse.json({ error: 'Email address already exists.' }, { status: 400 });
      }
    }
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
