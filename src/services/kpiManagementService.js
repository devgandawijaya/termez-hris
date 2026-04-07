const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const generateId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const employeesSeed = [
  {
    id: 'emp-001',
    employeeId: 'EMP1001',
    fullName: 'Ahmad Pratama',
    department: 'Technology',
    position: 'Senior Software Engineer',
    managerName: 'Siti Nurhaliza',
    role: 'employee',
  },
  {
    id: 'emp-002',
    employeeId: 'EMP1002',
    fullName: 'Bella Sari',
    department: 'Technology',
    position: 'Product Manager',
    managerName: 'Siti Nurhaliza',
    role: 'manager',
  },
  {
    id: 'emp-003',
    employeeId: 'EMP1003',
    fullName: 'Citra Lestari',
    department: 'Human Resources',
    position: 'HR Business Partner',
    managerName: 'Rudi Hartono',
    role: 'employee',
  },
  {
    id: 'emp-004',
    employeeId: 'EMP1004',
    fullName: 'Dewi Anggraini',
    department: 'Finance',
    position: 'Finance Controller',
    managerName: 'Rudi Hartono',
    role: 'employee',
  },
  {
    id: 'emp-005',
    employeeId: 'EMP1005',
    fullName: 'Eko Wibowo',
    department: 'Sales',
    position: 'Sales Supervisor',
    managerName: 'Rudi Hartono',
    role: 'manager',
  },
  {
    id: 'emp-006',
    employeeId: 'EMP1006',
    fullName: 'Farah Nabila',
    department: 'Human Resources',
    position: 'People Operations Specialist',
    managerName: 'Rudi Hartono',
    role: 'employee',
  },
  {
    id: 'emp-007',
    employeeId: 'EMP1007',
    fullName: 'Gilang Ramadhan',
    department: 'Technology',
    position: 'QA Lead',
    managerName: 'Bella Sari',
    role: 'employee',
  },
  {
    id: 'emp-008',
    employeeId: 'EMP1008',
    fullName: 'Hana Puspita',
    department: 'Finance',
    position: 'Budget Analyst',
    managerName: 'Dewi Anggraini',
    role: 'employee',
  },
  {
    id: 'emp-009',
    employeeId: 'EMP1009',
    fullName: 'Intan Maharani',
    department: 'Sales',
    position: 'Account Executive',
    managerName: 'Eko Wibowo',
    role: 'employee',
  },
  {
    id: 'emp-010',
    employeeId: 'EMP1010',
    fullName: 'Joko Saputra',
    department: 'Human Resources',
    position: 'Learning Specialist',
    managerName: 'Citra Lestari',
    role: 'employee',
  },
];

let kpiMasterStore = [
  {
    id: 'kpi-001',
    name: 'Project Delivery SLA',
    description: 'Menjaga penyelesaian proyek sesuai SLA yang telah disepakati.',
    weight: 30,
    target: 100,
    unit: '%',
    type: 'Individual',
    status: 'Active',
    ownerDepartment: 'Technology',
    createdAt: '2026-01-05T09:00:00.000Z',
    updatedAt: '2026-03-05T10:15:00.000Z',
  },
  {
    id: 'kpi-002',
    name: 'Employee Retention Rate',
    description: 'Mengukur kemampuan tim HR menjaga retensi karyawan strategis.',
    weight: 25,
    target: 95,
    unit: '%',
    type: 'Team',
    status: 'Active',
    ownerDepartment: 'Human Resources',
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-02-11T13:00:00.000Z',
  },
  {
    id: 'kpi-003',
    name: 'Revenue Achievement',
    description: 'Capaian omzet dibanding target bulanan perusahaan.',
    weight: 20,
    target: 1200000000,
    unit: 'angka',
    type: 'Company',
    status: 'Active',
    ownerDepartment: 'Sales',
    createdAt: '2026-01-12T09:00:00.000Z',
    updatedAt: '2026-03-18T15:30:00.000Z',
  },
  {
    id: 'kpi-004',
    name: 'Budget Accuracy',
    description: 'Akurasi forecasting biaya terhadap realisasi.',
    weight: 15,
    target: 98,
    unit: '%',
    type: 'Individual',
    status: 'Inactive',
    ownerDepartment: 'Finance',
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-02-20T09:00:00.000Z',
  },
  {
    id: 'kpi-005',
    name: 'Recruitment SLA Fulfillment',
    description: 'Mengukur kecepatan pemenuhan posisi kritikal sesuai target SLA rekrutmen.',
    weight: 20,
    target: 30,
    unit: 'hari',
    type: 'Team',
    status: 'Active',
    ownerDepartment: 'Human Resources',
    createdAt: '2026-01-20T09:00:00.000Z',
    updatedAt: '2026-03-12T11:45:00.000Z',
  },
  {
    id: 'kpi-006',
    name: 'Customer Renewal Conversion',
    description: 'Persentase renewal customer utama yang berhasil diamankan oleh tim sales.',
    weight: 22,
    target: 90,
    unit: '%',
    type: 'Individual',
    status: 'Active',
    ownerDepartment: 'Sales',
    createdAt: '2026-01-24T09:00:00.000Z',
    updatedAt: '2026-03-25T09:30:00.000Z',
  },
  {
    id: 'kpi-007',
    name: 'Automation Test Coverage',
    description: 'Cakupan automated test untuk release prioritas tim engineering.',
    weight: 18,
    target: 85,
    unit: '%',
    type: 'Individual',
    status: 'Active',
    ownerDepartment: 'Technology',
    createdAt: '2026-02-02T08:00:00.000Z',
    updatedAt: '2026-03-29T14:00:00.000Z',
  },
];

