import { NextResponse } from 'next/server';
import { verifyAdminApi } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logAuditActivity } from '@/lib/audit';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await verifyAdminApi();
  if (response) return response;
  
  const { id } = await context.params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { id: 'asc' }
        },
        attempts: {
          include: {
            user: {
              select: { id: true, name: true, employeeId: true, department: true }
            }
          },
          orderBy: { submittedAt: 'desc' }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await verifyAdminApi();
  if (response) return response;
  
  const { id } = await context.params;

  try {
    const body = await request.json();
    const { title, description, passMark, status, trainingId, questions } = body;

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title.trim();
    if (description !== undefined) dataToUpdate.description = description.trim();
    if (trainingId !== undefined) dataToUpdate.trainingId = trainingId;
    if (passMark !== undefined) {
      const pm = parseInt(passMark, 10);
      if (isNaN(pm) || pm < 0 || pm > 100) {
        return NextResponse.json({ error: 'Pass mark must be a valid percentage (0-100).' }, { status: 400 });
      }
      dataToUpdate.passMark = pm;
    }
    if (status !== undefined) {
      const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
      }
      dataToUpdate.status = status;
    }

    // Update quiz and questions in a transaction if questions are provided
    const updatedQuiz = await prisma.$transaction(async (tx) => {
      const qz = await tx.quiz.update({
        where: { id },
        data: dataToUpdate,
      });

      if (questions && Array.isArray(questions)) {
        // Delete old questions (or you could upsert, but deleting and recreating is simpler for full replace)
        await tx.quizQuestion.deleteMany({
          where: { quizId: id }
        });

        // Insert new questions
        for (const q of questions) {
          await tx.quizQuestion.create({
            data: {
              quizId: id,
              question: q.question,
              optionA: q.optionA,
              optionB: q.optionB,
              optionC: q.optionC,
              optionD: q.optionD,
              correctAnswer: parseInt(q.correctAnswer, 10),
            }
          });
        }
      }

      return qz;
    });

    await logAuditActivity(user.id, 'QUIZ_UPDATED', 'Quiz', id);

    return NextResponse.json(updatedQuiz);
  } catch (error: any) {
    console.error('Error updating quiz:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
