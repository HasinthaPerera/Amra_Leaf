import { NextResponse } from 'next/server';
import { verifyEmployeeApi } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateEmployeeCompliance } from '@/lib/services/complianceService';

export async function GET() {
  const { user, response } = await verifyEmployeeApi();
  if (response) return response;

  try {
    const data = await calculateEmployeeCompliance(user.id);
    if (!data) {
      return NextResponse.json({ error: 'Compliance data not available.' }, { status: 404 });
    }

    // Get full details for pending items for the dashboard feed
    const pendingPolicyIds = data.policyDetails.filter(p => p.status === 'PENDING').map(p => p.id);
    const pendingTrainingIds = data.trainingDetails.filter(t => t.status !== 'COMPLETED').map(t => t.id);

    const pendingPoliciesFull = await prisma.policy.findMany({
      where: { id: { in: pendingPolicyIds } }
    });

    const pendingTrainingFull = await prisma.trainingModule.findMany({
      where: { id: { in: pendingTrainingIds } },
      take: 3
    });

    // Also get the progress for pending training to show the progress bar
    const userProgress = await prisma.trainingProgress.findMany({
      where: { userId: user.id, trainingId: { in: pendingTrainingIds } }
    });

    const pendingTrainingMerged = pendingTrainingFull.map(t => {
      const prog = userProgress.find(p => p.trainingId === t.id);
      return {
        id: t.id,
        title: t.title,
        description: t.description,
        estimatedDuration: `${t.estimatedMinutes} min`,
        progressPercent: prog?.progressPercentage || 0
      };
    });

    return NextResponse.json({
      policiesAcknowledged: data.policiesAcknowledged,
      policiesRequired: data.policiesRequired,
      trainingCompleted: data.trainingCompleted,
      trainingRequired: data.trainingRequired,
      quizzesPassed: data.quizzesPassed,
      quizzesRequired: data.quizzesRequired,
      compliancePercentage: data.overallComplianceRate,
      pendingActionCount: data.pendingActionCount,
      userName: data.name,
      pendingPolicies: pendingPoliciesFull.map(p => ({
        id: p.id,
        title: p.title,
        version: p.version,
        publishedDate: p.publishedAt ? p.publishedAt.toISOString().split('T')[0] : p.createdAt.toISOString().split('T')[0]
      })),
      pendingTraining: pendingTrainingMerged
    });
  } catch (error) {
    console.error('Error fetching employee dashboard stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
