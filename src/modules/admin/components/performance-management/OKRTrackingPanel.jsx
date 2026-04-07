import React, { useMemo, useState } from 'react';

import { EmptyState, Modal, ProgressBar, SectionCard, StatCard, StatusPill } from './PerformanceShared';

function getSortValue(record, key) {
  if (key === 'progress') {
    return record.progress;
  }
  return String(record[key] || '').toLowerCase();
}

export default function OKRTrackingPanel({
  records,
  capabilities,
  onCreate,
  onEdit,
  onDelete,
  onOpenDetail,
  detailRecord,
  onCloseDetail,
  modalOpen,
  form,
  errors,
  employees,
  departments,
  onFormChange,
  onKeyResultChange,
  onAddKeyResult,
  onRemoveKeyResult,
  onCloseModal,
  onSave,
}) {
  const [sortKey, setSortKey] = useState('progress');
  const [sortDirection, setSortDirection] = useState('desc');

  const sortedRecords = useMemo(() => [...records].sort((left, right) => {
    const leftValue = getSortValue(left, sortKey);
    const rightValue = getSortValue(right, sortKey);

    if (leftValue < rightValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (leftValue > rightValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  }), [records, sortDirection, sortKey]);

  const summary = useMemo(() => ({
    total: records.length,
    completed: records.filter((item) => item.status === 'Completed').length,
    atRisk: records.filter((item) => item.status === 'At Risk').length,
    average: records.length ? Math.round(records.reduce((sum, item) => sum + item.progress, 0) / records.length) : 0,
  }), [records]);

  const focusList = useMemo(() => records
    .flatMap((record) => record.keyResults.map((keyResult) => ({
      objective: record.objective,
      ownerName: record.ownerName,
      quarter: record.quarter,
      ...keyResult,
    })))
    .sort((left, right) => left.progress - right.progress)
    .slice(0, 3), [records]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection('asc');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Objectives in scope" value={summary.total} helper="Dipengaruhi filter dan role aktif" tone="sky" />
        <StatCard label="Average progress" value={`${summary.average}%`} helper="Rata-rata progress semua objective" tone="emerald" />
        <StatCard label="Completed" value={summary.completed} helper="Objective selesai atau hampir closing" tone="violet" />
        <StatCard label="At risk" value={summary.atRisk} helper="Butuh intervention manager atau HRD" tone="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard title="OKR Working Rhythm" description="Alur OKR berpusat pada planning, check-in rutin, dan closing quarter.">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-sky-50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-sky-700">Plan</div>
              <div className="mt-3 text-sm leading-6 text-sky-900">Define objective, assign owner, dan pecah target menjadi KR yang bisa dipantau mingguan.</div>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">Check-in</div>
              <div className="mt-3 text-sm leading-6 text-emerald-900">Update actual, koreksi status, dan beri catatan blokir untuk manager review.</div>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-amber-700">Close</div>
              <div className="mt-3 text-sm leading-6 text-amber-900">Tentukan objective selesai, carry over, atau perlu recovery plan di quarter berikutnya.</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Weekly Focus Queue" description="KR dengan progress paling rendah yang perlu check-in atau escalation lebih dulu.">
          <div className="space-y-3">
            {focusList.length === 0 ? (
              <EmptyState title="No KR focus" description="Belum ada key result yang perlu disorot minggu ini." />
            ) : focusList.map((item) => (
              <div key={`${item.objective}-${item.id}`} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{item.title}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.objective} • {item.ownerName} • {item.quarter}</div>
                  </div>
                  <StatusPill value={item.status} />
                </div>
                <div className="mt-3"><ProgressBar value={item.progress} tone={item.status === 'At Risk' ? 'amber' : 'emerald'} /></div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="OKR Tracking"
        description="Kelola objective dan nested key results, lengkap dengan progress, status, dan timeline review."
        actions={capabilities.canManageOkr ? (
          <button type="button" onClick={onCreate} className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
            Create OKR
          </button>
        ) : null}
      >
        {sortedRecords.length === 0 ? (
          <EmptyState title="Belum ada OKR yang cocok" description="Coba ubah filter department, employee, atau quarter untuk melihat objective lain." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="px-3 py-3 font-medium">Objective</th>
                  <th className="px-3 py-3 font-medium">
                    <button type="button" onClick={() => handleSort('ownerName')} className="inline-flex items-center gap-1">Owner</button>
                  </th>
                  <th className="px-3 py-3 font-medium">Quarter</th>
                  <th className="px-3 py-3 font-medium">
                    <button type="button" onClick={() => handleSort('progress')} className="inline-flex items-center gap-1">Progress</button>
                  </th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedRecords.map((record) => (
                  <tr key={record.id} className="border-b border-slate-100 align-top last:border-b-0">
                    <td className="px-3 py-4">
                      <div className="font-semibold text-slate-900">{record.objective}</div>
                      <div className="mt-1 text-xs text-slate-500">{record.department} • Priority {record.priority}</div>
                      <div className="mt-3 space-y-3">
                        {record.keyResults.map((item) => (
                          <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
                            <div className="flex items-center justify-between gap-3 text-xs font-medium text-slate-500">
                              <span>{item.title}</span>
                              <StatusPill value={item.status} />
                            </div>
                            <div className="mt-2 text-xs text-slate-500">{item.actualLabel} / {item.targetLabel}</div>
                            <div className="mt-3">
                              <ProgressBar value={item.progress} tone={item.status === 'At Risk' ? 'amber' : item.status === 'Completed' ? 'sky' : 'emerald'} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-slate-700">{record.ownerName}</td>
                    <td className="px-3 py-4 text-slate-700">{record.quarter}</td>
                    <td className="px-3 py-4">
                      <div className="min-w-36"><ProgressBar value={record.progress} tone={record.status === 'At Risk' ? 'amber' : record.status === 'Completed' ? 'sky' : 'emerald'} /></div>
                    </td>
                    <td className="px-3 py-4"><StatusPill value={record.status} /></td>
                    <td className="px-3 py-4">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => onOpenDetail(record)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Details</button>
                        {capabilities.canManageOkr ? (
                          <>
                            <button type="button" onClick={() => onEdit(record)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                            <button type="button" onClick={() => onDelete(record.id)} className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50">Delete</button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <Modal isOpen={Boolean(detailRecord)} title={detailRecord?.objective || 'OKR Detail'} description="Progress overview, nested key results, dan timeline checkpoint." onClose={onCloseDetail}>
        {detailRecord ? (
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusPill value={detailRecord.status} />
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">{detailRecord.quarter}</span>
                </div>
                <div className="text-sm leading-6 text-slate-600">{detailRecord.description}</div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-white bg-white px-4 py-3 text-sm text-slate-600">Owner<div className="mt-1 font-semibold text-slate-900">{detailRecord.ownerName}</div></div>
                  <div className="rounded-2xl border border-white bg-white px-4 py-3 text-sm text-slate-600">Due Date<div className="mt-1 font-semibold text-slate-900">{detailRecord.dueDate}</div></div>
                  <div className="rounded-2xl border border-white bg-white px-4 py-3 text-sm text-slate-600">Overall<div className="mt-1 font-semibold text-slate-900">{detailRecord.progress}%</div></div>
                </div>
              </div>

              <div className="space-y-3">
                {detailRecord.keyResults.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-100 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-slate-900">{item.title}</div>
                        <div className="mt-1 text-sm text-slate-500">{item.actualLabel} / {item.targetLabel}</div>
                      </div>
                      <StatusPill value={item.status} />
                    </div>
                    <div className="mt-4"><ProgressBar value={item.progress} tone={item.status === 'At Risk' ? 'amber' : item.status === 'Completed' ? 'sky' : 'emerald'} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <div className="text-sm font-semibold text-slate-900">OKR Timeline</div>
              <div className="mt-5 space-y-4">
                {detailRecord.timeline.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-sky-500" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.actor} • {new Date(item.date).toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={modalOpen} title={form.id ? 'Edit OKR' : 'Create OKR'} description="HRD dapat membuat objective baru dan mendefinisikan nested key result beserta targetnya." onClose={onCloseModal}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Objective</span>
            <input value={form.objective} onChange={(event) => onFormChange('objective', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            {errors.objective ? <span className="text-xs text-rose-600">{errors.objective}</span> : null}
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Department</span>
            <select value={form.department} onChange={(event) => onFormChange('department', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
              <option value="">Choose department</option>
              {departments.map((department) => <option key={department} value={department}>{department}</option>)}
            </select>
            {errors.department ? <span className="text-xs text-rose-600">{errors.department}</span> : null}
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Owner</span>
            <select value={form.employeeId} onChange={(event) => onFormChange('employeeId', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
              <option value="">Choose employee</option>
              {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.fullName}</option>)}
            </select>
            {errors.employeeId ? <span className="text-xs text-rose-600">{errors.employeeId}</span> : null}
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Quarter</span>
            <input value={form.quarter} onChange={(event) => onFormChange('quarter', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Status</span>
            <select value={form.status} onChange={(event) => onFormChange('status', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
              {['Not Started', 'On Track', 'At Risk', 'Completed'].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Priority</span>
            <select value={form.priority} onChange={(event) => onFormChange('priority', event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm">
              {['Low', 'Medium', 'High'].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span>Description</span>
            <textarea value={form.description} onChange={(event) => onFormChange('description', event.target.value)} rows={3} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
          </label>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900">Key Results</div>
              <div className="text-sm text-slate-500">Tambahkan target, actual, dan status untuk setiap KR.</div>
            </div>
            <button type="button" onClick={onAddKeyResult} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">Add KR</button>
          </div>

          <div className="mt-4 space-y-4">
            {form.keyResults.map((item, index) => (
              <div key={`${item.id || 'new'}-${index}`} className="grid gap-3 rounded-2xl border border-white bg-white p-4 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto]">
                <input value={item.title} onChange={(event) => onKeyResultChange(index, 'title', event.target.value)} placeholder="KR title" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                <input value={item.targetLabel} onChange={(event) => onKeyResultChange(index, 'targetLabel', event.target.value)} placeholder="Target" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                <input value={item.actualLabel} onChange={(event) => onKeyResultChange(index, 'actualLabel', event.target.value)} placeholder="Actual" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                <div className="grid grid-cols-[1fr_110px] gap-3">
                  <input type="number" min="0" max="100" value={item.progress} onChange={(event) => onKeyResultChange(index, 'progress', Number(event.target.value))} placeholder="%" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
                  <select value={item.status} onChange={(event) => onKeyResultChange(index, 'status', event.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
                    {['Not Started', 'On Track', 'At Risk', 'Completed'].map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
                <button type="button" onClick={() => onRemoveKeyResult(index)} className="rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50">Remove</button>
              </div>
            ))}
          </div>
          {errors.keyResults ? <div className="mt-3 text-xs text-rose-600">{errors.keyResults}</div> : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCloseModal} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="button" onClick={onSave} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Save OKR</button>
        </div>
      </Modal>
    </div>
  );
}