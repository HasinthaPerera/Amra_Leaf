import { TrainingModule } from '@/types';

export const mockTrainingModules: TrainingModule[] = [
  {
    id: 'TRN001',
    title: 'Cybersecurity Basics',
    description: 'An introductory course covering fundamental security concepts, threats, and employee responsibilities.',
    content: `## Module 1: Introduction to Cybersecurity

### Why Security Matters
Cybersecurity is not just the IT department's job. Over **90%** of security breaches in corporate networks start with an employee action, such as clicking a bad link or reusing passwords. At Amra Leaf, security is part of everyone's daily work.

### Key Terms You Must Know
- **Malware**: Software designed to disrupt, damage, or gain unauthorized access to computer systems.
- **Ransomware**: A specific malware that encrypts files, demanding payment to unlock them.
- **Social Engineering**: Manipulating people into giving away confidential information (like passwords or codes).

### Core Security Rules
1. Never leave your computer unlocked when you step away from your desk.
2. Only connect to the secure corporate Wi-Fi when working.
3. Be skeptical of any unexpected requests for data.
`,
    estimatedDuration: '10 mins',
    status: 'PUBLISHED',
    createdDate: '2026-01-10',
    updatedDate: '2026-05-15',
  },
  {
    id: 'TRN002',
    title: 'Phishing Awareness',
    description: 'Learn how to detect email phishing, spear phishing, and other social engineering attempts.',
    content: `## Module 2: Phishing Awareness

### What is Phishing?
Phishing is the practice of sending fraudulent emails that resemble communications from reputable companies. The goal is to trick the recipient into providing sensitive information or installing malicious payloads.

### How to Spot a Phish
- **Mismatched URLs**: Hover over links to check the destination. If the text says \`amraleaf.com\` but redirects to \`amra-secure-login.xyz\`, do not click it!
- **Urgent or Threatening Tone**: "Your account will be suspended in 2 hours unless you confirm your password." This is a classic phishing tactic.
- **Generic Greetings**: Instead of your name, it says "Dear Customer" or "Dear Employee".
- **Strange Attachments**: Look out for executable formats or compressed packages (.exe, .scr, .zip, .rar) arriving unexpectedly.

### What to Do
If you suspect an email is a phish, use the **Report Phishing** button on your email client or send it directly to the security operations center.
`,
    estimatedDuration: '15 mins',
    status: 'PUBLISHED',
    createdDate: '2026-02-05',
    updatedDate: '2026-06-20',
  },
  {
    id: 'TRN003',
    title: 'Password Security & MFA',
    description: 'Best practices for creating strong credentials and using Multi-Factor Authentication.',
    content: `## Module 3: Password Security

### The Problem with Simple Passwords
Hackers use automated tools to try millions of common combinations in seconds. Short, dictionary-based passwords can be cracked in less than a second.

### The Solution: Passphrases
Instead of a single word, create a passphrase: a combination of random words that is easy for you to remember but extremely difficult for computers to guess.
- *Weak*: \`p@ssword123\`
- *Strong*: \`LeafyCoffee#GreenTable-44\`

### Safeguarding Credentials
- Use your enterprise-assigned Password Manager to keep credentials locked and encrypted.
- Never write credentials on sticky notes or text them to coworkers.
- Do not reuse your work passwords on personal social media or shopping websites.
`,
    estimatedDuration: '10 mins',
    status: 'PUBLISHED',
    createdDate: '2026-03-01',
    updatedDate: '2026-03-01',
  },
  {
    id: 'TRN004',
    title: 'POS (Point of Sale) Security',
    description: 'Essential physical and network guidelines for safeguarding checkout terminals and card processing.',
    content: `## Module 4: Point of Sale Security

### Physical Threat Inspection
Credit card skimmers are small electronic devices placed on top of payment terminal entry slots.
- Perform a physical check of every terminal before opening and closing the store.
- Look for loose parts, misaligned slots, or additional wires.
- Report any hardware deviations immediately.

### Logical POS Guidelines
- POS systems run on isolated network bands. Never try to bridge a POS terminal to the office Wi-Fi network.
- Do not connect any personal devices (like USB storage, cameras, or mobile phones) to the terminal hardware to charge them or browse files.
`,
    estimatedDuration: '12 mins',
    status: 'PUBLISHED',
    createdDate: '2026-03-15',
    updatedDate: '2026-07-10',
  },
  {
    id: 'TRN005',
    title: 'Customer Data Safety & Compliance',
    description: 'Procedures for managing sensitive consumer details, privacy regulations, and storage constraints.',
    content: `## Module 5: Customer Data Protection

### Understanding Sensitive Information
Customer data includes names, email addresses, credit card numbers, and purchase history. Improper handling can lead to identity theft, corporate fines, and loss of client trust.

### Golden Rules of Data Handling
1. **Minimize Storage**: Do not save customer detail lists on local hard drives or shared folders. Access them through secure cloud dashboards.
2. **Secure Sharing**: If sharing is required internally, use encrypted links rather than attaching spreadsheets in emails.
3. **Double check Recipient**: Ensure you are not sending bulk customer files to external accounts or personal emails.
`,
    estimatedDuration: '15 mins',
    status: 'PUBLISHED',
    createdDate: '2026-04-01',
    updatedDate: '2026-04-01',
  },
  {
    id: 'TRN006',
    title: 'Internet and Device Safety',
    description: 'Safeguarding mobile devices, connecting to public networks safely, and remote workspace practices.',
    content: `## Module 6: Internet and Device Safety

### Mobile & Remote Work Practices
Remote work introduces new exposure vectors. Follow these guidelines to keep systems protected when working away from the office.

### Working in Public Places
- **Public Wi-Fi Warning**: Free airport or coffee shop networks are vulnerable to "man-in-the-middle" eavesdropping. Always activate the company VPN before checking email or writing code on public networks.
- **Visual Eavesdropping**: Be conscious of who is sitting behind you. Use physical privacy screen filters in busy spaces.

### Physical Device Security
- Never leave laptops, tablets, or corporate phones unattended in cars, hotels, or restaurants.
- Lock your screen with a password/PIN on every device.
`,
    estimatedDuration: '10 mins',
    status: 'PUBLISHED',
    createdDate: '2026-04-20',
    updatedDate: '2026-04-20',
  },
  {
    id: 'TRN007',
    title: 'Reporting Suspicious Activities',
    description: 'How, when, and what to report to the Security Operations Center when you notice anomalies.',
    content: `## Module 7: Reporting Incidents

### When to Raise a Flag
You do not need to be certain there is an attack to raise an alert. Report immediately if you notice:
- Unusual popups asking for administrator login permissions on your screen.
- A missing badge or corporate card.
- A coworker requesting system passwords.
- A sudden slowing of systems or unusual files with strange extensions appearing.

### The Reporting Flow
1. Dial the Security Response Center (ext: 9111).
2. Email \`incident@amraleaf.com\` with screenshots of warning dialogs or malicious email headers.
3. Keep the device turned on, disconnect the ethernet cable or disconnect from Wi-Fi, and await response from IT Security support.
`,
    estimatedDuration: '8 mins',
    status: 'PUBLISHED',
    createdDate: '2026-05-10',
    updatedDate: '2026-05-10',
  }
];
