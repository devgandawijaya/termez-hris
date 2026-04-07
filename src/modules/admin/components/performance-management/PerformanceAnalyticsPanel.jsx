import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { EmptyState, SectionCard, StatCard } from './PerformanceShared';

const pieColors = ['#0EA5E9', '#10B981', '#F59E0B'];

export default function PerformanceAnalyticsPanel({ analytics }) {
  const strongestDepartment = [...analytics.departmentPerformance].sort((left, right) => right.averageScore - left.averageScore)[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {analytics.summaryCards.map((item) => (
          <StatCard key={item.id} label={item.label} value={item.value} tone={item.tone} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Executive Watchlist" description="Halaman analytics berbeda karena berfungsi sebagai pusat monitoring dan pengambilan keputusan lintas tim.">
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">Strongest department</div>
              <div className="mt-3 text-2xl font-semibold text-emerald-900">{strongestDepartment?.department || '-'}</div>
              <div className="mt-2 text-sm text-emerald-800">Average score {strongestDepartment?.averageScore || 0}. Cocok dijadikan benchmark lintas unit.</div>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-amber-700">Action priority</div>
              <div className="mt-3 text-sm leading-6 text-amber-900">Gunakan leaderboard dan low performer alert untuk menentukan coaching plan, talent acceleration, atau eskalasi manager.</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="How To Read This Dashboard" description="Urutan baca yang disarankan agar dashboard dipakai untuk decision making, bukan hanya display angka.">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">Mulai dari KPI cards untuk melihat kondisi umum dan sinyal prioritas.</div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">Turun ke chart departemen dan trend untuk mencari pola yang konsisten atau memburuk.</div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">Akhiri dengan leaderboard dan alert untuk menentukan tindakan nyata per employee atau unit.</div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="Performance per Department" description="Bar chart rata-rata appraisal per departemen untuk monitoring cepat HRD.">
          {analytics.departmentPerformance.length === 0 ? (
            <EmptyState title="No department analytics" description="Belum ada appraisal yang bisa diolah menjadi agregasi departemen." />
          ) : (
            <div className="h-[320px] w-full">
              <ResponsiveContainer>
                <BarChart data={analytics.departmentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="department" tick={{ fill: '#64748B', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="averageScore" fill="#0EA5E9" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Grade Distribution" description="Sebaran grade A, B, dan C dari performance appraisal terkini.">
          {analytics.distribution.length === 0 ? (
            <EmptyState title="No distribution yet" description="Buat appraisal untuk melihat pie chart distribusi nilai." />
          ) : (
            <div className="h-[320px] w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={analytics.distribution} dataKey="total" nameKey="grade" cx="50%" cy="50%" outerRadius={90} innerRadius={55} paddingAngle={4}>
                    {analytics.distribution.map((entry, index) => (
                      <Cell key={entry.grade} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard title="Performance Trend" description="Line chart perkembangan score rata-rata organisasi terhadap target score.">
          <div className="h-[320px] w-full">
            <ResponsiveContainer>
              <LineChart data={analytics.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" name="Average Score" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#0F172A" strokeDasharray="6 6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Leaderboard" description="Top performer dan talent pool yang paling siap dipromosikan.">
          {analytics.leaderboard.length === 0 ? (
            <EmptyState title="Leaderboard empty" description="Belum ada data appraisal untuk menyusun peringkat performa." />
          ) : (
            <div className="space-y-3">
              {analytics.leaderboard.map((entry, index) => (
                <div key={entry.employeeName} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold ${index === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{entry.employeeName}</div>
                      <div className="text-xs text-slate-500">{entry.department} • Grade {entry.grade}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold text-slate-900">{entry.finalScore}</div>
                    <div className="text-xs text-slate-500">final score</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Low Performer Alert" description="Daftar alert untuk karyawan dengan score di bawah ambang sehat sehingga HRD bisa menyiapkan tindakan cepat.">
        {analytics.alerts.length === 0 ? (
          <EmptyState title="No active alerts" description="Tidak ada karyawan yang berada di bawah benchmark performa saat ini." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {analytics.alerts.map((alert) => (
              <div key={alert.id} className="rounded-3xl border border-rose-100 bg-rose-50 p-5">
                <div className="text-sm font-semibold text-rose-900">{alert.employeeName}</div>
                <div className="mt-1 text-sm text-rose-700">{alert.department}</div>
                <div className="mt-4 text-sm font-medium text-rose-900">{alert.issue}</div>
                <div className="mt-2 text-sm text-rose-700">{alert.action}</div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}