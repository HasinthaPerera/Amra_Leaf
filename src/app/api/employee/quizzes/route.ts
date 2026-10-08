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
      const userProg = qz.trainingModule?.progress && qz.trainingModule.progress.length > 0 ? qz.trainingModule.progress[0] : null;
      const isTrainingCompleted = userProg?.status === 'COMPLETED';
      const isTrainingInProgress = userProg?.status === 'IN_PROGRESS';
      
      const latestAttempt = qz.attempts.length > 0 ? qz.attempts[0] : null;
      const passedAny = qz.attempts.some(a => a.passed);
      
      let state: 'LOCKED' | 'UNLOCKED' | 'AVAILABLE' | 'RETAKE_AVAILABLE' | 'PASSED' = 'LOCKED';
      let moduleStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING_ASSESSMENT' | 'COMPLETED' = 'NOT_STARTED';

      if (!isTrainingCompleted) {
        state = 'LOCKED';
        moduleStatus = isTrainingInProgress ? 'IN_PROGRESS' : 'NOT_STARTED';
      } else {
        if (passedAny) {
          state = 'PASSED';
          moduleStatus = 'COMPLETED';
        } else if (latestAttempt && !latestAttempt.passed) {
          state = 'RETAKE_AVAILABLE';
          moduleStatus = 'PENDING_ASSESSMENT';
        } else {
          state = 'UNLOCKED';
          moduleStatus = 'PENDING_ASSESSMENT';
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
        moduleStatus,
        isTrainingCompleted,
        attemptsCount: qz.attempts.length,
        latestAttempt: latestAttempt ? {
          id: latestAttempt.id,
          score: latestAttempt.score,
          totalQuestions: latestAttempt.totalQuestions,
          percentage: latestAttempt.percentage,
          passed: latestAttempt.passed,
          submittedAt: latestAttempt.submittedAt,
        } : null,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching employee quizzes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
