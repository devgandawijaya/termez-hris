import React from 'react';

const toneClasses = {
  sky: 'from-sky-500/15 to-cyan-400/10 border-sky-200 text-sky-900',
  emerald: 'from-emerald-500/15 to-lime-400/10 border-emerald-200 text-emerald-900',
  amber: 'from-amber-500/15 to-orange-400/10 border-amber-200 text-amber-900',
  violet: 'from-violet-500/15 to-fuchsia-400/10 border-violet-200 text-violet-900',
  slate: 'from-slate-500/10 to-slate-200/40 border-slate-200 text-slate-900',
  rose: 'from-rose-500/15 to-pink-400/10 border-rose-200 text-rose-900',
};

const statusClasses = {
  'Not Started': 'bg-slate-100 text-slate-700',
  'On Track': 'bg-emerald-100 text-emerald-700',
  'At Risk': 'bg-amber-100 text-amber-800',
  Completed: 'bg-sky-100 text-sky-700',
  Draft: 'bg-slate-100 text-slate-700',
  'Pending Approval': 'bg-amber-100 text-amber-800',
  Approved: 'bg-emerald-100 text-emerald-700',
  'Needs Review': 'bg-rose-100 text-rose-700',
  Rejected: 'bg-rose-100 text-rose-700',
  Recommended: 'bg-violet-100 text-violet-700',
  'Under Review': 'bg-amber-100 text-amber-800',
  Pending: 'bg-amber-100 text-amber-800',
  Eligible: 'bg-emerald-100 text-emerald-700',
  'Need Improvement': 'bg-rose-100 text-rose-700',
  'Potential Soon': 'bg-sky-100 text-sky-700',
};

export function SectionCard({ title, description, actions, children, className = '' }) {
  return (
    <section className={`rounded-3xl border border-white/60 bg-white/90 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] backdrop-blur ${className}`}>
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

export function StatCard({ label, value, helper, tone = 'slate' }) {
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${toneClasses[tone] || toneClasses.slate}`}>
      <div className="text-sm font-medium opacity-80">{label}</div>
      <div className="mt-4 text-3xl font-semibold tracking-tight">{value}</div>
      {helper ? <div className="mt-2 text-sm opacity-80">{helper}</div> : null}
    </div>
  );
}

export function StatusPill({ value }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[value] || 'bg-slate-100 text-slate-700'}`}>
      {value}
    </span>
  );
}

export function ProgressBar({ value, tone = 'emerald' }) {
  const barTone = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    sky: 'bg-sky-500',
    rose: 'bg-rose-500',
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>Progress</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full transition-all ${barTone[tone] || barTone.emerald}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}

export function Modal({ isOpen, title, description, onClose, children, widthClass = 'max-w-4xl' }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4">
      <div className={`max-h-[90vh] w-full overflow-y-auto rounded-3xl bg-white shadow-2xl ${widthClass}`}>
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white/95 px-6 py-5 backdrop-blur">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
            {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            Close
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="mx-auto mt-2 max-w-xl text-sm text-slate-500">{description}</div>
    </div>
  );
}

export function Toolbar({ filters, filterOptions, onChange, onReset, pageType }) {
  const showQuarter = pageType === 'okr';
  const showCycle = pageType === 'appraisal' || pageType === 'evaluation';

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 px-5 py-4 shadow-sm backdrop-blur">
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))_auto]">
        <input
          type="text"
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
          placeholder="Cari objective, employee, reviewer, atau insight"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none ring-0 transition focus:border-sky-300"
        />
        <select value={filters.department} onChange={(event) => onChange('department', event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <option value="">All departments</option>
          {filterOptions.departments.map((department) => (
            <option key={department} value={department}>{department}</option>
          ))}
        </select>
        <select value={filters.employeeId} onChange={(event) => onChange('employeeId', event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <option value="">All employees</option>
          {filterOptions.employees.map((employee) => (
            <option key={employee.id} value={employee.id}>{employee.name}</option>
          ))}
        </select>
        {showQuarter ? (
          <select value={filters.quarter} onChange={(event) => onChange('quarter', event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <option value="">All quarters</option>
            {filterOptions.quarters.map((quarter) => (
              <option key={quarter} value={quarter}>{quarter}</option>
            ))}
          </select>
        ) : (
          <div className="hidden xl:block" />
        )}
        {showCycle ? (
          <select value={filters.cycle} onChange={(event) => onChange('cycle', event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <option value="">All cycles</option>
            {filterOptions.cycles.map((cycle) => (
              <option key={cycle} value={cycle}>{cycle}</option>
            ))}
          </select>
        ) : (
          <div className="hidden xl:block" />
        )}
        <button type="button" onClick={onReset} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Reset
        </button>
      </div>
    </div>
  );
}

export function StarPreview({ value }) {
  const filled = Math.round(value);
  return (
    <div className="flex items-center gap-1 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < filled ? 'opacity-100' : 'opacity-25'}>★</span>
      ))}
      <span className="ml-2 text-sm font-medium text-slate-600">{value.toFixed(1)}</span>
    </div>
  );
}

export function WorkflowSteps({ items = [], tone = 'sky' }) {
  const dotTone = {
    sky: 'bg-sky-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
  };

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item, index) => (
        <div key={`${item.title}-${index}`} className="rounded-2xl border border-slate-100 bg-white/80 p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold text-white ${dotTone[tone] || dotTone.sky}`}>
              {index + 1}
            </div>
            <div className="text-sm font-semibold text-slate-900">{item.title}</div>
          </div>
          <div className="mt-3 text-sm leading-6 text-slate-600">{item.description}</div>
        </div>
      ))}
    </div>
  );
}

export function SpotlightCard({ eyebrow, title, description, tone = 'slate' }) {
  return (
    <div className={`rounded-3xl border bg-gradient-to-br p-5 ${toneClasses[tone] || toneClasses.slate}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.24em] opacity-75">{eyebrow}</div>
      <div className="mt-3 text-lg font-semibold">{title}</div>
      <div className="mt-2 text-sm leading-6 opacity-85">{description}</div>
    </div>
  );
}