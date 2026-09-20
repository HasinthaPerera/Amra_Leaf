import { NextResponse } from 'next/server';
import { verifyEmployeeApi } from '@/lib/auth';
import { calculateEmployeeCompliance } from '@/lib/services/complianceService';

export async function GET() {
  const { user, response } = await verifyEmployeeApi();
  if (response) return response;

  try {
    const data = await calculateEmployeeCompliance(user.id);
    if (!data) {
      return NextResponse.json({ error: 'Compliance data not available.' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching employee compliance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
