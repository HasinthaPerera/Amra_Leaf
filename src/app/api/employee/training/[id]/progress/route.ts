import { NextResponse } from 'next/server';
import { verifyEmployeeApi } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logAuditActivity } from '@/lib/audit';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await verifyEmployeeApi();
  if (response) return response;
  
  const { id } = await context.params;

  try {
    const body = await request.json();
    const { action } = body;

    if (!action || !['START', 'COMPLETE'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be START or COMPLETE.' }, { status: 400 });
    }

    // Verify module is PUBLISHED
    const module = await prisma.trainingModule.findFirst({
      where: { id, status: 'PUBLISHED' }
    });

    if (!module) {
      return NextResponse.json({ error: 'Published training module not found.' }, { status: 404 });
    }

    // Get current progress
    const existingProgress = await prisma.trainingProgress.findUnique({
      where: {
        userId_trainingId: {
          userId: user.id,
          trainingId: id,
        }
      }
    });

    let newProgress;

    if (action === 'START') {
      if (!existingProgress || existingProgress.status === 'NOT_STARTED') {
        newProgress = await prisma.trainingProgress.upsert({
          where: {
            userId_trainingId: {
              userId: user.id,
              trainingId: id,
            }
          },
          update: {
            status: 'IN_PROGRESS',
            progressPercentage: 0,
            startedAt: new Date(),
          },
          create: {
            userId: user.id,
            trainingId: id,
            status: 'IN_PROGRESS',
            progressPercentage: 0,
            startedAt: new Date(),
          }
        });
      } else {
        // Already started or completed, do not reset startedAt
        newProgress = existingProgress;
      }
    } else if (action === 'COMPLETE') {
      newProgress = await prisma.trainingProgress.upsert({
        where: {
          userId_trainingId: {
            userId: user.id,
            trainingId: id,
          }
        },
        update: {
          status: 'COMPLETED',
          progressPercentage: 100,
          completedAt: new Date(),
        },
        create: {
          userId: user.id,
          trainingId: id,
          status: 'COMPLETED',
          progressPercentage: 100,
          startedAt: new Date(),
          completedAt: new Date(),
        }
      });

      await logAuditActivity(user.id, 'TRAINING_COMPLETED', 'TrainingModule', id);
    }

    return NextResponse.json(newProgress);
  } catch (error) {
    console.error('Error updating training progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