let assignmentStore = [
  {
    id: 'assign-001',
    kpiId: 'kpi-001',
    employeeId: 'emp-001',
    department: 'Technology',
    periodType: 'Monthly',
    periodLabel: '2026-04',
    weight: 35,
    target: 100,
    actual: 88,
    unit: '%',
    approvalStatus: 'Pending',
    assignedBy: 'Admin System',
    updatedBy: 'Ahmad Pratama',
    notes: 'Sprint delivery April 2026.',
    assignedAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-04-05T15:00:00.000Z',
    submittedAt: '2026-04-05T15:00:00.000Z',
    reviewer: 'Bella Sari',
    reviewNotes: '',
    timeline: [
      { id: 't-001', label: 'Assigned', actor: 'Admin System', date: '2026-04-01T08:00:00.000Z' },
      { id: 't-002', label: 'Actual updated to 88', actor: 'Ahmad Pratama', date: '2026-04-05T14:30:00.000Z' },
      { id: 't-003', label: 'Submitted for approval', actor: 'Ahmad Pratama', date: '2026-04-05T15:00:00.000Z' },
    ],
  },
  {
    id: 'assign-002',
    kpiId: 'kpi-002',
    employeeId: 'emp-003',
    department: 'Human Resources',
    periodType: 'Quarterly',
    periodLabel: '2026-Q2',
    weight: 25,
    target: 95,
    actual: 93,
    unit: '%',
    approvalStatus: 'Approved',
    assignedBy: 'Admin System',
    updatedBy: 'Citra Lestari',
    notes: 'Retensi talent semester awal.',
    assignedAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-04-04T11:00:00.000Z',
    submittedAt: '2026-04-04T10:00:00.000Z',
    approvedAt: '2026-04-04T11:00:00.000Z',
    reviewer: 'Rudi Hartono',
    reviewNotes: 'Target realistis dan progress stabil.',
    timeline: [
      { id: 't-004', label: 'Assigned', actor: 'Admin System', date: '2026-04-01T08:00:00.000Z' },
      { id: 't-005', label: 'Submitted for approval', actor: 'Citra Lestari', date: '2026-04-04T10:00:00.000Z' },
      { id: 't-006', label: 'Approved', actor: 'Rudi Hartono', date: '2026-04-04T11:00:00.000Z' },
    ],
  },
  {
    id: 'assign-003',
    kpiId: 'kpi-003',
    employeeId: 'emp-005',
    department: 'Sales',
    periodType: 'Monthly',
    periodLabel: '2026-04',
    weight: 20,
    target: 1200000000,
    actual: 1320000000,
    unit: 'angka',
    approvalStatus: 'Approved',
    assignedBy: 'Admin System',
    updatedBy: 'Eko Wibowo',
    notes: 'Revenue April 2026.',
    assignedAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-04-03T12:00:00.000Z',
    submittedAt: '2026-04-03T10:00:00.000Z',
    approvedAt: '2026-04-03T12:00:00.000Z',
    reviewer: 'Rudi Hartono',
    reviewNotes: 'Achievement di atas target.',
    timeline: [
      { id: 't-007', label: 'Assigned', actor: 'Admin System', date: '2026-04-01T08:00:00.000Z' },
      { id: 't-008', label: 'Approved', actor: 'Rudi Hartono', date: '2026-04-03T12:00:00.000Z' },
    ],
  },
  {
    id: 'assign-004',
    kpiId: 'kpi-004',
    employeeId: 'emp-004',
    department: 'Finance',
    periodType: 'Yearly',
    periodLabel: '2026',
    weight: 20,
    target: 98,
    actual: 64,
    unit: '%',
    approvalStatus: 'Rejected',
    assignedBy: 'Admin System',
    updatedBy: 'Dewi Anggraini',
    notes: 'Forecast akurasi biaya tahunan.',
    assignedAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-04-02T09:45:00.000Z',
    submittedAt: '2026-04-02T09:00:00.000Z',
    reviewer: 'Rudi Hartono',
    reviewNotes: 'Mohon revisi asumsi budgeting Q2.',
    timeline: [
      { id: 't-009', label: 'Assigned', actor: 'Admin System', date: '2026-02-01T08:00:00.000Z' },
      { id: 't-010', label: 'Rejected / Revision requested', actor: 'Rudi Hartono', date: '2026-04-02T09:45:00.000Z' },
    ],
  },
  {
    id: 'assign-005',
    kpiId: 'kpi-001',
    employeeId: 'emp-002',
    department: 'Technology',
    periodType: 'Quarterly',
    periodLabel: '2026-Q2',
    weight: 25,
    target: 100,
    actual: 76,
    unit: '%',
    approvalStatus: 'Draft',
    assignedBy: 'Admin System',
    updatedBy: 'Bella Sari',
    notes: 'Cross-team coordination KPI.',
    assignedAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-04-06T08:30:00.000Z',
    reviewer: 'Siti Nurhaliza',
    reviewNotes: '',
    timeline: [
      { id: 't-011', label: 'Assigned', actor: 'Admin System', date: '2026-04-01T08:00:00.000Z' },
      { id: 't-012', label: 'Actual updated to 76', actor: 'Bella Sari', date: '2026-04-06T08:30:00.000Z' },
    ],
  },
  {
    id: 'assign-006',
    kpiId: 'kpi-002',
    employeeId: 'emp-006',
    department: 'Human Resources',
    periodType: 'Monthly',
    periodLabel: '2026-04',
    weight: 20,
    target: 95,
    actual: 95,
    unit: '%',
    approvalStatus: 'Pending',
    assignedBy: 'Admin System',
    updatedBy: 'Farah Nabila',
    notes: 'Retention initiatives April.',
    assignedAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-04-06T16:00:00.000Z',
    submittedAt: '2026-04-06T16:00:00.000Z',
    reviewer: 'Rudi Hartono',
    reviewNotes: '',
    timeline: [
      { id: 't-013', label: 'Assigned', actor: 'Admin System', date: '2026-04-01T08:00:00.000Z' },
      { id: 't-014', label: 'Submitted for approval', actor: 'Farah Nabila', date: '2026-04-06T16:00:00.000Z' },
    ],
  },
  {
    id: 'assign-007',
    kpiId: 'kpi-007',
    employeeId: 'emp-007',
    department: 'Technology',
    periodType: 'Monthly',
    periodLabel: '2026-03',
    weight: 18,
    target: 85,
    actual: 82,
    unit: '%',
    approvalStatus: 'Approved',
    assignedBy: 'Admin System',
    updatedBy: 'Gilang Ramadhan',
    notes: 'Coverage regression suite sprint akhir Maret.',
    assignedAt: '2026-03-01T08:00:00.000Z',
    updatedAt: '2026-03-29T18:00:00.000Z',
    submittedAt: '2026-03-29T16:00:00.000Z',
    approvedAt: '2026-03-29T18:00:00.000Z',
    reviewer: 'Bella Sari',
    reviewNotes: 'Capaian baik, lanjutkan automation untuk smoke suite.',
    timeline: [
      { id: 't-015', label: 'Assigned', actor: 'Admin System', date: '2026-03-01T08:00:00.000Z' },
      { id: 't-016', label: 'Actual updated to 82', actor: 'Gilang Ramadhan', date: '2026-03-29T15:30:00.000Z' },
      { id: 't-017', label: 'Approved', actor: 'Bella Sari', date: '2026-03-29T18:00:00.000Z' },
    ],
  },
  {
    id: 'assign-008',
    kpiId: 'kpi-004',
    employeeId: 'emp-008',
    department: 'Finance',
    periodType: 'Quarterly',
    periodLabel: '2026-Q1',
    weight: 15,
    target: 98,
    actual: 91,
    unit: '%',
    approvalStatus: 'Approved',
    assignedBy: 'Admin System',
    updatedBy: 'Hana Puspita',
    notes: 'Review variance budget operasional kuartal 1.',
    assignedAt: '2026-01-05T08:00:00.000Z',
    updatedAt: '2026-03-31T10:30:00.000Z',
    submittedAt: '2026-03-31T09:00:00.000Z',
    approvedAt: '2026-03-31T10:30:00.000Z',
    reviewer: 'Dewi Anggraini',
    reviewNotes: 'Perlu improvement di variance analysis, tapi outcome masih acceptable.',
    timeline: [
      { id: 't-018', label: 'Assigned', actor: 'Admin System', date: '2026-01-05T08:00:00.000Z' },
      { id: 't-019', label: 'Submitted for approval', actor: 'Hana Puspita', date: '2026-03-31T09:00:00.000Z' },
      { id: 't-020', label: 'Approved', actor: 'Dewi Anggraini', date: '2026-03-31T10:30:00.000Z' },
    ],
  },
  {
    id: 'assign-009',
    kpiId: 'kpi-006',
    employeeId: 'emp-009',
    department: 'Sales',
    periodType: 'Monthly',
    periodLabel: '2026-04',
    weight: 22,
    target: 90,
    actual: 71,
    unit: '%',
    approvalStatus: 'Pending',
    assignedBy: 'Admin System',
    updatedBy: 'Intan Maharani',
    notes: 'Masih ada dua account yang belum renew di minggu kedua.',
    assignedAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-04-07T10:20:00.000Z',
    submittedAt: '2026-04-07T10:20:00.000Z',
    reviewer: 'Eko Wibowo',
    reviewNotes: '',
    timeline: [
      { id: 't-021', label: 'Assigned', actor: 'Admin System', date: '2026-04-01T08:00:00.000Z' },
      { id: 't-022', label: 'Actual updated to 71', actor: 'Intan Maharani', date: '2026-04-07T10:10:00.000Z' },
      { id: 't-023', label: 'Submitted for approval', actor: 'Intan Maharani', date: '2026-04-07T10:20:00.000Z' },
    ],
  },
  {
    id: 'assign-010',
    kpiId: 'kpi-005',
    employeeId: 'emp-010',
    department: 'Human Resources',
    periodType: 'Yearly',
    periodLabel: '2026',
    weight: 20,
    target: 30,
    actual: 24,
    unit: 'hari',
    approvalStatus: 'Draft',
    assignedBy: 'Admin System',
    updatedBy: 'Joko Saputra',
    notes: 'Rata-rata time to fill posisi learning dan sales support.',
    assignedAt: '2026-01-03T08:00:00.000Z',
    updatedAt: '2026-04-06T14:00:00.000Z',
    reviewer: 'Citra Lestari',
    reviewNotes: '',
    timeline: [
      { id: 't-024', label: 'Assigned', actor: 'Admin System', date: '2026-01-03T08:00:00.000Z' },
      { id: 't-025', label: 'Actual updated to 24', actor: 'Joko Saputra', date: '2026-04-06T14:00:00.000Z' },
    ],
  },
  {
    id: 'assign-011',
    kpiId: 'kpi-003',
    employeeId: 'emp-009',
    department: 'Sales',
    periodType: 'Quarterly',
    periodLabel: '2026-Q2',
    weight: 18,
    target: 1000000000,
    actual: 940000000,
    unit: 'angka',
    approvalStatus: 'Rejected',
    assignedBy: 'Admin System',
    updatedBy: 'Intan Maharani',
    notes: 'Pipeline besar mundur ke akhir kuartal.',
    assignedAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-04-07T11:00:00.000Z',
    submittedAt: '2026-04-07T09:00:00.000Z',
    reviewer: 'Eko Wibowo',
    reviewNotes: 'Tambahkan action plan untuk closing pipeline utama.',
    timeline: [
      { id: 't-026', label: 'Assigned', actor: 'Admin System', date: '2026-04-01T08:00:00.000Z' },
      { id: 't-027', label: 'Submitted for approval', actor: 'Intan Maharani', date: '2026-04-07T09:00:00.000Z' },
      { id: 't-028', label: 'Rejected / Revision requested', actor: 'Eko Wibowo', date: '2026-04-07T11:00:00.000Z' },
    ],
  },
  {
    id: 'assign-012',
    kpiId: 'kpi-001',
    employeeId: 'emp-001',
    department: 'Technology',
    periodType: 'Quarterly',
    periodLabel: '2026-Q1',
    weight: 28,
    target: 100,
    actual: 104,
    unit: '%',
    approvalStatus: 'Approved',
    assignedBy: 'Admin System',
    updatedBy: 'Ahmad Pratama',
    notes: 'Delivery kuartal 1 melampaui SLA baseline.',
    assignedAt: '2026-01-02T08:00:00.000Z',
    updatedAt: '2026-03-30T17:00:00.000Z',
    submittedAt: '2026-03-30T16:00:00.000Z',
    approvedAt: '2026-03-30T17:00:00.000Z',
    reviewer: 'Bella Sari',
    reviewNotes: 'Excellent delivery consistency.',
    timeline: [
      { id: 't-029', label: 'Assigned', actor: 'Admin System', date: '2026-01-02T08:00:00.000Z' },
      { id: 't-030', label: 'Actual updated to 104', actor: 'Ahmad Pratama', date: '2026-03-30T15:45:00.000Z' },
      { id: 't-031', label: 'Approved', actor: 'Bella Sari', date: '2026-03-30T17:00:00.000Z' },
    ],
  },
];

