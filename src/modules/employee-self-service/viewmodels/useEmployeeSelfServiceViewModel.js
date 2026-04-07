/**
 * Employee Self Service ViewModel
 * Centralizes data loading and user actions for the ESS module.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  downloadDocument,
  downloadPayslipPdf,
  getEmployeeSelfServiceData,
  markAllNotificationsRead,
  processApproval,
  submitAttendanceAction,
  submitClaim,
  submitLeaveRequest,
  toggleNotificationRead,
  updateEmployeePassword,
  updateEmployeeProfile,
  updateProfilePhoto,
  uploadPersonalDocument,
} from '../services/employeeSelfServiceService';

export default function useEmployeeSelfServiceViewModel() {
  const [activeTab, setActiveTab] = useState('profile');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [actionLoading, setActionLoading] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getEmployeeSelfServiceData();
      if (!result.success) {
        throw new Error(result.message);
      }

      setData(result.data);
    } catch (err) {
      setError(err.message || 'Gagal memuat data ESS');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const runAction = useCallback(async (key, action, options = {}) => {
    const { refresh = true } = options;
    setActionLoading(key);
    setFeedback(null);

    try {
      const result = await action();
      if (!result.success) {
        throw new Error(result.message);
      }

      if (refresh) {
        await loadData();
      }

      if (result.message) {
        setFeedback({ type: 'success', message: result.message });
      }

      return result;
    } catch (err) {
      const message = err.message || 'Terjadi kesalahan';
      setFeedback({ type: 'error', message });
      return { success: false, message };
    } finally {
      setActionLoading('');
    }
  }, [loadData]);

  const summary = useMemo(() => {
    if (!data) {
      return [];
    }

    const unreadNotifications = data.notifications.filter((item) => !item.isRead).length;
    const pendingLeave = data.leaveRequests.filter((item) => item.status === 'Pending').length;
    const pendingClaims = data.claims.filter((item) => item.status === 'Pending').length;
    const pendingApprovals = data.approvals.filter((item) => item.status === 'Pending').length;

    return [
      {
        id: 'annual-leave',
        label: 'Sisa Cuti Tahunan',
        value: `${data.leaveBalance.find((item) => item.id === 'annual')?.remaining || 0} hari`,
        helper: 'Kuota aktif tahun berjalan',
      },
      {
        id: 'notifications',
        label: 'Notifikasi Belum Dibaca',
        value: unreadNotifications,
        helper: 'Butuh tindak lanjut',
      },
      {
        id: 'requests',
        label: 'Pengajuan Pending',
        value: pendingLeave + pendingClaims,
        helper: 'Cuti, izin, dan klaim',
      },
      {
        id: 'approvals',
        label: 'Approval Menunggu',
        value: pendingApprovals,
        helper: 'Tampil jika Anda atasan',
      },
    ];
  }, [data]);

  return {
    activeTab,
    setActiveTab,
    data,
    loading,
    error,
    feedback,
    clearFeedback: () => setFeedback(null),
    actionLoading,
    summary,
    refreshData: loadData,
    saveProfile: (payload) => runAction('save-profile', () => updateEmployeeProfile(payload)),
    changePassword: (payload) => runAction('change-password', () => updateEmployeePassword(payload), { refresh: false }),
    uploadPhoto: (payload) => runAction('upload-photo', () => updateProfilePhoto(payload)),
    submitAttendance: (payload) => runAction(`attendance-${payload}`, () => submitAttendanceAction(payload)),
    submitLeave: (payload) => runAction('submit-leave', () => submitLeaveRequest(payload)),
    submitClaim: (payload) => runAction('submit-claim', () => submitClaim(payload)),
    uploadDocument: (payload) => runAction('upload-document', () => uploadPersonalDocument(payload)),
    toggleNotification: (id) => runAction(`toggle-notification-${id}`, () => toggleNotificationRead(id)),
    markNotificationsRead: () => runAction('mark-notifications', () => markAllNotificationsRead()),
    downloadPayroll: (id) => runAction(`download-payroll-${id}`, () => downloadPayslipPdf(id), { refresh: false }),
    downloadEmployeeDocument: (id) => runAction(`download-document-${id}`, () => downloadDocument(id), { refresh: false }),
    processApprovalDecision: (id, decision, note) => runAction(`approval-${id}-${decision}`, () => processApproval(id, decision, note)),
  };
}