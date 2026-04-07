import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import KPISectionCard from './KPISectionCard';

const chartColors = ['#2563eb', '#0f766e', '#d97706', '#7c3aed'];

function SummaryCard({ title, value, subtitle }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-4">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-3xl font-semibold text-slate-900 mt-2">{value}</div>
      <div className="text-sm text-slate-500 mt-1">{subtitle}</div>
    </div>
  );
}

function ProgressRow({ item }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div>
          <div className="font-medium text-gray-800">{item.kpiName}</div>
          <div className="text-gray-500">{item.employeeName} • {item.department}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-gray-900">{item.progress}%</div>
          <div className={`text-xs ${item.trackingStatus === 'Achieved' ? 'text-green-600' : item.trackingStatus === 'On Track' ? 'text-amber-600' : 'text-rose-600'}`}>
            {item.trackingStatus}
          </div>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${item.trackingStatus === 'Achieved' ? 'bg-green-500' : item.trackingStatus === 'On Track' ? 'bg-amber-500' : 'bg-rose-500'}`}
          style={{ width: `${Math.min(item.progress, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function KPIDashboardTab({ summary, byEmployee, byDepartment, assignments, finalScores }) {
  const topAssignments = assignments.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard title="Total KPI" value={summary.total} subtitle="Total assignment dalam scope filter" />
        <SummaryCard title="Active KPI" value={summary.active} subtitle="Masih aktif dan sedang dipantau" />
        <SummaryCard title="Completed KPI" value={summary.completed} subtitle="Sudah mencapai target" />
        <SummaryCard title="Average Progress" value={`${summary.averageProgress}%`} subtitle="Rata-rata progress KPI" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <KPISectionCard title="Performa KPI per Karyawan" description="Rata-rata progress dan final score per karyawan.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byEmployee}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="progress" name="Progress %" radius={[8, 8, 0, 0]} fill="#2563eb" />
                <Bar dataKey="finalScore" name="Final Score" radius={[8, 8, 0, 0]} fill="#0f766e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </KPISectionCard>

        <KPISectionCard title="Performa KPI per Departemen" description="Perbandingan progress dan score per departemen.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byDepartment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="progress" name="Progress %" radius={[8, 8, 0, 0]}>
                  {byDepartment.map((entry, index) => (
                    <Cell key={entry.department} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
                <Bar dataKey="finalScore" name="Final Score" radius={[8, 8, 0, 0]} fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </KPISectionCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <KPISectionCard title="Progress Bar KPI" description="Progress assignment KPI terdepan berdasarkan filter.">
          <div className="space-y-5">
            {topAssignments.length === 0 ? (
              <div className="text-sm text-gray-500">Belum ada assignment KPI dalam filter aktif.</div>
            ) : topAssignments.map((item) => <ProgressRow key={item.id} item={item} />)}
          </div>
        </KPISectionCard>

        <KPISectionCard title="Final Score per Karyawan" description="Normalisasi score akhir berdasarkan formula realisasi terhadap target.">
          <div className="space-y-3">
            {finalScores.map((item) => (
              <div key={item.employeeId} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                <div>
                  <div className="font-medium text-gray-900">#{item.rank} {item.name}</div>
                  <div className="text-sm text-gray-500">{item.department} • {item.totalKpi} KPI</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{item.finalScore}</div>
                  <div className="text-xs text-gray-500">Progress {item.progress}%</div>
                </div>
              </div>
            ))}
          </div>
        </KPISectionCard>
      </div>
    </div>
  );
}
