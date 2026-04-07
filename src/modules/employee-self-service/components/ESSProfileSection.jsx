import React, { useEffect, useState } from 'react';
import { Camera, LockKeyhole, Save } from 'lucide-react';
import { ESSInfoPair, ESSSectionCard } from './ESSShared';

const inputClassName = 'w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

export default function ESSProfileSection({
  profile,
  actionLoading,
  onSaveProfile,
  onChangePassword,
  onUploadPhoto,
}) {
  const [form, setForm] = useState(profile);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const validateProfile = () => {
    const nextErrors = {};

    if (!form.fullName?.trim()) {
      nextErrors.fullName = 'Nama lengkap wajib diisi';
    }

    if (!form.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      nextErrors.email = 'Format email tidak valid';
    }

    if (!form.phone?.trim()) {
      nextErrors.phone = 'Nomor HP wajib diisi';
    }

    if (!form.address?.trim()) {
      nextErrors.address = 'Alamat wajib diisi';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validatePassword = () => {
    const nextErrors = {};

    if (!passwordForm.currentPassword) {
      nextErrors.currentPassword = 'Password saat ini wajib diisi';
    }

    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      nextErrors.newPassword = 'Password baru minimal 8 karakter';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      nextErrors.confirmPassword = 'Konfirmasi password tidak sama';
    }

    setPasswordErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (!validateProfile()) {
      return;
    }

    await onSaveProfile(form);
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!validatePassword()) {
      return;
    }

    const result = await onChangePassword(passwordForm);
    if (result?.success) {
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onUploadPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,minmax(0,1fr)]">
      <ESSSectionCard title="Ringkasan Profil" description="Data utama karyawan dan akses pembaruan foto profil.">
        <div className="space-y-5">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 p-6 text-white">
            <div className="flex items-center gap-4">
              <img
                src={form.photo}
                alt={form.fullName}
                className="h-20 w-20 rounded-2xl border-2 border-white/40 bg-white object-cover"
              />
              <div>
                <p className="text-lg font-semibold">{form.fullName}</p>
                <p className="text-sm text-indigo-100">{form.position}</p>
                <p className="text-xs text-indigo-100">{form.department}</p>
              </div>
            </div>
            <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
              <Camera className="h-4 w-4" />
              <span>{actionLoading === 'upload-photo' ? 'Mengunggah...' : 'Ubah Foto'}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>

          <div className="grid gap-3">
            <ESSInfoPair label="NIK" value={form.nik} />
            <ESSInfoPair label="Employee ID" value={form.employeeId} />
            <ESSInfoPair label="Lokasi Kerja" value={form.workLocation} />
            <ESSInfoPair label="Atasan Langsung" value={form.manager} />
            <ESSInfoPair label="Tanggal Bergabung" value={form.joinDate} />
          </div>
        </div>
      </ESSSectionCard>

      <div className="space-y-6">
        <ESSSectionCard
          title="Data Pribadi"
          description="Perbarui data personal dan kontak yang digunakan oleh sistem HRMS."
          actions={(
            <button
              type="submit"
              form="ess-profile-form"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Save className="h-4 w-4" />
              <span>{actionLoading === 'save-profile' ? 'Menyimpan...' : 'Simpan Profil'}</span>
            </button>
          )}
        >
          <form id="ess-profile-form" onSubmit={handleProfileSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input className={inputClassName} value={form.fullName || ''} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} />
              {errors.fullName ? <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
              <input className={inputClassName} value={form.email || ''} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
              {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Nomor HP</label>
              <input className={inputClassName} value={form.phone || ''} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
              {errors.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Kontak Darurat</label>
              <input className={inputClassName} value={form.emergencyContact || ''} onChange={(event) => setForm((current) => ({ ...current, emergencyContact: event.target.value }))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tempat Lahir</label>
              <input className={inputClassName} value={form.birthPlace || ''} onChange={(event) => setForm((current) => ({ ...current, birthPlace: event.target.value }))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Tanggal Lahir</label>
              <input type="date" className={inputClassName} value={form.birthDate || ''} onChange={(event) => setForm((current) => ({ ...current, birthDate: event.target.value }))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Jenis Kelamin</label>
              <select className={inputClassName} value={form.gender || ''} onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Status Pernikahan</label>
              <select className={inputClassName} value={form.maritalStatus || ''} onChange={(event) => setForm((current) => ({ ...current, maritalStatus: event.target.value }))}>
                <option value="Belum Menikah">Belum Menikah</option>
                <option value="Menikah">Menikah</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Alamat</label>
              <textarea className={`${inputClassName} min-h-28`} value={form.address || ''} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
              {errors.address ? <p className="mt-1 text-xs text-rose-600">{errors.address}</p> : null}
            </div>
          </form>
        </ESSSectionCard>

        <ESSSectionCard title="Ubah Password" description="Ganti password akun ESS Anda secara mandiri.">
          <form onSubmit={handlePasswordSubmit} className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Password Saat Ini</label>
              <input type="password" className={inputClassName} value={passwordForm.currentPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))} />
              {passwordErrors.currentPassword ? <p className="mt-1 text-xs text-rose-600">{passwordErrors.currentPassword}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Password Baru</label>
              <input type="password" className={inputClassName} value={passwordForm.newPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))} />
              {passwordErrors.newPassword ? <p className="mt-1 text-xs text-rose-600">{passwordErrors.newPassword}</p> : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Konfirmasi Password</label>
              <input type="password" className={inputClassName} value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))} />
              {passwordErrors.confirmPassword ? <p className="mt-1 text-xs text-rose-600">{passwordErrors.confirmPassword}</p> : null}
            </div>
            <div className="md:col-span-3">
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-indigo-500 hover:text-indigo-600">
                <LockKeyhole className="h-4 w-4" />
                <span>{actionLoading === 'change-password' ? 'Memperbarui...' : 'Perbarui Password'}</span>
              </button>
            </div>
          </form>
        </ESSSectionCard>
      </div>
    </div>
  );
}