let activityLogStore = [
  {
    id: 'log-001',
    actor: 'Admin System',
    action: 'Created KPI master Project Delivery SLA',
    timestamp: '2026-03-05T10:15:00.000Z',
    module: 'Master Data',
  },
  {
    id: 'log-002',
    actor: 'Ahmad Pratama',
    action: 'Submitted KPI Project Delivery SLA for approval',
    timestamp: '2026-04-05T15:00:00.000Z',
    module: 'Approval Workflow',
  },
  {
    id: 'log-003',
    actor: 'Rudi Hartono',
    action: 'Rejected KPI Budget Accuracy with revision note',
    timestamp: '2026-04-02T09:45:00.000Z',
    module: 'Approval Workflow',
  },
  {
    id: 'log-004',
    actor: 'Bella Sari',
    action: 'Approved KPI Automation Test Coverage for Gilang Ramadhan',
    timestamp: '2026-03-29T18:00:00.000Z',
    module: 'Approval Workflow',
  },
  {
    id: 'log-005',
    actor: 'Admin System',
    action: 'Created KPI master Customer Renewal Conversion',
    timestamp: '2026-03-25T09:30:00.000Z',
    module: 'Master Data',
  },
  {
    id: 'log-006',
    actor: 'Intan Maharani',
    action: 'Submitted KPI Customer Renewal Conversion for manager review',
    timestamp: '2026-04-07T10:20:00.000Z',
    module: 'Monitoring',
  },
];

