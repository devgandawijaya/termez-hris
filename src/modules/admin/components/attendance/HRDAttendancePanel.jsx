import React, { useMemo, useState } from 'react';
import { Download, FileSpreadsheet, Radar, RefreshCcw, Settings2, ShieldCheck } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import {
  AttendanceMap,
  AttendanceSectionCard,
  AttendanceStatusBadge,
  SortButton,
  SummaryTile,
} from './AttendanceShared';

const inputClassName = 'rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100';

function sortRows(rows, sortField, sortDirection) {
  return [...rows].sort((left, right) => {
    const leftValue = String(left.employee?.name || left[sortField] || '');
    const rightValue = String(right.employee?.name || right[sortField] || '');
    const comparison = leftValue.localeCompare(rightValue);
    return sortDirection === 'asc' ? comparison : comparison * -1;
  });
}

export default function HRDAttendancePanel({ vm }) {
  const [sortField, setSortField] = useState('employee');
  const [sortDirection, setSortDirection] = useState('asc');

  const sortedAttendance = useMemo(() => {
    if (sortField === 'employee') {
      return [...vm.filteredAttendanceForHrd].sort((left, right) => {
        const comparison = String(left.employee?.name || '').localeCompare(String(right.employee?.name || ''));
        return sortDirection === 'asc' ? comparison : comparison * -1;
      });
    }

    return sortRows(vm.filteredAttendanceForHrd, sortField, sortDirection);
  }, [sortDirection, sortField, vm.filteredAttendanceForHrd]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortField(field);
    setSortDirection('asc');
  };

  const departmentChartData = useMemo(() => vm.filterOptions.departments.map((department) => ({
    name: department,
    total: vm.filteredAttendanceForHrd.filter((item) => item.employee?.department === department && item.check_in !== '-').length,
  })), [vm.filterOptions.departments, vm.filteredAttendanceForHrd]);

  const methodChartData = useMemo(() => ['GPS', 'Biometric', 'Offline'].map((method) => ({
    name: method,
    value: vm.filteredAttendanceForHrd.filter((item) => item.method === method).length,
  })), [vm.filteredAttendanceForHrd]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SummaryTile label="Total Hadir" value={vm.monitoringSummary.present} helper="Employee hadir sesuai filter" tone="emerald" />
        <SummaryTile label="Telat" value={vm.monitoringSummary.late} helper="Attendance berstatus Late" tone="rose" />
        <SummaryTile label="Tidak Hadir" value={vm.monitoringSummary.absent} helper="Belum ada check-in pada tanggal tersebut" tone="amber" />
      </div>

      <AttendanceSectionCard title="Monitoring Dashboard" description="HRD dapat memonitor attendance per tanggal dan departemen, lalu langsung export data untuk reporting."
        actions={(
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={vm.exportCsv} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <Download className="h-4 w-4" />
              <span>CSV</span>
            </button>
            <button type="button" onClick={vm.exportExcel} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Excel</span>
            </button>
          </div>
        )}
      >
        <div className="mb-5 grid gap-3 xl:grid-cols-4">
          <input type="date" value={vm.hrdFilters.date} onChange={(event) => vm.setHrdFilters((current) => ({ ...current, date: event.target.value }))} className={inputClassName} />
          <select value={vm.hrdFilters.department} onChange={(event) => vm.setHrdFilters((current) => ({ ...current, department: event.target.value }))} className={inputClassName}>
            <option value="">All Department</option>
            {vm.filterOptions.departments.map((department) => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>
          <input type="text" value={vm.hrdFilters.search} onChange={(event) => vm.setHrdFilters((current) => ({ ...current, search: event.target.value }))} placeholder="Cari nama / status / metode" className={inputClassName} />
          <button type="button" onClick={vm.loadSnapshot} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            <RefreshCcw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900"><Radar className="h-4 w-4 text-sky-600" /> Attendance by Department</div>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={departmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#0f766e" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Attendance Method Mix</div>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={methodChartData} dataKey="value" nameKey="name" innerRadius={64} outerRadius={92} paddingAngle={4}>
                    {methodChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.name === 'GPS' ? '#0ea5e9' : entry.name === 'Biometric' ? '#10b981' : '#f59e0b'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </AttendanceSectionCard>

      <AttendanceSectionCard title="Table All Attendance" description="Tabel attendance semua karyawan dengan sorting, search, status badge, dan detail lokasi.">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3"><SortButton label="Nama" field="employee" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} /></th>
                <th className="pb-3">Department</th>
                <th className="pb-3"><SortButton label="Check In" field="check_in" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} /></th>
                <th className="pb-3"><SortButton label="Check Out" field="check_out" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} /></th>
                <th className="pb-3"><SortButton label="Status" field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} /></th>
                <th className="pb-3"><SortButton label="Method" field="method" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} /></th>
                <th className="pb-3">Lokasi</th>
              </tr>
            </thead>
            <tbody>
              {sortedAttendance.map((row) => (
                <tr key={`${row.id}-${row.employee_id}`} className="border-b border-slate-100 text-slate-700">
                  <td className="py-4">
                    <div className="font-semibold text-slate-900">{row.employee?.name || '-'}</div>
                    <div className="text-xs text-slate-500">{row.employee?.position || '-'}</div>
                  </td>
                  <td className="py-4">{row.employee?.department || '-'}</td>
                  <td className="py-4">{row.check_in}</td>
                  <td className="py-4">{row.check_out}</td>
                  <td className="py-4"><AttendanceStatusBadge value={row.status} /></td>
                  <td className="py-4">{row.method}</td>
                  <td className="py-4 text-xs">{typeof row.latitude === 'number' ? `${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AttendanceSectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AttendanceSectionCard title="Approval Correction" description="HRD dapat melakukan approve atau reject terhadap request correction yang masuk.">
          <div className="space-y-3">
            {vm.visibleCorrections.length ? vm.visibleCorrections.map((request) => (
              <div key={request.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{request.employee?.name || '-'} • {request.date}</div>
                    <div className="mt-1 text-sm text-slate-600">{request.reason}</div>
                    {request.reviewer_note ? <div className="mt-2 text-xs text-slate-500">Catatan: {request.reviewer_note}</div> : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <AttendanceStatusBadge value={request.status} />
                    {request.status === 'Pending' ? (
                      <>
                        <button type="button" onClick={() => vm.handleCorrectionReview(request.id, 'Approved')} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700">Approve</button>
                        <button type="button" onClick={() => vm.handleCorrectionReview(request.id, 'Rejected')} className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700">Reject</button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                Tidak ada correction request.
              </div>
            )}
          </div>
        </AttendanceSectionCard>

        <AttendanceSectionCard title="Geo-Fencing Setting" description="Atur koordinat office dan radius valid attendance.">
          <div className="grid gap-3">
            <input type="text" value={vm.geoSettingForm.office_name} onChange={(event) => vm.setGeoSettingForm((current) => ({ ...current, office_name: event.target.value }))} placeholder="Office Name" className={inputClassName} />
            <div className="grid gap-3 md:grid-cols-2">
              <input type="number" step="0.0001" value={vm.geoSettingForm.latitude} onChange={(event) => vm.setGeoSettingForm((current) => ({ ...current, latitude: event.target.value }))} placeholder="Latitude" className={inputClassName} />
              <input type="number" step="0.0001" value={vm.geoSettingForm.longitude} onChange={(event) => vm.setGeoSettingForm((current) => ({ ...current, longitude: event.target.value }))} placeholder="Longitude" className={inputClassName} />
            </div>
            <input type="number" min="10" value={vm.geoSettingForm.radius} onChange={(event) => vm.setGeoSettingForm((current) => ({ ...current, radius: event.target.value }))} placeholder="Radius (meter)" className={inputClassName} />
            <button type="button" onClick={vm.saveGeoFence} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              <Settings2 className="h-4 w-4" />
              <span>Save Geo-Fence</span>
            </button>
          </div>
        </AttendanceSectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AttendanceSectionCard title="Device / Biometric Monitoring" description="Monitoring status perangkat fingerprint, face recognition, dan mobile sync gateway.">
          <div className="space-y-3">
            {vm.devices.map((device) => (
              <div key={device.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{device.name}</div>
                    <div className="mt-1 text-sm text-slate-600">{device.type}</div>
                    <div className="mt-1 text-xs text-slate-500">Last sync: {device.last_sync}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AttendanceStatusBadge value={device.status} />
                    <button type="button" onClick={() => vm.toggleDevice(device.id)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">Toggle</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AttendanceSectionCard>

        <AttendanceMap geoSetting={vm.geoSetting} records={vm.mapRecords} title="Attendance Location Monitoring" />
      </div>
    </div>
  );
}