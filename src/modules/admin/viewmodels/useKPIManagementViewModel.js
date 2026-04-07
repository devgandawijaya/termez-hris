import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  assignKpi,
  createKpiMaster,
  deleteKpiMaster,
  getKpiManagementSnapshot,
  reviewAssignment,
  submitAssignment,
  updateAssignmentProgress,
  updateKpiMaster,
} from '../../../services/kpiManagementService';

const initialFilters = {
  periodType: '',
  department: '',
  employeeId: '',
};

const initialKpiForm = {
  id: '',
  name: '',
  description: '',
  weight: '',
  target: '',
  unit: '%',
  type: 'Individual',
  status: 'Active',
  ownerDepartment: '',
};

const initialAssignmentForm = {
  kpiId: '',
  assignmentMode: 'employee',
  employeeIds: [],
  department: '',
  periodType: 'Monthly',
  periodLabel: '',
  weight: '',
  target: '',
  actual: 0,
  unit: '%',
  reviewer: '',
  notes: '',
};

const initialTrackingForm = {
  assignmentId: '',
  actual: '',
  notes: '',
};

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'master', label: 'KPI Master Data' },
  { id: 'assignment', label: 'Assignment' },
  { id: 'tracking', label: 'Monitoring' },
  { id: 'approval', label: 'Approval' },
  { id: 'report', label: 'Report' },
  { id: 'activity', label: 'Activity Log' },
];

const roleTabs = {
  admin: tabs,
  user: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tracking', label: 'Monitoring Saya' },
    { id: 'approval', label: 'Status Approval' },
  ],
};

function parseSessionUser() {
  try {
    const raw = sessionStorage.getItem('user');
    if (!raw) {
      return {
        displayName: 'Admin System',
        role: 'admin',
        employeeId: '',
      };
    }

    const user = JSON.parse(raw);
    const roleCandidate = String(user.role || user.user_role || user.employee?.role || '').toLowerCase();
    const mappedRole = ['admin', 'manager'].includes(roleCandidate)
      ? 'admin'
      : ['employee', 'user', 'basic', 'staff'].includes(roleCandidate)
        ? 'user'
        : 'admin';
    return {
      displayName: user.employee?.full_name || user.username || 'Admin System',
      role: mappedRole,
      employeeId: user.employee?.id || user.employee?.employeeId || user.employee?.employee_id || user.employee_id || '',
    };
  } catch {
    return {
      displayName: 'Admin System',
      role: 'admin',
      employeeId: '',
    };
  }
}

function validateKpiForm(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Nama KPI wajib diisi.';
  }

  if (!form.description.trim()) {
    errors.description = 'Deskripsi KPI wajib diisi.';
  }

  if (!form.weight || Number(form.weight) <= 0 || Number(form.weight) > 100) {
    errors.weight = 'Bobot harus di antara 1 sampai 100.';
  }

  if (!form.target || Number(form.target) <= 0) {
    errors.target = 'Target harus lebih besar dari 0.';
  }

  if (!form.ownerDepartment) {
    errors.ownerDepartment = 'Departemen owner wajib dipilih.';
  }

  return errors;
}

function validateAssignmentForm(form) {
  const errors = {};

  if (!form.kpiId) {
    errors.kpiId = 'Pilih KPI terlebih dahulu.';
  }

  if (form.assignmentMode === 'employee' && form.employeeIds.length === 0) {
    errors.employeeIds = 'Pilih minimal satu karyawan.';
  }

  if (form.assignmentMode === 'department' && !form.department) {
    errors.department = 'Departemen wajib dipilih untuk assignment departemen.';
  }

  if (!form.periodLabel.trim()) {
    errors.periodLabel = 'Periode KPI wajib diisi.';
  }

  if (!form.weight || Number(form.weight) <= 0 || Number(form.weight) > 100) {
    errors.weight = 'Bobot assignment harus valid.';
  }

  if (!form.target || Number(form.target) <= 0) {
    errors.target = 'Target assignment harus lebih besar dari 0.';
  }

  if (!form.reviewer.trim()) {
    errors.reviewer = 'Atasan reviewer wajib diisi.';
  }

  return errors;
}

function validateTrackingForm(form) {
  const errors = {};

  if (form.actual === '' || Number(form.actual) < 0) {
    errors.actual = 'Realisasi KPI harus 0 atau lebih.';
  }

  if (!form.notes.trim()) {
    errors.notes = 'Catatan realisasi wajib diisi.';
  }

  return errors;
}

