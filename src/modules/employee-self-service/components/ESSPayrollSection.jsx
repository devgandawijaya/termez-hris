import React from 'react';
import { Download, WalletCards } from 'lucide-react';
import { ESSSectionCard } from './ESSShared';
import { formatCurrency, formatDateTime } from './ESSSharedUtils';

export default function ESSPayrollSection({ payrolls, actionLoading, onDownloadPayroll }) {
  const latestPayroll = payrolls[0];

  return (
    <div className="space-y-6">
      <ESSSectionCard title="Ringkasan Payroll" description="Slip gaji bulanan dan rincian komponen payroll karyawan.">
        <div className="grid gap-4 lg:grid-cols-[300px,minmax(0,1fr)]">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-700 p-5 text-white">
            <div className="flex items-center gap-3">
              <WalletCards className="h-8 w-8 text-indigo-200" />
              <div>
                <p className="text-sm text-slate-200">Slip Terbaru</p>
                <p className="text-xl font-semibold">{latestPayroll?.periodLabel}</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-200">Take Home Pay</p>
            <p className="mt-2 text-3xl font-semibold">{formatCurrency(latestPayroll?.takeHomePay)}</p>
            <button
              type="button"
              onClick={() => onDownloadPayroll(latestPayroll.id)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
              <span>{actionLoading === `download-payroll-${latestPayroll.id}` ? 'Mempersiapkan PDF...' : 'Download PDF'}</span>
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Gaji Pokok</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{formatCurrency(latestPayroll?.basicSalary)}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Total Tunjangan</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {formatCurrency(latestPayroll?.allowances.reduce((total, item) => total + item.amount, 0))}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Total Potongan</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {formatCurrency(latestPayroll?.deductions.reduce((total, item) => total + item.amount, 0))}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Terbit</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{formatDateTime(latestPayroll?.generatedAt)}</p>
            </div>
          </div>
        </div>
      </ESSSectionCard>

      <ESSSectionCard title="Riwayat Slip Gaji" description="Unduh slip gaji bulanan beserta rincian tunjangan dan potongan.">
        <div className="space-y-4">
          {payrolls.map((payroll) => (
            <div key={payroll.id} className="rounded-2xl border border-gray-200 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{payroll.periodLabel}</h3>
                  <p className="mt-1 text-sm text-gray-500">Terbit {formatDateTime(payroll.generatedAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onDownloadPayroll(payroll.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-indigo-500 hover:text-indigo-600"
                >
                  <Download className="h-4 w-4" />
                  <span>{actionLoading === `download-payroll-${payroll.id}` ? 'Mengunduh...' : 'Download PDF'}</span>
                </button>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Gaji Pokok</p>
                  <p className="mt-2 text-xl font-semibold text-gray-900">{formatCurrency(payroll.basicSalary)}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm text-emerald-700">Tunjangan</p>
                  <div className="mt-3 space-y-2 text-sm text-emerald-900">
                    {payroll.allowances.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <span>{item.label}</span>
                        <span className="font-medium">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-rose-50 p-4">
                  <p className="text-sm text-rose-700">Potongan</p>
                  <div className="mt-3 space-y-2 text-sm text-rose-900">
                    {payroll.deductions.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3">
                        <span>{item.label}</span>
                        <span className="font-medium">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-900">
                Take Home Pay: {formatCurrency(payroll.takeHomePay)}
              </div>
            </div>
          ))}
        </div>
      </ESSSectionCard>
    </div>
  );
}