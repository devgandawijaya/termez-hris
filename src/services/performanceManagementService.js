const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const performanceEmployees = [
  {
    id: 'emp-pm-001',
    employeeCode: 'EMP2001',
    fullName: 'Budi Santoso',
    department: 'Sales',
    position: 'Sales Executive',
    managerName: 'Ratna Dewi',
    role: 'employee',
  },
  {
    id: 'emp-pm-002',
    employeeCode: 'EMP2002',
    fullName: 'Andi Pratama',
    department: 'Sales',
    position: 'Senior Account Manager',
    managerName: 'Ratna Dewi',
    role: 'employee',
  },
  {
    id: 'emp-pm-003',
    employeeCode: 'EMP2003',
    fullName: 'Siti Aisyah',
    department: 'Human Resources',
    position: 'HR Officer',
    managerName: 'Dimas Nugroho',
    role: 'employee',
  },
  {
    id: 'emp-pm-004',
    employeeCode: 'EMP2004',
    fullName: 'Rina Lestari',
    department: 'Technology',
    position: 'Frontend Engineer',
    managerName: 'Galih Prakoso',
    role: 'employee',
  },
  {
    id: 'emp-pm-005',
    employeeCode: 'EMP2005',
    fullName: 'Deni Kurniawan',
    department: 'Operations',
    position: 'Operations Supervisor',
    managerName: 'Lina Mardiana',
    role: 'manager',
  },
  {
    id: 'emp-pm-006',
    employeeCode: 'EMP2006',
    fullName: 'Ratna Dewi',
    department: 'Sales',
    position: 'Head of Sales',
    managerName: 'CFO Office',
    role: 'manager',
  },
];

