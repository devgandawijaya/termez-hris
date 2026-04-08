import React from 'react';

import EmployeeAttendancePanel from '../components/attendance/EmployeeAttendancePanel';
import HRDAttendancePanel from '../components/attendance/HRDAttendancePanel';
import { AttendanceToast, NetworkBadge } from '../components/attendance/AttendanceShared';
import useAttendanceManagementViewModel from '../viewmodels/useAttendanceManagementViewModel';

export default function AttendanceManagementPage() {
  const vm = useAttendanceManagementViewModel();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_30%),linear-gradient(180deg,_#f7fbff_0%,_#f8fafc_100%)] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.4)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <nav className="text-sm text-slate-500">
                <span>Admin</span> {'>'} <span>Mega Menu</span> {'>'} <span>Attendance Time Management</span> {'>'} <span className="font-semibold text-slate-700">Attendance Absensi Online Offline GPS Biometric</span>
              </nav>
              <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Attendance Absensi Online Offline GPS Biometric</h1>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 md:text-base">
                Workspace attendance end-to-end untuk user dan HRD: GPS attendance, offline sync, biometric simulation, correction approval, geo-fencing, monitoring device, reporting, dan export data.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => vm.setDemoRole('user')}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${vm.demoRole === 'user' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white'}`}
                >
                  User View
                </button>
                <button
                  type="button"
                  onClick={() => vm.setDemoRole('hrd')}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${vm.demoRole === 'hrd' ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-white'}`}
                >
                  HRD View
                </button>
              </div>

              <select value={vm.demoEmployeeId} onChange={(event) => vm.setDemoEmployeeId(Number(event.target.value))} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                {vm.employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>{employee.name} • {employee.department}</option>
                ))}
              </select>

              <NetworkBadge isOnline={vm.isOnline} queueSize={vm.offlineQueue.length} syncingOffline={vm.syncingOffline} onSync={vm.syncOfflineQueue} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Role workspace</div>
              <div className="mt-3 text-lg font-semibold text-slate-950">{vm.demoRole === 'hrd' ? 'HRD monitoring and approval workspace' : 'Employee self attendance workspace'}</div>
              <div className="mt-2 text-sm text-slate-600">
                Role switch hanya untuk simulasi frontend dan tidak mengubah routing atau struktur menu yang sudah ada.
              </div>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-white p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Current employee</div>
              <div className="mt-3 text-lg font-semibold text-slate-950">{vm.currentEmployee?.name || '-'}</div>
              <div className="mt-2 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                <div>Department: <span className="font-semibold text-slate-900">{vm.currentEmployee?.department || '-'}</span></div>
                <div>Position: <span className="font-semibold text-slate-900">{vm.currentEmployee?.position || '-'}</span></div>
              </div>
            </div>
          </div>
        </div>

        {vm.error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{vm.error}</div> : null}

        {vm.loading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
            Memuat attendance management workspace...
          </div>
        ) : vm.demoRole === 'hrd' ? <HRDAttendancePanel vm={vm} /> : <EmployeeAttendancePanel vm={vm} />}
      </div>

      <AttendanceToast toast={vm.toast} />
    </div>
  );
}