import { NextResponse } from 'next/server';
import { verifyEmployeeApi } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const { user, response } = await verifyEmployeeApi();
  if (response) return response;

  try {
    const quizzes = await prisma.quiz.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        trainingModule: {
          select: { 
            id: true,
            title: true,
            progress: {
              where: { userId: user.id }
            }
          }
        },
        attempts: {
          where: { userId: user.id },
          orderBy: { submittedAt: 'desc' }
        },
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { id: 'asc' },
    });
    
    // Calculate if it's locked and requirement status
    const result = quizzes.map((qz) => {
      const isTrainingCompleted = qz.trainingModule?.progress && qz.trainingModule.progress.length > 0 && qz.trainingModule.progress[0].status === 'COMPLETED';
      
      const latestAttempt = qz.attempts.length > 0 ? qz.attempts[0] : null;
      const passedAny = qz.attempts.some(a => a.passed);
      
      let state = 'LOCKED';
      if (isTrainingCompleted) {
        if (passedAny) {
          state = 'PASSED';
        } else {
          state = 'AVAILABLE';
        }
      }

      return {
        id: qz.id,
        title: qz.title,
        description: qz.description,
        passMark: qz.passMark,
        trainingId: qz.trainingId,
        trainingTitle: qz.trainingModule?.title,
        questionCount: qz._count.questions,
        state,
        latestAttempt,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching employee quizzes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
