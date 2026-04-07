import React, { useState } from 'react';
import { Megaphone } from 'lucide-react';
import { ESSSectionCard, formatDateTime } from './ESSShared';

export default function ESSAnnouncementSection({ announcements }) {
  const [selectedId, setSelectedId] = useState(announcements[0]?.id || '');

  const selectedAnnouncement = announcements.find((item) => item.id === selectedId) || announcements[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[360px,minmax(0,1fr)]">
      <ESSSectionCard title="Pengumuman Perusahaan" description="Lihat daftar pengumuman dan baca detail informasinya.">
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <button
              key={announcement.id}
              type="button"
              onClick={() => setSelectedId(announcement.id)}
              className={[
                'w-full rounded-2xl border p-4 text-left transition',
                selectedAnnouncement?.id === announcement.id ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
              ].join(' ')}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{formatDateTime(announcement.createdAt)}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600">{announcement.summary}</p>
            </button>
          ))}
        </div>
      </ESSSectionCard>

      <ESSSectionCard title="Detail Pengumuman" description="Konten lengkap pengumuman yang dipilih.">
        {selectedAnnouncement ? (
          <div className="rounded-2xl bg-gray-50 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-semibold text-gray-900">{selectedAnnouncement.title}</h3>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">{selectedAnnouncement.author}</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">{formatDateTime(selectedAnnouncement.createdAt)}</p>
            <p className="mt-6 whitespace-pre-line text-sm leading-7 text-gray-700">{selectedAnnouncement.content}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Belum ada pengumuman untuk ditampilkan.</p>
        )}
      </ESSSectionCard>
    </div>
  );
}