let okrStore = [
  {
    id: 'okr-001',
    objective: 'Increase Sales Q2',
    department: 'Sales',
    employeeId: 'emp-pm-001',
    ownerName: 'Budi Santoso',
    quarter: '2026-Q2',
    status: 'On Track',
    priority: 'High',
    dueDate: '2026-06-30',
    description: 'Memacu pendapatan kuartal kedua melalui pipeline B2B dan ekspansi klien baru.',
    keyResults: [
      {
        id: 'kr-001',
        title: 'Achieve revenue 1M',
        progress: 70,
        targetLabel: 'Rp1.000.000.000',
        actualLabel: 'Rp700.000.000',
        status: 'On Track',
      },
      {
        id: 'kr-002',
        title: 'Add 50 new clients',
        progress: 40,
        targetLabel: '50 klien',
        actualLabel: '20 klien',
        status: 'At Risk',
      },
    ],
    timeline: [
      { id: 'okrt-001', label: 'Objective created', actor: 'HRD Team', date: '2026-04-01T08:00:00.000Z' },
      { id: 'okrt-002', label: 'Mid-quarter check-in', actor: 'Ratna Dewi', date: '2026-05-10T09:30:00.000Z' },
      { id: 'okrt-003', label: 'Client acquisition flagged at risk', actor: 'Budi Santoso', date: '2026-05-18T16:00:00.000Z' },
    ],
    updatedAt: '2026-05-18T16:00:00.000Z',
  },
  {
    id: 'okr-002',
    objective: 'Improve Customer Renewal Rate',
    department: 'Sales',
    employeeId: 'emp-pm-002',
    ownerName: 'Andi Pratama',
    quarter: '2026-Q2',
    status: 'Completed',
    priority: 'High',
    dueDate: '2026-06-20',
    description: 'Menjaga base client premium agar renewal conversion stabil di atas benchmark.',
    keyResults: [
      {
        id: 'kr-003',
        title: 'Renew 15 enterprise accounts',
        progress: 100,
        targetLabel: '15 akun',
        actualLabel: '16 akun',
        status: 'Completed',
      },
      {
        id: 'kr-004',
        title: 'Upsell 3 strategic packages',
        progress: 92,
        targetLabel: '3 paket',
        actualLabel: '2.8 paket ekuivalen',
        status: 'On Track',
      },
    ],
    timeline: [
      { id: 'okrt-004', label: 'Objective approved', actor: 'Ratna Dewi', date: '2026-04-02T08:15:00.000Z' },
      { id: 'okrt-005', label: 'Renewal sprint completed', actor: 'Andi Pratama', date: '2026-06-18T10:00:00.000Z' },
    ],
    updatedAt: '2026-06-18T10:00:00.000Z',
  },
  {
    id: 'okr-003',
    objective: 'Reduce Time to Fill Critical Roles',
    department: 'Human Resources',
    employeeId: 'emp-pm-003',
    ownerName: 'Siti Aisyah',
    quarter: '2026-Q2',
    status: 'On Track',
    priority: 'Medium',
    dueDate: '2026-06-30',
    description: 'Mengurangi lead time recruitment untuk posisi engineering dan sales prioritas.',
    keyResults: [
      {
        id: 'kr-005',
        title: 'Cut average time to fill to 28 days',
        progress: 76,
        targetLabel: '28 hari',
        actualLabel: '31 hari',
        status: 'On Track',
      },
      {
        id: 'kr-006',
        title: 'Build qualified talent pool of 120 candidates',
        progress: 65,
        targetLabel: '120 kandidat',
        actualLabel: '78 kandidat',
        status: 'On Track',
      },
    ],
    timeline: [
      { id: 'okrt-006', label: 'Recruitment benchmark published', actor: 'Dimas Nugroho', date: '2026-04-05T07:30:00.000Z' },
    ],
    updatedAt: '2026-05-27T14:20:00.000Z',
  },
  {
    id: 'okr-004',
    objective: 'Stabilize Frontend Release Quality',
    department: 'Technology',
    employeeId: 'emp-pm-004',
    ownerName: 'Rina Lestari',
    quarter: '2026-Q2',
    status: 'At Risk',
    priority: 'High',
    dueDate: '2026-06-30',
    description: 'Menaikkan kualitas release FE melalui coverage test dan error prevention.',
    keyResults: [
      {
        id: 'kr-007',
        title: 'Reach 80% UI test coverage',
        progress: 55,
        targetLabel: '80%',
        actualLabel: '44%',
        status: 'At Risk',
      },
      {
        id: 'kr-008',
        title: 'Reduce production bug reopen rate by 30%',
        progress: 62,
        targetLabel: '30%',
        actualLabel: '18%',
        status: 'On Track',
      },
    ],
    timeline: [
      { id: 'okrt-007', label: 'Regression issue escalated', actor: 'Galih Prakoso', date: '2026-05-22T11:00:00.000Z' },
    ],
    updatedAt: '2026-05-22T11:00:00.000Z',
  },
];

let appraisalStore = [
  {
    id: 'app-001',
    employeeId: 'emp-pm-001',
    employeeName: 'Budi Santoso',
    department: 'Sales',
    cycle: 'Mid Year 2026',
    reviewerName: 'Ratna Dewi',
    scores: {
      kpi: 85,
      attitude: 90,
      discipline: 88,
    },
    rating: {
      kpi: 4.2,
      attitude: 4.6,
      discipline: 4.4,
    },
    finalScore: 87.6,
    grade: 'A',
    workflowStatus: 'Pending Approval',
    recommendation: 'Ready for fast-track account handling.',
    history: [
      { id: 'apph-001', label: 'Draft created by HRD', actor: 'Siti Aisyah', date: '2026-06-10T08:00:00.000Z' },
      { id: 'apph-002', label: 'Reviewed by manager', actor: 'Ratna Dewi', date: '2026-06-12T10:30:00.000Z' },
    ],
    updatedAt: '2026-06-12T10:30:00.000Z',
  },
  {
    id: 'app-002',
    employeeId: 'emp-pm-002',
    employeeName: 'Andi Pratama',
    department: 'Sales',
    cycle: 'Mid Year 2026',
    reviewerName: 'Ratna Dewi',
    scores: {
      kpi: 92,
      attitude: 88,
      discipline: 91,
    },
    rating: {
      kpi: 4.8,
      attitude: 4.2,
      discipline: 4.5,
    },
    finalScore: 90.6,
    grade: 'A',
    workflowStatus: 'Approved',
    recommendation: 'Top performer for strategic promotion pool.',
    history: [
      { id: 'apph-003', label: 'Approved by HRD', actor: 'Dimas Nugroho', date: '2026-06-11T09:00:00.000Z' },
    ],
    updatedAt: '2026-06-11T09:00:00.000Z',
  },
  {
    id: 'app-003',
    employeeId: 'emp-pm-004',
    employeeName: 'Rina Lestari',
    department: 'Technology',
    cycle: 'Mid Year 2026',
    reviewerName: 'Galih Prakoso',
    scores: {
      kpi: 78,
      attitude: 84,
      discipline: 80,
    },
    rating: {
      kpi: 3.9,
      attitude: 4.0,
      discipline: 4.0,
    },
    finalScore: 80.2,
    grade: 'B',
    workflowStatus: 'Needs Review',
    recommendation: 'Coaching on quality gates and release discipline.',
    history: [
      { id: 'apph-004', label: 'Returned for recalibration', actor: 'HR Calibration Panel', date: '2026-06-14T14:00:00.000Z' },
    ],
    updatedAt: '2026-06-14T14:00:00.000Z',
  },
];

