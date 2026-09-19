const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const userCount = await prisma.user.count();
    const sessionCount = await prisma.session.count();
    const policyCount = await prisma.policy.count();
    const ackCount = await prisma.policyAcknowledgement.count();
    const trnModCount = await prisma.trainingModule.count();
    const trnProgCount = await prisma.trainingProgress.count();
    const quizCount = await prisma.quiz.count();
    const quizQCount = await prisma.quizQuestion.count();
    const quizAttemptCount = await prisma.quizAttempt.count();

    const someUser = await prisma.user.findFirst();
    const hasPasswordHash = !!(someUser && someUser.passwordHash);

    console.log(JSON.stringify({
      userCount,
      sessionCount,
      policyCount,
      ackCount,
      trnModCount,
      trnProgCount,
      quizCount,
      quizQCount,
      quizAttemptCount,
      hasPasswordHash,
      userSample: someUser ? { id: someUser.id, role: someUser.role } : null
    }, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
