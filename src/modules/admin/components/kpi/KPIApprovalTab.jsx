import React from 'react';

import KPISectionCard from './KPISectionCard';

const badgeTone = {
  Pending: 'bg-amber-50 text-amber-700',
  Approved: 'bg-emerald-50 text-emerald-700',
  Rejected: 'bg-rose-50 text-rose-700',
};

export default function KPIApprovalTab({ approvals, canApprove, reviewNotes, onNoteChange, onReview, isUserView = false }) {
  return (
    <KPISectionCard title="KPI Approval Workflow" description={isUserView ? 'User biasa memantau status approval dan catatan revisi dari admin.' : 'Submit KPI, approval oleh atasan, dan permintaan revisi apabila diperlukan.'}>
      <div className="space-y-4">
        {approvals.map((item) => (
          <div key={item.id} className="rounded-xl border border-gray-100 p-4">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-4">
              <div>
                <div className="font-semibold text-gray-900">{item.kpiName}</div>
                <div className="text-sm text-gray-500">{item.employeeName} • Reviewer: {item.reviewer || '-'} • {item.periodLabel}</div>
              </div>
              <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${badgeTone[item.approvalStatus] || 'bg-gray-50 text-gray-700'}`}>
                {item.approvalStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                <div className="font-medium text-gray-800 mb-2">Ringkasan</div>
                <div>Target: {item.target} {item.unit}</div>
                <div>Actual: {item.actual} {item.unit}</div>
                <div>Progress: {item.progress}%</div>
                <div>Score: {item.score}</div>
              </div>

              <div className="xl:col-span-2 space-y-3">
                <textarea
                  value={reviewNotes[item.id] || item.reviewNotes || ''}
                  onChange={(event) => onNoteChange(item.id, event.target.value)}
                  readOnly={!canApprove}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                  rows={3}
                  placeholder={canApprove ? 'Tambahkan catatan approval atau revisi' : 'Catatan approval dari admin akan tampil di sini'}
                />
                {canApprove ? (
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      type="button"
                      disabled={!canApprove || item.approvalStatus === 'Approved'}
                      onClick={() => onReview(item.id, 'approve')}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={!canApprove}
                      onClick={() => onReview(item.id, 'reject')}
                      className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Minta Revisi
                    </button>
                  </div>
                ) : (
                  <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Status approval untuk KPI ini sedang {item.approvalStatus.toLowerCase()}. Jika ditolak, lakukan revisi dari tab monitoring lalu submit ulang.
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </KPISectionCard>
  );
}