let evaluation360Store = [
  {
    id: 'eval-001',
    employeeId: 'emp-pm-001',
    employeeName: 'Budi Santoso',
    department: 'Sales',
    cycle: 'Mid Year 2026',
    anonymousAllowed: true,
    competencies: {
      Communication: 4.5,
      Teamwork: 4.2,
      Leadership: 3.8,
      Ownership: 4.1,
      ProblemSolving: 4.0,
    },
    reviewers: [
      {
        id: 'rev-001',
        reviewerName: 'Ratna Dewi',
        reviewerRole: 'Atasan',
        anonymous: false,
        comment: 'Budi menunjukkan kemajuan signifikan dalam handling enterprise pipeline.',
      },
      {
        id: 'rev-002',
        reviewerName: 'Anonim',
        reviewerRole: 'Rekan kerja',
        anonymous: true,
        comment: 'Kolaboratif, namun perlu lebih proaktif saat weekly update lintas tim.',
      },
      {
        id: 'rev-003',
        reviewerName: 'Deni Kurniawan',
        reviewerRole: 'Bawahan',
        anonymous: false,
        comment: 'Terbuka menerima feedback dan membantu unblock kendala lapangan.',
      },
    ],
    updatedAt: '2026-06-15T09:45:00.000Z',
  },
  {
    id: 'eval-002',
    employeeId: 'emp-pm-002',
    employeeName: 'Andi Pratama',
    department: 'Sales',
    cycle: 'Mid Year 2026',
    anonymousAllowed: true,
    competencies: {
      Communication: 4.8,
      Teamwork: 4.4,
      Leadership: 4.5,
      Ownership: 4.7,
      ProblemSolving: 4.6,
    },
    reviewers: [
      {
        id: 'rev-004',
        reviewerName: 'Ratna Dewi',
        reviewerRole: 'Atasan',
        anonymous: false,
        comment: 'Andi konsisten memimpin deal review dengan sangat matang.',
      },
      {
        id: 'rev-005',
        reviewerName: 'Anonim',
        reviewerRole: 'Rekan kerja',
        anonymous: true,
        comment: 'Sangat kuat dalam coaching junior dan negosiasi klien.',
      },
    ],
    updatedAt: '2026-06-13T13:20:00.000Z',
  },
  {
    id: 'eval-003',
    employeeId: 'emp-pm-004',
    employeeName: 'Rina Lestari',
    department: 'Technology',
    cycle: 'Mid Year 2026',
    anonymousAllowed: false,
    competencies: {
      Communication: 4.0,
      Teamwork: 4.3,
      Leadership: 3.6,
      Ownership: 4.1,
      ProblemSolving: 4.4,
    },
    reviewers: [
      {
        id: 'rev-006',
        reviewerName: 'Galih Prakoso',
        reviewerRole: 'Atasan',
        anonymous: false,
        comment: 'Teknis kuat, perlu naik level di stakeholder communication.',
      },
    ],
    updatedAt: '2026-06-14T16:10:00.000Z',
  },
];

