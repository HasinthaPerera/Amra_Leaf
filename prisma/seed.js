const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const usersToSeed = [
  {
    employeeId: 'ADM001',
    name: 'Dilani Perera',
    email: 'dilani.perera@amraleaf.com',
    passwordRaw: 'Dilani#Admin2026!',
    role: 'ADMIN',
    department: 'Cybersecurity Operations',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP001',
    name: 'Pathum Fernando',
    email: 'pathum.fernando@amraleaf.com',
    passwordRaw: 'Pathum#Fin2026!',
    role: 'EMPLOYEE',
    department: 'Accounts',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP002',
    name: 'Fathima Rishda',
    email: 'fathima.rishda@amraleaf.com',
    passwordRaw: 'Fathima#HR2026!',
    role: 'EMPLOYEE',
    department: 'Management',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP003',
    name: 'Tharshan Sivakumar',
    email: 'tharshan.sivakumar@amraleaf.com',
    passwordRaw: 'Tharshan#Dev2026!',
    role: 'EMPLOYEE',
    department: 'Management',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP004',
    name: 'Dinusha Wickramasinghe',
    email: 'dinusha.wickramasinghe@amraleaf.com',
    passwordRaw: 'Dinusha#Sales2026!',
    role: 'EMPLOYEE',
    department: 'Marketing / Social Media',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP005',
    name: 'Nuwan Kulasekara',
    email: 'nuwan.kulasekara@amraleaf.com',
    passwordRaw: 'Nuwan#Ops2026!',
    role: 'EMPLOYEE',
    department: 'Management',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP006',
    name: 'Vithushana Selvarajah',
    email: 'vithushana.selvarajah@amraleaf.com',
    passwordRaw: 'Vithu#CS2026!',
    role: 'EMPLOYEE',
    department: 'Front Office / Service',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP007',
    name: 'Mohomed Imran',
    email: 'mohomed.imran@amraleaf.com',
    passwordRaw: 'Mohomed#IT2026!',
    role: 'EMPLOYEE',
    department: 'Management',
    status: 'ACTIVE',
  },
  {
    employeeId: 'EMP008',
    name: 'Chathurika De Silva',
    email: 'chathurika.desilva@amraleaf.com',
    passwordRaw: 'Chathurika#Legal2026!',
    role: 'EMPLOYEE',
    department: 'Management',
    status: 'INACTIVE',
  },
];

async function main() {
  console.log('Cleaning existing sessions & users...');
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding initial Sri Lankan users...');

  for (const user of usersToSeed) {
    const passwordHash = await bcrypt.hash(user.passwordRaw, 10);

    await prisma.user.create({
      data: {
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        department: user.department,
        status: user.status,
      },
    });
    console.log(`Seeded user: ${user.name} <${user.email}> (${user.role})`);
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
