/**
 * Employee Self Service Service
 * Provides mock ESS data with local persistence so the module can be used
 * before the backend endpoints are available.
 */

import { saveAs } from 'file-saver';

const STORAGE_KEY_PREFIX = 'termez-employee-self-service-store';
const DEFAULT_PASSWORD = 'Password123!';

const wait = (duration = 250) => new Promise((resolve) => setTimeout(resolve, duration));

const clone = (value) => JSON.parse(JSON.stringify(value));

const createId = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

const formatDate = (date) => date.toISOString().split('T')[0];

const formatTime = (date) => date.toTimeString().slice(0, 5);

const calculateDayCount = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};

const getStoredUser = () => {
  try {
    const rawUser = sessionStorage.getItem('user');
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    return null;
  }
};

const getUserStorageKey = () => {
  const sessionUser = getStoredUser();
  const identity = sessionUser?.employeeId || sessionUser?.nik || sessionUser?.username || sessionUser?.email || 'default';
  return `${STORAGE_KEY_PREFIX}-${identity}`;
};

const resetAttendanceState = (store) => {
  const today = formatDate(new Date());
  const todayAttendance = store.attendance.find((item) => item.date === today);

  return {
    ...store,
    attendanceState: {
      checkedIn: Boolean(todayAttendance?.checkIn && todayAttendance.checkIn !== '-'),
      checkedOut: Boolean(todayAttendance?.checkOut && todayAttendance.checkOut !== '-'),
    },
  };
};

const createAttendanceRecords = () => {
  const base = new Date('2026-04-07T08:30:00');
  return Array.from({ length: 16 }, (_, index) => {
    const current = new Date(base);
    current.setDate(base.getDate() - index);

    const statusPool = ['Hadir', 'Hadir', 'Hadir', 'Terlambat', 'Izin', 'Alpha'];
    const status = statusPool[index % statusPool.length];
    const date = formatDate(current);

    if (status === 'Izin') {
      return {
        id: createId('ATT'),
        date,
        checkIn: '-',
        checkOut: '-',
        workHours: 0,
        status,
        note: 'Izin keluarga',
      };
    }

    if (status === 'Alpha') {
      return {
        id: createId('ATT'),
        date,
        checkIn: '-',
        checkOut: '-',
        workHours: 0,
        status,
        note: 'Tidak ada presensi',
      };
    }

    const checkInHour = status === 'Terlambat' ? 9 : 8;
    const checkInMinute = status === 'Terlambat' ? 18 : 5 + (index % 4) * 5;
    const checkOutHour = 17;
    const checkOutMinute = 5 + (index % 3) * 10;
    const workHours = Number((8 + (checkOutMinute - checkInMinute) / 60).toFixed(1));

    return {
      id: createId('ATT'),
      date,
      checkIn: `${String(checkInHour).padStart(2, '0')}:${String(checkInMinute).padStart(2, '0')}`,
      checkOut: `${String(checkOutHour).padStart(2, '0')}:${String(checkOutMinute).padStart(2, '0')}`,
      workHours,
      status,
      note: status === 'Terlambat' ? 'Masuk lewat dari jam kerja' : 'Presensi normal',
    };
  });
};

const createPayrolls = () => {
  const periods = ['2026-04', '2026-03', '2026-02', '2026-01', '2025-12', '2025-11'];
  return periods.map((period, index) => {
    const basicSalary = 12000000;
    const mealAllowance = 850000;
    const transportAllowance = 1200000;
    const communicationAllowance = 350000;
    const taxDeduction = 625000 + index * 15000;
    const bpjsDeduction = 220000;
    const loanDeduction = index === 0 ? 0 : 150000;
    const totalAllowance = mealAllowance + transportAllowance + communicationAllowance;
    const totalDeduction = taxDeduction + bpjsDeduction + loanDeduction;

    return {
      id: createId('PAY'),
      period,
      periodLabel: new Date(`${period}-01T00:00:00`).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      }),
      basicSalary,
      allowances: [
        { label: 'Tunjangan Makan', amount: mealAllowance },
        { label: 'Tunjangan Transport', amount: transportAllowance },
        { label: 'Tunjangan Komunikasi', amount: communicationAllowance },
      ],
      deductions: [
        { label: 'PPh 21', amount: taxDeduction },
        { label: 'BPJS', amount: bpjsDeduction },
        { label: 'Potongan Pinjaman', amount: loanDeduction },
      ],
      takeHomePay: basicSalary + totalAllowance - totalDeduction,
      generatedAt: `${period}-25T10:00:00Z`,
    };
  });
};

