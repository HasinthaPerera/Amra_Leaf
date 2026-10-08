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
        },
        quizzes: {
          where: { status: 'PUBLISHED' },
          include: {
            attempts: {
              where: { userId: user.id },
              orderBy: { submittedAt: 'desc' }
            },
            _count: {
              select: { questions: true }
            }
          }
        }
      }
    });

    if (!training) {
      return NextResponse.json({ error: 'Published training module not found' }, { status: 404 });
    }

    const userProg = training.progress && training.progress.length > 0 ? training.progress[0] : null;
    const isContentCompleted = userProg?.status === 'COMPLETED';
    const isContentInProgress = userProg?.status === 'IN_PROGRESS';

    const linkedQuiz = training.quizzes && training.quizzes.length > 0 ? training.quizzes[0] : null;
    const attempts = linkedQuiz?.attempts || [];
    const latestAttempt = attempts.length > 0 ? attempts[0] : null;
    const passedQuiz = attempts.some(a => a.passed);

    let moduleStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING_ASSESSMENT' | 'COMPLETED' = 'NOT_STARTED';
    let quizState: 'LOCKED' | 'UNLOCKED' | 'RETAKE_AVAILABLE' | 'PASSED' = 'LOCKED';

    if (!isContentCompleted) {
      moduleStatus = isContentInProgress ? 'IN_PROGRESS' : 'NOT_STARTED';
      quizState = 'LOCKED';
    } else {
      if (linkedQuiz) {
        if (passedQuiz) {
          moduleStatus = 'COMPLETED';
          quizState = 'PASSED';
        } else if (attempts.length > 0) {
          moduleStatus = 'PENDING_ASSESSMENT';
          quizState = 'RETAKE_AVAILABLE';
        } else {
          moduleStatus = 'PENDING_ASSESSMENT';
          quizState = 'UNLOCKED';
        }
      } else {
        moduleStatus = 'COMPLETED';
        quizState = 'UNLOCKED';
      }
    }

    const formattedTraining = {
      ...training,
      moduleStatus,
      quizInfo: linkedQuiz ? {
        id: linkedQuiz.id,
        title: linkedQuiz.title,
        description: linkedQuiz.description,
        passMark: linkedQuiz.passMark,
        questionCount: linkedQuiz._count.questions,
        state: quizState,
        latestAttempt: latestAttempt ? {
          score: latestAttempt.score,
          totalQuestions: latestAttempt.totalQuestions,
          percentage: latestAttempt.percentage,
          passed: latestAttempt.passed,
          submittedAt: latestAttempt.submittedAt,
        } : null,
        attemptsCount: attempts.length,
        passed: passedQuiz,
      } : null
    };

    return NextResponse.json(formattedTraining);
  } catch (error) {
    console.error('Error fetching employee training module:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
