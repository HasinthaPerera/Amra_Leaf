import { NextResponse } from 'next/server';
import { verifyAdminApi } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logAuditActivity } from '@/lib/audit';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await verifyAdminApi();
  if (response) return response;
  
  const { id } = await context.params;

  try {
    const training = await prisma.trainingModule.findUnique({
      where: { id },
      include: {
        progress: {
          include: {
            user: {
              select: { id: true, name: true, employeeId: true }
            }
          },
          orderBy: { completedAt: 'desc' }
        }
      }
    });

    if (!training) {
      return NextResponse.json({ error: 'Training module not found' }, { status: 404 });
    }

    return NextResponse.json(training);
  } catch (error) {
    console.error('Error fetching training module:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await verifyAdminApi();
  if (response) return response;
  
  const { id } = await context.params;

  try {
    const body = await request.json();
    const { title, description, estimatedMinutes, status, content } = body;

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title.trim();
    if (description !== undefined) dataToUpdate.description = description.trim();
    if (content !== undefined) dataToUpdate.content = content.trim();
    if (estimatedMinutes !== undefined) {
      const estMins = parseInt(estimatedMinutes, 10);
      if (isNaN(estMins) || estMins <= 0) {
        return NextResponse.json({ error: 'Estimated minutes must be a positive number.' }, { status: 400 });
      }
      dataToUpdate.estimatedMinutes = estMins;
    }
    if (status !== undefined) {
      const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
      }
      dataToUpdate.status = status;
    }

    const updatedModule = await prisma.trainingModule.update({
      where: { id },
      data: dataToUpdate,
    });

    await logAuditActivity(user.id, 'TRAINING_UPDATED', 'TrainingModule', id);

    return NextResponse.json(updatedModule);
  } catch (error: any) {
    console.error('Error updating training module:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Training module not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