const createInitialStore = () => {
  const sessionUser = getStoredUser();
  const fullName = sessionUser?.full_name || sessionUser?.fullName || 'Budi Santoso';
  const email = sessionUser?.email || 'budi.santoso@termez.id';

  return {
    profile: {
      fullName,
      employeeId: sessionUser?.employeeId || 'EMP1007',
      nik: sessionUser?.nik || '3174091201900001',
      email,
      phone: '+62 812 9000 7788',
      address: 'Jl. HRIS Terpadu No. 18, Jakarta Selatan',
      birthPlace: 'Bandung',
      birthDate: '1990-01-12',
      gender: 'Laki-laki',
      maritalStatus: 'Menikah',
      emergencyContact: 'Siti Santoso - +62 811 1111 2233',
      joinDate: '2021-07-01',
      division: 'Human Capital',
      department: 'People Operations',
      position: 'HR Business Partner',
      manager: 'Rina Kurniawati',
      workLocation: 'Jakarta HQ',
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
      canUploadPersonalDocuments: true,
    },
      password: DEFAULT_PASSWORD,
      attendanceState: {
        checkedIn: false,
        checkedOut: false,
      },
      attendance: createAttendanceRecords(),
      leaveBalance: [
        { id: 'annual', type: 'Tahunan', remaining: 8, quota: 12, unit: 'hari' },
        { id: 'sick', type: 'Sakit', remaining: 6, quota: 12, unit: 'hari' },
        { id: 'permission', type: 'Izin', remaining: 3, quota: 6, unit: 'hari' },
      ],
      leaveRequests: [
        {
          id: createId('LV'),
          type: 'Tahunan',
          startDate: '2026-03-22',
          endDate: '2026-03-24',
          dayCount: 3,
          reason: 'Liburan keluarga',
          status: 'Disetujui',
          submittedAt: '2026-03-10T08:30:00Z',
        },
        {
          id: createId('LV'),
          type: 'Izin',
          startDate: '2026-04-11',
          endDate: '2026-04-11',
          dayCount: 1,
          reason: 'Keperluan administrasi',
          status: 'Pending',
          submittedAt: '2026-04-05T13:15:00Z',
        },
      ],
      payrolls: createPayrolls(),
      claims: [
        {
          id: createId('CLM'),
          title: 'Klaim Transport Meeting Vendor',
          category: 'Transport',
          amount: 275000,
          date: '2026-03-19',
          notes: 'Perjalanan ke kantor vendor di BSD',
          evidenceName: 'struk-tol-dan-parkir.jpg',
          status: 'Disetujui',
          submittedAt: '2026-03-19T15:20:00Z',
        },
        {
          id: createId('CLM'),
          title: 'Klaim Medical Checkup',
          category: 'Kesehatan',
          amount: 450000,
          date: '2026-04-03',
          notes: 'General checkup tahunan',
          evidenceName: 'kwitansi-klinik.pdf',
          status: 'Pending',
          submittedAt: '2026-04-03T10:10:00Z',
        },
      ],
      documents: [
        {
          id: createId('DOC'),
          name: 'Kontrak Kerja 2026',
          category: 'Kontrak',
          fileName: 'kontrak-kerja-2026.txt',
          uploadedAt: '2026-01-02T09:15:00Z',
          source: 'Perusahaan',
          mimeType: 'text/plain;charset=utf-8',
          content: 'Dokumen kontrak kerja karyawan PT Termez Indonesia periode 2026.',
        },
        {
          id: createId('DOC'),
          name: 'NDA dan Kebijakan Keamanan',
          category: 'NDA',
          fileName: 'nda-termez.txt',
          uploadedAt: '2025-12-12T11:00:00Z',
          source: 'Perusahaan',
          mimeType: 'text/plain;charset=utf-8',
          content: 'Dokumen non-disclosure agreement dan kebijakan keamanan data perusahaan.',
        },
      ],
      notifications: [
        {
          id: createId('NTF'),
          title: 'Pengajuan cuti disetujui',
          message: 'Pengajuan cuti tahunan Anda untuk 22-24 Maret telah disetujui.',
          type: 'Persetujuan cuti',
          createdAt: '2026-03-12T09:20:00Z',
          isRead: false,
        },
        {
          id: createId('NTF'),
          title: 'Slip gaji tersedia',
          message: 'Slip gaji April 2026 sudah dapat diunduh.',
          type: 'Slip gaji tersedia',
          createdAt: '2026-04-01T08:00:00Z',
          isRead: false,
        },
        {
          id: createId('NTF'),
          title: 'Town hall bulanan',
          message: 'Town hall bulanan akan dilaksanakan pada 12 April 2026 pukul 10.00 WIB.',
          type: 'Pengumuman perusahaan',
          createdAt: '2026-04-06T07:45:00Z',
          isRead: true,
        },
      ],
      announcements: [
        {
          id: createId('ANN'),
          title: 'Penyesuaian Kebijakan Work From Anywhere',
          summary: 'Perusahaan memperbarui kuota WFA untuk kuartal kedua 2026.',
          content: 'Mulai 15 April 2026, setiap karyawan dapat mengajukan hingga 6 hari work from anywhere per bulan dengan persetujuan atasan langsung. Pengajuan dilakukan maksimal H-2 melalui ESS.',
          createdAt: '2026-04-05T09:00:00Z',
          author: 'Human Capital',
        },
        {
          id: createId('ANN'),
          title: 'Jadwal Medical Checkup Tahunan',
          summary: 'Medical checkup tahunan dimulai pekan ketiga April.',
          content: 'Medical checkup tahunan akan dilakukan pada 18-23 April 2026 di Klinik Sehat Sentosa. Jadwal per divisi akan diinformasikan oleh PIC masing-masing. Klaim reimbursement untuk pemeriksaan tambahan mengikuti kebijakan benefit yang berlaku.',
          createdAt: '2026-04-02T14:10:00Z',
          author: 'People Operations',
        },
      ],
      approvals: [
        {
          id: createId('APR'),
          employeeName: 'Dina Maharani',
          type: 'leave_request',
          title: 'Cuti Tahunan - 2 Hari',
          submittedAt: '2026-04-06T09:40:00Z',
          reason: 'Acara keluarga di luar kota',
          status: 'Pending',
        },
        {
          id: createId('APR'),
          employeeName: 'Rizal Firmansyah',
          type: 'claim_request',
          title: 'Klaim Transport Client Visit',
          submittedAt: '2026-04-04T16:00:00Z',
          reason: 'Biaya tol dan parkir kunjungan klien',
          status: 'Pending',
        },
      ],
    };
};