function buildRoleCapabilities(role) {
  return {
    canManageMaster: role === 'admin',
    canAssign: role === 'admin',
    canApprove: role === 'admin',
    canMonitorAll: role === 'admin',
    canExport: role === 'admin',
  };
}

function buildSummaryFromAssignments(assignments) {
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

function buildUserFlow(assignments) {
  return [
    {
      step: '1. Lihat KPI yang di-assign',
      description: `${assignments.length} KPI aktif tampil di dashboard dan monitoring user.`,
    },
    {
      step: '2. Input realisasi KPI',
      description: 'User biasa mengisi actual dan catatan progress sesuai periode KPI.',
    },
    {
      step: '3. Submit untuk approval',
      description: 'Setelah progress siap, user submit KPI ke admin untuk direview.',
    },
    {
      step: '4. Pantau hasil approval',
      description: 'User melihat status Pending, Approved, atau Rejected beserta catatan revisi.',
    },
  ];
}

export default function useKPIManagementViewModel() {
  const sessionUser = useMemo(() => parseSessionUser(), []);
  const [demoRole, setDemoRole] = useState(sessionUser.role);
  const [demoEmployeeId, setDemoEmployeeId] = useState(sessionUser.employeeId);
  const effectiveRole = demoRole;
  const capabilities = useMemo(() => buildRoleCapabilities(effectiveRole), [effectiveRole]);

  const [filters, setFilters] = useState(initialFilters);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [snapshot, setSnapshot] = useState({
    employees: [],
    masterRecords: [],
    assignments: [],
    summary: {
      total: 0,
      active: 0,
      completed: 0,
      pendingApprovals: 0,
      averageProgress: 0,
    },
    performanceByEmployee: [],
    performanceByDepartment: [],
    finalScores: [],
    approvalQueue: [],
    timeline: [],
    activityLog: [],
    filterOptions: {
      periodTypes: [],
      departments: [],
      employees: [],
    },
    reportRows: [],
    roleSummary: {},
  });

  const [modalState, setModalState] = useState({
    kpiFormOpen: false,
    assignmentOpen: false,
    trackingOpen: false,
  });
  const [kpiForm, setKpiForm] = useState(initialKpiForm);
  const [assignmentForm, setAssignmentForm] = useState(initialAssignmentForm);
  const [trackingForm, setTrackingForm] = useState(initialTrackingForm);
  const [reviewNotes, setReviewNotes] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Centralize refresh so every action reuses the same loading flow.
  const loadSnapshot = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getKpiManagementSnapshot(filters);
      setSnapshot(response);
    } catch (loadError) {
      setError(loadError.message || 'Gagal memuat KPI Management.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timer = window.setTimeout(() => setFeedback(''), 2500);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    if (effectiveRole !== 'user' || demoEmployeeId || snapshot.employees.length === 0) {
      return;
    }

    setDemoEmployeeId(snapshot.employees[0].id);
  }, [demoEmployeeId, effectiveRole, snapshot.employees]);

  const currentUser = useMemo(() => {
    const selectedEmployee = snapshot.employees.find(
      (employee) => employee.id === demoEmployeeId || employee.employeeId === demoEmployeeId,
    );

    return {
      ...sessionUser,
      role: effectiveRole,
      displayName: effectiveRole === 'user' ? selectedEmployee?.fullName || sessionUser.displayName : sessionUser.displayName,
      employeeId: effectiveRole === 'user' ? selectedEmployee?.id || demoEmployeeId : sessionUser.employeeId,
      employeeCode: selectedEmployee?.employeeId || '',
      department: selectedEmployee?.department || '',
    };
  }, [demoEmployeeId, effectiveRole, sessionUser, snapshot.employees]);

  const visibleAssignments = useMemo(() => {
    if (effectiveRole !== 'user') {
      return snapshot.assignments;
    }

    const preferredEmployee = snapshot.employees.find(
      (employee) =>
        employee.id === demoEmployeeId ||
        employee.employeeId === demoEmployeeId ||
        employee.id === currentUser.employeeId ||
        employee.employeeId === currentUser.employeeId ||
        employee.fullName === currentUser.displayName,
    );

    if (!preferredEmployee) {
      return [];
    }

    return snapshot.assignments.filter((assignment) => assignment.employeeId === preferredEmployee.id);
  }, [currentUser.displayName, currentUser.employeeId, demoEmployeeId, effectiveRole, snapshot.assignments, snapshot.employees]);

  const visibleApprovalQueue = useMemo(() => {
    if (capabilities.canApprove) {
      return snapshot.approvalQueue;
    }

    return visibleAssignments.filter((item) => ['Pending', 'Rejected', 'Approved'].includes(item.approvalStatus));
  }, [capabilities.canApprove, snapshot.approvalQueue, visibleAssignments]);

  const visibleTabs = useMemo(() => roleTabs[effectiveRole] || roleTabs.admin, [effectiveRole]);

  useEffect(() => {
    if (!visibleTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(visibleTabs[0]?.id || 'dashboard');
    }
  }, [activeTab, visibleTabs]);

  const visibleSummary = useMemo(() => {
    if (effectiveRole === 'admin') {
      return snapshot.summary;
    }

    return buildSummaryFromAssignments(visibleAssignments);
  }, [effectiveRole, snapshot.summary, visibleAssignments]);

  const visiblePerformanceByEmployee = useMemo(() => {
    if (effectiveRole === 'admin') {
      return snapshot.performanceByEmployee;
    }

    return snapshot.performanceByEmployee.filter((item) => item.name === currentUser.displayName);
  }, [currentUser.displayName, effectiveRole, snapshot.performanceByEmployee]);

  const visiblePerformanceByDepartment = useMemo(() => {
    if (effectiveRole === 'admin') {
      return snapshot.performanceByDepartment;
    }

    return snapshot.performanceByDepartment.filter((item) => item.department === currentUser.department);
  }, [currentUser.department, effectiveRole, snapshot.performanceByDepartment]);

  const visibleFinalScores = useMemo(() => {
    if (effectiveRole === 'admin') {
      return snapshot.finalScores;
    }

    return snapshot.finalScores.filter((item) => item.name === currentUser.displayName);
  }, [currentUser.displayName, effectiveRole, snapshot.finalScores]);

  const userFlow = useMemo(() => buildUserFlow(visibleAssignments), [visibleAssignments]);

  const openCreateKpi = useCallback(() => {
    setFormErrors({});
    setKpiForm(initialKpiForm);
    setModalState((current) => ({ ...current, kpiFormOpen: true }));
  }, []);

  const openEditKpi = useCallback((record) => {
    setFormErrors({});
    setKpiForm({
      id: record.id,
      name: record.name,
      description: record.description,
      weight: String(record.weight),
      target: String(record.target),
      unit: record.unit,
      type: record.type,
      status: record.status,
      ownerDepartment: record.ownerDepartment,
    });
    setModalState((current) => ({ ...current, kpiFormOpen: true }));
  }, []);

  const closeModals = useCallback(() => {
    setModalState({
      kpiFormOpen: false,
      assignmentOpen: false,
      trackingOpen: false,
    });
    setFormErrors({});
  }, []);

  const handleSaveKpi = useCallback(async () => {
    const nextErrors = validateKpiForm(kpiForm);
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    const payload = {
      ...kpiForm,
      weight: Number(kpiForm.weight),
      target: Number(kpiForm.target),
    };

    if (kpiForm.id) {
      await updateKpiMaster(kpiForm.id, payload, currentUser.displayName);
      setFeedback('KPI berhasil diperbarui.');
    } else {
      await createKpiMaster(payload, currentUser.displayName);
      setFeedback('KPI berhasil dibuat.');
    }

    closeModals();
    await loadSnapshot();
  }, [closeModals, currentUser.displayName, kpiForm, loadSnapshot]);

  const handleDeleteKpi = useCallback(async (record) => {
    const isConfirmed = window.confirm(`Hapus KPI ${record.name}? Semua assignment terkait akan ikut terhapus.`);
    if (!isConfirmed) {
      return;
    }

    await deleteKpiMaster(record.id, currentUser.displayName);
    setFeedback('KPI berhasil dihapus.');
    await loadSnapshot();
  }, [currentUser.displayName, loadSnapshot]);

  const openAssignmentModal = useCallback(() => {
    setFormErrors({});
    setAssignmentForm(initialAssignmentForm);
    setModalState((current) => ({ ...current, assignmentOpen: true }));
  }, []);

  const handleSaveAssignment = useCallback(async () => {
    const nextErrors = validateAssignmentForm(assignmentForm);
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    await assignKpi(
      {
        ...assignmentForm,
        target: Number(assignmentForm.target),
        weight: Number(assignmentForm.weight),
      },
      currentUser.displayName,
    );

    closeModals();
    setFeedback('Assignment KPI berhasil disimpan.');
    await loadSnapshot();
  }, [assignmentForm, closeModals, currentUser.displayName, loadSnapshot]);

  const openTrackingModal = useCallback((assignment) => {
    setFormErrors({});
    setTrackingForm({
      assignmentId: assignment.id,
      actual: String(assignment.actual),
      notes: assignment.notes || '',
    });
    setModalState((current) => ({ ...current, trackingOpen: true }));
  }, []);

  const handleSaveTracking = useCallback(async () => {
    const nextErrors = validateTrackingForm(trackingForm);
    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    await updateAssignmentProgress(
      trackingForm.assignmentId,
      {
        actual: Number(trackingForm.actual),
        notes: trackingForm.notes,
      },
      currentUser.displayName,
    );

    closeModals();
    setFeedback('Realisasi KPI berhasil diperbarui.');
    await loadSnapshot();
  }, [closeModals, currentUser.displayName, loadSnapshot, trackingForm]);

  const handleSubmitForApproval = useCallback(async (assignmentId) => {
    await submitAssignment(assignmentId, currentUser.displayName);
    setFeedback('KPI berhasil disubmit untuk approval.');
    await loadSnapshot();
  }, [currentUser.displayName, loadSnapshot]);

  const handleReview = useCallback(async (assignmentId, action) => {
    await reviewAssignment(assignmentId, action, reviewNotes[assignmentId] || '', currentUser.displayName);
    setReviewNotes((current) => ({ ...current, [assignmentId]: '' }));
    setFeedback(action === 'approve' ? 'KPI berhasil disetujui.' : 'Revisi KPI berhasil diminta.');
    await loadSnapshot();
  }, [currentUser.displayName, loadSnapshot, reviewNotes]);

  const exportExcel = useCallback(async () => {
    const [{ saveAs }, XLSX] = await Promise.all([
      import('file-saver'),
      import('xlsx'),
    ]);
    const worksheet = XLSX.utils.json_to_sheet(snapshot.reportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KPI Report');
    const fileBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([fileBuffer]), `kpi-report-${Date.now()}.xlsx`);
    setFeedback('Report Excel berhasil diunduh.');
  }, [snapshot.reportRows]);

  const exportPdf = useCallback(async () => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: 'landscape' });
    pdf.setFontSize(16);
    pdf.text('KPI Management Report', 14, 16);
    pdf.setFontSize(10);
    snapshot.reportRows.slice(0, 18).forEach((row, index) => {
      const y = 28 + (index * 10);
      pdf.text(
        `${row.employee} | ${row.department} | ${row.kpi} | Target: ${row.target} | Actual: ${row.actual} | Progress: ${row.progress}% | Score: ${row.score}`,
        14,
        y,
      );
    });
    pdf.save(`kpi-report-${Date.now()}.pdf`);
    setFeedback('Report PDF berhasil diunduh.');
  }, [snapshot.reportRows]);

  return {
    activeTab,
    tabs: visibleTabs,
    demoRole,
    demoEmployeeId,
    effectiveRole,
    filters,
    loading,
    error,
    feedback,
    currentUser,
    capabilities,
    snapshot,
    visibleSummary,
    visiblePerformanceByEmployee,
    visiblePerformanceByDepartment,
    visibleFinalScores,
    visibleAssignments,
    visibleApprovalQueue,
    userFlow,
    modalState,
    kpiForm,
    assignmentForm,
    trackingForm,
    formErrors,
    reviewNotes,
    setActiveTab,
    setDemoRole,
    setDemoEmployeeId,
    setFilters,
    setKpiForm,
    setAssignmentForm,
    setTrackingForm,
    setReviewNotes,
    openCreateKpi,
    openEditKpi,
    closeModals,
    handleSaveKpi,
    handleDeleteKpi,
    openAssignmentModal,
    handleSaveAssignment,
    openTrackingModal,
    handleSaveTracking,
    handleSubmitForApproval,
    handleReview,
    exportExcel,
    exportPdf,
    reload: loadSnapshot,
  };
}
