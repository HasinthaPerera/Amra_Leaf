import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { verifyAdminApi } from '@/lib/auth';
import { logAuditActivity } from '@/lib/audit';

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

export async function POST(request: Request) {
  const auth = await verifyAdminApi();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    let { employeeId, name, email, department, password, status } = body;

    if (!employeeId || !employeeId.trim()) return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    if (!name || !name.trim()) return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    if (!email || !email.trim()) return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    if (!department || !department.trim()) return NextResponse.json({ error: 'Department is required' }, { status: 400 });
    if (!password || password.length < 8) return NextResponse.json({ error: 'Password must contain at least 8 characters.' }, { status: 400 });

    employeeId = employeeId.trim();
    email = email.trim().toLowerCase();
    
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (status !== 'ACTIVE' && status !== 'INACTIVE') {
      status = 'ACTIVE';
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user (Prisma unique constraint errors will be caught)
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
