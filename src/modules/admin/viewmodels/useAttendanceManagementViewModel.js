import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  exportAttendanceCsv,
  exportAttendanceExcel,
  getAttendanceManagementSnapshot,
  reviewCorrectionRequest,
  saveAttendanceEntry,
  saveGeoSetting,
  submitCorrectionRequest,
  updateBiometricDevice,
} from '../../../services/attendanceManagementService';

const OFFLINE_QUEUE_KEY = 'termez-attendance-offline-queue-v1';

const initialHistoryFilters = {
  startDate: '',
  endDate: '',
  status: '',
  search: '',
};

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function createInitialCorrectionForm() {
  return {
    date: getTodayString(),
    reason: '',
  };
}

function createInitialHrdFilters() {
  return {
    department: '',
    date: getTodayString(),
    search: '',
  };
}

function parseSessionUser() {
  try {
    const raw = window.sessionStorage.getItem('user');
    if (!raw) {
      return { role: 'hrd', employeeId: 1, displayName: 'HRD Team' };
    }

    const user = JSON.parse(raw);
    const roleRaw = String(user.role || user.user_role || '').toLowerCase();
    const role = ['admin', 'hrd', 'hr', 'manager'].includes(roleRaw) ? 'hrd' : 'user';
    return {
      role,
      employeeId: Number(user.employee?.id || user.employee_id || 1),
      displayName: user.employee?.full_name || user.username || 'HRD Team',
    };
  } catch {
    return { role: 'hrd', employeeId: 1, displayName: 'HRD Team' };
  }
}

function readOfflineQueue() {
  try {
    const raw = window.localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeOfflineQueue(queue) {
  window.localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

function includesKeyword(values, keyword) {
  if (!keyword) {
    return true;
  }

  const search = keyword.toLowerCase();
  return values.some((value) => String(value || '').toLowerCase().includes(search));
}

function formatTime(date) {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371000;
  const deltaLat = toRad(lat2 - lat1);
  const deltaLon = toRad(lon2 - lon1);
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function mergeOfflineQueue(attendance, queue) {
  const merged = [...attendance];

  queue.forEach((entry) => {
    const existingIndex = merged.findIndex((item) => item.employee_id === entry.employee_id && item.date === entry.date);
    const baseRecord = existingIndex >= 0 ? merged[existingIndex] : null;
    const nextRecord = {
      id: entry.queue_id,
      employee_id: entry.employee_id,
      date: entry.date,
      check_in: entry.type === 'check-in' ? entry.time_value : (baseRecord?.check_in || '-'),
      check_out: entry.type === 'check-out' ? entry.time_value : (baseRecord?.check_out || '-'),
      status: entry.status,
      method: 'Offline',
      latitude: entry.latitude,
      longitude: entry.longitude,
      is_offline: true,
      biometric_status: entry.biometric_status || '-',
      pending_sync: true,
    };

    if (existingIndex >= 0) {
      merged[existingIndex] = nextRecord;
    } else {
      merged.unshift(nextRecord);
    }
  });

  return merged;
}

function createToast(message, tone = 'success') {
  return {
    id: Date.now(),
    message,
    tone,
  };
}

function simulateMockLocation(geoSetting) {
  const jitter = () => (Math.random() - 0.5) * 0.0006;
  return {
    latitude: Number((geoSetting.latitude + jitter()).toFixed(6)),
    longitude: Number((geoSetting.longitude + jitter()).toFixed(6)),
    source: 'mock',
  };
}

function resolveLocation(geoSetting) {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(simulateMockLocation(geoSetting));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
          source: 'gps',
        });
      },
      () => resolve(simulateMockLocation(geoSetting)),
      {
        enableHighAccuracy: true,
        timeout: 6000,
      }
    );
  });
}

