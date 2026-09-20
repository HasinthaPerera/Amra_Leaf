import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logAuditActivity } from '@/lib/audit';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
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

    // Upsert or Create? The constraint prevents duplicates.
    const ack = await prisma.policyAcknowledgement.create({
      data: {
        userId: user.id,
        policyId: policy.id,
        policyVersion: policy.version
      }
    });

    await logAuditActivity(user.id, 'POLICY_ACKNOWLEDGED', 'Policy', policy.id);

    return NextResponse.json(ack, { status: 201 });
  } catch (error: any) {
    console.error('Error acknowledging policy:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'You have already acknowledged this version of the policy.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to acknowledge policy' }, { status: 500 });
  }
}
