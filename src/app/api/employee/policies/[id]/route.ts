import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'EMPLOYEE') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await context.params;

  try {
    const policy = await prisma.policy.findUnique({
      where: { id }
    });

    if (!policy || policy.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Policy not found or not published' }, { status: 404 });
    }

    const ack = await prisma.policyAcknowledgement.findUnique({
      where: {
        userId_policyId_policyVersion: {
          userId: user.id,
          policyId: policy.id,
          policyVersion: policy.version
        }
      }
    });

    return NextResponse.json({
      ...policy,
      publishedDate: policy.publishedAt ? policy.publishedAt.toISOString().split('T')[0] : null,
      isAcknowledged: !!ack,
      acknowledgedAt: ack ? ack.acknowledgedAt : null,
    });
  } catch (error) {
    console.error('Error fetching employee policy:', error);
    return NextResponse.json({ error: 'Failed to fetch policy' }, { status: 500 });
  }
}
