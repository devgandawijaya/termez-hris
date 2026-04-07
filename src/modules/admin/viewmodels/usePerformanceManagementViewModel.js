import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  deleteOkr,
  getPerformanceManagementSnapshot,
  saveAppraisal,
  saveEvaluationFeedback,
  saveOkr,
  updateAppraisalWorkflow,
  updateCareerApproval,
} from '../../../services/performanceManagementService';

const initialFilters = {
  search: '',
  department: '',
  employeeId: '',
  quarter: '',
  cycle: '',
};

const initialOkrForm = {
  id: '',
  objective: '',
  department: '',
  employeeId: '',
  quarter: '2026-Q2',
  status: 'Not Started',
  priority: 'Medium',
  dueDate: '2026-06-30',
  description: '',
  keyResults: [
    { id: '', title: '', progress: 0, targetLabel: '', actualLabel: '', status: 'Not Started' },
    { id: '', title: '', progress: 0, targetLabel: '', actualLabel: '', status: 'Not Started' },
  ],
};

const initialAppraisalForm = {
  id: '',
  employeeId: '',
  cycle: 'Mid Year 2026',
  reviewerName: 'HRD Panel',
  scores: {
    kpi: 80,
    attitude: 80,
    discipline: 80,
  },
  recommendation: '',
};

const initialEvaluationForm = {
  id: '',
  reviewerName: '',
  reviewerRole: 'Rekan kerja',
  anonymous: true,
  comment: '',
  competencies: {
    Communication: 4,
    Teamwork: 4,
    Leadership: 4,
    Ownership: 4,
    ProblemSolving: 4,
  },
};

function parseSessionUser() {
  try {
    const raw = sessionStorage.getItem('user');
    if (!raw) {
      return { displayName: 'HRD Team', role: 'hrd', employeeId: 'emp-pm-001' };
    }

    const user = JSON.parse(raw);
    const roleRaw = String(user.role || user.user_role || user.employee?.role || '').toLowerCase();
    const mappedRole = ['admin', 'manager', 'hrd', 'hr'].includes(roleRaw) ? 'hrd' : 'employee';
    return {
      displayName: user.employee?.full_name || user.username || 'HRD Team',
      role: mappedRole,
      employeeId: user.employee?.id || user.employee_id || 'emp-pm-001',
    };
  } catch {
    return { displayName: 'HRD Team', role: 'hrd', employeeId: 'emp-pm-001' };
  }
}

function includesKeyword(values, keyword) {
  if (!keyword) {
    return true;
  }

  const search = keyword.toLowerCase();
  return values.some((value) => String(value || '').toLowerCase().includes(search));
}

function buildRatingFromScores(scores) {
  return {
    kpi: Number((scores.kpi / 20).toFixed(1)),
    attitude: Number((scores.attitude / 20).toFixed(1)),
    discipline: Number((scores.discipline / 20).toFixed(1)),
  };
}

