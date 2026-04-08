import React, { useMemo, useState } from 'react';
import { Camera, Fingerprint, History, LogIn, LogOut, MapPinned, Send } from 'lucide-react';

import {
  AttendanceMap,
  AttendanceModal,
  AttendanceProgress,
  AttendanceSectionCard,
  AttendanceStatusBadge,
  SortButton,
  SummaryTile,
} from './AttendanceShared';

const inputClassName = 'rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100';

function sortRows(rows, sortField, sortDirection) {
  return [...rows].sort((left, right) => {
    const leftValue = String(left[sortField] ?? '');
    const rightValue = String(right[sortField] ?? '');
    const comparison = leftValue.localeCompare(rightValue);
    return sortDirection === 'asc' ? comparison : comparison * -1;
  });
}

export default function EmployeeAttendancePanel({ vm }) {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const canCheckIn = !vm.currentEmployeeTodayAttendance || vm.currentEmployeeTodayAttendance.check_in === '-';
  const canCheckOut = Boolean(vm.currentEmployeeTodayAttendance?.check_in && vm.currentEmployeeTodayAttendance.check_in !== '-' && vm.currentEmployeeTodayAttendance.check_out === '-');

  const sortedHistory = useMemo(() => sortRows(vm.employeeAttendanceHistory, sortField, sortDirection), [sortDirection, sortField, vm.employeeAttendanceHistory]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortField(field);
    setSortDirection('asc');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryTile label="On Time" value={vm.userSummary.onTime} helper="Attendance tepat waktu" tone="emerald" />
        <SummaryTile label="Late" value={vm.userSummary.late} helper="Check in lewat jam kerja" tone="rose" />
        <SummaryTile label="Early Leave" value={vm.userSummary.earlyLeave} helper="Pulang sebelum 17:00" tone="amber" />
        <SummaryTile label="Pending Correction" value={vm.userSummary.corrections} helper="Butuh review HRD" tone="sky" />
      </div>

      <AttendanceSectionCard
        title="Check In / Check Out"
        description="Lakukan attendance berbasis GPS atau biometric, lengkap dengan validasi radius kantor dan fallback offline queue."
        actions={(
          <div className="rounded-2xl border border-slate-200 bg-white p-1">
            {['GPS', 'Biometric'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => vm.setAttendanceMethod(method)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold ${vm.attendanceMethod === method ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {method}
              </button>
            ))}
          </div>
        )}
      >
        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Hari ini</div>
                  <div className="mt-3 text-2xl font-semibold text-slate-950">{vm.today}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Check In</div>
                  <div className="mt-3 text-2xl font-semibold text-slate-950">{vm.currentEmployeeTodayAttendance?.check_in || '-'}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Check Out</div>
                  <div className="mt-3 text-2xl font-semibold text-slate-950">{vm.currentEmployeeTodayAttendance?.check_out || '-'}</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <AttendanceStatusBadge value={vm.currentEmployeeTodayAttendance?.status || 'Idle'} />
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Metode: {vm.currentEmployeeTodayAttendance?.method || vm.attendanceMethod}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Radius office: {vm.geoSetting.radius}m
                </span>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => vm.handleAttendance('check-in')}
                disabled={!canCheckIn || Boolean(vm.attendanceActionLoading)}
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                <LogIn className="h-4 w-4" />
                <span>{vm.attendanceActionLoading === `${vm.attendanceMethod}-check-in` ? 'Memproses...' : 'Check In'}</span>
              </button>
              <button
                type="button"
                onClick={() => vm.handleAttendance('check-out')}
                disabled={!canCheckOut || Boolean(vm.attendanceActionLoading)}
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-rose-600 px-5 py-4 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
              >
                <LogOut className="h-4 w-4" />
                <span>{vm.attendanceActionLoading === `${vm.attendanceMethod}-check-out` ? 'Memproses...' : 'Check Out'}</span>
              </button>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Status lokasi attendance</div>
                  <div className="mt-1 text-sm text-slate-600">Absensi akan divalidasi terhadap koordinat office sebelum disimpan.</div>
                </div>
                <div className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  {vm.geoSetting.latitude}, {vm.geoSetting.longitude}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Biometric Verification</div>
                  <div className="mt-1 text-sm text-slate-600">Simulasi face recognition dan fingerprint untuk attendance biometric.</div>
                </div>
                <AttendanceStatusBadge value={vm.biometricState.status} />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <button type="button" onClick={() => vm.runBiometricVerification('Face Recognition')} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  <Camera className="h-4 w-4 text-sky-600" />
                  <span>Face Recognition</span>
                </button>
                <button type="button" onClick={() => vm.runBiometricVerification('Fingerprint')} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  <Fingerprint className="h-4 w-4 text-emerald-600" />
                  <span>Fingerprint</span>
                </button>
              </div>
              <div className="mt-5 space-y-4">
                <AttendanceProgress
                  label={vm.biometricState.mode}
                  progress={vm.biometricState.progress}
                  tone={vm.biometricState.status === 'Failed' ? 'rose' : vm.biometricState.status === 'Verifying' ? 'amber' : 'emerald'}
                />
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Hasil terakhir: <span className="font-semibold text-slate-900">{vm.biometricState.lastResult || 'Belum ada verifikasi'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white">
              <div className="text-sm font-semibold">Attendance Rules</div>
              <div className="mt-4 grid gap-3 text-sm text-slate-200 md:grid-cols-3">
                <div className="rounded-2xl bg-white/10 p-3">On Time jika check-in maksimal 08:00</div>
                <div className="rounded-2xl bg-white/10 p-3">Late jika check-in lebih dari 08:00</div>
                <div className="rounded-2xl bg-white/10 p-3">Early Leave jika check-out sebelum 17:00</div>
              </div>
            </div>
          </div>
        </div>
      </AttendanceSectionCard>

      <AttendanceSectionCard title="History Attendance" description="Riwayat attendance dapat difilter berdasarkan rentang tanggal, status, dan keyword. Semua tabel mendukung sorting.">
        <div className="mb-5 grid gap-3 lg:grid-cols-4">
          <input type="date" value={vm.historyFilters.startDate} onChange={(event) => vm.setHistoryFilters((current) => ({ ...current, startDate: event.target.value }))} className={inputClassName} />
          <input type="date" value={vm.historyFilters.endDate} onChange={(event) => vm.setHistoryFilters((current) => ({ ...current, endDate: event.target.value }))} className={inputClassName} />
          <select value={vm.historyFilters.status} onChange={(event) => vm.setHistoryFilters((current) => ({ ...current, status: event.target.value }))} className={inputClassName}>
            <option value="">All Status</option>
            {vm.filterOptions.statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <input type="text" value={vm.historyFilters.search} onChange={(event) => vm.setHistoryFilters((current) => ({ ...current, search: event.target.value }))} placeholder="Cari status / method / jam" className={inputClassName} />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3"><SortButton label="Tanggal" field="date" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} /></th>
                <th className="pb-3"><SortButton label="Check In" field="check_in" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} /></th>
                <th className="pb-3"><SortButton label="Check Out" field="check_out" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} /></th>
                <th className="pb-3"><SortButton label="Status" field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} /></th>
                <th className="pb-3"><SortButton label="Method" field="method" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} /></th>
                <th className="pb-3">Sync</th>
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((row) => (
                <tr key={`${row.id}-${row.date}`} className="border-b border-slate-100 text-slate-700">
                  <td className="py-4">{row.date}</td>
                  <td className="py-4">{row.check_in}</td>
                  <td className="py-4">{row.check_out}</td>
                  <td className="py-4"><AttendanceStatusBadge value={row.status} /></td>
                  <td className="py-4">{row.method}</td>
                  <td className="py-4">{row.pending_sync ? <AttendanceStatusBadge value="Offline" /> : row.is_offline ? 'Synced' : 'Realtime'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AttendanceSectionCard>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AttendanceSectionCard
          title="Request Correction"
          description="Ajukan koreksi attendance jika lupa check-in, check-out, atau perlu klarifikasi attendance offline."
          actions={(
            <button type="button" onClick={() => vm.setCorrectionOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              <Send className="h-4 w-4" />
              <span>New Request</span>
            </button>
          )}
        >
          <div className="space-y-3">
            {vm.employeeCorrections.length ? vm.employeeCorrections.map((request) => (
              <div key={request.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-900">{request.date}</div>
                  <AttendanceStatusBadge value={request.status} />
                </div>
                <div className="mt-2 text-sm text-slate-600">{request.reason}</div>
                {request.reviewer_note ? <div className="mt-2 text-xs text-slate-500">Catatan HRD: {request.reviewer_note}</div> : null}
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                Belum ada correction request.
              </div>
            )}
          </div>
        </AttendanceSectionCard>

        <AttendanceMap geoSetting={vm.geoSetting} records={vm.mapRecords.map((record) => ({ ...record, employee: vm.currentEmployee }))} title="Map View" />
      </div>

      <AttendanceModal
        open={vm.correctionOpen}
        title="Request Attendance Correction"
        description="Kirim permintaan koreksi untuk diperiksa HRD. Gunakan alasan yang jelas agar approval lebih cepat."
        onClose={() => vm.setCorrectionOpen(false)}
        footer={(
          <>
            <button type="button" onClick={() => vm.setCorrectionOpen(false)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>
            <button type="button" onClick={vm.submitCorrection} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Submit</button>
          </>
        )}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Tanggal</label>
            <input type="date" value={vm.correctionForm.date} onChange={(event) => vm.setCorrectionForm((current) => ({ ...current, date: event.target.value }))} className={`${inputClassName} w-full`} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Alasan</label>
            <textarea value={vm.correctionForm.reason} onChange={(event) => vm.setCorrectionForm((current) => ({ ...current, reason: event.target.value }))} rows={4} className={`${inputClassName} w-full resize-none`} placeholder="Contoh: Lupa check-in karena meeting client sejak pagi." />
          </div>
        </div>
      </AttendanceModal>
    </div>
  );
}