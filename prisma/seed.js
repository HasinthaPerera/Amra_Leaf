const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const usersToSeed = [
  {
    employeeId: 'ADM001',
    name: 'Sarah Jenkins',
    email: 'admin@amraleaf.com',
    passwordRaw: 'AmraAdmin2026!',
    role: 'ADMIN',
    department: 'Cybersecurity Operations',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP001',
    name: 'Liam Vance',
    email: 'employee@amraleaf.com',
    passwordRaw: 'AmraEmployee2026!',
    role: 'EMPLOYEE',
    department: 'Accounts',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP002',
    name: 'Amina Al-Mansoor',
    email: 'amina.al@amraleaf.com',
    passwordRaw: 'AminaHR2026!',
    role: 'EMPLOYEE',
    department: 'Management',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP003',
    name: 'Chen Wei',
    email: 'chen.wei@amraleaf.com',
    passwordRaw: 'ChenDev2026!',
    role: 'EMPLOYEE',
    department: 'Management',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP004',
    name: 'Elena Rostova',
    email: 'elena.rostova@amraleaf.com',
    passwordRaw: 'ElenaSales2026!',
    role: 'EMPLOYEE',
    department: 'Marketing / Social Media',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP005',
    name: 'Marcus Brody',
    email: 'marcus.brody@amraleaf.com',
    passwordRaw: 'MarcusOps2026!',
    role: 'EMPLOYEE',
    department: 'Management',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP006',
    name: 'Priya Nair',
    email: 'priya.nair@amraleaf.com',
    passwordRaw: 'PriyaCS2026!',
    role: 'EMPLOYEE',
    department: 'Front Office / Service',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP007',
    name: 'Jackson Frost',
    email: 'jackson.frost@amraleaf.com',
    passwordRaw: 'JacksonIT2026!',
    role: 'EMPLOYEE',
    department: 'Management',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP008',
    name: 'Isabella Torrez',
    email: 'isabella.torrez@amraleaf.com',
    passwordRaw: 'IsabellaLegal2026!',
    role: 'EMPLOYEE',
    department: 'Management',
    status: 'INACTIVE',
  },
];

async function main() {
  console.log('Seeding initial users...');

  for (const user of usersToSeed) {
    const passwordHash = await bcrypt.hash(user.passwordRaw, 10);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        employeeId: user.employeeId,
        name: user.name,
        passwordHash,
        role: user.role,
        department: user.department,
        status: user.status,
      },
      create: {
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        department: user.department,
        status: user.status,
      },
    });
    console.log(`Seeded user: ${user.email} (${user.role}, ${user.status})`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
