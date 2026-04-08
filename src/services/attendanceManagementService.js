import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const delay = (ms = 180) => new Promise((resolve) => window.setTimeout(resolve, ms));

const STORAGE_KEY = 'termez-attendance-management-v1';

const defaultEmployees = [
  {
    id: 1,
    name: 'Budi Santoso',
    department: 'IT',
    position: 'Frontend Developer',
  },
  {
    id: 2,
    name: 'Siti Rahmawati',
    department: 'HR',
    position: 'HR Officer',
  },
  {
    id: 3,
    name: 'Deni Kurniawan',
    department: 'Finance',
    position: 'Finance Analyst',
  },
  {
    id: 4,
    name: 'Rina Lestari',
    department: 'Operations',
    position: 'Operations Supervisor',
  },
  {
    id: 5,
    name: 'Andi Pratama',
    department: 'IT',
    position: 'Backend Engineer',
  },
];

const defaultAttendance = [
  {
    id: 1,
    employee_id: 1,
    date: '2026-04-07',
    check_in: '08:05',
    check_out: '17:00',
    status: 'Late',
    method: 'GPS',
    latitude: -6.2,
    longitude: 106.816,
    is_offline: false,
    biometric_status: 'Verified',
  },
  {
    id: 2,
    employee_id: 2,
    date: '2026-04-07',
    check_in: '07:55',
    check_out: '17:04',
    status: 'On Time',
    method: 'Biometric',
    latitude: -6.2002,
    longitude: 106.8162,
    is_offline: false,
    biometric_status: 'Verified',
  },
  {
    id: 3,
    employee_id: 3,
    date: '2026-04-07',
    check_in: '-',
    check_out: '-',
    status: 'Absent',
    method: '-',
    latitude: null,
    longitude: null,
    is_offline: false,
    biometric_status: '-',
  },
  {
    id: 4,
    employee_id: 4,
    date: '2026-04-06',
    check_in: '08:00',
    check_out: '16:20',
    status: 'Early Leave',
    method: 'Offline',
    latitude: -6.2005,
    longitude: 106.8164,
    is_offline: true,
    biometric_status: 'Failed',
  },
  {
    id: 5,
    employee_id: 5,
    date: '2026-04-06',
    check_in: '07:48',
    check_out: '17:11',
    status: 'On Time',
    method: 'GPS',
    latitude: -6.1996,
    longitude: 106.8157,
    is_offline: false,
    biometric_status: 'Verified',
  },
  {
    id: 6,
    employee_id: 1,
    date: '2026-04-05',
    check_in: '07:58',
    check_out: '17:03',
    status: 'On Time',
    method: 'Biometric',
    latitude: -6.2001,
    longitude: 106.8161,
    is_offline: false,
    biometric_status: 'Verified',
  },
];

const defaultCorrections = [
  {
    id: 1,
    employee_id: 1,
    date: '2026-04-07',
    reason: 'Lupa check-in',
    status: 'Pending',
    reviewer_note: '',
  },
  {
    id: 2,
    employee_id: 4,
    date: '2026-04-06',
    reason: 'Pulang dinas lapangan lebih cepat dan belum sempat update.',
    status: 'Approved',
    reviewer_note: 'Disetujui sesuai surat tugas.',
  },
];

const defaultGeoSetting = {
  office_name: 'Head Office',
  latitude: -6.2,
  longitude: 106.816,
  radius: 100,
};

const defaultDevices = [
  {
    id: 'dev-face-01',
    name: 'Front Gate Face Terminal',
    type: 'Face Recognition',
    status: 'Online',
    last_sync: '2026-04-07 08:12',
  },
  {
    id: 'dev-fp-02',
    name: '2nd Floor Fingerprint',
    type: 'Fingerprint',
    status: 'Offline',
    last_sync: '2026-04-07 07:40',
  },
  {
    id: 'dev-mobile-03',
    name: 'Mobile Attendance Gateway',
    type: 'GPS Sync Hub',
    status: 'Online',
    last_sync: '2026-04-07 08:10',
  },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readStore() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStore(store) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function createDefaultStore() {
  return {
    employees: defaultEmployees,
    attendance: defaultAttendance,
    corrections: defaultCorrections,
    geoSetting: defaultGeoSetting,
    devices: defaultDevices,
  };
}

let store = readStore() || createDefaultStore();

if (!readStore()) {
  writeStore(store);
}

function generateId(collection) {
  return collection.length ? Math.max(...collection.map((item) => Number(item.id) || 0)) + 1 : 1;
}

function formatLocation(latitude, longitude) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return '-';
  }

  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

function buildFilterOptions(nextStore) {
  const departments = [...new Set(nextStore.employees.map((employee) => employee.department))];
  const methods = [...new Set(nextStore.attendance.map((item) => item.method).filter(Boolean))];
  const statuses = [...new Set(nextStore.attendance.map((item) => item.status).filter(Boolean))];

  return {
    departments,
    methods,
    statuses,
    employees: nextStore.employees,
  };
}

function buildSnapshot() {
  return {
    employees: clone(store.employees),
    attendance: clone(store.attendance),
    corrections: clone(store.corrections),
    geoSetting: clone(store.geoSetting),
    devices: clone(store.devices),
    filterOptions: buildFilterOptions(store),
  };
}

