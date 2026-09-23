import { NextResponse } from 'next/server';
import { verifyEmployeeApi } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await verifyEmployeeApi();
  if (response) return response;
  
  const { id } = await context.params;

  try {
    const quiz = await prisma.quiz.findFirst({
      where: { 
        id, 
        status: 'PUBLISHED' 
      },
      include: {
        trainingModule: {
          include: {
            progress: {
              where: { userId: user.id }
            }
          }
        },
        // EXPLICIT SELECT to NEVER return correctAnswer to the client
        questions: {
          select: {
            id: true,
            quizId: true,
            question: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
          },
          orderBy: { id: 'asc' }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Published quiz not found' }, { status: 404 });
    }

    // Verify related training is COMPLETED
    const isTrainingCompleted = quiz.trainingModule?.progress && 
                                quiz.trainingModule.progress.length > 0 && 
                                quiz.trainingModule.progress[0].status === 'COMPLETED';
    
    if (!isTrainingCompleted) {
      return NextResponse.json({ error: 'Complete the related training module before taking this quiz.' }, { status: 403 });
    }

    const formattedQuiz = {
      id: quiz.id,
      trainingId: quiz.trainingId,
      title: quiz.title,
      description: quiz.description,
      passMark: quiz.passMark,
      questions: (quiz.questions || []).map((q) => ({
        id: q.id,
        question: q.question,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
      })),
    };

    return NextResponse.json(formattedQuiz);
  } catch (error) {
    console.error('Error fetching employee quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
