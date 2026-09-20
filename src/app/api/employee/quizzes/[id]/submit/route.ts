import { NextResponse } from 'next/server';
import { verifyEmployeeApi } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await verifyEmployeeApi();
  if (response) return response;
  
  const { id } = await context.params;

  try {
    const body = await request.json();
    const { answers } = body; // format: { "question-id-1": 0, "question-id-2": 1 }

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid answers format.' }, { status: 400 });
    }

    // Load Quiz and correct answers from DB
    const quiz = await prisma.quiz.findFirst({
      where: { id, status: 'PUBLISHED' },
      include: {
        trainingModule: {
          include: {
            progress: { where: { userId: user.id } }
          }
        },
        questions: true // we need correctAnswers here server-side!
      }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found.' }, { status: 404 });
    }

    // Verify training completed
    const isTrainingCompleted = quiz.trainingModule?.progress && 
                                quiz.trainingModule.progress.length > 0 && 
                                quiz.trainingModule.progress[0].status === 'COMPLETED';
    
    if (!isTrainingCompleted) {
      return NextResponse.json({ error: 'Complete the related training module before taking this quiz.' }, { status: 403 });
    }

    const totalQuestions = quiz.questions.length;
    let score = 0;

    // Validate and score
    for (const q of quiz.questions) {
      const submittedAnswer = answers[q.id];
      if (submittedAnswer === undefined || submittedAnswer === null) {
        return NextResponse.json({ error: `Missing answer for question: ${q.id}` }, { status: 400 });
      }
      const answerInt = parseInt(submittedAnswer, 10);
      if (isNaN(answerInt) || answerInt < 0 || answerInt > 3) {
        return NextResponse.json({ error: `Invalid answer value for question: ${q.id}` }, { status: 400 });
      }
      
      if (answerInt === q.correctAnswer) {
        score++;
      }
    }

    // Check for extraneous keys in answers to prevent tampering
    const submittedKeys = Object.keys(answers);
    for (const key of submittedKeys) {
      if (!quiz.questions.find(q => q.id === key)) {
        return NextResponse.json({ error: 'Submitted answers contain invalid or unknown question IDs.' }, { status: 400 });
      }
    }

    // Calculate pass/fail
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const passed = percentage >= quiz.passMark;

    // Create a new Attempt!
    const newAttempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        score,
        totalQuestions,
        percentage,
        passed
      }
    });

    return NextResponse.json(newAttempt);
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
