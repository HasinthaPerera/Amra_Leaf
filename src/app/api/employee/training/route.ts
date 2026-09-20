import { NextResponse } from 'next/server';
import { verifyEmployeeApi } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const { user, response } = await verifyEmployeeApi();
  if (response) return response;

  try {
    const modules = await prisma.trainingModule.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: {
        progress: {
          where: { userId: user.id }
        }
      }
    });
    return NextResponse.json(modules);
  } catch (error) {
    console.error('Error fetching employee training modules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
