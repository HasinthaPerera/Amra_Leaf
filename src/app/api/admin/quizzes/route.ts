import { NextResponse } from 'next/server';
import { verifyAdminApi } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logAuditActivity } from '@/lib/audit';

export async function GET() {
  const { user, response } = await verifyAdminApi();
  if (response) return response;

  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        trainingModule: {
          select: { title: true }
        },
        _count: {
          select: { questions: true }
        }
      },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching admin quizzes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { user, response } = await verifyAdminApi();
  if (response) return response;

  try {
    const body = await request.json();
    const { title, description, passMark, status, trainingId, questions } = body;

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 });
    }

    const pm = parseInt(passMark, 10);
    if (isNaN(pm) || pm < 0 || pm > 100) {
      return NextResponse.json({ error: 'Pass mark must be a valid percentage (0-100).' }, { status: 400 });
    }

    const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    const newQuiz = await prisma.$transaction(async (tx) => {
      const qz = await tx.quiz.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          passMark: pm,
          status,
          trainingId: trainingId || null,
        },
      });

      if (questions && Array.isArray(questions)) {
        for (const q of questions) {
          await tx.quizQuestion.create({
            data: {
              quizId: qz.id,
              question: q.question,
              optionA: q.options[0],
              optionB: q.options[1],
              optionC: q.options[2],
              optionD: q.options[3],
              correctAnswer: parseInt(q.correctAnswer, 10),
            }
          });
        }
      }
      return qz;
    });

    await logAuditActivity(user.id, 'QUIZ_CREATED', 'Quiz', newQuiz.id);

    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
