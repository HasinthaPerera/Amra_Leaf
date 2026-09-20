import { PrismaClient, ContentStatus } from '@prisma/client';

const prisma = new PrismaClient();

const modules = [
  {
    id: 'TRN001',
    title: 'Cybersecurity Basics',
    description: 'Learn the fundamentals of cybersecurity, including how to spot common threats like malware and social engineering at Amra Leaf.',
    content: `## Introduction
Welcome to Cybersecurity Basics. At Amra Leaf, ensuring the security of our restaurant operations is everyone's responsibility. This module covers essential practices for daily work.

## Why it matters to Amra Leaf
A single security breach can compromise customer reservation data and disrupt our POS systems, leading to a loss of trust and revenue.

## Important Security Practices
1. **Lock Your Workstation**: Always lock your POS terminal or back-office computer when stepping away.
2. **Verify Requests**: Double-check any unusual requests for sensitive information, even if they appear to come from a Restaurant Manager.
3. **Use Strong Passwords**: Ensure all accounts have strong, unique passwords.
4. **Report Anomalies**: If a system behaves strangely, report it immediately to an authorized supervisor.

## Realistic Restaurant Example
During a busy dinner rush, a staff member is asked to quickly click a link in an email to "confirm a large catering order". By pausing and verifying the sender, they realize it's a phishing attempt and prevent malware from infecting the restaurant's network.

## Summary
Always stay vigilant. Your actions directly protect Amra Leaf's customers and operations.`,
    estimatedMinutes: 10,
    status: ContentStatus.PUBLISHED,
  },
  {
    id: 'TRN002',
    title: 'Phishing Awareness',
    description: 'Understand how to identify, avoid, and report phishing attacks targeting Amra Leaf employees.',
    content: `## Introduction
Phishing is a deceptive attempt to steal sensitive information. This module trains you to spot these attacks.

## Why it matters to Amra Leaf
Attackers often target restaurant staff to gain access to financial systems or customer contact information. Falling for a phishing scam can have severe consequences.

## Important Security Practices
1. **Check the Sender**: Always verify the sender's email address matches our official domain.
2. **Avoid Suspicious Links**: Hover over links to preview the destination before clicking.
3. **Beware of Urgency**: Be skeptical of messages demanding immediate action, like an "urgent invoice payment".
4. **Report Phishing**: Use the designated channel to report suspicious emails to your Restaurant Manager.

## Realistic Restaurant Example
A shift supervisor receives an email appearing to be from the Amra Leaf payroll provider, asking them to update their banking details urgently. Instead of clicking the link, they contact the Restaurant Manager, who confirms it's a scam.

## Summary
Think before you click. Reporting suspected phishing helps protect the entire Amra Leaf team.`,
    estimatedMinutes: 15,
    status: ContentStatus.PUBLISHED,
  },
  {
    id: 'TRN003',
    title: 'Password Security & MFA',
    description: 'Learn best practices for creating strong passwords and using Multi-Factor Authentication (MFA).',
    content: `## Introduction
Strong passwords and MFA are your first line of defense against unauthorized access.

## Why it matters to Amra Leaf
Weak passwords can allow attackers to access Amra Leaf social media accounts, employee portals, or customer reservation systems.

## Important Security Practices
1. **Use Passphrases**: Create long passwords using a combination of words, numbers, and symbols.
2. **Never Share Passwords**: Do not share your login credentials with colleagues.
3. **Enable MFA**: Always use Multi-Factor Authentication where available.
4. **Use a Password Manager**: Utilize approved password managers instead of writing passwords on sticky notes.

## Realistic Restaurant Example
A front-of-house staff member uses the same password for their personal email and the Amra Leaf social media account. When their personal email is compromised, the attacker also gains access to the restaurant's social media. Using unique passwords prevents this.

## Summary
Strong, unique passwords combined with MFA significantly reduce the risk of account compromise.`,
    estimatedMinutes: 12,
    status: ContentStatus.PUBLISHED,
  },
  {
    id: 'TRN004',
    title: 'Point of Sale (POS) Security',
    description: 'Crucial security practices for handling POS terminals and protecting customer payment information.',
    content: `## Introduction
Our POS systems process sensitive payment data daily. Securing these terminals is critical.

## Why it matters to Amra Leaf
A compromised POS system can lead to massive credit card theft, resulting in severe financial and reputational damage to the restaurant.

## Important Security Practices
1. **Inspect Terminals**: Check card readers daily for tampering or skimming devices.
2. **No Unauthorized Devices**: Never plug personal mobile devices or unauthorized USB drives into POS terminals.
3. **Protect the Screen**: Ensure customers cannot view POS screens that display sensitive data.
4. **Log Off**: Always log off the POS system when your shift ends or when you step away.

## Realistic Restaurant Example
A cashier notices a strange plastic overlay on the card reader at the checkout counter. They immediately notify the Restaurant Manager and stop using the terminal, preventing customers from having their card details stolen by a skimmer.

## Summary
Regularly inspect POS terminals and restrict their use strictly to authorized restaurant transactions.`,
    estimatedMinutes: 15,
    status: ContentStatus.PUBLISHED,
  },
  {
    id: 'TRN005',
    title: 'Customer Data Safety & Privacy',
    description: 'Guidelines for safely handling and storing customer reservation and contact information.',
    content: `## Introduction
Protecting customer privacy is essential for maintaining trust and complying with regulations.

## Why it matters to Amra Leaf
Customers trust us with their contact details, dietary requirements, and payment info. Mishandling this data breaches their trust and can lead to legal penalties.

## Important Security Practices
1. **Collect Only What's Needed**: Only ask for customer information necessary for the reservation or service.
2. **Secure Physical Records**: Keep physical reservation books or notes out of public view and securely stored.
3. **Digital Privacy**: Do not leave digital reservation systems open and unattended.
4. **Proper Disposal**: Shred physical documents containing customer data when no longer needed.

## Realistic Restaurant Example
A host accidentally leaves the physical reservation book on the host stand while showing guests to their table. Another guest glances at the book and sees a celebrity's phone number. Keeping the book closed or using a secure digital system prevents such privacy breaches.

## Summary
Treat customer data with the utmost care. Secure both physical and digital records at all times.`,
    estimatedMinutes: 10,
    status: ContentStatus.PUBLISHED,
  },
  {
    id: 'TRN006',
    title: 'Internet and Staff Device Safety',
    description: 'Safe browsing habits and rules for using staff mobile devices on the restaurant network.',
    content: `## Introduction
Connecting to the internet and using mobile devices introduces risks that must be managed.

## Why it matters to Amra Leaf
Malware introduced via a staff mobile device connected to the internal network can spread to POS and back-office systems.

## Important Security Practices
1. **Use Guest Wi-Fi**: Connect personal devices only to the designated Guest Wi-Fi, never the internal business network.
2. **Safe Browsing**: Avoid visiting suspicious websites or downloading unapproved software on work computers.
3. **Keep Devices Updated**: Ensure your personal and work devices have the latest security updates installed.
4. **No Jailbroken Devices**: Do not connect jailbroken or rooted devices to any company network.

## Realistic Restaurant Example
A staff member connects their personal phone to the restaurant's back-office Wi-Fi to download a large file. The phone has a hidden malware infection, which then attempts to scan the POS network. Using the isolated Guest Wi-Fi prevents this cross-contamination.

## Summary
Keep personal devices off the internal business network and practice safe browsing habits.`,
    estimatedMinutes: 10,
    status: ContentStatus.PUBLISHED,
  },
  {
    id: 'TRN007',
    title: 'Reporting Suspicious Activities / Incidents',
    description: 'How to properly identify and report security incidents or suspicious behavior in the restaurant.',
    content: `## Introduction
Prompt reporting of security incidents minimizes damage and helps Amra Leaf respond effectively.

## Why it matters to Amra Leaf
Delaying the report of a lost device or a suspected breach gives attackers more time to access our systems and data.

## Important Security Practices
1. **Know What to Report**: Report lost devices, suspicious emails, strange POS behavior, or unauthorized persons in staff areas.
2. **Report Immediately**: Do not wait. Inform an authorized supervisor or Restaurant Manager as soon as you suspect an issue.
3. **Do Not Investigate Yourself**: Leave the investigation to the appropriate personnel; your job is to report it.
4. **Provide Details**: When reporting, provide clear details about what happened, when, and where.

## Realistic Restaurant Example
A server notices an individual lingering near the back-office door who does not wear an Amra Leaf uniform. Instead of confronting them, the server immediately informs the Restaurant Manager, who handles the situation, preventing unauthorized access to the office.

## Summary
When in doubt, report it. Your prompt action is critical to Amra Leaf's security posture.`,
    estimatedMinutes: 10,
    status: ContentStatus.PUBLISHED,
  }
];

async function main() {
  console.log('Seeding Training Modules...');
  for (const mod of modules) {
    const existing = await prisma.trainingModule.upsert({
      where: { id: mod.id },
      update: {
        title: mod.title,
        description: mod.description,
        content: mod.content,
        estimatedMinutes: mod.estimatedMinutes,
        status: mod.status,
      },
      create: mod,
    });
    console.log(`Upserted Training Module: ${existing.id} - ${existing.title}`);
  }
  console.log('Training modules seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
