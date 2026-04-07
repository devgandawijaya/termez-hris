import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { ESSSectionCard, ESSStatusBadge, formatDateTime } from './ESSShared';

export default function ESSApprovalSection({ approvals, actionLoading, onProcessApproval }) {
  const [notes, setNotes] = useState({});
  const pendingApprovals = approvals.filter((item) => item.status === 'Pending');

  return (
    <ESSSectionCard title="Tracking Approval" description="Tinjau pengajuan bawahan dan proses approval langsung dari ESS.">
      {approvals.length === 0 ? (
        <p className="text-sm text-gray-500">Tidak ada approval untuk diproses.</p>
      ) : (
        <div className="space-y-4">
          {approvals.map((approval) => (
            <div key={approval.id} className="rounded-2xl border border-gray-200 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{approval.title}</h3>
                    <ESSStatusBadge status={approval.status} />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{approval.employeeName} • {approval.reason}</p>
                  <p className="mt-2 text-xs text-gray-500">Diajukan {formatDateTime(approval.submittedAt)}</p>
                  {approval.reviewerNote ? <p className="mt-2 text-sm text-gray-500">Catatan reviewer: {approval.reviewerNote}</p> : null}
                </div>
                {approval.status === 'Pending' ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onProcessApproval(approval.id, 'Disetujui', notes[approval.id] || '')}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      <Check className="h-4 w-4" />
                      <span>{actionLoading === `approval-${approval.id}-Disetujui` ? 'Memproses...' : 'Approve'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onProcessApproval(approval.id, 'Ditolak', notes[approval.id] || '')}
                      className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                      <X className="h-4 w-4" />
                      <span>{actionLoading === `approval-${approval.id}-Ditolak` ? 'Memproses...' : 'Reject'}</span>
                    </button>
                  </div>
                ) : null}
              </div>

              {approval.status === 'Pending' ? (
                <textarea
                  className="mt-4 min-h-24 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Tambahkan catatan reviewer jika diperlukan"
                  value={notes[approval.id] || ''}
                  onChange={(event) => setNotes((current) => ({ ...current, [approval.id]: event.target.value }))}
                />
              ) : null}
            </div>
          ))}
        </div>
      )}

      {pendingApprovals.length > 0 ? (
        <p className="mt-5 text-sm text-gray-500">{pendingApprovals.length} approval masih menunggu keputusan.</p>
      ) : null}
    </ESSSectionCard>
  );
}