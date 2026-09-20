import { NextResponse } from 'next/server';
import { verifyAdminApi } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { logAuditActivity } from '@/lib/audit';

export async function GET() {
  const { user, response } = await verifyAdminApi();
  if (response) return response;

  try {
    const modules = await prisma.trainingModule.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(modules);
  } catch (error) {
    console.error('Error fetching training modules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { user, response } = await verifyAdminApi();
  if (response) return response;

  try {
    const body = await request.json();
    const { title, description, estimatedMinutes, status, content } = body;

    if (!title?.trim() || !description?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Title, description, and content are required.' }, { status: 400 });
    }

    const estMins = parseInt(estimatedMinutes, 10);
    if (isNaN(estMins) || estMins <= 0) {
      return NextResponse.json({ error: 'Estimated minutes must be a positive number.' }, { status: 400 });
    }

    const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    const newModule = await prisma.trainingModule.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        estimatedMinutes: estMins,
        status,
      },
    });

    await logAuditActivity(user.id, 'TRAINING_CREATED', 'TrainingModule', newModule.id);

    return NextResponse.json(newModule, { status: 201 });
  } catch (error) {
    console.error('Error creating training module:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
