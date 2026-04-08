import React from 'react';
import { MapPin, Wifi, WifiOff, X } from 'lucide-react';

const badgeTone = {
  'On Time': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Late: 'bg-rose-100 text-rose-700 border-rose-200',
  'Early Leave': 'bg-amber-100 text-amber-700 border-amber-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-100 text-rose-700 border-rose-200',
  Verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Failed: 'bg-rose-100 text-rose-700 border-rose-200',
  Online: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Offline: 'bg-slate-200 text-slate-700 border-slate-300',
  Idle: 'bg-slate-100 text-slate-600 border-slate-200',
  Absent: 'bg-slate-200 text-slate-700 border-slate-300',
};

export function AttendanceSectionCard({ title, description, actions = null, children, tone = 'white' }) {
  const toneClass = tone === 'sky'
    ? 'border-sky-100 bg-sky-50/60'
    : tone === 'slate'
      ? 'border-slate-200 bg-slate-50/90'
      : 'border-white/70 bg-white/95';

  return (
    <section className={`rounded-[28px] border p-5 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.35)] ${toneClass} md:p-6`}>
      <div className="flex flex-col gap-4 border-b border-slate-200/70 pb-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 md:text-xl">{title}</h2>
          {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
        {actions}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

export function AttendanceStatusBadge({ value }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeTone[value] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {value}
    </span>
  );
}

export function SummaryTile({ label, value, helper, tone = 'slate' }) {
  const toneClass = {
    emerald: 'from-emerald-500/15 to-emerald-50 text-emerald-950',
    rose: 'from-rose-500/15 to-rose-50 text-rose-950',
    amber: 'from-amber-500/15 to-amber-50 text-amber-950',
    sky: 'from-sky-500/15 to-sky-50 text-sky-950',
    slate: 'from-slate-500/10 to-white text-slate-950',
  }[tone] || 'from-slate-500/10 to-white text-slate-950';

  return (
    <div className={`rounded-3xl border border-white/70 bg-gradient-to-br ${toneClass} p-5`}>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
      {helper ? <div className="mt-2 text-sm text-slate-600">{helper}</div> : null}
    </div>
  );
}

export function NetworkBadge({ isOnline, queueSize, syncingOffline, onSync }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        {isOnline ? <Wifi className="h-4 w-4 text-emerald-600" /> : <WifiOff className="h-4 w-4 text-amber-600" />}
        <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
      </div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        Queue: {queueSize}
      </span>
      {queueSize > 0 ? (
        <button
          type="button"
          onClick={onSync}
          disabled={!isOnline || syncingOffline}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {syncingOffline ? 'Syncing...' : 'Sync Now'}
        </button>
      ) : null}
    </div>
  );
}

export function AttendanceProgress({ label, progress, tone = 'emerald' }) {
  const barClass = tone === 'rose' ? 'bg-rose-500' : tone === 'amber' ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className={`h-2 rounded-full transition-all duration-300 ${barClass}`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export function AttendanceMap({ geoSetting, records, title = 'Attendance Map' }) {
  const range = 0.003;
  const markers = records.map((record) => {
    const x = ((record.longitude - (geoSetting.longitude - range)) / (range * 2)) * 100;
    const y = 100 - (((record.latitude - (geoSetting.latitude - range)) / (range * 2)) * 100);
    return {
      ...record,
      x: Math.max(6, Math.min(94, x)),
      y: Math.max(8, Math.min(92, y)),
    };
  });

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">Marker menampilkan lokasi office dan titik attendance check-in atau check-out terakhir.</p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
          Radius {geoSetting.radius}m
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[280px] overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,_rgba(226,232,240,0.6)_0%,_rgba(248,250,252,0.92)_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.16),_transparent_40%),linear-gradient(to_right,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px)] bg-[size:auto,40px_40px,40px_40px]" />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
            <div className="h-4 w-4 rounded-full border-4 border-sky-500 bg-white" />
            <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">{geoSetting.office_name}</span>
          </div>

          {markers.map((marker) => (
            <div
              key={`${marker.id}-${marker.date}`}
              className="group absolute"
              style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className={`h-4 w-4 rounded-full border-2 border-white shadow ${marker.method === 'Offline' ? 'bg-amber-500' : marker.method === 'Biometric' ? 'bg-emerald-500' : 'bg-sky-500'}`} />
              <div className="pointer-events-none absolute left-1/2 top-5 hidden min-w-[180px] -translate-x-1/2 rounded-2xl bg-slate-950 px-3 py-2 text-xs text-white shadow-xl group-hover:block">
                <div className="font-semibold">{marker.employee?.name || 'Employee'}</div>
                <div>{marker.date} • {marker.method}</div>
                <div>{marker.status}</div>
                <div>{marker.latitude?.toFixed(4)}, {marker.longitude?.toFixed(4)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Office coordinate</div>
            <div className="mt-3 flex items-center gap-2 font-medium text-slate-900">
              <MapPin className="h-4 w-4 text-sky-600" />
              <span>{geoSetting.latitude}, {geoSetting.longitude}</span>
            </div>
          </div>

          <div className="max-h-[220px] space-y-3 overflow-auto pr-1">
            {markers.length ? markers.map((marker) => (
              <div key={`legend-${marker.id}-${marker.date}`} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-900">{marker.employee?.name || 'Employee'}</div>
                  <AttendanceStatusBadge value={marker.status} />
                </div>
                <div className="mt-2">{marker.date} • {marker.check_in} - {marker.check_out}</div>
                <div className="mt-1 text-xs">{marker.latitude?.toFixed(4)}, {marker.longitude?.toFixed(4)} • {marker.method}</div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                Belum ada marker attendance untuk filter saat ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AttendanceModal({ open, title, description, onClose, children, footer }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] border border-white/70 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
            {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}

export function AttendanceToast({ toast }) {
  if (!toast) {
    return null;
  }

  const toneClass = toast.tone === 'error'
    ? 'border-rose-200 bg-rose-50 text-rose-700'
    : toast.tone === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700';

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border px-4 py-3 text-sm font-medium shadow-xl ${toneClass}`}>
      {toast.message}
    </div>
  );
}

export function SortButton({ label, field, sortField, sortDirection, onSort }) {
  return (
    <button type="button" onClick={() => onSort(field)} className="inline-flex items-center gap-1 font-medium text-slate-500 transition hover:text-slate-800">
      <span>{label}</span>
      <span className="text-[10px] uppercase">{sortField === field ? sortDirection : '-'}</span>
    </button>
  );
}