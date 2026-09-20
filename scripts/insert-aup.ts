// Development setup utility to seed the Amra Leaf Acceptable Use Policy.
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const policyKey = 'acceptable-use-policy';
  const existing = await prisma.policy.findFirst({
    where: { policyKey, status: 'PUBLISHED' }
  });

  if (existing) {
    console.log('AUP already exists.');
    return;
  }

  const content = `# Amra Leaf Acceptable Use Policy

## 1. Purpose and Scope
This policy outlines the acceptable use of restaurant systems, devices, and networks by all employees. It aims to protect Amra Leaf's customer data, reputation, and security.

## 2. Authorized Use of Restaurant Systems
Restaurant systems, including Point of Sale (POS) terminals, back-office computers, and restaurant networks, are provided for business purposes only. Unauthorized personal use is prohibited.

## 3. Account and Password Responsibilities
Employees must keep their login credentials confidential. Passwords must not be shared with coworkers, managers, or third parties. Multi-Factor Authentication (MFA) must be used where applicable.

## 4. POS Terminal Usage
POS terminals must only be used by logged-in employees for processing orders and payments. Terminals must be locked when unattended. 

## 5. Customer Data Handling
Customer information, including credit card details and contact information, must be handled securely and strictly in accordance with privacy laws. Never write down customer credit card numbers.

## 6. Staff Mobile and Device Use
The use of personal mobile devices during service hours is restricted to designated break areas. Personal devices must not be connected to the secure restaurant internal network.

## 7. Internet and Social Media Usage
Employees must not use restaurant networks to access inappropriate, illegal, or malicious websites. Official Amra Leaf Social Media Accounts must only be accessed by authorized personnel.

## 8. Prohibited Activities
Prohibited activities include, but are not limited to:
- Disabling security software or bypassing firewalls.
- Installing unauthorized software or connecting personal USB drives to restaurant systems.
- Accessing or attempting to access data outside of your authorized role.

## 9. Phishing and Suspicious Links
Employees must remain vigilant against phishing attacks. Do not open email attachments or click on links from unknown or suspicious sources.

## 10. Incident Reporting
Any suspected security breach, lost device, or suspicious activity must be reported immediately to the Restaurant Manager or Authorized Supervisor.

## 11. Monitoring and Compliance
Amra Leaf reserves the right to monitor the use of its systems and networks to ensure compliance with this policy.

## 12. Policy Violations and Enforcement
Violations of this Acceptable Use Policy may result in disciplinary action, up to and including termination of employment and legal action.`;

  await prisma.policy.create({
    data: {
      policyKey,
      title: 'Amra Leaf Acceptable Use Policy',
      category: 'Acceptable Use',
      content,
      version: 'v1.0',
      status: 'PUBLISHED',
      publishedAt: new Date()
    }
  });

  console.log('AUP successfully created and published!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
