import React from 'react';

import KPISectionCard from './KPISectionCard';

function canEditTracking(item, currentUser, capabilities) {
  if (capabilities.canMonitorAll && currentUser.role === 'admin') {
    return true;
  }

  if (currentUser.role === 'user') {
    return item.employeeId === currentUser.employeeId;
  }

  return false;
}

export default function KPITrackingTab({ assignments, currentUser, capabilities, onEdit, onSubmit }) {
  return (
    <KPISectionCard title="Tracking & Monitoring" description="Input realisasi KPI, hitung progress otomatis, dan pantau timeline perubahan.">
      <div className="space-y-4">
        {assignments.map((item) => {
          const editable = canEditTracking(item, currentUser, capabilities);

          return (
            <div key={item.id} className="rounded-xl border border-gray-100 p-4">
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
                <div className="space-y-2">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{item.kpiName}</div>
                    <div className="text-sm text-gray-500">{item.employeeName} • {item.department} • {item.periodLabel}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">Target: {item.target} {item.unit}</span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Actual: {item.actual} {item.unit}</span>
                    <span className={`rounded-full px-3 py-1 ${item.trackingStatus === 'Achieved' ? 'bg-emerald-50 text-emerald-700' : item.trackingStatus === 'On Track' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'}`}>
                      {item.trackingStatus}
                    </span>
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">Score: {item.score}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden max-w-xl">
                    <div className={`h-full rounded-full ${item.trackingStatus === 'Achieved' ? 'bg-emerald-500' : item.trackingStatus === 'On Track' ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(item.progress, 100)}%` }} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <button
                    type="button"
                    disabled={!editable}
                    onClick={() => onEdit(item)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Input Realisasi
                  </button>
                  <button
                    type="button"
                    disabled={!editable || item.approvalStatus === 'Pending'}
                    onClick={() => onSubmit(item.id)}
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                  >
                    Submit KPI
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Latest Notes</div>
                  <div className="rounded-lg bg-gray-50 px-3 py-3 text-sm text-gray-600">{item.notes || 'Belum ada catatan realisasi.'}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Timeline</div>
                  <div className="space-y-2">
                    {item.timeline.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-start justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm">
                        <div>
                          <div className="font-medium text-gray-800">{event.label}</div>
                          <div className="text-gray-500">{event.actor}</div>
                        </div>
                        <div className="text-xs text-gray-400">{new Date(event.date).toLocaleString('id-ID')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </KPISectionCard>
  );
}
