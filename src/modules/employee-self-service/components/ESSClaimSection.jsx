import React, { useState } from 'react';
import { ReceiptText, Send } from 'lucide-react';
import { ESSSectionCard, ESSStatusBadge, formatCurrency, formatDate, formatDateTime } from './ESSShared';

const inputClassName = 'w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

export default function ESSClaimSection({ claims, actionLoading, onSubmitClaim }) {
  const [form, setForm] = useState({
    title: '',
    category: 'Transport',
    amount: '',
    date: '',
    notes: '',
    evidenceName: '',
  });
  const [errors, setErrors] = useState({});

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setForm((current) => ({
      ...current,
      evidenceName: file.name,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.title.trim()) {
      nextErrors.title = 'Judul klaim wajib diisi';
    }
    if (!form.amount || Number(form.amount) <= 0) {
      nextErrors.amount = 'Nominal klaim harus lebih besar dari 0';
    }
    if (!form.date) {
      nextErrors.date = 'Tanggal transaksi wajib diisi';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = await onSubmitClaim(form);
    if (result?.success) {
      setForm({
        title: '',
        category: 'Transport',
        amount: '',
        date: '',
        notes: '',
        evidenceName: '',
      });
      setErrors({});
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px,minmax(0,1fr)]">
      <ESSSectionCard title="Ajukan Reimbursement / Klaim" description="Isi detail biaya dan lampirkan bukti transaksi untuk proses reimbursement.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Judul Klaim</label>
            <input className={inputClassName} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
            {errors.title ? <p className="mt-1 text-xs text-rose-600">{errors.title}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Kategori</label>
            <select className={inputClassName} value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
              <option value="Transport">Transport</option>
              <option value="Kesehatan">Kesehatan</option>
              <option value="Operasional">Operasional</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Nominal</label>
            <input type="number" className={inputClassName} value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} />
            {errors.amount ? <p className="mt-1 text-xs text-rose-600">{errors.amount}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tanggal Transaksi</label>
            <input type="date" className={inputClassName} value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
            {errors.date ? <p className="mt-1 text-xs text-rose-600">{errors.date}</p> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Bukti Transaksi</label>
            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 transition hover:border-indigo-400 hover:text-indigo-600">
              <span>{form.evidenceName || 'Pilih file struk / kwitansi'}</span>
              <input type="file" className="hidden" onChange={handleFileChange} />
              <ReceiptText className="h-4 w-4" />
            </label>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Catatan</label>
            <textarea className={`${inputClassName} min-h-24`} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
          </div>
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
            <Send className="h-4 w-4" />
            <span>{actionLoading === 'submit-claim' ? 'Mengirim...' : 'Kirim Klaim'}</span>
          </button>
        </form>
      </ESSSectionCard>

      <ESSSectionCard title="Riwayat Klaim" description="Pantau status pengajuan reimbursement dan nominal yang diajukan.">
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="rounded-2xl border border-gray-200 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{claim.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{claim.category} • {formatDate(claim.date)} • {claim.evidenceName}</p>
                </div>
                <ESSStatusBadge status={claim.status} />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Nominal</p>
                  <p className="mt-2 text-xl font-semibold text-gray-900">{formatCurrency(claim.amount)}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Diajukan</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{formatDateTime(claim.submittedAt)}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Catatan</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{claim.notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ESSSectionCard>
    </div>
  );
}