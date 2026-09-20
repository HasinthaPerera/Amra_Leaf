import { NextResponse } from 'next/server';
import { verifyAdminApi } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateEmployeeCompliance } from '@/lib/services/complianceService';
import { UserRole, UserStatus } from '@prisma/client';

export async function GET() {
  const { response } = await verifyAdminApi();
  if (response) return response;

  try {
    const activeEmployees = await prisma.user.findMany({
      where: { role: UserRole.EMPLOYEE, status: UserStatus.ACTIVE },
      select: { id: true }
    });

    const complianceList = [];
    for (const emp of activeEmployees) {
      const data = await calculateEmployeeCompliance(emp.id);
      if (data) {
        complianceList.push(data);
      }
    }

    return NextResponse.json(complianceList);
  } catch (error) {
    console.error('Error fetching compliance list:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
