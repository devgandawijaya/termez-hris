import React, { useMemo, useState } from 'react';

import { EmptyState, SectionCard, StatCard, StatusPill } from './PerformanceShared';

export default function CareerPathPanel({ records, capabilities, onApprovalChange }) {
  const [selectedId, setSelectedId] = useState(records[0]?.id || '');

  const selectedRecord = useMemo(() => records.find((item) => item.id === selectedId) || records[0] || null, [records, selectedId]);

  const eligibleCount = records.filter((item) => item.eligibility === 'Eligible').length;
  const pendingCount = records.filter((item) => item.hrdApproval === 'Pending').length;
  const averageReadiness = records.length ? Math.round(records.reduce((sum, item) => sum + item.readinessScore, 0) / records.length) : 0;
  const bucketedReadiness = {
    ready: records.filter((item) => item.readinessScore >= 85).length,
    watch: records.filter((item) => item.readinessScore >= 75 && item.readinessScore < 85).length,
    build: records.filter((item) => item.readinessScore < 75).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Career tracks" value={records.length} helper="Data tracking jenjang karir aktif" tone="sky" />
        <StatCard label="Avg readiness" value={`${averageReadiness}%`} helper="Kesiapan promosi berdasarkan performa" tone="emerald" />
        <StatCard label="Eligible now" value={eligibleCount} helper="Karyawan siap promosi pada cycle aktif" tone="violet" />
        <StatCard label="Pending HRD" value={pendingCount} helper="Menunggu approval akhir HRD" tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Promotion Decision Board" description="Flow career path berpusat pada readiness dan governance promosi, bukan input score atau feedback campaign.">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">Ready now</div>
              <div className="mt-3 text-3xl font-semibold text-emerald-900">{bucketedReadiness.ready}</div>
              <div className="mt-2 text-sm text-emerald-800">Candidate dengan evidence kuat untuk promotion discussion.</div>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-sky-700">Watchlist</div>
              <div className="mt-3 text-3xl font-semibold text-sky-900">{bucketedReadiness.watch}</div>
              <div className="mt-2 text-sm text-sky-800">Hampir siap, namun masih perlu milestone tambahan sebelum diusulkan.</div>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-amber-700">Build plan</div>
              <div className="mt-3 text-3xl font-semibold text-amber-900">{bucketedReadiness.build}</div>
              <div className="mt-2 text-sm text-amber-800">Masih memerlukan development plan sebelum masuk pool promosi.</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Approval Checklist" description="Checklist keputusan HRD agar promotion recommendation berbasis bukti, bukan feeling semata.">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">Validasi histori promosi dan konsistensi performa lintas cycle.</div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">Bandingkan readiness score dengan target stage dan requirement posisi berikutnya.</div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">Putuskan approve, pending, atau development plan dengan next action yang jelas.</div>
          </div>
        </SectionCard>
      </div>

      {records.length === 0 ? (
        <EmptyState title="Belum ada career path" description="Promotion readiness akan tampil ketika performa dan histori promosi sudah tersedia." />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <SectionCard title="Promotion Career Path Tracking" description="Tracking jalur karir, readiness score, serta approval HRD untuk rekomendasi promosi.">
            <div className="space-y-3">
              {records.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => setSelectedId(record.id)}
                  className={`w-full rounded-3xl border p-4 text-left transition ${selectedRecord?.id === record.id ? 'border-sky-300 bg-sky-50' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900">{record.employeeName}</div>
                      <div className="mt-1 text-sm text-slate-500">{record.department} • {record.currentStage} → {record.targetStage}</div>
                    </div>
                    <StatusPill value={record.eligibility} />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                    <span>Readiness</span>
                    <span className="font-semibold text-slate-900">{record.readinessScore}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white">
                    <div className={`h-2 rounded-full ${record.readinessScore >= 85 ? 'bg-emerald-500' : record.readinessScore >= 75 ? 'bg-sky-500' : 'bg-amber-500'}`} style={{ width: `${record.readinessScore}%` }} />
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>

          <div className="space-y-6">
            {selectedRecord ? (
              <>
                <SectionCard
                  title={selectedRecord.employeeName}
                  description="Career path timeline, promotion history, dan HRD recommendation status."
                  actions={capabilities.canApproveCareer ? (
                    <>
                      <button type="button" onClick={() => onApprovalChange(selectedRecord.id, 'Approved')} className="rounded-2xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">Approve HRD</button>
                      <button type="button" onClick={() => onApprovalChange(selectedRecord.id, 'Pending')} className="rounded-2xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50">Set Pending</button>
                    </>
                  ) : null}
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Eligibility</div>
                      <div className="mt-3"><StatusPill value={selectedRecord.eligibility} /></div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Recommendation</div>
                      <div className="mt-3 text-lg font-semibold text-slate-900">{selectedRecord.recommendationStatus}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">HRD Approval</div>
                      <div className="mt-3"><StatusPill value={selectedRecord.hrdApproval} /></div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-sm font-semibold text-slate-900">Career Path Timeline</div>
                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      {selectedRecord.pathStages.map((stage, index) => {
                        const isCurrent = stage === selectedRecord.currentStage;
                        const isTarget = stage === selectedRecord.targetStage;
                        return (
                          <div key={stage} className={`rounded-3xl border p-4 ${isTarget ? 'border-violet-200 bg-violet-50' : isCurrent ? 'border-sky-200 bg-sky-50' : 'border-slate-100 bg-white'}`}>
                            <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Stage {index + 1}</div>
                            <div className="mt-3 text-lg font-semibold text-slate-900">{stage}</div>
                            <div className="mt-3 text-xs font-semibold text-slate-500">{isCurrent ? 'Current stage' : isTarget ? 'Target stage' : 'Completed path'}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-900">Next Action Recommendation</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">{selectedRecord.nextAction}</div>
                  </div>
                </SectionCard>

                <SectionCard title="Promotion History" description="Riwayat perpindahan level dan momen promosi karyawan terpilih.">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500">
                          <th className="px-3 py-3 font-medium">Title</th>
                          <th className="px-3 py-3 font-medium">Effective Date</th>
                          <th className="px-3 py-3 font-medium">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.promotionHistory.map((item) => (
                          <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                            <td className="px-3 py-4 font-semibold text-slate-900">{item.title}</td>
                            <td className="px-3 py-4 text-slate-600">{item.effectiveDate}</td>
                            <td className="px-3 py-4 text-slate-600">{item.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}