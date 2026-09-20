import prisma from '@/lib/prisma';
import { UserRole, UserStatus } from '@prisma/client';

export interface EmployeeComplianceResult {
  userId: string;
  name: string;
  email: string;
  department: string;
  employeeId: string;
  
  // Percentages
  policyCompletionRate: number;
  trainingCompletionRate: number;
  quizPassRate: number;
  overallComplianceRate: number;
  
  overallStatus: 'COMPLIANT' | 'PENDING' | 'INCOMPLETE';
  
  // Raw counts for dashboard
  policiesAcknowledged: number;
  policiesRequired: number;
  trainingCompleted: number;
  trainingRequired: number;
  quizzesPassed: number;
  quizzesRequired: number;
  
  pendingActionCount: number;

  // Detailed breakdowns for audit/My Progress
  policyDetails: {
    id: string;
    title: string;
    version: string;
    status: 'SIGNED' | 'PENDING';
    acknowledgedAt: Date | null;
  }[];

  trainingDetails: {
    id: string;
    title: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    completedAt: Date | null;
  }[];

  quizDetails: {
    id: string;
    title: string;
    latestScore: number | null;
    latestPercentage: number | null;
    latestResult: 'PASSED' | 'FAILED' | null;
    latestAttemptAt: Date | null;
    requirementStatus: 'PASSED' | 'PENDING' | 'FAILED';
    attemptsCount: number;
  }[];

  trainingNeeds: {
    title: string;
    need: 'Policy Review Required' | 'Training Required' | 'Training In Progress' | 'Quiz Required' | 'Retraining Recommended' | 'No Current Training Need';
    type: 'POLICY' | 'TRAINING' | 'QUIZ';
  }[];
}