let essStore = null;

const getStore = () => {
  if (essStore) {
    return essStore;
  }

  const storageKey = getUserStorageKey();

  try {
    const rawStore = localStorage.getItem(storageKey);
    if (rawStore) {
      essStore = resetAttendanceState(JSON.parse(rawStore));
      localStorage.setItem(storageKey, JSON.stringify(essStore));
      return essStore;
    }

    const legacyStore = localStorage.getItem(STORAGE_KEY_PREFIX);
    if (legacyStore) {
      essStore = resetAttendanceState(JSON.parse(legacyStore));
      localStorage.setItem(storageKey, JSON.stringify(essStore));
      localStorage.removeItem(STORAGE_KEY_PREFIX);
      return essStore;
    }
  } catch {
    // Ignore storage read failures and recreate data.
  }

  essStore = resetAttendanceState(createInitialStore());
  localStorage.setItem(storageKey, JSON.stringify(essStore));
  return essStore;
};

const persistStore = (nextStore) => {
  const normalizedStore = resetAttendanceState(nextStore);
  essStore = normalizedStore;
  localStorage.setItem(getUserStorageKey(), JSON.stringify(normalizedStore));
  return essStore;
};

const createSuccess = (data, message) => ({ success: true, data, message });

const createFailure = (message) => ({ success: false, data: null, message });

