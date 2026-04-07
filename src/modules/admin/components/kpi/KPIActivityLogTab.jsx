import React from 'react';

import KPISectionCard from './KPISectionCard';

export default function KPIActivityLogTab({ logs, roleSummary }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6">
      <KPISectionCard title="Activity Log" description="Tracking perubahan KPI, siapa yang update, dan timestamp terbaru.">
        <div className="space-y-3">
          {logs.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-100 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <div className="font-medium text-gray-900">{item.action}</div>
                <div className="text-sm text-gray-500">{item.actor} • {item.module}</div>
              </div>
              <div className="text-sm text-gray-400">{new Date(item.timestamp).toLocaleString('id-ID')}</div>
            </div>
          ))}
        </div>
      </KPISectionCard>

      <KPISectionCard title="Role & Permission" description="Hak akses dasar sesuai spesifikasi modul KPI Management.">
        <div className="space-y-4 text-sm text-gray-600">
          <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
            <div className="font-semibold text-indigo-900">Admin</div>
            <div className="mt-1">{roleSummary.admin}</div>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
            <div className="font-semibold text-amber-900">User Biasa</div>
            <div className="mt-1">{roleSummary.user}</div>
          </div>
        </div>
      </KPISectionCard>
    </div>
  );
}