function logActivity(actor, action, module) {
  activityLogStore.unshift({
    id: generateId('log'),
    actor,
    action,
    module,
    timestamp: new Date().toISOString(),
  });
}

function normalizeProgress(actual, target) {
  if (!target) {
    return 0;
  }

  return Number(((actual / target) * 100).toFixed(2));
}

function getTrackingStatus(progress) {
  if (progress >= 100) {
    return 'Achieved';
  }

  if (progress >= 75) {
    return 'On Track';
  }

  return 'Behind';
}

function getRawScore(actual, target, weight) {
  if (!target) {
    return 0;
  }

  return Number((((actual / target) * weight)).toFixed(2));
}

function normalizeScore(score) {
  return Number(Math.max(0, Math.min(100, score)).toFixed(2));
}

async function getEmployeeDirectory() {
  await delay(80);
  // Keep KPI demo data deterministic so assignment, filters, scoring, and role simulation stay aligned.
  return employeesSeed;
}

function buildEnrichedAssignments(assignments, employees) {
  return assignments.map((assignment) => {
    const master = kpiMasterStore.find((item) => item.id === assignment.kpiId);
    const employee = employees.find((item) => item.id === assignment.employeeId) || employeesSeed.find((item) => item.id === assignment.employeeId);
    const progress = normalizeProgress(assignment.actual, assignment.target);
    const rawScore = getRawScore(assignment.actual, assignment.target, assignment.weight);

    return {
      ...assignment,
      kpiName: master?.name || 'Unknown KPI',
      kpiDescription: master?.description || '',
      kpiType: master?.type || 'Individual',
      kpiStatus: master?.status || 'Inactive',
      ownerDepartment: master?.ownerDepartment || assignment.department,
      employeeName: employee?.fullName || 'Unknown Employee',
      employeeCode: employee?.employeeId || '-',
      position: employee?.position || '-',
      managerName: employee?.managerName || '-',
      progress,
      progressDisplay: Math.min(progress, 100),
      trackingStatus: getTrackingStatus(progress),
      score: normalizeScore(rawScore),
      rawScore,
    };
  });
}

