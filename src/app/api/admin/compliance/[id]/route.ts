import { NextResponse } from 'next/server';
import { verifyAdminApi } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateEmployeeCompliance } from '@/lib/services/complianceService';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { response } = await verifyAdminApi();
  if (response) return response;

  const { id } = await context.params;

  try {
    // Note: the complianceService inherently checks for EMPLOYEE role and non-admin
    const data = await calculateEmployeeCompliance(id);
    if (!data) {
      return NextResponse.json({ error: 'Compliance data not available or user is not an employee.' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching compliance detail:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
