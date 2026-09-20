import { NextResponse } from 'next/server';
import { verifyAdminApi } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const { user, response } = await verifyAdminApi();
  if (response) return response;

  try {
    const logs = await prisma.auditLog.findMany({
      take: 100, // Limit to recent 100
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, employeeId: true }
        }
      }
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