export async function calculateEmployeeCompliance(userId: string): Promise<EmployeeComplianceResult | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      acknowledgements: { include: { policy: true } },
      trainingProgress: true,
      quizAttempts: {
        orderBy: { submittedAt: 'desc' }
      }
    }
  });

  if (!user || user.role === UserRole.ADMIN || user.status === UserStatus.INACTIVE) {
    return null;
  }

  // 1. Get current required policies (latest PUBLISHED version per policyKey)
  const allPublishedPolicies = await prisma.policy.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' } // Assumes latest created is current
  });

  const currentPoliciesMap = new Map<string, typeof allPublishedPolicies[0]>();
  for (const p of allPublishedPolicies) {
    if (!currentPoliciesMap.has(p.policyKey)) {
      currentPoliciesMap.set(p.policyKey, p);
    }
  }
  const currentPolicies = Array.from(currentPoliciesMap.values());

  // 2. Get current required training modules
  const currentTrainingModules = await prisma.trainingModule.findMany({
    where: { status: 'PUBLISHED' }
  });

  // 3. Get current required quizzes (linked to current training modules)
  const trainingModuleIds = currentTrainingModules.map(t => t.id);
  const currentQuizzes = await prisma.quiz.findMany({
    where: {
      status: 'PUBLISHED',
      trainingId: { in: trainingModuleIds }
    }
  });

  // Calculate Policy Compliance
  let policiesAcknowledged = 0;
  const policyDetails: EmployeeComplianceResult['policyDetails'] = [];
  const trainingNeeds: EmployeeComplianceResult['trainingNeeds'] = [];
  let pendingActionCount = 0;

  for (const policy of currentPolicies) {
    // Check if the user has acknowledged this EXACT policy row
    const ack = user.acknowledgements.find(a => a.policyId === policy.id);
    if (ack) {
      policiesAcknowledged++;
      policyDetails.push({
        id: policy.id,
        title: policy.title,
        version: policy.version,
        status: 'SIGNED',
        acknowledgedAt: ack.acknowledgedAt
      });
    } else {
      pendingActionCount++;
      policyDetails.push({
        id: policy.id,
        title: policy.title,
        version: policy.version,
        status: 'PENDING',
        acknowledgedAt: null
      });
      trainingNeeds.push({
        title: policy.title,
        need: 'Policy Review Required',
        type: 'POLICY'
      });
    }
  }

  // Calculate Training Compliance
  let trainingCompleted = 0;
  const trainingDetails: EmployeeComplianceResult['trainingDetails'] = [];
  
  for (const module of currentTrainingModules) {
    const progress = user.trainingProgress.find(p => p.trainingId === module.id);
    
    if (progress?.status === 'COMPLETED') {
      trainingCompleted++;
      trainingDetails.push({
        id: module.id,
        title: module.title,
        status: 'COMPLETED',
        completedAt: progress.completedAt
      });
    } else {
      if (progress?.status !== 'IN_PROGRESS') pendingActionCount++;
      trainingDetails.push({
        id: module.id,
        title: module.title,
        status: progress?.status || 'NOT_STARTED',
        completedAt: null
      });

      trainingNeeds.push({
        title: module.title,
        need: progress?.status === 'IN_PROGRESS' ? 'Training In Progress' : 'Training Required',
        type: 'TRAINING'
      });
    }
  }

  // Calculate Quiz Compliance
  let quizzesPassed = 0;
  const quizDetails: EmployeeComplianceResult['quizDetails'] = [];

  for (const quiz of currentQuizzes) {
    const attempts = user.quizAttempts.filter(a => a.quizId === quiz.id);
    const passedAny = attempts.some(a => a.passed);
    const latestAttempt = attempts[0]; // Ordered desc by submittedAt
    
    // Check related training completion
    const trainingProg = user.trainingProgress.find(p => p.trainingId === quiz.trainingId);
    const isTrainingCompleted = trainingProg?.status === 'COMPLETED';

    if (passedAny) {
      quizzesPassed++;
      quizDetails.push({
        id: quiz.id,
        title: quiz.title,
        latestScore: latestAttempt?.score || null,
        latestPercentage: latestAttempt?.percentage || null,
        latestResult: latestAttempt?.passed ? 'PASSED' : 'FAILED',
        latestAttemptAt: latestAttempt?.submittedAt || null,
        requirementStatus: 'PASSED',
        attemptsCount: attempts.length
      });
    } else {
      pendingActionCount++;
      quizDetails.push({
        id: quiz.id,
        title: quiz.title,
        latestScore: latestAttempt?.score || null,
        latestPercentage: latestAttempt?.percentage || null,
        latestResult: latestAttempt ? (latestAttempt.passed ? 'PASSED' : 'FAILED') : null,
        latestAttemptAt: latestAttempt?.submittedAt || null,
        requirementStatus: latestAttempt ? 'FAILED' : 'PENDING',
        attemptsCount: attempts.length
      });

      if (isTrainingCompleted) {
        trainingNeeds.push({
          title: quiz.title,
          need: attempts.length > 0 ? 'Retraining Recommended' : 'Quiz Required',
          type: 'QUIZ'
        });
      }
    }
  }

  if (trainingNeeds.length === 0) {
    trainingNeeds.push({
      title: 'No Current Training Need',
      need: 'No Current Training Need',
      type: 'TRAINING'
    });
  }

  // Zero-requirement safety and overall score
  const policiesReq = currentPolicies.length;
  const trainingReq = currentTrainingModules.length;
  const quizzesReq = currentQuizzes.length;

  const policyPct = policiesReq > 0 ? Math.round((policiesAcknowledged / policiesReq) * 100) : null;
  const trainingPct = trainingReq > 0 ? Math.round((trainingCompleted / trainingReq) * 100) : null;
  const quizPct = quizzesReq > 0 ? Math.round((quizzesPassed / quizzesReq) * 100) : null;

  let applicableComponents = 0;
  let totalPctSum = 0;

  if (policyPct !== null) { applicableComponents++; totalPctSum += policyPct; }
  if (trainingPct !== null) { applicableComponents++; totalPctSum += trainingPct; }
  if (quizPct !== null) { applicableComponents++; totalPctSum += quizPct; }

  let overallPct = 0;
  let overallStatus: 'COMPLIANT' | 'PENDING' | 'INCOMPLETE' = 'INCOMPLETE';

  if (applicableComponents === 0) {
    overallPct = 0;
    overallStatus = 'INCOMPLETE';
  } else {
    overallPct = Math.round(totalPctSum / applicableComponents);

    // Determine Status
    // COMPLIANT: all applicable components are exactly 100%
    const isCompliant = 
      (policyPct === null || policyPct === 100) &&
      (trainingPct === null || trainingPct === 100) &&
      (quizPct === null || quizPct === 100);

    // Any Progress: employee has a row indicating progress for a CURRENT requirement
    const hasAnyProgress = 
      user.acknowledgements.some(a => currentPoliciesMap.has(a.policy.policyKey) && a.policyId === currentPoliciesMap.get(a.policy.policyKey)?.id) ||
      user.trainingProgress.some(tp => trainingModuleIds.includes(tp.trainingId)) ||
      user.quizAttempts.some(qa => currentQuizzes.map(q => q.id).includes(qa.quizId));

    if (isCompliant) {
      overallStatus = 'COMPLIANT';
    } else if (hasAnyProgress) {
      overallStatus = 'PENDING';
    } else {
      overallStatus = 'INCOMPLETE';
    }
  }

  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    department: user.department,
    employeeId: user.employeeId,
    policyCompletionRate: policyPct || 0,
    trainingCompletionRate: trainingPct || 0,
    quizPassRate: quizPct || 0,
    overallComplianceRate: overallPct,
    overallStatus,
    policiesAcknowledged,
    policiesRequired: policiesReq,
    trainingCompleted,
    trainingRequired: trainingReq,
    quizzesPassed,
    quizzesRequired: quizzesReq,
    pendingActionCount,
    policyDetails,
    trainingDetails,
    quizDetails,
    trainingNeeds
  };
}

export async function calculateOrganizationCompliance() {
  const activeEmployees = await prisma.user.findMany({
    where: { role: UserRole.EMPLOYEE, status: UserStatus.ACTIVE },
    select: { id: true }
  });

  if (activeEmployees.length === 0) {
    return {
      averageComplianceRate: 0,
      totalActiveEmployees: 0,
      compliantCount: 0,
      pendingCount: 0,
      incompleteCount: 0
    };
  }

  let totalScore = 0;
  let compliantCount = 0;
  let pendingCount = 0;
  let incompleteCount = 0;

  for (const emp of activeEmployees) {
    const data = await calculateEmployeeCompliance(emp.id);
    if (data) {
      totalScore += data.overallComplianceRate;
      if (data.overallStatus === 'COMPLIANT') compliantCount++;
      else if (data.overallStatus === 'PENDING') pendingCount++;
      else incompleteCount++;
    }
  }

  return {
    averageComplianceRate: Math.round(totalScore / activeEmployees.length),
    totalActiveEmployees: activeEmployees.length,
    compliantCount,
    pendingCount,
    incompleteCount
  };
}
