import React from 'react';

export function ESSSectionCard({ title, description, actions, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

export function ESSTabNavigation({ tabs, activeTab, onChange }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                'flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              ].join(' ')}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ESSStatusBadge({ status }) {
  const tone = {
    Hadir: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Terlambat: 'bg-amber-50 text-amber-700 border-amber-200',
    Izin: 'bg-sky-50 text-sky-700 border-sky-200',
    Alpha: 'bg-rose-50 text-rose-700 border-rose-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Disetujui: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Ditolak: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span className={[
      'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold',
      tone[status] || 'bg-gray-50 text-gray-700 border-gray-200',
    ].join(' ')}>
      {status}
    </span>
  );
}

export function ESSInfoPair({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-900">{value || '-'}</p>
    </div>
  );
}