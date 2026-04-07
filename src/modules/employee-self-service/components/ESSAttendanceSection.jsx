import React, { useMemo, useState } from 'react';
import { CalendarDays, LogIn, LogOut } from 'lucide-react';
import { ESSSectionCard, ESSStatusBadge } from './ESSShared';

const inputClassName = 'rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

export default function ESSAttendanceSection({ attendance, actionLoading, onSubmitAttendance }) {
  const [range, setRange] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const todayAttendance = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return attendance.find((item) => item.date === today) || null;
  }, [attendance]);

  const canCheckIn = !todayAttendance || todayAttendance.checkIn === '-';
  const canCheckOut = Boolean(todayAttendance?.checkIn && todayAttendance.checkIn !== '-' && todayAttendance.checkOut === '-');

  const filteredAttendance = useMemo(() => {
    const today = new Date();
    let threshold = null;

    if (range === 'daily') {
      threshold = new Date(today);
      threshold.setDate(today.getDate() - 1);
    }

    if (range === 'weekly') {
      threshold = new Date(today);
      threshold.setDate(today.getDate() - 7);
    }

    if (range === 'monthly') {
      threshold = new Date(today);
      threshold.setDate(today.getDate() - 30);
    }

    return attendance.filter((item) => {
      const currentDate = new Date(item.date);

      if (threshold && currentDate < threshold) {
        return false;
      }

      if (startDate && item.date < startDate) {
        return false;
      }

      if (endDate && item.date > endDate) {
        return false;
      }

      return true;
    });
  }, [attendance, endDate, range, startDate]);

  const summary = useMemo(() => ({
    hadir: attendance.filter((item) => item.status === 'Hadir').length,
    terlambat: attendance.filter((item) => item.status === 'Terlambat').length,
    izin: attendance.filter((item) => item.status === 'Izin').length,
    alpha: attendance.filter((item) => item.status === 'Alpha').length,
  }), [attendance]);

  return (
    <div className="space-y-6">
      <ESSSectionCard
        title="Aksi Presensi"
        description="Lakukan check-in atau check-out dan pantau status absensi Anda secara real-time."
        actions={(
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSubmitAttendance('check-in')}
              disabled={!canCheckIn}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              <LogIn className="h-4 w-4" />
              <span>{actionLoading === 'attendance-check-in' ? 'Memproses...' : 'Check-in'}</span>
            </button>
            <button
              type="button"
              onClick={() => onSubmitAttendance('check-out')}
              disabled={!canCheckOut}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-rose-300"
            >
              <LogOut className="h-4 w-4" />
              <span>{actionLoading === 'attendance-check-out' ? 'Memproses...' : 'Check-out'}</span>
            </button>
          </div>
        )}
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">Hadir</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-900">{summary.hadir}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="text-sm text-amber-700">Terlambat</p>
            <p className="mt-2 text-2xl font-semibold text-amber-900">{summary.terlambat}</p>
          </div>
          <div className="rounded-2xl bg-sky-50 p-4">
            <p className="text-sm text-sky-700">Izin</p>
            <p className="mt-2 text-2xl font-semibold text-sky-900">{summary.izin}</p>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4">
            <p className="text-sm text-rose-700">Alpha</p>
            <p className="mt-2 text-2xl font-semibold text-rose-900">{summary.alpha}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          Status hari ini: {todayAttendance ? `${todayAttendance.status} • check-in ${todayAttendance.checkIn} • check-out ${todayAttendance.checkOut}` : 'Belum ada presensi hari ini'}
        </div>
      </ESSSectionCard>

      <ESSSectionCard title="Riwayat Absensi" description="Filter riwayat harian, mingguan, atau bulanan sesuai kebutuhan Anda.">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'daily', label: 'Harian' },
              { id: 'weekly', label: 'Mingguan' },
              { id: 'monthly', label: 'Bulanan' },
              { id: 'all', label: 'Semua' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setRange(option.id)}
                className={[
                  'rounded-xl px-3 py-2 text-sm font-medium transition',
                  range === option.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                ].join(' ')}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarDays className="h-4 w-4" />
              <input type="date" className={inputClassName} value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            </label>
            <input type="date" className={inputClassName} value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-3 font-medium">Tanggal</th>
                <th className="pb-3 font-medium">Check-in</th>
                <th className="pb-3 font-medium">Check-out</th>
                <th className="pb-3 font-medium">Jam Kerja</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 text-gray-700">
                  <td className="py-3">{item.date}</td>
                  <td className="py-3">{item.checkIn}</td>
                  <td className="py-3">{item.checkOut}</td>
                  <td className="py-3">{item.workHours ? `${item.workHours} jam` : '-'}</td>
                  <td className="py-3"><ESSStatusBadge status={item.status} /></td>
                  <td className="py-3">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ESSSectionCard>
    </div>
  );
}