let careerPathStore = [
  {
    id: 'career-001',
    employeeId: 'emp-pm-001',
    employeeName: 'Budi Santoso',
    department: 'Sales',
    currentStage: 'Senior Staff',
    targetStage: 'Supervisor',
    pathStages: ['Staff', 'Senior Staff', 'Supervisor'],
    readinessScore: 78,
    recommendationStatus: 'Under Review',
    hrdApproval: 'Pending',
    eligibility: 'Potential Soon',
    nextAction: 'Tingkatkan konsistensi closing rate dan mentoring junior.',
    promotionHistory: [
      { id: 'ph-001', title: 'Sales Staff', effectiveDate: '2023-02-01', notes: 'Joined commercial team.' },
      { id: 'ph-002', title: 'Senior Staff', effectiveDate: '2025-03-01', notes: 'Exceeded annual quota 2 cycles.' },
    ],
  },
  {
    id: 'career-002',
    employeeId: 'emp-pm-002',
    employeeName: 'Andi Pratama',
    department: 'Sales',
    currentStage: 'Senior Staff',
    targetStage: 'Supervisor',
    pathStages: ['Staff', 'Senior Staff', 'Supervisor'],
    readinessScore: 92,
    recommendationStatus: 'Recommended',
    hrdApproval: 'Approved',
    eligibility: 'Eligible',
    nextAction: 'Siapkan transition plan ke peran supervisor pada Q3.',
    promotionHistory: [
      { id: 'ph-003', title: 'Sales Staff', effectiveDate: '2022-08-12', notes: 'Initial assignment.' },
      { id: 'ph-004', title: 'Senior Staff', effectiveDate: '2024-10-01', notes: 'Promoted after record account growth.' },
    ],
  },
  {
    id: 'career-003',
    employeeId: 'emp-pm-004',
    employeeName: 'Rina Lestari',
    department: 'Technology',
    currentStage: 'Staff',
    targetStage: 'Senior Staff',
    pathStages: ['Staff', 'Senior Staff', 'Lead Engineer'],
    readinessScore: 74,
    recommendationStatus: 'Development Plan',
    hrdApproval: 'Pending',
    eligibility: 'Need Improvement',
    nextAction: 'Lengkapi technical leadership milestone dan release ownership.',
    promotionHistory: [
      { id: 'ph-005', title: 'Frontend Engineer', effectiveDate: '2024-02-05', notes: 'Joined product engineering squad.' },
    ],
  },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getEmployee(employeeId) {
  return performanceEmployees.find((employee) => employee.id === employeeId);
}

function calculateOkrProgress(keyResults) {
  if (!keyResults.length) {
    return 0;
  }

  const total = keyResults.reduce((sum, item) => sum + Number(item.progress || 0), 0);
  return Number((total / keyResults.length).toFixed(1));
}

function calculateAppraisalFinal(scores) {
  const finalScore = (Number(scores.kpi) * 0.5) + (Number(scores.attitude) * 0.3) + (Number(scores.discipline) * 0.2);
  return Number(finalScore.toFixed(1));
}

function scoreToGrade(score) {
  if (score >= 85) return 'A';
  if (score >= 75) return 'B';
  return 'C';
}

function enrichOkrs() {
  return okrStore.map((record) => ({
    ...record,
    progress: calculateOkrProgress(record.keyResults),
  }));
}

function buildDepartmentPerformance(appraisals) {
  const grouped = appraisals.reduce((map, record) => {
    if (!map[record.department]) {
      map[record.department] = [];
    }
    map[record.department].push(record.finalScore);
    return map;
  }, {});

  return Object.entries(grouped).map(([department, scores]) => ({
    department,
    averageScore: Number((scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)),
  }));
}

function buildPerformanceTrend(appraisals) {
  const base = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const average = appraisals.length
    ? appraisals.reduce((sum, item) => sum + item.finalScore, 0) / appraisals.length
    : 0;

  return base.map((month, index) => ({
    month,
    score: Number((average - 3 + (index * 1.4)).toFixed(1)),
    target: 85,
  }));
}

function buildLeaderboard(appraisals) {
  return appraisalStore
    .map((record) => ({
      employeeName: record.employeeName,
      department: record.department,
      finalScore: record.finalScore,
      grade: record.grade,
    }))
    .sort((left, right) => right.finalScore - left.finalScore);
}

function buildAlerts(appraisals) {
  return appraisals
    .filter((record) => record.finalScore < 80)
    .map((record) => ({
      id: `alert-${record.id}`,
      employeeName: record.employeeName,
      department: record.department,
      issue: 'Performance below healthy benchmark',
      action: 'Trigger coaching plan and follow-up review.',
    }));
}

function buildDistribution(appraisals) {
  const distribution = { A: 0, B: 0, C: 0 };
  appraisals.forEach((record) => {
    distribution[record.grade] += 1;
  });
  return Object.entries(distribution).map(([grade, total]) => ({ grade, total }));
}

function buildAnalyticsSnapshot() {
  const departmentPerformance = buildDepartmentPerformance(appraisalStore);
  const leaderboard = buildLeaderboard(appraisalStore);
  const topPerformer = leaderboard[0];
  const salesAverage = departmentPerformance.find((item) => item.department === 'Sales')?.averageScore || 0;

  return {
    summaryCards: [
      { id: 'summary-001', label: 'Sales Dept Avg', value: `${Math.round(salesAverage)}%`, tone: 'sky' },
      { id: 'summary-002', label: 'Top Performer', value: topPerformer?.employeeName || '-', tone: 'emerald' },
      { id: 'summary-003', label: 'Pending Reviews', value: String(appraisalStore.filter((item) => item.workflowStatus !== 'Approved').length), tone: 'amber' },
      { id: 'summary-004', label: 'Promotion Ready', value: String(careerPathStore.filter((item) => item.eligibility === 'Eligible').length), tone: 'violet' },
    ],
    departmentPerformance,
    trend: buildPerformanceTrend(appraisalStore),
    distribution: buildDistribution(appraisalStore),
    leaderboard,
    alerts: buildAlerts(appraisalStore),
  };
}

function buildFilterOptions() {
  return {
    departments: [...new Set(performanceEmployees.map((employee) => employee.department))],
    employees: performanceEmployees.map((employee) => ({
      id: employee.id,
      name: employee.fullName,
      department: employee.department,
    })),
    quarters: [...new Set(enrichOkrs().map((record) => record.quarter))],
    cycles: [...new Set(appraisalStore.map((record) => record.cycle))],
  };
}

export async function getPerformanceManagementSnapshot() {
  await delay();

  return clone({
    employees: performanceEmployees,
    okrs: enrichOkrs(),
    appraisals: appraisalStore,
    evaluations: evaluation360Store,
    careerPaths: careerPathStore,
    analytics: buildAnalyticsSnapshot(),
    filterOptions: buildFilterOptions(),
  });
}

export async function saveOkr(payload) {
  await delay();

  const employee = getEmployee(payload.employeeId);
  const sanitizedRecord = {
    id: payload.id || generateId('okr'),
    objective: payload.objective,
    department: payload.department,
    employeeId: payload.employeeId,
    ownerName: employee?.fullName || payload.ownerName || 'Unknown',
    quarter: payload.quarter,
    status: payload.status,
    priority: payload.priority,
    dueDate: payload.dueDate,
    description: payload.description,
    keyResults: (payload.keyResults || []).map((item) => ({
      id: item.id || generateId('kr'),
      title: item.title,
      progress: Number(item.progress || 0),
      targetLabel: item.targetLabel,
      actualLabel: item.actualLabel,
      status: item.status,
    })),
    timeline: payload.timeline || [],
    updatedAt: new Date().toISOString(),
  };

  const currentTimeline = payload.id
    ? (okrStore.find((record) => record.id === payload.id)?.timeline || [])
    : [];

  sanitizedRecord.timeline = [
    ...currentTimeline,
    {
      id: generateId('okrt'),
      label: payload.id ? 'Objective updated' : 'Objective created',
      actor: 'HRD Team',
      date: new Date().toISOString(),
    },
  ];

  const existingIndex = okrStore.findIndex((record) => record.id === sanitizedRecord.id);
  if (existingIndex >= 0) {
    okrStore[existingIndex] = sanitizedRecord;
  } else {
    okrStore = [sanitizedRecord, ...okrStore];
  }

  return clone(sanitizedRecord);
}

export async function deleteOkr(okrId) {
  await delay(180);
  okrStore = okrStore.filter((record) => record.id !== okrId);
  return { success: true };
}

export async function saveAppraisal(payload) {
  await delay();

  const employee = getEmployee(payload.employeeId);
  const finalScore = calculateAppraisalFinal(payload.scores);
  const appraisalRecord = {
    id: payload.id || generateId('app'),
    employeeId: payload.employeeId,
    employeeName: employee?.fullName || payload.employeeName || 'Unknown',
    department: employee?.department || payload.department,
    cycle: payload.cycle,
    reviewerName: payload.reviewerName,
    scores: {
      kpi: Number(payload.scores.kpi),
      attitude: Number(payload.scores.attitude),
      discipline: Number(payload.scores.discipline),
    },
    rating: {
      kpi: Number(payload.rating.kpi),
      attitude: Number(payload.rating.attitude),
      discipline: Number(payload.rating.discipline),
    },
    finalScore,
    grade: scoreToGrade(finalScore),
    workflowStatus: payload.workflowStatus || 'Pending Approval',
    recommendation: payload.recommendation,
    history: [
      ...(appraisalStore.find((record) => record.id === payload.id)?.history || []),
      {
        id: generateId('apph'),
        label: payload.id ? 'Appraisal updated' : 'Appraisal created',
        actor: 'HRD Team',
        date: new Date().toISOString(),
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = appraisalStore.findIndex((record) => record.id === appraisalRecord.id);
  if (existingIndex >= 0) {
    appraisalStore[existingIndex] = appraisalRecord;
  } else {
    appraisalStore = [appraisalRecord, ...appraisalStore];
  }

  return clone(appraisalRecord);
}

export async function updateAppraisalWorkflow(appraisalId, workflowStatus) {
  await delay(180);

  appraisalStore = appraisalStore.map((record) => (
    record.id === appraisalId
      ? {
          ...record,
          workflowStatus,
          history: [
            ...record.history,
            {
              id: generateId('apph'),
              label: `Workflow changed to ${workflowStatus}`,
              actor: 'HRD Approver',
              date: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        }
      : record
  ));

  return clone(appraisalStore.find((record) => record.id === appraisalId));
}

export async function saveEvaluationFeedback(payload) {
  await delay();

  const existing = evaluation360Store.find((record) => record.id === payload.id);
  if (!existing) {
    throw new Error('360 evaluation record tidak ditemukan.');
  }

  const newFeedback = {
    id: generateId('rev'),
    reviewerName: payload.anonymous ? 'Anonim' : payload.reviewerName,
    reviewerRole: payload.reviewerRole,
    anonymous: payload.anonymous,
    comment: payload.comment,
  };

  const competencyTotals = { ...existing.competencies };
  Object.entries(payload.competencies).forEach(([key, value]) => {
    competencyTotals[key] = Number(((competencyTotals[key] + Number(value)) / 2).toFixed(1));
  });

  evaluation360Store = evaluation360Store.map((record) => (
    record.id === payload.id
      ? {
          ...record,
          competencies: competencyTotals,
          reviewers: [newFeedback, ...record.reviewers],
          updatedAt: new Date().toISOString(),
        }
      : record
  ));

  return clone(evaluation360Store.find((record) => record.id === payload.id));
}

export async function updateCareerApproval(careerId, nextStatus) {
  await delay(180);

  careerPathStore = careerPathStore.map((record) => (
    record.id === careerId
      ? {
          ...record,
          hrdApproval: nextStatus,
          recommendationStatus: nextStatus === 'Approved' ? 'Recommended' : record.recommendationStatus,
        }
      : record
  ));

  return clone(careerPathStore.find((record) => record.id === careerId));
}