function filterAssignments(assignments, filters) {
  return assignments.filter((assignment) => {
    if (filters.periodType && assignment.periodType !== filters.periodType) {
      return false;
    }

    if (filters.department && assignment.department !== filters.department) {
      return false;
    }

    if (filters.employeeId && assignment.employeeId !== filters.employeeId) {
      return false;
    }

    return true;
  });
}

function buildSummary(assignments) {
  return {
    total: assignments.length,
    active: assignments.filter((item) => item.kpiStatus === 'Active').length,
    completed: assignments.filter((item) => item.progress >= 100).length,
    pendingApprovals: assignments.filter((item) => item.approvalStatus === 'Pending').length,
    averageProgress: assignments.length
      ? Number((assignments.reduce((total, item) => total + item.progress, 0) / assignments.length).toFixed(2))
      : 0,
  };
}

function buildPerformanceByEmployee(assignments) {
  const grouped = assignments.reduce((accumulator, item) => {
    if (!accumulator[item.employeeId]) {
      accumulator[item.employeeId] = {
        employeeId: item.employeeId,
        employeeName: item.employeeName,
        department: item.department,
        progressTotal: 0,
        scoreTotal: 0,
        total: 0,
      };
    }

    accumulator[item.employeeId].progressTotal += item.progress;
    accumulator[item.employeeId].scoreTotal += item.score;
    accumulator[item.employeeId].total += 1;
    return accumulator;
  }, {});

  return Object.values(grouped).map((item) => ({
    name: item.employeeName,
    department: item.department,
    progress: Number((item.progressTotal / item.total).toFixed(2)),
    finalScore: normalizeScore(item.scoreTotal),
    totalKpi: item.total,
  }));
}