const syncSessionUser = (profile) => {
  try {
    const sessionUser = getStoredUser() || {};
    sessionStorage.setItem(
      'user',
      JSON.stringify({
        ...sessionUser,
        full_name: profile.fullName,
        fullName: profile.fullName,
        nik: profile.nik,
        email: profile.email,
        photo: profile.photo,
        employeeId: profile.employeeId,
      }),
    );
  } catch {
    // Ignore session sync issues on demo data.
  }
};

export async function getEmployeeSelfServiceData() {
  await wait();
  return createSuccess(clone(getStore()), 'ESS data berhasil dimuat');
}

export async function updateEmployeeProfile(payload) {
  await wait();

  if (!payload.fullName?.trim()) {
    return createFailure('Nama lengkap wajib diisi');
  }

  if (!payload.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return createFailure('Format email tidak valid');
  }

  if (!payload.phone?.trim()) {
    return createFailure('Nomor HP wajib diisi');
  }

  if (!payload.address?.trim()) {
    return createFailure('Alamat wajib diisi');
  }

  const store = getStore();
  const nextStore = persistStore({
    ...store,
    profile: {
      ...store.profile,
      ...payload,
      fullName: payload.fullName.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      address: payload.address.trim(),
    },
  });

  syncSessionUser(nextStore.profile);
  return createSuccess(clone(nextStore.profile), 'Profil berhasil diperbarui');
}

export async function updateEmployeePassword({ currentPassword, newPassword, confirmPassword }) {
  await wait();
  const store = getStore();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return createFailure('Semua field password wajib diisi');
  }

  if (currentPassword !== store.password) {
    return createFailure('Password saat ini tidak sesuai');
  }

  if (newPassword.length < 8) {
    return createFailure('Password baru minimal 8 karakter');
  }

  if (newPassword !== confirmPassword) {
    return createFailure('Konfirmasi password tidak sama');
  }

  persistStore({
    ...store,
    password: newPassword,
  });

  return createSuccess(true, 'Password berhasil diubah');
}

export async function updateProfilePhoto(photo) {
  await wait();

  if (!photo) {
    return createFailure('Foto profil tidak boleh kosong');
  }

  const store = getStore();
  const nextStore = persistStore({
    ...store,
    profile: {
      ...store.profile,
      photo,
    },
  });

  syncSessionUser(nextStore.profile);
  return createSuccess(clone(nextStore.profile), 'Foto profil berhasil diperbarui');
}

export async function submitAttendanceAction(action) {
  await wait();
  const store = getStore();
  const today = formatDate(new Date());
  const todayIndex = store.attendance.findIndex((item) => item.date === today);
  const now = new Date();

  if (action === 'check-in') {
    if (todayIndex >= 0 && store.attendance[todayIndex].checkIn !== '-') {
      return createFailure('Anda sudah melakukan check-in hari ini');
    }

    const isLate = formatTime(now) > '09:05';
    const record = {
      id: createId('ATT'),
      date: today,
      checkIn: formatTime(now),
      checkOut: '-',
      workHours: 0,
      status: isLate ? 'Terlambat' : 'Hadir',
      note: isLate ? 'Check-in melewati jam kerja' : 'Check-in berhasil',
    };

    const nextAttendance = todayIndex >= 0
      ? store.attendance.map((item, index) => (index === todayIndex ? record : item))
      : [record, ...store.attendance];

    persistStore({
      ...store,
      attendance: nextAttendance,
      attendanceState: {
        checkedIn: true,
        checkedOut: false,
      },
    });

    return createSuccess(record, 'Check-in berhasil');
  }

  if (todayIndex < 0 || store.attendance[todayIndex].checkIn === '-') {
    return createFailure('Lakukan check-in terlebih dahulu sebelum check-out');
  }

  if (store.attendance[todayIndex].checkOut !== '-') {
    return createFailure('Anda sudah melakukan check-out hari ini');
  }

  const checkInParts = store.attendance[todayIndex].checkIn.split(':').map(Number);
  const checkInDate = new Date(now);
  checkInDate.setHours(checkInParts[0], checkInParts[1], 0, 0);
  const workHours = Number(((now.getTime() - checkInDate.getTime()) / (1000 * 60 * 60)).toFixed(1));

  const updatedRecord = {
    ...store.attendance[todayIndex],
    checkOut: formatTime(now),
    workHours: workHours > 0 ? workHours : 0,
    note: 'Check-out berhasil',
  };

  persistStore({
    ...store,
    attendance: store.attendance.map((item, index) => (index === todayIndex ? updatedRecord : item)),
    attendanceState: {
      checkedIn: true,
      checkedOut: true,
    },
  });

  return createSuccess(updatedRecord, 'Check-out berhasil');
}

