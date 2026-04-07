/**
 * Employee Self Service Page
 * Full ESS experience implemented inside the existing feature module flow.
 */

import React from 'react';
import {
  Bell,
  CalendarRange,
  CheckCheck,
  Clock3,
  FolderOpen,
  Megaphone,
  ReceiptText,
  UserRound,
  Wallet,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ESSAnnouncementSection from '../components/ESSAnnouncementSection';
import ESSApprovalSection from '../components/ESSApprovalSection';
import ESSAttendanceSection from '../components/ESSAttendanceSection';
import ESSClaimSection from '../components/ESSClaimSection';
import ESSDocumentSection from '../components/ESSDocumentSection';
import ESSLeaveSection from '../components/ESSLeaveSection';
import ESSNotificationSection from '../components/ESSNotificationSection';
import ESSPayrollSection from '../components/ESSPayrollSection';
import ESSProfileSection from '../components/ESSProfileSection';
import { ESSTabNavigation } from '../components/ESSShared';
import useEmployeeSelfServiceViewModel from '../viewmodels/useEmployeeSelfServiceViewModel';

const tabs = [
  { id: 'profile', label: 'Profil', icon: UserRound },
  { id: 'attendance', label: 'Absensi', icon: Clock3 },
  { id: 'leave', label: 'Cuti & Izin', icon: CalendarRange },
  { id: 'payroll', label: 'Slip Gaji', icon: Wallet },
  { id: 'claims', label: 'Klaim', icon: ReceiptText },
  { id: 'documents', label: 'Dokumen', icon: FolderOpen },
  { id: 'notifications', label: 'Notifikasi', icon: Bell },
  { id: 'announcements', label: 'Pengumuman', icon: Megaphone },
  { id: 'approvals', label: 'Approval', icon: CheckCheck },
];

export default function EmployeeSelfServicePage() {
  const {
    activeTab,
    setActiveTab,
    data,
    loading,
    error,
    feedback,
    clearFeedback,
    actionLoading,
    summary,
    saveProfile,
    changePassword,
    uploadPhoto,
    submitAttendance,
    submitLeave,
    submitClaim,
    uploadDocument,
    toggleNotification,
    markNotificationsRead,
    downloadPayroll,
    downloadEmployeeDocument,
    processApprovalDecision,
    refreshData,
  } = useEmployeeSelfServiceViewModel();

  const renderContent = () => {
    if (!data) {
      return null;
    }

    switch (activeTab) {
      case 'profile':
        return (
          <ESSProfileSection
            profile={data.profile}
            actionLoading={actionLoading}
            onSaveProfile={saveProfile}
            onChangePassword={changePassword}
            onUploadPhoto={uploadPhoto}
          />
        );
      case 'attendance':
        return (
          <ESSAttendanceSection
            attendance={data.attendance}
            actionLoading={actionLoading}
            onSubmitAttendance={submitAttendance}
          />
        );
      case 'leave':
        return (
          <ESSLeaveSection
            leaveBalance={data.leaveBalance}
            leaveRequests={data.leaveRequests}
            actionLoading={actionLoading}
            onSubmitLeave={submitLeave}
          />
        );
      case 'payroll':
        return (
          <ESSPayrollSection
            payrolls={data.payrolls}
            actionLoading={actionLoading}
            onDownloadPayroll={downloadPayroll}
          />
        );
      case 'claims':
        return (
          <ESSClaimSection
            claims={data.claims}
            actionLoading={actionLoading}
            onSubmitClaim={submitClaim}
          />
        );
      case 'documents':
        return (
          <ESSDocumentSection
            profile={data.profile}
            documents={data.documents}
            actionLoading={actionLoading}
            onUploadDocument={uploadDocument}
            onDownloadDocument={downloadEmployeeDocument}
          />
        );
      case 'notifications':
        return (
          <ESSNotificationSection
            notifications={data.notifications}
            actionLoading={actionLoading}
            onToggleNotification={toggleNotification}
            onMarkAllRead={markNotificationsRead}
          />
        );
      case 'announcements':
        return <ESSAnnouncementSection announcements={data.announcements} />;
      case 'approvals':
        return (
          <ESSApprovalSection
            approvals={data.approvals}
            actionLoading={actionLoading}
            onProcessApproval={processApprovalDecision}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-12 pt-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
              <span>Admin</span>
              <span>/</span>
              <span>Core HR</span>
              <span>/</span>
              <span className="font-medium text-gray-900">Employee Self Service</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Employee Self Service (ESS)</h1>
            <p className="mt-2 max-w-3xl text-lg text-gray-600">
              Modul mandiri karyawan untuk profil, absensi, cuti, payroll, dokumen, notifikasi, pengumuman, dan approval.
            </p>
          </div>
          <button
            type="button"
            onClick={refreshData}
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-indigo-500 hover:text-indigo-600"
          >
            Refresh Data
          </button>
        </div>

        {feedback ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={[
              'mb-6 flex items-start justify-between gap-4 rounded-2xl border px-5 py-4 text-sm',
              feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-rose-200 bg-rose-50 text-rose-900',
            ].join(' ')}
          >
            <p>{feedback.message}</p>
            <button type="button" onClick={clearFeedback} className="font-semibold">Tutup</button>
          </motion.div>
        ) : null}

        {loading ? (
          <div className="flex h-72 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-900">
            <h2 className="text-lg font-semibold">Gagal Memuat ESS</h2>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summary.map((item) => (
                <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{item.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{item.helper}</p>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <ESSTabNavigation tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={activeTab}>
              {renderContent()}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}