function buildPerformanceByDepartment(assignments) {
  const grouped = assignments.reduce((accumulator, item) => {
    if (!accumulator[item.department]) {
      accumulator[item.department] = {
        department: item.department,
        progressTotal: 0,
        scoreTotal: 0,
        total: 0,
      };
    }

    accumulator[item.department].progressTotal += item.progress;
    accumulator[item.department].scoreTotal += item.score;
    accumulator[item.department].total += 1;
    return accumulator;
  }, {});

  return Object.values(grouped).map((item) => ({
    department: item.department,
    progress: Number((item.progressTotal / item.total).toFixed(2)),
    finalScore: normalizeScore(item.scoreTotal),
    totalKpi: item.total,
  }));
}

function buildFinalScores(assignments) {
  return buildPerformanceByEmployee(assignments)
    .sort((left, right) => right.finalScore - left.finalScore)
    .map((item, index) => ({
      rank: index + 1,
      ...item,
    }));
}

function buildTimeline(assignments) {
  return assignments
    .flatMap((assignment) =>
      assignment.timeline.map((event) => ({
        ...event,
        assignmentId: assignment.id,
        kpiName: assignment.kpiName,
        employeeName: assignment.employeeName,
      })),
    )
    .sort((left, right) => new Date(right.date) - new Date(left.date));
}

