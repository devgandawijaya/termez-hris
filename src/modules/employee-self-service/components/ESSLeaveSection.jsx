import React, { useMemo, useState } from 'react';
import { CalendarPlus2, SendHorizontal } from 'lucide-react';
import { ESSSectionCard, ESSStatusBadge } from './ESSShared';
import { formatDate, formatDateTime } from './ESSSharedUtils';

const inputClassName = 'w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

export default function ESSLeaveSection({ leaveBalance, leaveRequests, actionLoading, onSubmitLeave }) {
  const [form, setForm] = useState({
    type: 'Tahunan',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});

  const pendingCount = useMemo(() => leaveRequests.filter((item) => item.status === 'Pending').length, [leaveRequests]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.startDate) {
      nextErrors.startDate = 'Tanggal mulai wajib diisi';
    }
    if (!form.endDate) {
      nextErrors.endDate = 'Tanggal selesai wajib diisi';
    }
    if (!form.reason.trim()) {
      nextErrors.reason = 'Alasan pengajuan wajib diisi';
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      nextErrors.endDate = 'Tanggal selesai harus sesudah tanggal mulai';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = await onSubmitLeave(form);
    if (result?.success) {
      setForm({ type: 'Tahunan', startDate: '', endDate: '', reason: '' });
      setErrors({});
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px,minmax(0,1fr)]">
      <ESSSectionCard title="Ajukan Cuti & Izin" description="Buat pengajuan cuti tahunan, sakit, atau izin melalui formulir ini.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Jenis Cuti</label>
            <select className={inputClassName} value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}>
              <option value="Tahunan">Tahunan</option>
              <option value="Sakit">Sakit</option>
              <option value="Izin">Izin</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tanggal Mulai</label>
            <input type="date" className={inputClassName} value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} />
            {errors.startDate ? <p className="mt-1 text-xs text-rose-600">{errors.startDate}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tanggal Selesai</label>
            <input type="date" className={inputClassName} value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} />
            {errors.endDate ? <p className="mt-1 text-xs text-rose-600">{errors.endDate}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Alasan</label>
            <textarea className={`${inputClassName} min-h-28`} value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} />
            {errors.reason ? <p className="mt-1 text-xs text-rose-600">{errors.reason}</p> : null}
          </div>
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
            <SendHorizontal className="h-4 w-4" />
            <span>{actionLoading === 'submit-leave' ? 'Mengirim...' : 'Kirim Pengajuan'}</span>
          </button>
        </form>
      </ESSSectionCard>

      <div className="space-y-6">
        <ESSSectionCard title="Saldo Cuti" description="Pantau sisa cuti yang masih tersedia untuk tiap kategori.">
          <div className="grid gap-4 md:grid-cols-3">
            {leaveBalance.map((item) => (
              <div key={item.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CalendarPlus2 className="h-4 w-4" />
                  <span>{item.type}</span>
                </div>
                <p className="mt-3 text-2xl font-semibold text-gray-900">{item.remaining} {item.unit}</p>
                <p className="mt-1 text-xs text-gray-500">Kuota {item.quota} {item.unit}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">{pendingCount} pengajuan saat ini masih berstatus pending.</p>
        </ESSSectionCard>

        <ESSSectionCard title="Riwayat Pengajuan" description="Lihat status pengajuan cuti dan izin yang pernah dibuat.">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="pb-3 font-medium">Jenis</th>
                  <th className="pb-3 font-medium">Periode</th>
                  <th className="pb-3 font-medium">Durasi</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Diajukan</th>
                  <th className="pb-3 font-medium">Alasan</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 text-gray-700">
                    <td className="py-3">{item.type}</td>
                    <td className="py-3">{formatDate(item.startDate)} - {formatDate(item.endDate)}</td>
                    <td className="py-3">{item.dayCount} hari</td>
                    <td className="py-3"><ESSStatusBadge status={item.status} /></td>
                    <td className="py-3">{formatDateTime(item.submittedAt)}</td>
                    <td className="py-3">{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ESSSectionCard>
      </div>
    </div>
  );
}