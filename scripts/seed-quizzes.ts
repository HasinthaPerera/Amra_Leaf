import { PrismaClient, ContentStatus } from '@prisma/client';

const prisma = new PrismaClient();

const quizzes = [
  {
    id: 'QZ001',
    trainingId: 'TRN001',
    title: 'Cybersecurity Basics Quiz',
    description: 'Test your understanding of fundamental cybersecurity concepts at Amra Leaf.',
    passMark: 70,
    status: ContentStatus.PUBLISHED,
    questions: [
      {
        id: 'QZ001-Q1',
        question: 'What is the most critical first step if you suspect your POS terminal is acting strangely?',
        optionA: 'Restart the terminal immediately',
        optionB: 'Report the anomaly immediately to an authorized supervisor',
        optionC: 'Try to fix the software issue yourself',
        optionD: 'Ignore it unless it completely stops working',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ001-Q2',
        question: 'When stepping away from a back-office computer, what should you always do?',
        optionA: 'Turn off the monitor',
        optionB: 'Lock the workstation',
        optionC: 'Log out of all applications',
        optionD: 'Leave it open so others can use it',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ001-Q3',
        question: 'Why is it important to verify requests for sensitive information, even from a Restaurant Manager?',
        optionA: 'To ensure the manager is not testing you',
        optionB: 'Because managers often forget their own passwords',
        optionC: 'To prevent social engineering and unauthorized access',
        optionD: 'Because it is required by the health department',
        correctAnswer: 2 // C
      },
      {
        id: 'QZ001-Q4',
        question: 'What is the primary risk of a single security breach at Amra Leaf?',
        optionA: 'Loss of Wi-Fi access for guests',
        optionB: 'Compromise of customer reservation data and loss of trust',
        optionC: 'Food spoiling in the walk-in cooler',
        optionD: 'Printers running out of paper',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ001-Q5',
        question: 'If you receive an email to "confirm a large catering order" with an unusual link, what is the safest action?',
        optionA: 'Click the link to secure the order quickly',
        optionB: 'Forward it to all staff members',
        optionC: 'Pause, verify the sender, and report it if it seems like a phishing attempt',
        optionD: 'Reply to the sender asking if it is legitimate',
        correctAnswer: 2 // C
      }
    ]
  },
  {
    id: 'QZ002',
    trainingId: 'TRN002',
    title: 'Phishing Awareness Quiz',
    description: 'Assess your ability to identify and respond to phishing threats.',
    passMark: 70,
    status: ContentStatus.PUBLISHED,
    questions: [
      {
        id: 'QZ002-Q1',
        question: 'What is a common indicator of a phishing email?',
        optionA: 'A message demanding immediate urgent action',
        optionB: 'An email from a known supplier with a standard invoice',
        optionC: 'A newsletter from Amra Leaf corporate',
        optionD: 'A schedule update from your manager',
        correctAnswer: 0 // A
      },
      {
        id: 'QZ002-Q2',
        question: 'Before clicking a link in an unexpected email, what should you do?',
        optionA: 'Click it quickly to see where it goes',
        optionB: 'Hover over the link to preview the actual destination URL',
        optionC: 'Download the attachment instead',
        optionD: 'Assume our spam filter caught any malicious links',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ002-Q3',
        question: 'If you receive a suspicious Facebook/Instagram login request for the Amra Leaf account, you should:',
        optionA: 'Enter your credentials to verify',
        optionB: 'Ignore it and delete the message',
        optionC: 'Report it through designated channels without clicking the link',
        optionD: 'Share the link with other employees',
        correctAnswer: 2 // C
      },
      {
        id: 'QZ002-Q4',
        question: 'Why do attackers target restaurant staff with phishing?',
        optionA: 'To get free meal vouchers',
        optionB: 'To gain access to financial systems or customer contact info',
        optionC: 'To change the restaurant menu online',
        optionD: 'To apply for open jobs',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ002-Q5',
        question: 'You receive an urgent WhatsApp message claiming to be from the Restaurant Manager asking for POS credentials. What is the correct response?',
        optionA: 'Provide the credentials immediately to avoid trouble',
        optionB: 'Ask for a reason before providing them',
        optionC: 'Do not provide credentials; verify the request directly with the manager in person or via a known phone number',
        optionD: 'Send fake credentials',
        correctAnswer: 2 // C
      }
    ]
  },
  {
    id: 'QZ003',
    trainingId: 'TRN003',
    title: 'Password Security & MFA Quiz',
    description: 'Test your knowledge on creating strong passwords and using MFA.',
    passMark: 70,
    status: ContentStatus.PUBLISHED,
    questions: [
      {
        id: 'QZ003-Q1',
        question: 'Which of the following is considered best practice for password creation?',
        optionA: 'Using the restaurant name and current year (e.g., AmraLeaf2023)',
        optionB: 'Creating a long passphrase using a combination of words, numbers, and symbols',
        optionC: 'Using the same password for all work accounts for easy memorization',
        optionD: 'Writing the password on a sticky note under the keyboard',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ003-Q2',
        question: 'What is the primary purpose of Multi-Factor Authentication (MFA)?',
        optionA: 'To make logging in faster',
        optionB: 'To require a second form of verification, adding a layer of defense',
        optionC: 'To remember your passwords for you',
        optionD: 'To encrypt your emails',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ003-Q3',
        question: 'Why should you never share your login credentials with colleagues?',
        optionA: 'It makes it difficult to track who performed specific actions in the system',
        optionB: 'It slows down the network',
        optionC: 'It uses up too many software licenses',
        optionD: 'Management wants everyone to log in at the same time',
        correctAnswer: 0 // A
      },
      {
        id: 'QZ003-Q4',
        question: 'If you need to store complex passwords, what is the approved method?',
        optionA: 'A shared spreadsheet on the back-office computer',
        optionB: 'A physical notebook kept in the safe',
        optionC: 'An approved password manager application',
        optionD: 'Sending them to yourself in an email',
        correctAnswer: 2 // C
      },
      {
        id: 'QZ003-Q5',
        question: 'What is a major risk of reusing your personal password for work accounts?',
        optionA: 'You might forget which password is which',
        optionB: 'If your personal account is compromised, attackers can also access the restaurant systems',
        optionC: 'The password will expire faster',
        optionD: 'It violates copyright laws',
        correctAnswer: 1 // B
      }
    ]
  },
  {
    id: 'QZ004',
    trainingId: 'TRN004',
    title: 'POS Security Quiz',
    description: 'Assess your understanding of Point of Sale (POS) security procedures.',
    passMark: 70,
    status: ContentStatus.PUBLISHED,
    questions: [
      {
        id: 'QZ004-Q1',
        question: 'What should you check for daily on POS card readers?',
        optionA: 'Dust and fingerprints',
        optionB: 'Tampering or attached skimming devices',
        optionC: 'Software updates available',
        optionD: 'The volume level of the beep',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ004-Q2',
        question: 'Is it acceptable to plug a personal mobile device into a POS terminal to charge it?',
        optionA: 'Yes, if it is an emergency',
        optionB: 'Yes, as long as you do not transfer files',
        optionC: 'No, unauthorized devices must never be connected to POS terminals',
        optionD: 'Yes, if the manager gives verbal permission',
        correctAnswer: 2 // C
      },
      {
        id: 'QZ004-Q3',
        question: 'When you finish your shift or step away from the POS terminal, you must always:',
        optionA: 'Leave it open for the next server',
        optionB: 'Log off or lock the system',
        optionC: 'Turn off the screen',
        optionD: 'Print a receipt',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ004-Q4',
        question: 'If you notice an unknown USB drive connected to the back of the POS system, what should you do?',
        optionA: 'Unplug it and throw it away',
        optionB: 'Open the files to see who it belongs to',
        optionC: 'Leave it alone and notify the Restaurant Manager immediately',
        optionD: 'Format the drive to be safe',
        correctAnswer: 2 // C
      },
      {
        id: 'QZ004-Q5',
        question: 'How should you position POS screens that display sensitive customer data?',
        optionA: 'Facing the customer so they can verify their order',
        optionB: 'Facing the kitchen for easy viewing',
        optionC: 'Angled away so customers cannot view the sensitive information',
        optionD: 'It does not matter as long as the brightness is low',
        correctAnswer: 2 // C
      }
    ]
  },
  {
    id: 'QZ005',
    trainingId: 'TRN005',
    title: 'Customer Data Safety Quiz',
    description: 'Test your knowledge on handling and protecting customer information.',
    passMark: 70,
    status: ContentStatus.PUBLISHED,
    questions: [
      {
        id: 'QZ005-Q1',
        question: 'When taking a reservation, what information should you collect?',
        optionA: 'As much personal detail as possible for marketing',
        optionB: 'Only the information strictly necessary for the reservation and service',
        optionC: 'Their home address and employer details',
        optionD: 'Their social media handles',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ005-Q2',
        question: 'What is the proper way to handle physical reservation books or notes?',
        optionA: 'Leave them open on the host stand for easy access',
        optionB: 'Keep them out of public view and securely stored when not in use',
        optionC: 'Throw them in the regular trash at the end of the day',
        optionD: 'Let customers flip through them to find their own name',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ005-Q3',
        question: 'If a customer asks you to write down their credit card number for a future charge, you should:',
        optionA: 'Write it on a scrap of paper and put it in your pocket',
        optionB: 'Enter it into a secure, approved digital system; never store written card details insecurely',
        optionC: 'Write it in the physical reservation book',
        optionD: 'Save it as a contact in your personal phone',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ005-Q4',
        question: 'How should physical documents containing customer data be disposed of?',
        optionA: 'Recycled with the cardboard boxes',
        optionB: 'Thrown in the kitchen trash',
        optionC: 'Shredded when no longer needed',
        optionD: 'Given to the manager to take home',
        correctAnswer: 2 // C
      },
      {
        id: 'QZ005-Q5',
        question: 'Why is mishandling customer data a critical issue for Amra Leaf?',
        optionA: 'It wastes paper',
        optionB: 'It breaches customer trust and can result in severe legal and financial penalties',
        optionC: 'It makes the reservation system run slowly',
        optionD: 'It causes confusion in the kitchen',
        correctAnswer: 1 // B
      }
    ]
  },
  {
    id: 'QZ006',
    trainingId: 'TRN006',
    title: 'Internet and Device Safety Quiz',
    description: 'Assess your understanding of safe browsing and device usage policies.',
    passMark: 70,
    status: ContentStatus.PUBLISHED,
    questions: [
      {
        id: 'QZ006-Q1',
        question: 'Which Wi-Fi network should you use for your personal mobile device while at work?',
        optionA: 'The internal back-office network',
        optionB: 'The POS network',
        optionC: 'The designated Guest Wi-Fi network only',
        optionD: 'Any network that has a strong signal',
        correctAnswer: 2 // C
      },
      {
        id: 'QZ006-Q2',
        question: 'Why are jailbroken or rooted devices prohibited on company networks?',
        optionA: 'They use too much bandwidth',
        optionB: 'They bypass built-in security controls, increasing the risk of malware infection',
        optionC: 'They interfere with the POS wireless signals',
        optionD: 'They are distracting to staff',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ006-Q3',
        question: 'When using work computers, which of these is an example of safe browsing?',
        optionA: 'Downloading free software tools to help with scheduling',
        optionB: 'Visiting unapproved websites during breaks',
        optionC: 'Avoiding suspicious websites and only downloading approved software',
        optionD: 'Clicking on pop-up ads for restaurant supplies',
        correctAnswer: 2 // C
      },
      {
        id: 'QZ006-Q4',
        question: 'What is a significant risk of connecting an infected personal device to the internal business network?',
        optionA: 'The device battery will drain quickly',
        optionB: 'Malware can spread from the device to POS and back-office systems',
        optionC: 'The internet bill will increase',
        optionD: 'The device will be permanently damaged',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ006-Q5',
        question: 'How should you manage updates for work devices?',
        optionA: 'Ignore update prompts because they slow down the system',
        optionB: 'Only update when the system stops working',
        optionC: 'Ensure the latest security updates are installed promptly',
        optionD: 'Uninstall the updating software entirely',
        correctAnswer: 2 // C
      }
    ]
  },
  {
    id: 'QZ007',
    trainingId: 'TRN007',
    title: 'Incident Reporting Quiz',
    description: 'Test your knowledge on how to identify and report security incidents.',
    passMark: 70,
    status: ContentStatus.PUBLISHED,
    questions: [
      {
        id: 'QZ007-Q1',
        question: 'If you notice an unauthorized person lingering near the back-office door, what is the best immediate action?',
        optionA: 'Confront them and demand their ID',
        optionB: 'Ignore them if they do not look dangerous',
        optionC: 'Inform the Restaurant Manager or an authorized supervisor immediately',
        optionD: 'Take a picture and post it on social media',
        correctAnswer: 2 // C
      },
      {
        id: 'QZ007-Q2',
        question: 'What should you do if you realize you clicked a phishing link on a work computer?',
        optionA: 'Delete the email and pretend nothing happened',
        optionB: 'Report it immediately; do not wait to see if something bad happens',
        optionC: 'Unplug the computer and throw it away',
        optionD: 'Run an antivirus scan and fix it yourself',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ007-Q3',
        question: 'When reporting a security incident, what information is most helpful?',
        optionA: 'Your opinion on who is to blame',
        optionB: 'Clear details about what happened, when it happened, and where',
        optionC: 'Only the parts of the incident you feel comfortable sharing',
        optionD: 'A long essay describing the emotional impact',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ007-Q4',
        question: 'Why is prompt reporting critical after discovering a lost staff mobile device?',
        optionA: 'So you can get a replacement faster',
        optionB: 'To minimize the time an attacker has to access Amra Leaf systems or data',
        optionC: 'To avoid paying for the lost device',
        optionD: 'Because the police require it within 24 hours',
        correctAnswer: 1 // B
      },
      {
        id: 'QZ007-Q5',
        question: 'If you suspect a security issue, should you investigate it thoroughly yourself before reporting?',
        optionA: 'Yes, to make sure it is a real incident before bothering the manager',
        optionB: 'Yes, it shows initiative',
        optionC: 'No, your job is to report it immediately; leave the investigation to appropriate personnel',
        optionD: 'Only if the restaurant is not busy',
        correctAnswer: 2 // C
      }
    ]
  }
];

async function main() {
  console.log('Seeding Quizzes and Questions...');
  
  for (const qz of quizzes) {
    // We use upsert for the quiz.
    // However, for questions, it's safer to delete existing questions for this quiz and re-create them,
    // or upsert them individually. Since we have stable QZ00X-QY IDs, we can upsert individually.
    
    const createdQuiz = await prisma.quiz.upsert({
      where: { id: qz.id },
      update: {
        title: qz.title,
        description: qz.description,
        passMark: qz.passMark,
        status: qz.status,
        trainingId: qz.trainingId,
      },
      create: {
        id: qz.id,
        title: qz.title,
        description: qz.description,
        passMark: qz.passMark,
        status: qz.status,
        trainingId: qz.trainingId,
      }
    });

    for (const q of qz.questions) {
      await prisma.quizQuestion.upsert({
        where: { id: q.id },
        update: {
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
        },
        create: {
          id: q.id,
          quizId: createdQuiz.id,
          question: q.question,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
        }
      });
    }

    console.log(`Upserted Quiz: ${createdQuiz.id} - ${createdQuiz.title}`);
  }
  
  console.log('Quizzes seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