function buildFilterOptions(employees) {
  return {
    periodTypes: ['Monthly', 'Quarterly', 'Yearly'],
    departments: [...new Set(employees.map((employee) => employee.department))].sort(),
    employees: employees
      .map((employee) => ({
        id: employee.id,
        name: employee.fullName,
        department: employee.department,
      }))
      .sort((left, right) => left.name.localeCompare(right.name)),
  };
}

function buildMasterRecords(assignments) {
  return kpiMasterStore.map((record) => ({
    ...record,
    assignmentCount: assignments.filter((assignment) => assignment.kpiId === record.id).length,
  }));
}

function buildApprovalQueue(assignments) {
  return assignments
    .filter((item) => ['Pending', 'Rejected', 'Approved'].includes(item.approvalStatus))
    .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
}

function buildReportRows(assignments) {
  return assignments.map((item) => ({
    period: item.periodLabel,
    employee: item.employeeName,
    department: item.department,
    kpi: item.kpiName,
    target: item.target,
    actual: item.actual,
    progress: item.progress,
    score: item.score,
    approvalStatus: item.approvalStatus,
    trackingStatus: item.trackingStatus,
  }));
}

function buildRoleSummary(assignments) {
  return {
    admin: 'Full access to master data, assignment, monitoring, approval, and report export.',
    user: `Can monitor assigned KPI, update realization, submit progress, and follow approval status for ${assignments.length} assignment(s).`,
  };
}

async function getKpiManagementSnapshot(filters = {}) {
  await delay();
  const employees = await getEmployeeDirectory();
  // Enrich assignment records once so every UI section can consume the same shape.
  const enrichedAssignments = buildEnrichedAssignments(assignmentStore, employees);
  const filteredAssignments = filterAssignments(enrichedAssignments, filters);

  return {
    employees,
    masterRecords: buildMasterRecords(enrichedAssignments),
    assignments: filteredAssignments,
    summary: buildSummary(filteredAssignments),
    performanceByEmployee: buildPerformanceByEmployee(filteredAssignments),
    performanceByDepartment: buildPerformanceByDepartment(filteredAssignments),
    finalScores: buildFinalScores(filteredAssignments),
    approvalQueue: buildApprovalQueue(filteredAssignments),
    timeline: buildTimeline(filteredAssignments),
    activityLog: activityLogStore.slice().sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp)),
    filterOptions: buildFilterOptions(employees),
    reportRows: buildReportRows(filteredAssignments),
    roleSummary: buildRoleSummary(filteredAssignments),
  };
}

async function createKpiMaster(payload, actor) {
  await delay();
  const now = new Date().toISOString();
  const record = {
    id: generateId('kpi'),
    ...payload,
    createdAt: now,
    updatedAt: now,
  };

  kpiMasterStore = [record, ...kpiMasterStore];
  logActivity(actor, `Created KPI master ${payload.name}`, 'Master Data');
  return record;
}

async function updateKpiMaster(id, payload, actor) {
  await delay();
  kpiMasterStore = kpiMasterStore.map((record) =>
    record.id === id
      ? {
          ...record,
          ...payload,
          updatedAt: new Date().toISOString(),
        }
      : record,
  );

  logActivity(actor, `Updated KPI master ${payload.name}`, 'Master Data');
}

async function deleteKpiMaster(id, actor) {
  await delay();
  const record = kpiMasterStore.find((item) => item.id === id);
  kpiMasterStore = kpiMasterStore.filter((item) => item.id !== id);
  assignmentStore = assignmentStore.filter((item) => item.kpiId !== id);
  logActivity(actor, `Deleted KPI master ${record?.name || id}`, 'Master Data');
}