function buildDepartmentPerformance(records) {
  const grouped = records.reduce((map, record) => {
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

function buildDistribution(records) {
  const gradeMap = { A: 0, B: 0, C: 0 };
  records.forEach((record) => {
    gradeMap[record.grade] += 1;
  });
  return Object.entries(gradeMap).map(([grade, total]) => ({ grade, total }));
}

function buildLeaderboard(records) {
  return [...records]
    .sort((left, right) => right.finalScore - left.finalScore)
    .map((record) => ({
      employeeName: record.employeeName,
      department: record.department,
      finalScore: record.finalScore,
      grade: record.grade,
    }));
}

function buildAlerts(records) {
  return records
    .filter((record) => record.finalScore < 80)
    .map((record) => ({
      id: `alert-${record.id}`,
      employeeName: record.employeeName,
      department: record.department,
      issue: 'Performance below healthy benchmark',
      action: 'Trigger coaching plan and follow-up review.',
    }));
}

function buildTrend(records) {
  const baseMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const average = records.length ? records.reduce((sum, record) => sum + record.finalScore, 0) / records.length : 0;

  return baseMonths.map((month, index) => ({
    month,
    score: Number((average - 3 + (index * 1.4)).toFixed(1)),
    target: 85,
  }));
}

function validateOkrForm(form) {
  const errors = {};

  if (!form.objective.trim()) {
    errors.objective = 'Objective wajib diisi.';
  }
  if (!form.department) {
    errors.department = 'Pilih departemen.';
  }
  if (!form.employeeId) {
    errors.employeeId = 'Pilih owner objective.';
  }
  if (!form.quarter) {
    errors.quarter = 'Quarter wajib diisi.';
  }
  if (form.keyResults.some((item) => !item.title.trim())) {
    errors.keyResults = 'Semua key result wajib memiliki judul.';
  }

  return errors;
}

function validateAppraisalForm(form) {
  const errors = {};
  if (!form.employeeId) {
    errors.employeeId = 'Pilih karyawan.';
  }
  if (!form.cycle) {
    errors.cycle = 'Pilih cycle appraisal.';
  }
  if (!form.reviewerName.trim()) {
    errors.reviewerName = 'Nama reviewer wajib diisi.';
  }
  return errors;
}

function validateEvaluationForm(form) {
  const errors = {};
  if (!form.id) {
    errors.id = 'Pilih employee yang akan direview.';
  }
  if (!form.anonymous && !form.reviewerName.trim()) {
    errors.reviewerName = 'Nama reviewer wajib diisi jika tidak anonim.';
  }
  if (!form.comment.trim()) {
    errors.comment = 'Feedback wajib diisi.';
  }
  return errors;
}

export default function usePerformanceManagementViewModel() {
  const sessionUser = useMemo(() => parseSessionUser(), []);
  const [demoRole, setDemoRole] = useState(sessionUser.role);
  const [demoEmployeeId, setDemoEmployeeId] = useState('emp-pm-001');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [snapshot, setSnapshot] = useState({
    employees: [],
    okrs: [],
    appraisals: [],
    evaluations: [],
    careerPaths: [],
    analytics: {
      summaryCards: [],
      departmentPerformance: [],
      trend: [],
      distribution: [],
      leaderboard: [],
      alerts: [],
    },
    filterOptions: {
      departments: [],
      employees: [],
      quarters: [],
      cycles: [],
    },
  });

  const [okrModalOpen, setOkrModalOpen] = useState(false);
  const [okrDetail, setOkrDetail] = useState(null);
  const [okrForm, setOkrForm] = useState(initialOkrForm);

  const [appraisalModalOpen, setAppraisalModalOpen] = useState(false);
  const [appraisalForm, setAppraisalForm] = useState(initialAppraisalForm);

  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [evaluationForm, setEvaluationForm] = useState(initialEvaluationForm);

  const [formErrors, setFormErrors] = useState({});

  const capabilities = useMemo(() => ({
    canManageOkr: demoRole === 'hrd',
    canManageAppraisal: demoRole === 'hrd',
    canApproveCareer: demoRole === 'hrd',
    canSubmit360: true,
  }), [demoRole]);

  const loadSnapshot = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const nextSnapshot = await getPerformanceManagementSnapshot();
      setSnapshot(nextSnapshot);
      if (!demoEmployeeId && nextSnapshot.employees[0]) {
        setDemoEmployeeId(nextSnapshot.employees[0].id);
      }
    } catch (loadError) {
      setError(loadError.message || 'Gagal memuat Performance Management.');
    } finally {
      setLoading(false);
    }
  }, [demoEmployeeId]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timer = window.setTimeout(() => setFeedback(''), 2800);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const currentEmployee = useMemo(() => (
    snapshot.employees.find((employee) => employee.id === demoEmployeeId) || snapshot.employees[0] || null
  ), [demoEmployeeId, snapshot.employees]);

  const baseScopedFilter = useCallback((record, additionalValues = []) => {
    const matchesRole = demoRole === 'hrd' || record.employeeId === currentEmployee?.id;
    const matchesDepartment = !filters.department || record.department === filters.department;
    const matchesEmployee = !filters.employeeId || record.employeeId === filters.employeeId;
    const matchesKeyword = includesKeyword(additionalValues, filters.search);
    return matchesRole && matchesDepartment && matchesEmployee && matchesKeyword;
  }, [currentEmployee?.id, demoRole, filters.department, filters.employeeId, filters.search]);

  const visibleOkrs = useMemo(() => snapshot.okrs.filter((record) => {
    const matchesQuarter = !filters.quarter || record.quarter === filters.quarter;
    return matchesQuarter && baseScopedFilter(record, [record.objective, record.ownerName, record.description, record.status]);
  }), [baseScopedFilter, filters.quarter, snapshot.okrs]);

  const visibleAppraisals = useMemo(() => snapshot.appraisals.filter((record) => {
    const matchesCycle = !filters.cycle || record.cycle === filters.cycle;
    return matchesCycle && baseScopedFilter(record, [record.employeeName, record.reviewerName, record.workflowStatus, record.recommendation]);
  }), [baseScopedFilter, filters.cycle, snapshot.appraisals]);

  const visibleEvaluations = useMemo(() => snapshot.evaluations.filter((record) => {
    const matchesCycle = !filters.cycle || record.cycle === filters.cycle;
    return matchesCycle && baseScopedFilter(record, [record.employeeName, record.department, record.reviewers.map((item) => item.comment).join(' ')]);
  }), [baseScopedFilter, filters.cycle, snapshot.evaluations]);

  const visibleCareerPaths = useMemo(() => snapshot.careerPaths.filter((record) => (
    baseScopedFilter(record, [record.employeeName, record.currentStage, record.targetStage, record.eligibility, record.nextAction])
  )), [baseScopedFilter, snapshot.careerPaths]);

  const derivedSummary = useMemo(() => {
    const okrAverage = visibleOkrs.length
      ? Number((visibleOkrs.reduce((sum, item) => sum + item.progress, 0) / visibleOkrs.length).toFixed(1))
      : 0;
    const appraisalAverage = visibleAppraisals.length
      ? Number((visibleAppraisals.reduce((sum, item) => sum + item.finalScore, 0) / visibleAppraisals.length).toFixed(1))
      : 0;
    const evaluationAverage = visibleEvaluations.length
      ? Number((visibleEvaluations.reduce((sum, item) => sum + Object.values(item.competencies).reduce((inner, value) => inner + value, 0) / Object.keys(item.competencies).length, 0) / visibleEvaluations.length).toFixed(1))
      : 0;
    const readyPromotion = visibleCareerPaths.filter((item) => item.eligibility === 'Eligible').length;

    return {
      okrAverage,
      appraisalAverage,
      evaluationAverage,
      readyPromotion,
    };
  }, [visibleAppraisals, visibleCareerPaths, visibleEvaluations, visibleOkrs]);

  const analyticsView = useMemo(() => {
    const scopedDepartmentPerformance = buildDepartmentPerformance(visibleAppraisals);
    const scopedLeaderboard = buildLeaderboard(visibleAppraisals);
    const scopedAlerts = buildAlerts(visibleAppraisals);
    const scopedDistribution = buildDistribution(visibleAppraisals);
    const scopedTrend = buildTrend(visibleAppraisals);
    const salesAverage = scopedDepartmentPerformance.find((item) => item.department === 'Sales')?.averageScore || 0;

    if (demoRole === 'hrd') {
      return {
        ...snapshot.analytics,
        summaryCards: [
          { id: 'summary-001', label: 'Sales Dept Avg', value: `${Math.round(salesAverage)}%`, tone: 'sky' },
          { id: 'summary-002', label: 'Top Performer', value: scopedLeaderboard[0]?.employeeName || '-', tone: 'emerald' },
          { id: 'summary-003', label: 'Pending Reviews', value: String(visibleAppraisals.filter((item) => item.workflowStatus !== 'Approved').length), tone: 'amber' },
          { id: 'summary-004', label: 'Promotion Ready', value: String(visibleCareerPaths.filter((item) => item.eligibility === 'Eligible').length), tone: 'violet' },
        ],
        departmentPerformance: scopedDepartmentPerformance,
        trend: scopedTrend,
        distribution: scopedDistribution,
        leaderboard: scopedLeaderboard,
        alerts: scopedAlerts,
      };
    }

    const personalAppraisal = visibleAppraisals[0];
    return {
      ...snapshot.analytics,
      summaryCards: [
        { id: 'my-001', label: 'My OKR Progress', value: `${Math.round(derivedSummary.okrAverage)}%`, tone: 'sky' },
        { id: 'my-002', label: 'My Appraisal', value: personalAppraisal ? `${personalAppraisal.finalScore}` : '-', tone: 'emerald' },
        { id: 'my-003', label: '360 Average', value: `${derivedSummary.evaluationAverage.toFixed(1)}/5`, tone: 'amber' },
        { id: 'my-004', label: 'Career Readiness', value: `${visibleCareerPaths[0]?.readinessScore || 0}%`, tone: 'violet' },
      ],
      departmentPerformance: scopedDepartmentPerformance,
      trend: scopedTrend,
      distribution: scopedDistribution,
      leaderboard: scopedLeaderboard.filter((entry) => entry.employeeName === currentEmployee?.fullName),
      alerts: scopedAlerts.filter((entry) => entry.employeeName === currentEmployee?.fullName),
    };
  }, [currentEmployee?.fullName, demoRole, derivedSummary.evaluationAverage, derivedSummary.okrAverage, snapshot.analytics, visibleAppraisals, visibleCareerPaths]);

  const openCreateOkr = useCallback(() => {
    setFormErrors({});
    setOkrForm({
      ...initialOkrForm,
      department: currentEmployee?.department || '',
      employeeId: currentEmployee?.id || '',
    });
    setOkrModalOpen(true);
  }, [currentEmployee?.department, currentEmployee?.id]);

  const openEditOkr = useCallback((record) => {
    setFormErrors({});
    setOkrForm({
      id: record.id,
      objective: record.objective,
      department: record.department,
      employeeId: record.employeeId,
      quarter: record.quarter,
      status: record.status,
      priority: record.priority,
      dueDate: record.dueDate,
      description: record.description,
      keyResults: record.keyResults.map((item) => ({ ...item })),
    });
    setOkrModalOpen(true);
  }, []);

  const closeOkrModal = useCallback(() => {
    setOkrModalOpen(false);
    setOkrForm(initialOkrForm);
    setFormErrors({});
  }, []);

  const updateOkrKeyResult = useCallback((index, field, value) => {
    setOkrForm((current) => ({
      ...current,
      keyResults: current.keyResults.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  }, []);

  const addOkrKeyResult = useCallback(() => {
    setOkrForm((current) => ({
      ...current,
      keyResults: [...current.keyResults, { id: '', title: '', progress: 0, targetLabel: '', actualLabel: '', status: 'Not Started' }],
    }));
  }, []);

  const removeOkrKeyResult = useCallback((index) => {
    setOkrForm((current) => ({
      ...current,
      keyResults: current.keyResults.filter((_, itemIndex) => itemIndex !== index),
    }));
  }, []);

  const handleSaveOkr = useCallback(async () => {
    const validation = validateOkrForm(okrForm);
    if (Object.keys(validation).length > 0) {
      setFormErrors(validation);
      return;
    }

    await saveOkr(okrForm);
    setFeedback(okrForm.id ? 'OKR berhasil diperbarui.' : 'OKR berhasil dibuat.');
    closeOkrModal();
    loadSnapshot();
  }, [closeOkrModal, loadSnapshot, okrForm]);

  const handleDeleteOkr = useCallback(async (okrId) => {
    await deleteOkr(okrId);
    if (okrDetail?.id === okrId) {
      setOkrDetail(null);
    }
    setFeedback('OKR berhasil dihapus.');
    loadSnapshot();
  }, [loadSnapshot, okrDetail?.id]);

  const openAppraisalModal = useCallback((record) => {
    setFormErrors({});
    if (!record) {
      setAppraisalForm({
        ...initialAppraisalForm,
        employeeId: currentEmployee?.id || '',
        recommendation: 'Siapkan next action coaching atau promotion decision.',
      });
    } else {
      setAppraisalForm({
        id: record.id,
        employeeId: record.employeeId,
        cycle: record.cycle,
        reviewerName: record.reviewerName,
        scores: { ...record.scores },
        recommendation: record.recommendation,
      });
    }
    setAppraisalModalOpen(true);
  }, [currentEmployee?.id]);

  const closeAppraisalModal = useCallback(() => {
    setAppraisalModalOpen(false);
    setAppraisalForm(initialAppraisalForm);
    setFormErrors({});
  }, []);

  const handleSaveAppraisal = useCallback(async () => {
    const validation = validateAppraisalForm(appraisalForm);
    if (Object.keys(validation).length > 0) {
      setFormErrors(validation);
      return;
    }

    await saveAppraisal({
      ...appraisalForm,
      rating: buildRatingFromScores(appraisalForm.scores),
      workflowStatus: 'Pending Approval',
    });
    setFeedback(appraisalForm.id ? 'Appraisal berhasil diperbarui.' : 'Appraisal berhasil dibuat.');
    closeAppraisalModal();
    loadSnapshot();
  }, [appraisalForm, closeAppraisalModal, loadSnapshot]);

  const handleAppraisalWorkflow = useCallback(async (appraisalId, workflowStatus) => {
    await updateAppraisalWorkflow(appraisalId, workflowStatus);
    setFeedback(`Status appraisal diubah menjadi ${workflowStatus}.`);
    loadSnapshot();
  }, [loadSnapshot]);

  const openEvaluationModal = useCallback((record) => {
    setFormErrors({});
    setEvaluationForm({
      ...initialEvaluationForm,
      id: record.id,
      reviewerName: demoRole === 'employee' ? currentEmployee?.fullName || '' : 'HRD Panel',
      reviewerRole: demoRole === 'employee' ? 'Rekan kerja' : 'Atasan',
    });
    setEvaluationModalOpen(true);
  }, [currentEmployee?.fullName, demoRole]);

  const closeEvaluationModal = useCallback(() => {
    setEvaluationModalOpen(false);
    setEvaluationForm(initialEvaluationForm);
    setFormErrors({});
  }, []);

  const handleSaveEvaluation = useCallback(async () => {
    const validation = validateEvaluationForm(evaluationForm);
    if (Object.keys(validation).length > 0) {
      setFormErrors(validation);
      return;
    }

    await saveEvaluationFeedback(evaluationForm);
    setFeedback('Feedback 360 berhasil dikirim.');
    closeEvaluationModal();
    loadSnapshot();
  }, [closeEvaluationModal, evaluationForm, loadSnapshot]);

  const handleCareerApproval = useCallback(async (careerId, nextStatus) => {
    await updateCareerApproval(careerId, nextStatus);
    setFeedback(`Approval promosi berhasil diubah menjadi ${nextStatus}.`);
    loadSnapshot();
  }, [loadSnapshot]);

  return {
    loading,
    error,
    feedback,
    filters,
    setFilters,
    snapshot,
    currentEmployee,
    demoRole,
    setDemoRole,
    demoEmployeeId,
    setDemoEmployeeId,
    capabilities,
    visibleOkrs,
    visibleAppraisals,
    visibleEvaluations,
    visibleCareerPaths,
    derivedSummary,
    analyticsView,
    loadSnapshot,
    okrModalOpen,
    okrDetail,
    setOkrDetail,
    okrForm,
    setOkrForm,
    openCreateOkr,
    openEditOkr,
    closeOkrModal,
    updateOkrKeyResult,
    addOkrKeyResult,
    removeOkrKeyResult,
    handleSaveOkr,
    handleDeleteOkr,
    appraisalModalOpen,
    appraisalForm,
    setAppraisalForm,
    openAppraisalModal,
    closeAppraisalModal,
    handleSaveAppraisal,
    handleAppraisalWorkflow,
    evaluationModalOpen,
    evaluationForm,
    setEvaluationForm,
    openEvaluationModal,
    closeEvaluationModal,
    handleSaveEvaluation,
    handleCareerApproval,
    formErrors,
  };
}