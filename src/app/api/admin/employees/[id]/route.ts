import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminApi } from '@/lib/auth';
import { logAuditActivity } from '@/lib/audit';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminApi();
  if (auth.response) return auth.response;
  
  const { id } = await context.params;

  try {
    const employee = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        department: true,
        status: true,
        role: true,
        createdAt: true,
      },
    });

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    if (employee.role !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'Cannot access admin accounts through this API' }, { status: 403 });
    }

    // Exclude role before returning, as it's an employee
    const { role, ...safeEmployee } = employee;
    return NextResponse.json(safeEmployee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdminApi();
  if (auth.response) return auth.response;
  
  const { id } = await context.params;

  try {
    // Ensure target exists and is an EMPLOYEE
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    if (targetUser.role !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'Cannot modify admin accounts through this API' }, { status: 403 });
    }

    const body = await request.json();
    
    // Only extract whitelisted fields
    let { name, email, department, status } = body;
    
    const updateData: any = {};

    if (name !== undefined) {
      if (!name.trim()) return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
      updateData.name = name.trim();
    }

    if (email !== undefined) {
      if (!email.trim()) return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
      email = email.trim().toLowerCase();
      if (!/\S+@\S+\.\S+/.test(email)) {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
      }
      updateData.email = email;
    }

    if (department !== undefined) {
      if (!department.trim()) return NextResponse.json({ error: 'Department is required' }, { status: 400 });
      updateData.department = department.trim();
    }

    if (status !== undefined) {
      if (status !== 'ACTIVE' && status !== 'INACTIVE') {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      updateData.status = status;
    }

    const updatedEmployee = await prisma.user.update({
      where: { id },
      data: updateData,
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

    await logAuditActivity(auth.user.id, 'EMPLOYEE_STATUS_CHANGED', 'User', id);

    return NextResponse.json(updatedEmployee);
  } catch (error: any) {
    console.error('Error updating employee:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json({ error: 'Email address already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}
