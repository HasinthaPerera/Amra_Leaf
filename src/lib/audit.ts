import prisma from './prisma';

export async function logAuditActivity(
  userId: string | null,
  action: string,
  targetType?: string,
  targetId?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        targetType,
        targetId,
      },
    });
  } catch (error) {
    // Fail silently to avoid breaking the main business process
    console.error('Failed to write audit log:', error);
  }
}
