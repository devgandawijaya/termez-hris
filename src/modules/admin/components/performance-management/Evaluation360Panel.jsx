import React from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';

import { EmptyState, Modal, SectionCard, StatCard, StatusPill } from './PerformanceShared';

function buildRadarData(competencies) {
  return Object.entries(competencies).map(([subject, score]) => ({ subject, score, fullMark: 5 }));
}

function CompetencyInput({ label, value, onChange }) {
  return (
    <label className="rounded-2xl border border-slate-100 p-4 text-sm font-medium text-slate-700">
      <div className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{Number(value).toFixed(1)}</span>
      </div>
      <input type="range" min="1" max="5" step="0.1" value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-4 w-full accent-violet-500" />
    </label>
  );
}

export default function Evaluation360Panel({
  records,
  onOpenFeedback,
  modalOpen,
  form,
  errors,
  onFormChange,
  onCompetencyChange,
  onCloseModal,
  onSave,
}) {
  const reviewCount = records.reduce((sum, item) => sum + item.reviewers.length, 0);
  const anonymousCount = records.reduce((sum, item) => sum + item.reviewers.filter((reviewer) => reviewer.anonymous).length, 0);
  const averageCommunication = records.length
    ? (records.reduce((sum, item) => sum + item.competencies.Communication, 0) / records.length).toFixed(1)
    : '0.0';
  const reviewerMix = records.reduce((accumulator, record) => {
    record.reviewers.forEach((reviewer) => {
      accumulator[reviewer.reviewerRole] = (accumulator[reviewer.reviewerRole] || 0) + 1;
    });
    return accumulator;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="360 cycles" value={records.length} helper="Cycle evaluasi yang sedang aktif" tone="sky" />
        <StatCard label="Total reviewers" value={reviewCount} helper="Atasan, peer, dan bawahan" tone="emerald" />
        <StatCard label="Anonymous feedback" value={anonymousCount} helper="Meningkatkan keterbukaan reviewer" tone="amber" />
        <StatCard label="Communication avg" value={`${averageCommunication}/5`} helper="Rata-rata competency dummy yang disorot user" tone="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionCard title="Reviewer Composition" description="Flow 360 evaluation berputar di orchestrasi reviewer, anonimitas, dan kualitas feedback lintas peran.">
          <div className="grid gap-4 md:grid-cols-3">
            {['Atasan', 'Rekan kerja', 'Bawahan'].map((role) => (
              <div key={role} className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{role}</div>
                <div className="mt-3 text-3xl font-semibold text-slate-900">{reviewerMix[role] || 0}</div>
                <div className="mt-2 text-sm text-slate-600">Reviewer aktif dalam scope filter saat ini.</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Feedback Principles" description="Modul ini tidak mengejar grade final; yang dicari adalah pola perilaku dan insight naratif yang bisa ditindaklanjuti.">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm leading-6 text-violet-900">Gunakan opsi anonymous untuk topik sensitif agar reviewer lebih jujur.</div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-sky-900">Pastikan mix reviewer mewakili interaksi kerja nyata, bukan sekadar struktur organisasi.</div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">Baca komentar bersama radar chart untuk melihat gap antara persepsi dan kinerja formal.</div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="360 Evaluation" description="Feedback lintas peran dengan opsi anonymous, multi reviewer, dan spider chart untuk summary competency.">
        {records.length === 0 ? (
          <EmptyState title="Belum ada 360 evaluation" description="Tambahkan reviewer dan feedback agar radar chart dan summary competency bisa muncul." />
        ) : (
          <div className="space-y-5">
            {records.map((record) => (
              <div key={record.id} className="grid gap-4 rounded-3xl border border-slate-100 p-5 xl:grid-cols-[1fr_1.05fr]">
                <div>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">{record.employeeName}</div>
                      <div className="mt-1 text-sm text-slate-500">{record.department} • {record.cycle}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill value={record.anonymousAllowed ? 'Approved' : 'Pending'} />
                      <button type="button" onClick={() => onOpenFeedback(record)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                        Add Feedback
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(record.competencies).map(([key, value]) => (
                      <div key={key} className="rounded-2xl bg-slate-50 p-4">
                        <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{key}</div>
                        <div className="mt-3 text-2xl font-semibold text-slate-900">{value.toFixed(1)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 space-y-3">
                    {record.reviewers.map((reviewer) => (
                      <div key={reviewer.id} className="rounded-2xl border border-slate-100 p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{reviewer.reviewerName}</span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{reviewer.reviewerRole}</span>
                          {reviewer.anonymous ? <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Anonymous</span> : null}
                        </div>
                        <div className="mt-2 text-sm leading-6 text-slate-600">{reviewer.comment}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5">
                  <div className="text-sm font-semibold text-slate-900">Spider / Radar Summary</div>
                  <div className="mt-4 h-[320px] w-full">
                    <ResponsiveContainer>
                      <RadarChart data={buildRadarData(record.competencies)}>
                        <PolarGrid stroke="#CBD5E1" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                        <Tooltip />
                        <Radar name="Score" dataKey="score" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.35} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <Modal isOpen={modalOpen} title="Submit 360 Feedback" description="Reviewer dapat memberi masukan anonim atau terbuka dengan skor competency per aspek." onClose={onCloseModal} widthClass="max-w-5xl">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Reviewer Name</span>
            <input value={form.reviewerName} onChange={(event) => onFormChange('reviewerName', event.target.value)} disabled={form.anonymous} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm disabled:bg-slate-100" />
            {errors.reviewerName ? <span className="text-xs text-rose-600">{errors.reviewerName}</span> : null}
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Reviewer Role</span>
            <select value={form.reviewerRole} onChange={(event) => onFormChange('reviewerRole', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
              {['Atasan', 'Rekan kerja', 'Bawahan'].map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
          </label>
        </div>

        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-100 p-4 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={form.anonymous} onChange={(event) => onFormChange('anonymous', event.target.checked)} className="h-4 w-4 rounded border-slate-300" />
          Kirim sebagai anonymous feedback
        </label>

        <label className="mt-4 block space-y-2 text-sm font-medium text-slate-700">
          <span>Feedback Summary</span>
          <textarea value={form.comment} onChange={(event) => onFormChange('comment', event.target.value)} rows={4} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          {errors.comment ? <span className="text-xs text-rose-600">{errors.comment}</span> : null}
        </label>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(form.competencies).map(([key, value]) => (
            <CompetencyInput key={key} label={key} value={value} onChange={(nextValue) => onCompetencyChange(key, nextValue)} />
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCloseModal} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="button" onClick={onSave} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Send Feedback</button>
        </div>
      </Modal>
    </div>
  );
}