function determineStatus(type, timeValue, previousStatus) {
  if (type === 'check-in') {
    return timeValue <= '08:00' ? 'On Time' : 'Late';
  }

  if (timeValue < '17:00') {
    return 'Early Leave';
  }

  return previousStatus === 'Late' ? 'Late' : 'On Time';
}

function touchDeviceSync(method) {
  store.devices = store.devices.map((device) => {
    if (method === 'Biometric' && (device.type === 'Face Recognition' || device.type === 'Fingerprint')) {
      return { ...device, status: 'Online', last_sync: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' ') };
    }
    if ((method === 'GPS' || method === 'Offline') && device.type === 'GPS Sync Hub') {
      return { ...device, status: 'Online', last_sync: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' ') };
    }
    return device;
  });
}

export async function getAttendanceManagementSnapshot() {
  await delay();
  return buildSnapshot();
}

export async function saveAttendanceEntry(payload) {
  await delay();

  const nextId = generateId(store.attendance);
  const existingIndex = store.attendance.findIndex((item) => item.employee_id === payload.employee_id && item.date === payload.date);
  const existingRecord = existingIndex >= 0 ? store.attendance[existingIndex] : null;
  const nextMethod = payload.is_offline ? 'Offline' : payload.method;
  const nextStatus = determineStatus(payload.type, payload.time_value, existingRecord?.status);

  const nextRecord = {
    id: existingRecord?.id || nextId,
    employee_id: payload.employee_id,
    date: payload.date,
    check_in: payload.type === 'check-in' ? payload.time_value : (existingRecord?.check_in || '-'),
    check_out: payload.type === 'check-out' ? payload.time_value : (existingRecord?.check_out || '-'),
    status: nextStatus,
    method: nextMethod,
    latitude: payload.latitude,
    longitude: payload.longitude,
    is_offline: Boolean(payload.is_offline),
    biometric_status: payload.biometric_status || '-',
    location_label: formatLocation(payload.latitude, payload.longitude),
  };

  if (existingIndex >= 0) {
    store.attendance[existingIndex] = nextRecord;
  } else {
    store.attendance.unshift(nextRecord);
  }

  touchDeviceSync(nextMethod);
  writeStore(store);
  return clone(nextRecord);
}

export async function submitCorrectionRequest(payload) {
  await delay();

  const nextCorrection = {
    id: generateId(store.corrections),
    employee_id: payload.employee_id,
    date: payload.date,
    reason: payload.reason,
    status: 'Pending',
    reviewer_note: '',
  };

  store.corrections.unshift(nextCorrection);
  writeStore(store);
  return clone(nextCorrection);
}

export async function reviewCorrectionRequest(id, decision, reviewerNote = '') {
  await delay();

  store.corrections = store.corrections.map((item) => (
    item.id === id
      ? { ...item, status: decision, reviewer_note: reviewerNote }
      : item
  ));

  writeStore(store);
  return clone(store.corrections.find((item) => item.id === id));
}

export async function saveGeoSetting(nextGeoSetting) {
  await delay();
  store.geoSetting = {
    ...store.geoSetting,
    ...nextGeoSetting,
    latitude: Number(nextGeoSetting.latitude),
    longitude: Number(nextGeoSetting.longitude),
    radius: Number(nextGeoSetting.radius),
  };
  writeStore(store);
  return clone(store.geoSetting);
}

export async function updateBiometricDevice(deviceId) {
  await delay(120);
  store.devices = store.devices.map((device) => (
    device.id === deviceId
      ? {
          ...device,
          status: device.status === 'Online' ? 'Offline' : 'Online',
          last_sync: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
        }
      : device
  ));
  writeStore(store);
  return clone(store.devices.find((device) => device.id === deviceId));
}

function buildExportRows(records, employees) {
  return records.map((record) => {
    const employee = employees.find((item) => item.id === record.employee_id);
    return {
      Name: employee?.name || '-',
      Department: employee?.department || '-',
      Position: employee?.position || '-',
      Date: record.date,
      'Check In': record.check_in,
      'Check Out': record.check_out,
      Status: record.status,
      Method: record.method,
      Location: formatLocation(record.latitude, record.longitude),
      Offline: record.is_offline ? 'Yes' : 'No',
      Biometric: record.biometric_status || '-',
    };
  });
}

export async function exportAttendanceCsv(records, employees) {
  await delay(80);
  const rows = buildExportRows(records, employees);
  const header = Object.keys(rows[0] || {
    Name: '',
    Department: '',
    Position: '',
    Date: '',
    'Check In': '',
    'Check Out': '',
    Status: '',
    Method: '',
    Location: '',
    Offline: '',
    Biometric: '',
  });

  const csv = [
    header.join(','),
    ...rows.map((row) => header.map((column) => `"${String(row[column] || '').replaceAll('"', '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'attendance-report.csv');
}

export async function exportAttendanceExcel(records, employees) {
  await delay(80);
  const rows = buildExportRows(records, employees);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
  const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'attendance-report.xlsx');
}