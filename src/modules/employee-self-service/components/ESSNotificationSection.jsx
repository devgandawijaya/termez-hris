import React from 'react';
import { BellRing, CheckCheck } from 'lucide-react';
import { ESSSectionCard } from './ESSShared';
import { formatDateTime } from './ESSSharedUtils';

export default function ESSNotificationSection({ notifications, actionLoading, onToggleNotification, onMarkAllRead }) {
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <ESSSectionCard
      title="Notifikasi"
      description="Pantau approval cuti, slip gaji terbaru, dan pengumuman perusahaan."
      actions={(
        <button
          type="button"
          onClick={onMarkAllRead}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-indigo-500 hover:text-indigo-600"
        >
          <CheckCheck className="h-4 w-4" />
          <span>{actionLoading === 'mark-notifications' ? 'Memproses...' : 'Tandai Semua Dibaca'}</span>
        </button>
      )}
    >
      <div className="mb-5 rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
        {unreadCount} notifikasi belum dibaca.
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className={[
            'rounded-2xl border p-5 transition',
            notification.isRead ? 'border-gray-200 bg-white' : 'border-indigo-200 bg-indigo-50/50',
          ].join(' ')}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-3">
                <div className={[
                  'rounded-2xl p-3',
                  notification.isRead ? 'bg-gray-100 text-gray-500' : 'bg-indigo-100 text-indigo-600',
                ].join(' ')}>
                  <BellRing className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                    {!notification.isRead ? <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-semibold text-white">Baru</span> : null}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{notification.type}</p>
                  <p className="mt-3 text-sm text-gray-700">{notification.message}</p>
                  <p className="mt-3 text-xs text-gray-500">{formatDateTime(notification.createdAt)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onToggleNotification(notification.id)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-indigo-500 hover:text-indigo-600"
              >
                {actionLoading === `toggle-notification-${notification.id}` ? 'Memproses...' : notification.isRead ? 'Tandai Belum Dibaca' : 'Tandai Dibaca'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </ESSSectionCard>
  );
}