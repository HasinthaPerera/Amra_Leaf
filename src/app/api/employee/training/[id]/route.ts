import { NextResponse } from 'next/server';
import { verifyEmployeeApi } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await verifyEmployeeApi();
  if (response) return response;
  
  const { id } = await context.params;

  try {
    const training = await prisma.trainingModule.findFirst({
      where: { 
        id, 
        status: 'PUBLISHED' 
      },
      include: {
        progress: {
          where: { userId: user.id }
        }
      }
    });

    if (!training) {
      return NextResponse.json({ error: 'Published training module not found' }, { status: 404 });
    }

    return NextResponse.json(training);
  } catch (error) {
    console.error('Error fetching employee training module:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
