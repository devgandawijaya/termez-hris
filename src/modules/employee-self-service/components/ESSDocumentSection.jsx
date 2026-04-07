import React, { useState } from 'react';
import { Download, FolderOpen, Upload } from 'lucide-react';
import { ESSSectionCard } from './ESSShared';
import { formatDateTime } from './ESSSharedUtils';

const inputClassName = 'w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

export default function ESSDocumentSection({ profile, documents, actionLoading, onUploadDocument, onDownloadDocument }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Pribadi',
    fileName: '',
  });
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setForm((current) => ({
      ...current,
      fileName: file.name,
      name: current.name || file.name.replace(/\.[^.]+$/, ''),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('Nama dokumen wajib diisi');
      return;
    }

    const result = await onUploadDocument(form);
    if (result?.success) {
      setForm({ name: '', category: 'Pribadi', fileName: '' });
      setError('');
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px,minmax(0,1fr)]">
      <ESSSectionCard title="Manajemen Dokumen" description="Akses dokumen perusahaan dan unggah dokumen pribadi yang diizinkan.">
        {profile.canUploadPersonalDocuments ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Nama Dokumen</label>
              <input className={inputClassName} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Kategori</label>
              <select className={inputClassName} value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
                <option value="Pribadi">Pribadi</option>
                <option value="Sertifikat">Sertifikat</option>
                <option value="Administrasi">Administrasi</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">File</label>
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 transition hover:border-indigo-400 hover:text-indigo-600">
                <span>{form.fileName || 'Pilih file dokumen'}</span>
                <input type="file" className="hidden" onChange={handleFileChange} />
                <Upload className="h-4 w-4" />
              </label>
            </div>
            {error ? <p className="text-xs text-rose-600">{error}</p> : null}
            <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
              <Upload className="h-4 w-4" />
              <span>{actionLoading === 'upload-document' ? 'Mengunggah...' : 'Upload Dokumen'}</span>
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-500">Akun ini tidak memiliki izin untuk mengunggah dokumen pribadi.</p>
        )}
      </ESSSectionCard>

      <ESSSectionCard title="Daftar Dokumen" description="Lihat dan unduh dokumen perusahaan maupun dokumen pribadi yang tersimpan.">
        <div className="space-y-4">
          {documents.map((document) => (
            <div key={document.id} className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{document.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{document.category} • {document.source} • {document.fileName}</p>
                  <p className="mt-1 text-xs text-gray-500">Diunggah {formatDateTime(document.uploadedAt)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onDownloadDocument(document.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-indigo-500 hover:text-indigo-600"
              >
                <Download className="h-4 w-4" />
                <span>{actionLoading === `download-document-${document.id}` ? 'Mengunduh...' : 'Download'}</span>
              </button>
            </div>
          ))}
        </div>
      </ESSSectionCard>
    </div>
  );
}