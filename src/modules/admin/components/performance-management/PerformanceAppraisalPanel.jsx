import React from 'react';

import { EmptyState, Modal, SectionCard, StarPreview, StatCard, StatusPill } from './PerformanceShared';

function ScoreField({ label, value, onChange }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{label}</div>
          <div className="text-xs text-slate-500">Range 0 sampai 100</div>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{value}</div>
      </div>
      <input type="range" min="0" max="100" value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-4 w-full accent-sky-500" />
    </div>
  );
}

export default function PerformanceAppraisalPanel({
  records,
  capabilities,
  onCreate,
  onEdit,
  onWorkflowChange,
  modalOpen,
  form,
  errors,
  employees,
  onFormChange,
  onScoreChange,
  onCloseModal,
  onSave,
}) {
  const averageScore = records.length ? (records.reduce((sum, item) => sum + item.finalScore, 0) / records.length).toFixed(1) : '0.0';
  const approvedCount = records.filter((item) => item.workflowStatus === 'Approved').length;
  const pendingCount = records.filter((item) => item.workflowStatus === 'Pending Approval').length;
  const needsReviewCount = records.filter((item) => item.workflowStatus === 'Needs Review').length;
  const topGradeCount = records.filter((item) => item.grade === 'A').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Appraisal records" value={records.length} helper="History per cycle dan reviewer" tone="sky" />
        <StatCard label="Average score" value={averageScore} helper="Akumulasi KPI, attitude, discipline" tone="emerald" />
        <StatCard label="Approved" value={approvedCount} helper="Sudah lolos workflow approval" tone="violet" />
        <StatCard label="Pending" value={pendingCount} helper="Menunggu sign-off HRD atau atasan" tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Appraisal Workflow Board" description="Alur appraisal berbeda dari OKR karena berpusat pada scoring, kalibrasi, dan approval resmi.">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-sky-700">Draft / Pending</div>
              <div className="mt-3 text-3xl font-semibold text-sky-900">{pendingCount}</div>
              <div className="mt-2 text-sm text-sky-800">Form appraisal menunggu persetujuan atau final review.</div>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-amber-700">Needs Review</div>
              <div className="mt-3 text-3xl font-semibold text-amber-900">{needsReviewCount}</div>
              <div className="mt-2 text-sm text-amber-800">Perlu kalibrasi ulang score atau komentar sebelum final sign-off.</div>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">Approved</div>
              <div className="mt-3 text-3xl font-semibold text-emerald-900">{approvedCount}</div>
              <div className="mt-2 text-sm text-emerald-800">Siap dipakai untuk keputusan performance dan talent review.</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Calibration Snapshot" description="Panel ini menyorot kualitas distribusi hasil appraisal, bukan progress target seperti di OKR.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Top grade share</div>
              <div className="mt-3 text-3xl font-semibold text-slate-900">{topGradeCount}</div>
              <div className="mt-2 text-sm text-slate-600">Jumlah appraisal dengan grade A dalam scope filter aktif.</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Calibration note</div>
              <div className="mt-3 text-sm leading-6 text-slate-700">Gunakan halaman ini untuk memastikan reviewer memberi score yang konsisten dan rekomendasi development tetap relevan.</div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Performance Appraisal"
        description="Penilaian formal untuk KPI, attitude, dan discipline lengkap dengan score, grading, dan approval workflow."
        actions={capabilities.canManageAppraisal ? (
          <button type="button" onClick={() => onCreate()} className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
            New Appraisal
          </button>
        ) : null}
      >
        {records.length === 0 ? (
          <EmptyState title="Belum ada appraisal" description="Data appraisal akan muncul setelah HRD atau atasan membuat penilaian untuk cycle aktif." />
        ) : (
          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="rounded-3xl border border-slate-100 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">{record.employeeName}</div>
                      <div className="mt-1 text-sm text-slate-500">{record.department} • {record.cycle} • Reviewer {record.reviewerName}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill value={record.workflowStatus} />
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Grade {record.grade}</span>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">KPI</div>
                      <div className="mt-2 text-2xl font-semibold text-slate-900">{record.scores.kpi}</div>
                      <div className="mt-2"><StarPreview value={record.rating.kpi} /></div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Attitude</div>
                      <div className="mt-2 text-2xl font-semibold text-slate-900">{record.scores.attitude}</div>
                      <div className="mt-2"><StarPreview value={record.rating.attitude} /></div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Discipline</div>
                      <div className="mt-2 text-2xl font-semibold text-slate-900">{record.scores.discipline}</div>
                      <div className="mt-2"><StarPreview value={record.rating.discipline} /></div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Summary score {record.finalScore}</div>
                      <div className="mt-1 text-sm text-slate-500">{record.recommendation}</div>
                    </div>
                    {capabilities.canManageAppraisal ? (
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => onEdit(record)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                        <button type="button" onClick={() => onWorkflowChange(record.id, 'Approved')} className="rounded-2xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">Approve</button>
                        <button type="button" onClick={() => onWorkflowChange(record.id, 'Needs Review')} className="rounded-2xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50">Request Review</button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <SectionCard title="Approval History" description="Jejak perubahan appraisal dan kalibrasi lintas reviewer." className="h-fit">
              <div className="space-y-4">
                {records.flatMap((record) => record.history.map((history) => ({ ...history, employeeName: record.employeeName }))).slice(0, 8).map((history) => (
                  <div key={history.id} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                    <div className="mt-1 h-3 w-3 rounded-full bg-violet-500" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{history.label}</div>
                      <div className="text-xs text-slate-500">{history.employeeName} • {history.actor}</div>
                      <div className="mt-1 text-xs text-slate-400">{new Date(history.date).toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}
      </SectionCard>

      <Modal isOpen={modalOpen} title={form.id ? 'Edit Appraisal' : 'Create Appraisal'} description="HRD atau atasan dapat menetapkan score, grading, dan rekomendasi appraisal." onClose={onCloseModal}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Employee</span>
            <select value={form.employeeId} onChange={(event) => onFormChange('employeeId', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
              <option value="">Choose employee</option>
              {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.fullName}</option>)}
            </select>
            {errors.employeeId ? <span className="text-xs text-rose-600">{errors.employeeId}</span> : null}
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Cycle</span>
            <input value={form.cycle} onChange={(event) => onFormChange('cycle', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span>Reviewer Name</span>
            <input value={form.reviewerName} onChange={(event) => onFormChange('reviewerName', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            {errors.reviewerName ? <span className="text-xs text-rose-600">{errors.reviewerName}</span> : null}
          </label>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <ScoreField label="KPI" value={form.scores.kpi} onChange={(value) => onScoreChange('kpi', value)} />
          <ScoreField label="Attitude" value={form.scores.attitude} onChange={(value) => onScoreChange('attitude', value)} />
          <ScoreField label="Discipline" value={form.scores.discipline} onChange={(value) => onScoreChange('discipline', value)} />
        </div>

        <label className="mt-6 block space-y-2 text-sm font-medium text-slate-700">
          <span>Recommendation</span>
          <textarea value={form.recommendation} onChange={(event) => onFormChange('recommendation', event.target.value)} rows={4} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
        </label>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Star preview</div>
            <div className="mt-3"><StarPreview value={form.scores.kpi / 20} /></div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Summary score</div>
            <div className="mt-3 text-3xl font-semibold text-slate-900">{((form.scores.kpi * 0.5) + (form.scores.attitude * 0.3) + (form.scores.discipline * 0.2)).toFixed(1)}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Projected grade</div>
            <div className="mt-3 text-3xl font-semibold text-slate-900">
              {((form.scores.kpi * 0.5) + (form.scores.attitude * 0.3) + (form.scores.discipline * 0.2)) >= 85 ? 'A' : ((form.scores.kpi * 0.5) + (form.scores.attitude * 0.3) + (form.scores.discipline * 0.2)) >= 75 ? 'B' : 'C'}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCloseModal} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="button" onClick={onSave} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Save Appraisal</button>
        </div>
      </Modal>
    </div>
  );
}