function createAssignmentRecord(basePayload, employee, actor) {
  const now = new Date().toISOString();
  return {
    id: generateId('assign'),
    kpiId: basePayload.kpiId,
    employeeId: employee.id,
    department: employee.department,
    periodType: basePayload.periodType,
    periodLabel: basePayload.periodLabel,
    weight: Number(basePayload.weight),
    target: Number(basePayload.target),
    actual: Number(basePayload.actual || 0),
    unit: basePayload.unit,
    approvalStatus: 'Draft',
    assignedBy: actor,
    updatedBy: actor,
    notes: basePayload.notes || '',
    assignedAt: now,
    updatedAt: now,
    reviewer: basePayload.reviewer,
    reviewNotes: '',
    timeline: [
      {
        id: generateId('timeline'),
        label: 'Assigned',
        actor,
        date: now,
      },
    ],
  };
}

async function assignKpi(payload, actor) {
  await delay();
  const employees = await getEmployeeDirectory();
  let targets = [];

  if (payload.assignmentMode === 'department') {
    // Department mode fans out one payload into employee-level assignments for easier tracking.
    targets = employees.filter((employee) => employee.department === payload.department);
  } else {
    targets = employees.filter((employee) => payload.employeeIds.includes(employee.id));
  }

  const newAssignments = targets.map((employee) => createAssignmentRecord(payload, employee, actor));
  assignmentStore = [...newAssignments, ...assignmentStore];

  logActivity(actor, `Assigned KPI to ${newAssignments.length} assignee(s) for ${payload.periodLabel}`, 'Assignment');
  return newAssignments;
}

async function updateAssignmentProgress(id, payload, actor) {
  await delay();
  assignmentStore = assignmentStore.map((assignment) => {
    if (assignment.id !== id) {
      return assignment;
    }

    const now = new Date().toISOString();
    return {
      ...assignment,
      actual: Number(payload.actual),
      notes: payload.notes,
      updatedBy: actor,
      updatedAt: now,
      timeline: [
        {
          id: generateId('timeline'),
          label: `Actual updated to ${payload.actual}`,
          actor,
          date: now,
        },
        ...assignment.timeline,
      ],
    };
  });

  logActivity(actor, `Updated KPI realization for assignment ${id}`, 'Monitoring');
}

async function submitAssignment(id, actor) {
  await delay();
  assignmentStore = assignmentStore.map((assignment) => {
    if (assignment.id !== id) {
      return assignment;
    }

    const now = new Date().toISOString();
    return {
      ...assignment,
      approvalStatus: 'Pending',
      submittedAt: now,
      updatedBy: actor,
      updatedAt: now,
      timeline: [
        {
          id: generateId('timeline'),
          label: 'Submitted for approval',
          actor,
          date: now,
        },
        ...assignment.timeline,
      ],
    };
  });

  logActivity(actor, `Submitted KPI assignment ${id} for approval`, 'Approval Workflow');
}

async function reviewAssignment(id, action, notes, actor) {
  await delay();
  assignmentStore = assignmentStore.map((assignment) => {
    if (assignment.id !== id) {
      return assignment;
    }

    const now = new Date().toISOString();
    const nextStatus = action === 'approve' ? 'Approved' : 'Rejected';
    const nextLabel = action === 'approve' ? 'Approved' : 'Rejected / Revision requested';

    return {
      ...assignment,
      approvalStatus: nextStatus,
      reviewNotes: notes,
      reviewer: actor,
      approvedAt: action === 'approve' ? now : assignment.approvedAt,
      updatedAt: now,
      updatedBy: actor,
      timeline: [
        {
          id: generateId('timeline'),
          label: nextLabel,
          actor,
          date: now,
        },
        ...assignment.timeline,
      ],
    };
  });

  logActivity(actor, `${action === 'approve' ? 'Approved' : 'Requested revision for'} KPI assignment ${id}`, 'Approval Workflow');
}

export {
  getKpiManagementSnapshot,
  createKpiMaster,
  updateKpiMaster,
  deleteKpiMaster,
  assignKpi,
  updateAssignmentProgress,
  submitAssignment,
  reviewAssignment,
  normalizeProgress,
  normalizeScore,
  getRawScore,
};
