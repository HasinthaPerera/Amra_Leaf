import { UserProgress } from '@/types';

export const mockUserProgress: UserProgress[] = [
  {
    userId: 'EMP001', // employee@amraleaf.com (Mock Employee User)
    policyProgress: [
      { policyId: 'POL001', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-15T09:00:00Z' },
      { policyId: 'POL002', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-16T10:15:00Z' },
      { policyId: 'POL003', status: 'PENDING' },
      { policyId: 'POL004', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-28T14:30:00Z' },
      { policyId: 'POL005', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-29T11:00:00Z' },
      { policyId: 'POL006', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-07-23T08:45:00Z' },
      { policyId: 'POL007', status: 'PENDING' },
    ],
    trainingProgress: [
      { moduleId: 'TRN001', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-14T11:30:00Z' },
      { moduleId: 'TRN002', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-15T15:20:00Z' },
      { moduleId: 'TRN003', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-25T16:00:00Z' },
      { moduleId: 'TRN004', progressPercent: 40, status: 'IN_PROGRESS' },
      { moduleId: 'TRN005', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-27T10:10:00Z' },
      { moduleId: 'TRN006', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-07-22T09:40:00Z' },
      { moduleId: 'TRN007', progressPercent: 0, status: 'NOT_STARTED' },
    ],
    quizResults: [
      {
        quizId: 'QZ001',
        userId: 'EMP001',
        score: 3,
        totalQuestions: 3,
        percentage: 100,
        passed: true,
        submittedAt: '2026-06-14T11:45:00Z',
      },
      {
        quizId: 'QZ002',
        userId: 'EMP001',
        score: 2,
        totalQuestions: 3,
        percentage: 67,
        passed: true,
        submittedAt: '2026-06-15T15:40:00Z',
      },
      {
        quizId: 'QZ003',
        userId: 'EMP001',
        score: 3,
        totalQuestions: 3,
        percentage: 100,
        passed: true,
        submittedAt: '2026-06-25T16:15:00Z',
      }
    ],
  },
  {
    userId: 'EMP002', // Amina
    policyProgress: [
      { policyId: 'POL001', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-13T09:00:00Z' },
      { policyId: 'POL002', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-14T10:15:00Z' },
      { policyId: 'POL003', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-07-06T11:30:00Z' },
      { policyId: 'POL004', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-29T14:30:00Z' },
      { policyId: 'POL005', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-29T11:00:00Z' },
      { policyId: 'POL006', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-07-23T08:45:00Z' },
      { policyId: 'POL007', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-08-03T10:00:00Z' },
    ],
    trainingProgress: [
      { moduleId: 'TRN001', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-12T11:30:00Z' },
      { moduleId: 'TRN002', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-13T15:20:00Z' },
      { moduleId: 'TRN003', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-25T16:00:00Z' },
      { moduleId: 'TRN004', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-07-05T10:10:00Z' },
      { moduleId: 'TRN005', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-27T10:10:00Z' },
      { moduleId: 'TRN006', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-07-22T09:40:00Z' },
      { moduleId: 'TRN007', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-08-02T09:40:00Z' },
    ],
    quizResults: [
      { quizId: 'QZ001', userId: 'EMP002', score: 3, totalQuestions: 3, percentage: 100, passed: true, submittedAt: '2026-06-12T11:45:00Z' },
      { quizId: 'QZ002', userId: 'EMP002', score: 3, totalQuestions: 3, percentage: 100, passed: true, submittedAt: '2026-06-13T15:40:00Z' },
      { quizId: 'QZ003', userId: 'EMP002', score: 3, totalQuestions: 3, percentage: 100, passed: true, submittedAt: '2026-06-25T16:15:00Z' },
      { quizId: 'QZ004', userId: 'EMP002', score: 3, totalQuestions: 3, percentage: 100, passed: true, submittedAt: '2026-07-05T10:30:00Z' }
    ],
  },
  {
    userId: 'EMP003', // Chen Wei
    policyProgress: [
      { policyId: 'POL001', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-15T09:00:00Z' },
      { policyId: 'POL002', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-16T10:15:00Z' },
      { policyId: 'POL003', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-07-06T11:30:00Z' },
      { policyId: 'POL004', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-28T14:30:00Z' },
      { policyId: 'POL005', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-29T11:00:00Z' },
      { policyId: 'POL006', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-07-23T08:45:00Z' },
      { policyId: 'POL007', status: 'PENDING' },
    ],
    trainingProgress: [
      { moduleId: 'TRN001', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-14T11:30:00Z' },
      { moduleId: 'TRN002', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-15T15:20:00Z' },
      { moduleId: 'TRN003', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-25T16:00:00Z' },
      { moduleId: 'TRN004', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-07-05T10:10:00Z' },
      { moduleId: 'TRN005', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-27T10:10:00Z' },
      { moduleId: 'TRN006', progressPercent: 70, status: 'IN_PROGRESS' },
      { moduleId: 'TRN007', progressPercent: 0, status: 'NOT_STARTED' },
    ],
    quizResults: [
      { quizId: 'QZ001', userId: 'EMP003', score: 3, totalQuestions: 3, percentage: 100, passed: true, submittedAt: '2026-06-14T11:45:00Z' },
      { quizId: 'QZ002', userId: 'EMP003', score: 1, totalQuestions: 3, percentage: 33, passed: false, submittedAt: '2026-06-15T15:40:00Z' }, // FAILED
      { quizId: 'QZ003', userId: 'EMP003', score: 3, totalQuestions: 3, percentage: 100, passed: true, submittedAt: '2026-06-25T16:15:00Z' }
    ],
  },
  {
    userId: 'EMP004', // Elena
    policyProgress: [
      { policyId: 'POL001', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-15T09:00:00Z' },
      { policyId: 'POL002', status: 'PENDING' },
      { policyId: 'POL003', status: 'PENDING' },
      { policyId: 'POL004', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-28T14:30:00Z' },
      { policyId: 'POL005', status: 'PENDING' },
      { policyId: 'POL006', status: 'PENDING' },
      { policyId: 'POL007', status: 'PENDING' },
    ],
    trainingProgress: [
      { moduleId: 'TRN001', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-14T11:30:00Z' },
      { moduleId: 'TRN002', progressPercent: 20, status: 'IN_PROGRESS' },
      { moduleId: 'TRN003', progressPercent: 0, status: 'NOT_STARTED' },
      { moduleId: 'TRN004', progressPercent: 0, status: 'NOT_STARTED' },
      { moduleId: 'TRN005', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-27T10:10:00Z' },
      { moduleId: 'TRN006', progressPercent: 0, status: 'NOT_STARTED' },
      { moduleId: 'TRN007', progressPercent: 0, status: 'NOT_STARTED' },
    ],
    quizResults: [
      { quizId: 'QZ001', userId: 'EMP004', score: 2, totalQuestions: 3, percentage: 67, passed: true, submittedAt: '2026-06-14T11:45:00Z' }
    ],
  },
  {
    userId: 'EMP005', // Marcus
    policyProgress: [
      { policyId: 'POL001', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-15T09:00:00Z' },
      { policyId: 'POL002', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-16T10:15:00Z' },
      { policyId: 'POL003', status: 'PENDING' },
      { policyId: 'POL004', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-28T14:30:00Z' },
      { policyId: 'POL005', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-29T11:00:00Z' },
      { policyId: 'POL006', status: 'PENDING' },
      { policyId: 'POL007', status: 'PENDING' },
    ],
    trainingProgress: [
      { moduleId: 'TRN001', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-14T11:30:00Z' },
      { moduleId: 'TRN002', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-15T15:20:00Z' },
      { moduleId: 'TRN003', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-25T16:00:00Z' },
      { moduleId: 'TRN004', progressPercent: 0, status: 'NOT_STARTED' },
      { moduleId: 'TRN005', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-27T10:10:00Z' },
      { moduleId: 'TRN006', progressPercent: 10, status: 'IN_PROGRESS' },
      { moduleId: 'TRN007', progressPercent: 0, status: 'NOT_STARTED' },
    ],
    quizResults: [
      { quizId: 'QZ001', userId: 'EMP005', score: 3, totalQuestions: 3, percentage: 100, passed: true, submittedAt: '2026-06-14T11:45:00Z' },
      { quizId: 'QZ002', userId: 'EMP005', score: 2, totalQuestions: 3, percentage: 67, passed: true, submittedAt: '2026-06-15T15:40:00Z' }
    ],
  },
  {
    userId: 'EMP006', // Priya
    policyProgress: [
      { policyId: 'POL001', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-15T09:00:00Z' },
      { policyId: 'POL002', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-16T10:15:00Z' },
      { policyId: 'POL003', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-07-06T11:30:00Z' },
      { policyId: 'POL004', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-28T14:30:00Z' },
      { policyId: 'POL005', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-29T11:00:00Z' },
      { policyId: 'POL006', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-07-23T08:45:00Z' },
      { policyId: 'POL007', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-08-02T10:00:00Z' },
    ],
    trainingProgress: [
      { moduleId: 'TRN001', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-14T11:30:00Z' },
      { moduleId: 'TRN002', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-15T15:20:00Z' },
      { moduleId: 'TRN003', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-25T16:00:00Z' },
      { moduleId: 'TRN004', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-07-05T10:10:00Z' },
      { moduleId: 'TRN005', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-27T10:10:00Z' },
      { moduleId: 'TRN006', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-07-22T09:40:00Z' },
      { moduleId: 'TRN007', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-08-01T09:40:00Z' },
    ],
    quizResults: [
      { quizId: 'QZ001', userId: 'EMP006', score: 3, totalQuestions: 3, percentage: 100, passed: true, submittedAt: '2026-06-14T11:45:00Z' },
      { quizId: 'QZ002', userId: 'EMP006', score: 3, totalQuestions: 3, percentage: 100, passed: true, submittedAt: '2026-06-15T15:40:00Z' },
      { quizId: 'QZ003', userId: 'EMP006', score: 3, totalQuestions: 3, percentage: 100, passed: true, submittedAt: '2026-06-25T16:15:00Z' },
      { quizId: 'QZ004', userId: 'EMP006', score: 3, totalQuestions: 3, percentage: 100, passed: true, submittedAt: '2026-07-05T10:30:00Z' }
    ],
  },
  {
    userId: 'EMP007', // Jackson
    policyProgress: [
      { policyId: 'POL001', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-15T09:00:00Z' },
      { policyId: 'POL002', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-16T10:15:00Z' },
      { policyId: 'POL003', status: 'PENDING' },
      { policyId: 'POL004', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-28T14:30:00Z' },
      { policyId: 'POL005', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-29T11:00:00Z' },
      { policyId: 'POL006', status: 'PENDING' },
      { policyId: 'POL007', status: 'PENDING' },
    ],
    trainingProgress: [
      { moduleId: 'TRN001', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-14T11:30:00Z' },
      { moduleId: 'TRN002', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-15T15:20:00Z' },
      { moduleId: 'TRN003', progressPercent: 100, status: 'COMPLETED', completedAt: '2026-06-25T16:00:00Z' },
      { moduleId: 'TRN004', progressPercent: 20, status: 'IN_PROGRESS' },
      { moduleId: 'TRN005', progressPercent: 0, status: 'NOT_STARTED' },
      { moduleId: 'TRN006', progressPercent: 0, status: 'NOT_STARTED' },
      { moduleId: 'TRN007', progressPercent: 0, status: 'NOT_STARTED' },
    ],
    quizResults: [
      { quizId: 'QZ001', userId: 'EMP007', score: 3, totalQuestions: 3, percentage: 100, passed: true, submittedAt: '2026-06-14T11:45:00Z' },
      { quizId: 'QZ002', userId: 'EMP007', score: 2, totalQuestions: 3, percentage: 67, passed: true, submittedAt: '2026-06-15T15:40:00Z' }
    ],
  },
  {
    userId: 'EMP008', // Isabella (Inactive)
    policyProgress: [
      { policyId: 'POL001', status: 'PENDING' },
      { policyId: 'POL002', status: 'PENDING' },
      { policyId: 'POL003', status: 'PENDING' },
      { policyId: 'POL004', status: 'PENDING' },
      { policyId: 'POL005', status: 'PENDING' },
      { policyId: 'POL006', status: 'PENDING' },
      { policyId: 'POL007', status: 'PENDING' },
    ],
    trainingProgress: [
      { moduleId: 'TRN001', progressPercent: 0, status: 'NOT_STARTED' },
      { moduleId: 'TRN002', progressPercent: 0, status: 'NOT_STARTED' },
      { moduleId: 'TRN003', progressPercent: 0, status: 'NOT_STARTED' },
      { moduleId: 'TRN004', progressPercent: 0, status: 'NOT_STARTED' },
      { moduleId: 'TRN005', progressPercent: 0, status: 'NOT_STARTED' },
      { moduleId: 'TRN006', progressPercent: 0, status: 'NOT_STARTED' },
      { moduleId: 'TRN007', progressPercent: 0, status: 'NOT_STARTED' },
    ],
    quizResults: [],
  }
];
