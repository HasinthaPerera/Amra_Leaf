import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'EMPLOYEE') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    // Get the latest published version for each policy key
    const policies = await prisma.policy.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      distinct: ['policyKey'],
    });

    const policyIds = policies.map(p => p.id);

    // Get the current user's acknowledgements for these specific policy rows
    const acks = await prisma.policyAcknowledgement.findMany({
      where: {
        userId: user.id,
        policyId: { in: policyIds }
      }
    });

    const ackMap = new Set(acks.map(a => a.policyId));

    const enrichedPolicies = policies.map(p => {
      const ack = acks.find(a => a.policyId === p.id);
      return {
        ...p,
        publishedDate: p.publishedAt ? p.publishedAt.toISOString().split('T')[0] : null,
        isAcknowledged: ackMap.has(p.id),
        acknowledgedAt: ack ? ack.acknowledgedAt : null,
      };
    });

    return NextResponse.json(enrichedPolicies);
  } catch (error) {
    console.error('Error fetching employee policies:', error);
    return NextResponse.json({ error: 'Failed to fetch policies' }, { status: 500 });
  }
}