export async function submitLeaveRequest(payload) {
  await wait();

  if (!payload.type || !payload.startDate || !payload.endDate || !payload.reason?.trim()) {
    return createFailure('Lengkapi semua field pengajuan cuti');
  }

  if (payload.endDate < payload.startDate) {
    return createFailure('Tanggal selesai tidak boleh lebih kecil dari tanggal mulai');
  }

  const dayCount = calculateDayCount(payload.startDate, payload.endDate);
  const store = getStore();
  const request = {
    id: createId('LV'),
    type: payload.type,
    startDate: payload.startDate,
    endDate: payload.endDate,
    dayCount,
    reason: payload.reason.trim(),
    status: 'Pending',
    submittedAt: new Date().toISOString(),
  };

  persistStore({
    ...store,
    leaveRequests: [request, ...store.leaveRequests],
    notifications: [
      {
        id: createId('NTF'),
        title: 'Pengajuan cuti berhasil dikirim',
        message: `Pengajuan ${payload.type.toLowerCase()} Anda sedang menunggu persetujuan.`,
        type: 'Persetujuan cuti',
        createdAt: new Date().toISOString(),
        isRead: false,
      },
      ...store.notifications,
    ],
  });

  return createSuccess(request, 'Pengajuan cuti berhasil dikirim');
}

export async function submitClaim(payload) {
  await wait();

  if (!payload.title?.trim() || !payload.category || !payload.amount || !payload.date) {
    return createFailure('Lengkapi semua field klaim');
  }

  if (Number(payload.amount) <= 0) {
    return createFailure('Nominal klaim harus lebih besar dari 0');
  }

  const store = getStore();
  const claim = {
    id: createId('CLM'),
    title: payload.title.trim(),
    category: payload.category,
    amount: Number(payload.amount),
    date: payload.date,
    notes: payload.notes?.trim() || '-',
    evidenceName: payload.evidenceName || 'tanpa-bukti.txt',
    status: 'Pending',
    submittedAt: new Date().toISOString(),
  };

  persistStore({
    ...store,
    claims: [claim, ...store.claims],
  });

  return createSuccess(claim, 'Pengajuan klaim berhasil disimpan');
}

export async function uploadPersonalDocument(payload) {
  await wait();

  if (!payload.name?.trim() || !payload.category) {
    return createFailure('Nama dokumen dan kategori wajib diisi');
  }

  const store = getStore();
  if (!store.profile.canUploadPersonalDocuments) {
    return createFailure('Upload dokumen pribadi tidak diizinkan untuk akun ini');
  }

  const document = {
    id: createId('DOC'),
    name: payload.name.trim(),
    category: payload.category,
    fileName: payload.fileName || 'dokumen-pribadi.txt',
    uploadedAt: new Date().toISOString(),
    source: 'Karyawan',
    mimeType: 'text/plain;charset=utf-8',
    content: payload.content || `Dokumen pribadi ${payload.name.trim()} diunggah melalui ESS.`,
  };

  persistStore({
    ...store,
    documents: [document, ...store.documents],
  });

  return createSuccess(document, 'Dokumen pribadi berhasil diunggah');
}

export async function toggleNotificationRead(id) {
  await wait(120);
  const store = getStore();
  const nextNotifications = store.notifications.map((item) => (
    item.id === id ? { ...item, isRead: !item.isRead } : item
  ));

  persistStore({
    ...store,
    notifications: nextNotifications,
  });

  return createSuccess(true, 'Status notifikasi diperbarui');
}