export default function useAttendanceManagementViewModel() {
  const sessionUser = useMemo(() => parseSessionUser(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [snapshot, setSnapshot] = useState({
    employees: [],
    attendance: [],
    corrections: [],
    geoSetting: { office_name: '', latitude: 0, longitude: 0, radius: 0 },
    devices: [],
    filterOptions: {
      departments: [],
      methods: [],
      statuses: [],
      employees: [],
    },
  });
  const [demoRole, setDemoRole] = useState(sessionUser.role);
  const [demoEmployeeId, setDemoEmployeeId] = useState(sessionUser.employeeId);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState(() => readOfflineQueue());
  const [attendanceMethod, setAttendanceMethod] = useState('GPS');
  const [attendanceActionLoading, setAttendanceActionLoading] = useState('');
  const [syncingOffline, setSyncingOffline] = useState(false);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctionForm, setCorrectionForm] = useState(createInitialCorrectionForm);
  const [historyFilters, setHistoryFilters] = useState(initialHistoryFilters);
  const [hrdFilters, setHrdFilters] = useState(createInitialHrdFilters);
  const [geoSettingForm, setGeoSettingForm] = useState({
    office_name: '',
    latitude: '',
    longitude: '',
    radius: '',
  });
  const [biometricState, setBiometricState] = useState({
    mode: 'Face Recognition',
    status: 'Idle',
    progress: 0,
    lastResult: '',
  });

  const loadSnapshot = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const nextSnapshot = await getAttendanceManagementSnapshot();
      setSnapshot(nextSnapshot);
      setGeoSettingForm({
        office_name: nextSnapshot.geoSetting.office_name,
        latitude: String(nextSnapshot.geoSetting.latitude),
        longitude: String(nextSnapshot.geoSetting.longitude),
        radius: String(nextSnapshot.geoSetting.radius),
      });
      if (!nextSnapshot.employees.some((employee) => employee.id === demoEmployeeId) && nextSnapshot.employees[0]) {
        setDemoEmployeeId(nextSnapshot.employees[0].id);
      }
    } catch (loadError) {
      setError(loadError.message || 'Gagal memuat Attendance Management.');
    } finally {
      setLoading(false);
    }
  }, [demoEmployeeId]);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  useEffect(() => {
    writeOfflineQueue(offlineQueue);
  }, [offlineQueue]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const mergedAttendance = useMemo(() => mergeOfflineQueue(snapshot.attendance, offlineQueue), [offlineQueue, snapshot.attendance]);

  const currentEmployee = useMemo(() => (
    snapshot.employees.find((employee) => employee.id === demoEmployeeId) || snapshot.employees[0] || null
  ), [demoEmployeeId, snapshot.employees]);

  const today = useMemo(() => getTodayString(), []);

  const currentEmployeeTodayAttendance = useMemo(() => (
    mergedAttendance.find((item) => item.employee_id === currentEmployee?.id && item.date === today) || null
  ), [currentEmployee?.id, mergedAttendance, today]);

  const employeeAttendanceHistory = useMemo(() => mergedAttendance.filter((item) => {
    if (item.employee_id !== currentEmployee?.id) {
      return false;
    }

    if (historyFilters.startDate && item.date < historyFilters.startDate) {
      return false;
    }

    if (historyFilters.endDate && item.date > historyFilters.endDate) {
      return false;
    }

    if (historyFilters.status && item.status !== historyFilters.status) {
      return false;
    }

    return includesKeyword([
      item.date,
      item.check_in,
      item.check_out,
      item.status,
      item.method,
    ], historyFilters.search);
  }), [currentEmployee?.id, historyFilters.endDate, historyFilters.search, historyFilters.startDate, historyFilters.status, mergedAttendance]);

  const visibleCorrections = useMemo(() => snapshot.corrections.map((correction) => ({
    ...correction,
    employee: snapshot.employees.find((employee) => employee.id === correction.employee_id) || null,
  })), [snapshot.corrections, snapshot.employees]);

  const employeeCorrections = useMemo(() => visibleCorrections.filter((item) => item.employee_id === currentEmployee?.id), [currentEmployee?.id, visibleCorrections]);

  const filteredAttendanceForHrd = useMemo(() => mergedAttendance
    .filter((item) => item.date === hrdFilters.date)
    .filter((item) => {
      const employee = snapshot.employees.find((entry) => entry.id === item.employee_id);
      if (hrdFilters.department && employee?.department !== hrdFilters.department) {
        return false;
      }
      return includesKeyword([
        employee?.name,
        employee?.department,
        item.status,
        item.method,
        item.check_in,
        item.check_out,
      ], hrdFilters.search);
    })
    .map((item) => ({
      ...item,
      employee: snapshot.employees.find((entry) => entry.id === item.employee_id) || null,
    })), [hrdFilters.date, hrdFilters.department, hrdFilters.search, mergedAttendance, snapshot.employees]);

  const monitoringSummary = useMemo(() => {
    const scopedEmployees = hrdFilters.department
      ? snapshot.employees.filter((employee) => employee.department === hrdFilters.department)
      : snapshot.employees;

    const scopedEmployeeIds = scopedEmployees.map((employee) => employee.id);
    const scopedAttendance = filteredAttendanceForHrd.filter((item) => scopedEmployeeIds.includes(item.employee_id));
    const attendanceIds = new Set(scopedAttendance.map((item) => item.employee_id));

    return {
      present: scopedAttendance.filter((item) => item.check_in && item.check_in !== '-').length,
      late: scopedAttendance.filter((item) => item.status === 'Late').length,
      absent: scopedEmployees.filter((employee) => !attendanceIds.has(employee.id) || scopedAttendance.some((record) => record.employee_id === employee.id && record.status === 'Absent')).length,
    };
  }, [filteredAttendanceForHrd, hrdFilters.department, snapshot.employees]);

  const mapRecords = useMemo(() => {
    const baseRecords = demoRole === 'hrd' ? filteredAttendanceForHrd : employeeAttendanceHistory;
    return baseRecords.filter((item) => typeof item.latitude === 'number' && typeof item.longitude === 'number');
  }, [demoRole, employeeAttendanceHistory, filteredAttendanceForHrd]);

  const syncOfflineQueue = useCallback(async () => {
    if (!isOnline || offlineQueue.length === 0) {
      return;
    }

    setSyncingOffline(true);
    setError('');

    try {
      for (const entry of offlineQueue) {
        await saveAttendanceEntry({ ...entry, is_offline: true });
      }
      setOfflineQueue([]);
      await loadSnapshot();
      setToast(createToast('Offline attendance berhasil di-sync.', 'success'));
    } catch (syncError) {
      setError(syncError.message || 'Gagal melakukan sync attendance offline.');
    } finally {
      setSyncingOffline(false);
    }
  }, [isOnline, loadSnapshot, offlineQueue]);

  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      syncOfflineQueue();
    }
  }, [isOnline, offlineQueue.length, syncOfflineQueue]);

  const runBiometricVerification = useCallback((mode) => {
    setBiometricState({ mode, status: 'Verifying', progress: 18, lastResult: '' });

    window.setTimeout(() => setBiometricState((current) => ({ ...current, progress: 46 })), 220);
    window.setTimeout(() => setBiometricState((current) => ({ ...current, progress: 72 })), 460);

    window.setTimeout(() => {
      const success = Math.random() > 0.2;
      setBiometricState({
        mode,
        status: success ? 'Verified' : 'Failed',
        progress: 100,
        lastResult: success ? `${mode} verified` : `${mode} failed`,
      });
      setToast(createToast(success ? `${mode} berhasil diverifikasi.` : `${mode} gagal diverifikasi.`, success ? 'success' : 'error'));
    }, 780);
  }, []);

  const handleAttendance = useCallback(async (type) => {
    if (!currentEmployee) {
      return;
    }

    if (attendanceMethod === 'Biometric' && biometricState.status !== 'Verified') {
      setToast(createToast('Lakukan verifikasi biometric terlebih dahulu.', 'warning'));
      return;
    }

    const actionKey = `${attendanceMethod}-${type}`;
    setAttendanceActionLoading(actionKey);
    setError('');

    try {
      const location = await resolveLocation(snapshot.geoSetting);
      const distance = haversineDistance(
        snapshot.geoSetting.latitude,
        snapshot.geoSetting.longitude,
        location.latitude,
        location.longitude
      );

      if (distance > snapshot.geoSetting.radius) {
        setToast(createToast(`Lokasi di luar radius kantor (${Math.round(distance)} m).`, 'error'));
        return;
      }

      const now = new Date();
      const payload = {
        queue_id: `offline-${Date.now()}`,
        employee_id: currentEmployee.id,
        type,
        date: today,
        time_value: formatTime(now),
        latitude: location.latitude,
        longitude: location.longitude,
        distance,
        method: attendanceMethod,
        biometric_status: attendanceMethod === 'Biometric' ? biometricState.status : '-',
      };

      if (!isOnline) {
        const offlineStatus = type === 'check-in'
          ? payload.time_value <= '08:00' ? 'On Time' : 'Late'
          : payload.time_value < '17:00' ? 'Early Leave' : 'On Time';
        setOfflineQueue((current) => ([...current, { ...payload, is_offline: true, status: offlineStatus }]));
        setToast(createToast('Attendance disimpan ke offline queue dan akan sync otomatis.', 'warning'));
        return;
      }

      await saveAttendanceEntry({
        ...payload,
        is_offline: false,
      });

      await loadSnapshot();
      setToast(createToast(`${type === 'check-in' ? 'Check in' : 'Check out'} berhasil dicatat.`, 'success'));
    } catch (attendanceError) {
      setError(attendanceError.message || 'Gagal menyimpan attendance.');
    } finally {
      setAttendanceActionLoading('');
    }
  }, [attendanceMethod, biometricState.status, currentEmployee, isOnline, loadSnapshot, snapshot.geoSetting, today]);

  const submitCorrection = useCallback(async () => {
    if (!currentEmployee) {
      return;
    }

    if (!correctionForm.date || !correctionForm.reason.trim()) {
      setToast(createToast('Tanggal dan alasan koreksi wajib diisi.', 'warning'));
      return;
    }

    try {
      await submitCorrectionRequest({
        employee_id: currentEmployee.id,
        date: correctionForm.date,
        reason: correctionForm.reason.trim(),
      });
      await loadSnapshot();
      setCorrectionOpen(false);
      setCorrectionForm(createInitialCorrectionForm());
      setToast(createToast('Request correction berhasil dikirim.', 'success'));
    } catch (submitError) {
      setError(submitError.message || 'Gagal mengirim request correction.');
    }
  }, [correctionForm.date, correctionForm.reason, currentEmployee, loadSnapshot]);

  const handleCorrectionReview = useCallback(async (id, decision) => {
    try {
      await reviewCorrectionRequest(id, decision, decision === 'Approved' ? 'Approved by HRD.' : 'Rejected by HRD.');
      await loadSnapshot();
      setToast(createToast(`Correction ${decision.toLowerCase()}.`, decision === 'Approved' ? 'success' : 'error'));
    } catch (reviewError) {
      setError(reviewError.message || 'Gagal mengubah status correction.');
    }
  }, [loadSnapshot]);

  const saveGeoFence = useCallback(async () => {
    try {
      await saveGeoSetting(geoSettingForm);
      await loadSnapshot();
      setToast(createToast('Geo-fencing setting berhasil diperbarui.', 'success'));
    } catch (saveError) {
      setError(saveError.message || 'Gagal menyimpan geo-fencing setting.');
    }
  }, [geoSettingForm, loadSnapshot]);

  const toggleDevice = useCallback(async (deviceId) => {
    try {
      await updateBiometricDevice(deviceId);
      await loadSnapshot();
      setToast(createToast('Device status berhasil diperbarui.', 'success'));
    } catch (deviceError) {
      setError(deviceError.message || 'Gagal mengubah status device.');
    }
  }, [loadSnapshot]);

  const exportCsv = useCallback(async () => {
    await exportAttendanceCsv(filteredAttendanceForHrd, snapshot.employees);
    setToast(createToast('CSV export berhasil dibuat.', 'success'));
  }, [filteredAttendanceForHrd, snapshot.employees]);

  const exportExcel = useCallback(async () => {
    await exportAttendanceExcel(filteredAttendanceForHrd, snapshot.employees);
    setToast(createToast('Excel export berhasil dibuat.', 'success'));
  }, [filteredAttendanceForHrd, snapshot.employees]);

  const userSummary = useMemo(() => ({
    onTime: employeeAttendanceHistory.filter((item) => item.status === 'On Time').length,
    late: employeeAttendanceHistory.filter((item) => item.status === 'Late').length,
    earlyLeave: employeeAttendanceHistory.filter((item) => item.status === 'Early Leave').length,
    corrections: employeeCorrections.filter((item) => item.status === 'Pending').length,
  }), [employeeAttendanceHistory, employeeCorrections]);

  return {
    loading,
    error,
    toast,
    demoRole,
    setDemoRole,
    demoEmployeeId,
    setDemoEmployeeId,
    employees: snapshot.employees,
    currentEmployee,
    geoSetting: snapshot.geoSetting,
    devices: snapshot.devices,
    filterOptions: snapshot.filterOptions,
    isOnline,
    offlineQueue,
    syncingOffline,
    attendanceMethod,
    setAttendanceMethod,
    attendanceActionLoading,
    biometricState,
    runBiometricVerification,
    handleAttendance,
    today,
    currentEmployeeTodayAttendance,
    employeeAttendanceHistory,
    historyFilters,
    setHistoryFilters,
    correctionOpen,
    setCorrectionOpen,
    correctionForm,
    setCorrectionForm,
    submitCorrection,
    employeeCorrections,
    filteredAttendanceForHrd,
    hrdFilters,
    setHrdFilters,
    monitoringSummary,
    visibleCorrections,
    handleCorrectionReview,
    geoSettingForm,
    setGeoSettingForm,
    saveGeoFence,
    toggleDevice,
    exportCsv,
    exportExcel,
    mapRecords,
    userSummary,
    syncOfflineQueue,
    loadSnapshot,
  };
}