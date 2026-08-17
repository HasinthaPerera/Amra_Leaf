import { Quiz } from '@/types';

export const mockQuizzes: Quiz[] = [
  {
    id: 'QZ001',
    title: 'Cybersecurity Basics Quiz',
    description: 'Test your understanding of malware, social engineering, and basic physical security controls.',
    trainingModuleId: 'TRN001',
    questions: [
      {
        id: 'Q001_1',
        question: 'Which of the following is responsible for over 90% of initial network breaches in companies?',
        options: [
          'Direct hacker intrusion into database firewalls',
          'An employee action such as clicking a malicious link or downloading an unsafe file',
          'Hardware malfunctions on main router boxes',
          'Software issues with core operating systems'
        ],
        correctAnswer: 1,
      },
      {
        id: 'Q001_2',
        question: 'What is "Social Engineering"?',
        options: [
          'Writing programs that optimize code delivery',
          'The design of team seating layouts to increase work speed',
          'Manipulating people into giving away confidential credentials or details',
          'Connecting databases across different physical sites'
        ],
        correctAnswer: 2,
      },
      {
        id: 'Q001_3',
        question: 'What is the correct action to take when stepping away from your workspace?',
        options: [
          'Leave the screen active but turn off the monitor',
          'Lock the computer screen (Win + L) to prevent unauthorized usage',
          'Ask your neighbor to watch it and keep it unlocked',
          'Close your browser but leave other apps running'
        ],
        correctAnswer: 1,
      }
    ],
  },
  {
    id: 'QZ002',
    title: 'Phishing Awareness Quiz',
    description: 'Test your ability to recognize phishing triggers, suspect emails, and report social engineering attacks.',
    trainingModuleId: 'TRN002',
    questions: [
      {
        id: 'Q002_1',
        question: 'An email arrives with a sender address "accounts-billing@amra-leaf.com". What should you do first?',
        options: [
          'Reply with your login details to confirm your identity',
          'Forward it to your personal email to verify the contents',
          'Verify the sender domain matches "@amraleaf.com" exactly and inspect the link address',
          'Ignore it completely and hope they email you again if it is urgent'
        ],
        correctAnswer: 2,
      },
      {
        id: 'Q002_2',
        question: 'Which of the following is a key sign of a potential phishing email?',
        options: [
          'Use of artificial urgency demanding you click a link within a few hours to avoid account lockouts',
          'A simple signature with no images or links',
          'A message that is sent only to you rather than the team distribution list',
          'An email containing a text-only attachment with no styling'
        ],
        correctAnswer: 0,
      },
      {
        id: 'Q002_3',
        question: 'What is the correct procedure for reporting a suspected phishing email?',
        options: [
          'Forward it to all your department members to warn them',
          'Click the email "Report Phishing" button or forward it to "security-response@amraleaf.com"',
          'Delete it and do nothing else',
          'Reply to the sender telling them you know they are fake'
        ],
        correctAnswer: 1,
      }
    ],
  },
  {
    id: 'QZ003',
    title: 'Password Security & MFA Quiz',
    description: 'Assess your knowledge of secure password generation, storage, and Multi-Factor Authentication setups.',
    trainingModuleId: 'TRN003',
    questions: [
      {
        id: 'Q003_1',
        question: 'Which of the following passwords represents the strongest and most secure structure?',
        options: [
          'Sarah1995!',
          'LeafyCoffee#GreenTable-44',
          'admin12345',
          'p@ssword!'
        ],
        correctAnswer: 1,
      },
      {
        id: 'Q003_2',
        question: 'How should corporate passwords be saved and managed by staff?',
        options: [
          'Written in a physical notebook kept under the keyboard',
          'Typed into a private personal note app on a personal mobile phone',
          'Stored securely in the enterprise-assigned Password Manager',
          'Shared in a shared department spreadsheet for quick lookup'
        ],
        correctAnswer: 2,
      },
      {
        id: 'Q003_3',
        question: 'What type of Multi-Factor Authentication is generally the most secure and recommended?',
        options: [
          'SMS-based text message verification codes',
          'Authenticators apps that generate time-based codes locally',
          'Security questions asking about your favorite color or pet',
          'Email-based link verifications'
        ],
        correctAnswer: 1,
      }
    ],
  },
  {
    id: 'QZ004',
    title: 'POS (Point of Sale) Security Quiz',
    description: 'Verify your retail site checkout safety knowledge and credit card transaction terminal inspection routines.',
    trainingModuleId: 'TRN004',
    questions: [
      {
        id: 'Q004_1',
        question: 'What is a payment card "Skimmer"?',
        options: [
          'A device that cleans the payment terminal card reader slot',
          'A device placed on card slots to record credit card information without authorization',
          'A software tool that reports POS software version details',
          'A barcode scanner module used to scan customer discount coupons'
        ],
        correctAnswer: 1,
      },
      {
        id: 'Q004_2',
        question: 'How often must card readers and POS terminals be physically checked by checkout personnel?',
        options: [
          'Once a year during external compliance audits',
          'Every time a customer complains about the machine',
          'Daily, both at opening and closing of checkout shifts',
          'Only when the card reader fails to scan card chips'
        ],
        correctAnswer: 2,
      },
      {
        id: 'Q004_3',
        question: 'Are staff permitted to connect personal phones to checkout computers to charge them?',
        options: [
          'Yes, if they use their own personal charging cord',
          'Yes, but only if they are not processing transactions at that moment',
          'No, connecting any unauthorized device to POS computers is strictly prohibited',
          'Yes, as long as the phone screen is locked'
        ],
        correctAnswer: 2,
      }
    ],
  }
];