export async function markAllNotificationsRead() {
  await wait(120);
  const store = getStore();
  persistStore({
    ...store,
    notifications: store.notifications.map((item) => ({ ...item, isRead: true })),
  });

  return createSuccess(true, 'Semua notifikasi ditandai sudah dibaca');
}

export async function processApproval(id, decision, note) {
  await wait();

  if (!['Disetujui', 'Ditolak'].includes(decision)) {
    return createFailure('Keputusan approval tidak valid');
  }

  const store = getStore();
  const approval = store.approvals.find((item) => item.id === id);
  if (!approval) {
    return createFailure('Data approval tidak ditemukan');
  }

  const nextApprovals = store.approvals.map((item) => (
    item.id === id
      ? {
          ...item,
          status: decision,
          reviewerNote: note?.trim() || '-',
          processedAt: new Date().toISOString(),
        }
      : item
  ));

  const nextNotifications = [
    {
      id: createId('NTF'),
      title: `${approval.title} ${decision.toLowerCase()}`,
      message: `${approval.employeeName} menerima keputusan ${decision.toLowerCase()} untuk ${approval.title.toLowerCase()}.`,
      type: 'Persetujuan cuti',
      createdAt: new Date().toISOString(),
      isRead: false,
    },
    ...store.notifications,
  ];

  persistStore({
    ...store,
    approvals: nextApprovals,
    notifications: nextNotifications,
  });

  return createSuccess(true, `Approval berhasil ${decision.toLowerCase()}`);
}

export async function downloadPayslipPdf(payrollId) {
  await wait(120);
  const store = getStore();
  const payroll = store.payrolls.find((item) => item.id === payrollId);

  if (!payroll) {
    return createFailure('Slip gaji tidak ditemukan');
  }

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  let yPosition = 20;

  doc.setFontSize(18);
  doc.text('Slip Gaji Karyawan', 14, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.text(`Nama: ${store.profile.fullName}`, 14, yPosition);
  yPosition += 7;
  doc.text(`NIK: ${store.profile.nik}`, 14, yPosition);
  yPosition += 7;
  doc.text(`Periode: ${payroll.periodLabel}`, 14, yPosition);
  yPosition += 12;

  doc.setFontSize(12);
  doc.text(`Gaji Pokok: Rp ${payroll.basicSalary.toLocaleString('id-ID')}`, 14, yPosition);
  yPosition += 10;

  doc.text('Tunjangan', 14, yPosition);
  yPosition += 8;
  payroll.allowances.forEach((item) => {
    doc.text(`- ${item.label}: Rp ${item.amount.toLocaleString('id-ID')}`, 18, yPosition);
    yPosition += 7;
  });

  yPosition += 3;
  doc.text('Potongan', 14, yPosition);
  yPosition += 8;
  payroll.deductions.forEach((item) => {
    doc.text(`- ${item.label}: Rp ${item.amount.toLocaleString('id-ID')}`, 18, yPosition);
    yPosition += 7;
  });

  yPosition += 6;
  doc.setFontSize(13);
  doc.text(`Take Home Pay: Rp ${payroll.takeHomePay.toLocaleString('id-ID')}`, 14, yPosition);

  saveAs(doc.output('blob'), `slip-gaji-${payroll.period}.pdf`);
  return createSuccess(true, 'Slip gaji berhasil diunduh');
}

export async function downloadDocument(documentId) {
  await wait(120);
  const store = getStore();
  const document = store.documents.find((item) => item.id === documentId);

  if (!document) {
    return createFailure('Dokumen tidak ditemukan');
  }

  const blob = new Blob([document.content || document.name], {
    type: document.mimeType || 'text/plain;charset=utf-8',
  });
  saveAs(blob, document.fileName || `${document.name}.txt`);

  return createSuccess(true, 'Dokumen berhasil diunduh');
}

export default {
  getEmployeeSelfServiceData,
  updateEmployeeProfile,
  updateEmployeePassword,
  updateProfilePhoto,
  submitAttendanceAction,
  submitLeaveRequest,
  submitClaim,
  uploadPersonalDocument,
  toggleNotificationRead,
  markAllNotificationsRead,
  processApproval,
  downloadPayslipPdf,
  downloadDocument,
};