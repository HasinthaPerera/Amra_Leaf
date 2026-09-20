import { NextResponse } from 'next/server';
import { verifyAdminApi } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { calculateOrganizationCompliance, calculateEmployeeCompliance } from '@/lib/services/complianceService';
import { UserRole, UserStatus } from '@prisma/client';

export async function GET() {
  const { response } = await verifyAdminApi();
  if (response) return response;

  try {
    const orgCompliance = await calculateOrganizationCompliance();
    
    // 1. Calculate dashboard core stats
    const totalEmployees = orgCompliance.totalActiveEmployees;
    const complianceRate = orgCompliance.averageComplianceRate;
    
    // Count unique published policy keys
    const policies = await prisma.policy.findMany({ where: { status: 'PUBLISHED' } });
    const uniqueKeys = new Set(policies.map(p => p.policyKey));
    const publishedPolicies = uniqueKeys.size;
    
    const trainingModulesCount = await prisma.trainingModule.count({ where: { status: 'PUBLISHED' } });

    // 2. Fetch urgent employees (INCOMPLETE or Score < 60)
    const activeEmployees = await prisma.user.findMany({
      where: { role: UserRole.EMPLOYEE, status: UserStatus.ACTIVE },
      select: { id: true }
    });

    const allCompliance = [];
    for (const emp of activeEmployees) {
      const c = await calculateEmployeeCompliance(emp.id);
      if (c) allCompliance.push(c);
    }

    const urgentEmployees = allCompliance
      .filter(c => c.overallStatus === 'INCOMPLETE' || c.overallComplianceRate < 60)
      .sort((a, b) => a.overallComplianceRate - b.overallComplianceRate)
      .slice(0, 5)
      .map(emp => ({
        userId: emp.userId,
        userName: emp.name,
        userEmail: emp.email,
        department: emp.department,
        overallScore: emp.overallComplianceRate,
        overallStatus: emp.overallStatus
      }));

    // 3. Fetch recent activity (3 recent policies, 3 recent training modules)
    const recentPolicies = await prisma.policy.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    const recentTraining = await prisma.trainingModule.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    });

    return NextResponse.json({
      stats: {
        totalEmployees,
        publishedPolicies,
        trainingModules: trainingModulesCount,
        complianceRate
      },
      urgentEmployees,
      recentPolicies: recentPolicies.map(p => ({
        id: p.id,
        title: p.title,
        version: p.version,
        category: p.category,
        status: p.status
      })),
      recentTraining: recentTraining.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        estimatedDuration: `${t.estimatedMinutes} min`,
        status: t.status,
        createdDate: t.createdAt.toISOString().split('T')[0]
      }))
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
