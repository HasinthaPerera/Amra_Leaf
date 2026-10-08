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

    const formattedModules = modules.map((m) => {
      const userProg = m.progress && m.progress.length > 0 ? m.progress[0] : null;
      const isContentCompleted = userProg?.status === 'COMPLETED';
      const isContentInProgress = userProg?.status === 'IN_PROGRESS';

      const linkedQuiz = m.quizzes && m.quizzes.length > 0 ? m.quizzes[0] : null;
      const attempts = linkedQuiz?.attempts || [];
      const latestAttempt = attempts.length > 0 ? attempts[0] : null;
      const passedQuiz = attempts.some(a => a.passed);

      let moduleStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING_ASSESSMENT' | 'COMPLETED' = 'NOT_STARTED';
      let quizState: 'LOCKED' | 'UNLOCKED' | 'RETAKE_AVAILABLE' | 'PASSED' = 'LOCKED';

      if (!isContentCompleted) {
        moduleStatus = isContentInProgress ? 'IN_PROGRESS' : 'NOT_STARTED';
        quizState = 'LOCKED';
      } else {
        // Content is finished
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

      return {
        ...m,
        moduleStatus,
        quizInfo: linkedQuiz ? {
          id: linkedQuiz.id,
          title: linkedQuiz.title,
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
    });

    return NextResponse.json(formattedModules);
  } catch (error) {
    console.error('Error fetching employee training modules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
