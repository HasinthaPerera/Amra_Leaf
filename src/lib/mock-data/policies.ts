import { Policy } from '@/types';

export const mockPolicies: Policy[] = [
  {
    id: 'POL001',
    title: 'Password & Authentication Policy',
    category: 'Password Security',
    content: `# Password & Authentication Policy

## 1. Purpose
This policy defines the rules for creating, protecting, and changing passwords used to access Amra Leaf systems. This is critical to prevent unauthorized access to administrative controls and customer databases.

## 2. Password Complexity Requirements
All corporate accounts must employ passwords that meet or exceed the following constraints:
- Minimum length of **14 characters**.
- Must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special character (e.g., \`!, @, #, $, %, ^, *\`).
- Must not contain dictionary words, usernames, or easily guessable personal info (such as birthdays or names of pets).

## 3. Multi-Factor Authentication (MFA)
- MFA must be enabled on all systems that support it, especially email accounts, POS systems, and VPN connections.
- The use of authentication apps (such as Google Authenticator or Microsoft Authenticator) is highly preferred over SMS-based MFA.

## 4. Password Management
- Employees must use the approved company Password Manager to generate and store passwords.
- Sharing passwords between colleagues or writing them down on physical notes is strictly prohibited.
- Passwords must be changed immediately if there is any suspicion of compromise.
`,
    version: 'v2.1',
    status: 'PUBLISHED',
    createdDate: '2026-01-15',
    updatedDate: '2026-06-10',
    publishedDate: '2026-06-12',
  },
  {
    id: 'POL002',
    title: 'Phishing Awareness and Defense Policy',
    category: 'Phishing Awareness',
    content: `# Phishing Awareness and Defense Policy

## 1. Purpose
This policy sets forth guidelines for recognizing, responding to, and reporting suspicious emails, text messages, or phone calls designed to steal credentials or download malware.

## 2. Scope
This applies to all email correspondence, instant messages, and communications received on Amra Leaf hardware or corporate accounts.

## 3. Mandatory Actions
- **Double Check Sender Addresses**: Verify that email addresses end exactly with \`@amraleaf.com\` before treating internal messages as authentic.
- **Do Not Click Suspicious Links**: Never click links or download attachments from unexpected senders, or messages that urge immediate action (artificial urgency).
- **Report Immediately**: If you receive a suspicious message, click the "Report Phishing" button in your email client or forward it to \`security-response@amraleaf.com\`. Do not forward it to other colleagues.
`,
    version: 'v1.3',
    status: 'PUBLISHED',
    createdDate: '2026-02-10',
    updatedDate: '2026-05-18',
    publishedDate: '2026-05-20',
  },
  {
    id: 'POL003',
    title: 'Point of Sale (POS) Security Policy',
    category: 'POS Security',
    content: `# Point of Sale (POS) Security Policy

## 1. Purpose
This policy establishes physical and logical safety controls around retail and terminal transaction hardware to protect transaction flows and customer payment cards.

## 2. Hardware Controls
- **Physical Inspection**: Staff must inspect terminal card slots, card reader terminals, and connecting cables daily for unauthorized skimming devices.
- **Unauthorized Devices**: No third-party USB drives, keyboards, or phone chargers may be connected to POS computer units.

## 3. Network & Software Security
- POS terminals must operate on a segregated network environment separated from general corporate office networks.
- No general web browsing, email checks, or software downloads are allowed on active payment terminals.
`,
    version: 'v3.0',
    status: 'PUBLISHED',
    createdDate: '2025-11-01',
    updatedDate: '2026-07-02',
    publishedDate: '2026-07-05',
  },
  {
    id: 'POL004',
    title: 'Customer Data Protection & Privacy',
    category: 'Customer Data Protection',
    content: `# Customer Data Protection & Privacy Policy

## 1. Purpose
To ensure compliance with general data protection regulations (GDPR) and local retail client privacy standards regarding the collection, processing, and storage of consumer files.

## 2. Minimal Disclosure Rule
- Customer records, including billing addresses, phone numbers, and buying histories, must only be shared on a strict "need-to-know" basis.
- Under no circumstances should bulk customer sheets be downloaded onto personal devices or local drives without encryption approval.

## 3. Disposal of Records
- Physical sheets containing customer details must be shredded immediately after their immediate utility expires.
- Digital logs must undergo secure sanitization according to IT security storage procedures.
`,
    version: 'v2.0',
    status: 'PUBLISHED',
    createdDate: '2026-01-20',
    updatedDate: '2026-06-25',
    publishedDate: '2026-06-28',
  },
  {
    id: 'POL005',
    title: 'Acceptable Use of IT Assets',
    category: 'Acceptable Use',
    content: `# Acceptable Use of IT Assets Policy

## 1. Purpose
This document details acceptable behaviors for employees when utilizing laptops, internet lines, cloud servers, and networks provided by Amra Leaf.

## 2. Approved Activities
- Work resources are primary for operations, development, support, and administrative services.
- Minimal personal use of email and web surfing is permitted during break times, provided it does not slow systems or expose them to security threats.

## 3. Prohibited Activities
- Downloading pirated media, tools, or running torrent clients.
- Setting up external remote access utilities (e.g. TeamViewer, AnyDesk) without security operations approval.
- Using work emails to sign up for personal services, gaming, or gambling websites.
`,
    version: 'v1.0',
    status: 'PUBLISHED',
    createdDate: '2026-03-05',
    updatedDate: '2026-03-05',
    publishedDate: '2026-03-07',
  },
  {
    id: 'POL006',
    title: 'Staff Device and BYOD Security',
    category: 'Staff Device Security',
    content: `# Staff Device and BYOD (Bring Your Own Device) Security

## 1. Purpose
Defines policies for connecting personal mobile devices, tablets, and remote work laptops to Amra Leaf corporate services.

## 2. Basic Requirements
- All devices must use secure lock screens (PIN, fingerprint, or facial recognition).
- Devices must run a supported operating system with automatic security patches enabled.
- Rooted or jailbroken phones are completely blocked from logging into company accounts.

## 3. Remote Wipe Authority
- By connecting your device to the corporate email system, you acknowledge that Amra Leaf IT maintains the authority to execute a remote wipe of corporate data if the device is lost, stolen, or upon termination of employment.
`,
    version: 'v1.5',
    status: 'PUBLISHED',
    createdDate: '2026-04-12',
    updatedDate: '2026-07-20',
    publishedDate: '2026-07-22',
  },
  {
    id: 'POL007',
    title: 'Security Incident Reporting Policy',
    category: 'Incident Reporting',
    content: `# Security Incident Reporting Policy

## 1. Purpose
Timely identification and reporting of security issues allow the response team to isolate threats and minimize data exposure.

## 2. What Constitutes an Incident
Employees must report:
- Loss or theft of work laptops, phones, or security badges.
- Receiving ransomware messages or noticing files locked with unexpected extensions.
- Finding physical security locks broken or tailgaters entering secure zones.
- Unintentional disclosure of company code or client files.

## 3. Reporting Protocols
- Report immediately by calling the Security Hotline (Ext 9111) or filing an urgent ticket on the IT Helpdesk.
- Do not attempt to investigate, reboot, or clean infected computers yourself. Keep the system powered on but disconnect it from the network.
`,
    version: 'v2.2',
    status: 'PUBLISHED',
    createdDate: '2025-12-10',
    updatedDate: '2026-08-01',
    publishedDate: '2026-08-02',
  },
  {
    id: 'POL008',
    title: 'Social Media Security Guidelines',
    category: 'Social Media Security',
    content: `# Social Media Security Guidelines

## 1. Purpose
Protects Amra Leaf from target reconnaissance by malicious actors and brand defamation via public social media platforms.

## 2. Professional and Safe Posting
- Do not post pictures of your workspace, computer monitors, or company ID badges online.
- Avoid listing specific technologies, internal server configurations, or security setups in public discussions or LinkedIn postings.
- Never discuss internal company issues, client grievances, or security incidents on public forums.
`,
    version: 'v1.1',
    status: 'DRAFT',
    createdDate: '2026-08-10',
    updatedDate: '2026-08-15',
  }
];
