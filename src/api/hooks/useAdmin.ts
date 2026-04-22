import { useMemo } from 'react';
import apiInstance from '../apiInstance';

export const useAdmin = () => {
  /**
   * Get comprehensive report statistics (Admin)
   * Matches RN: reports/admin/stats
   */
  const getReportStats = async () => {
    const res = await apiInstance.get('reports/admin/stats');
    return res.data;
  };

  // ── Users ───────────────────────────────────────────────────────────────
  const adminListUsers = async (
    search?: string,
    role?: 'venter' | 'listener' | 'both',
    limit: number = 20,
    offset: number = 0,
  ) => {
    const res = await apiInstance.get('admin/users', {
      params: { search, role, limit, offset },
    });
    return res.data;
  };

  const getUsers = adminListUsers;

  const getUserDetail = async (userId: string) => {
    const res = await apiInstance.get(`admin/users/${userId}`);
    return res.data;
  };

  const adminGetUserDetail = getUserDetail;

  /** Suspend / reactivate user — matches native adminSuspendUser (payload: { suspended: boolean }) */
  const adminSuspendUser = async (userId: string, payload: { suspended: boolean }) => {
    const res = await apiInstance.put(`admin/users/${userId}/suspend`, payload);
    return res.data;
  };

  /** Delete user */
  const adminDeleteUser = async (userId: string) => {
    const res = await apiInstance.delete(`admin/users/${userId}`);
    return res.data;
  };

  /** Bulk delete — matches native adminBulkDeleteUsers (payload: { userIds: string[] }) */
  const adminBulkDeleteUsers = async (payload: { userIds: string[] }) => {
    const res = await apiInstance.delete('admin/users', { data: payload });
    return res.data;
  };

  /** Bulk role update */
  const adminBulkUpdateUserRoles = async (payload: { userIds: string[]; role: string }) => {
    const res = await apiInstance.put('admin/users/roles', payload);
    return res.data;
  };

  const toggleUserStatus = async (userId: string, action: 'suspend' | 'activate' | 'ban') => {
    const res = await apiInstance.post(`admin/users/${userId}/${action}`);
    return res.data;
  };

  // ── Sub-Admins ──────────────────────────────────────────────────────────
  const getSubAdmins = async () => {
    const res = await apiInstance.get('sub-admins');
    return res.data;
  };

  /** Matches native createSubAdmin logic used in standalone page */
  const createSubAdmin = async (payload: { email: string; password?: string; permissions?: Record<string, boolean> }) => {
    const res = await apiInstance.post('sub-admins', payload);
    return res.data;
  };

  const addSubAdmin = createSubAdmin;

  const getSubAdminDetail = async (id: string) => {
    const res = await apiInstance.get(`sub-admins/${id}`);
    return res.data;
  };

  const updateSubAdminPermissions = async (id: string, payload: { permissions: Record<string, boolean> | string[] }) => {
    const res = await apiInstance.put(`sub-admins/${id}`, payload);
    return res.data;
  };

  const updateSubAdmin = async (id: string, payload: any) => {
    const res = await apiInstance.put(`sub-admins/${id}`, payload);
    return res.data;
  };

  const deleteSubAdmin = async (id: string) => {
    const res = await apiInstance.delete(`sub-admins/${id}`);
    return res.data;
  };

  const removeSubAdmin = deleteSubAdmin;

  // ── Listener Requests ───────────────────────────────────────────────────
  const getListenerRequests = async (status?: string) => {
    const res = await apiInstance.get('listener-verifications/admin/all', { params: { status } });
    return res.data;
  };

  const getListenerVerifications = getListenerRequests;

  const getListenerVerificationDetail = async (verificationId: string) => {
    const res = await apiInstance.get(`listener-verifications/admin/${verificationId}`);
    return res.data;
  };

  const reviewListenerVerification = async (
    verificationId: string,
    payload: { status: 'verified' | 'rejected'; adminNotes?: string },
  ) => {
    const res = await apiInstance.put(`listener-verifications/admin/${verificationId}`, payload);
    return res.data;
  };

  const reviewListenerRequest = reviewListenerVerification;

  // ── Reports ──────────────────────────────────────────────────────────────
  const getReports = async (
    status?: string,
    limit = 50,
    offset = 0,
    reason?: string,
  ) => {
    const res = await apiInstance.get('reports/admin/all', {
      params: { status, limit, offset, reason },
    });
    return res.data;
  };

  const getReportDetail = async (reportId: string) => {
    const res = await apiInstance.get(`reports/admin/${reportId}`);
    return res.data;
  };

  const getReportDetails = getReportDetail;

  /** Resolve report — matches native updateReportStatus (payload: { status: 'resolved' | 'open'; adminNotes?: string }) */
  const updateReportStatus = async (reportId: string, payload: { status: 'resolved' | 'open'; adminNotes?: string }) => {
    const res = await apiInstance.put(`reports/admin/${reportId}`, payload);
    return res.data;
  };

  const takeAction = async (reportId: string, action: string, notes?: string) => {
    const res = await apiInstance.post(`admin/reports/${reportId}/action`, { action, notes });
    return res.data;
  };

  const submitReport = async (payload: {
    reportedId: string;
    sessionType?: string;
    sessionId?: string;
    reason: string;
    description: string;
  }) => {
    const res = await apiInstance.post('reports', payload);
    return res.data;
  };

  // ── Financial ────────────────────────────────────────────────────────────
  const getFinancialStats = async (period?: string) => {
    const res = await apiInstance.get('admin/financial/stats', { params: { period } });
    return res.data;
  };

  const getPaymentHistory = async (params?: any) => {
    const res = await apiInstance.get('admin/payments/history', { params });
    return res.data;
  };

  /** Matches native getAdminPaymentStats used for financial dashboard */
  const getAdminPaymentStats = async () => {
    const res = await apiInstance.get('admin/payments/stats');
    return res.data;
  };

  /** Export payment history as PDF — matches native exportPaymentHistoryPDF */
  const exportPaymentHistoryPDF = async (params?: any) => {
    const res = await apiInstance.get('admin/payments/history/export/pdf', {
      params: { ...params, maxRows: 250 },
      responseType: 'blob',
    });
    return res.data;
  };

  // ── Exports & Integrations ──────────────────────────────────────────────
  const exportData = async (type: string, format: 'csv' | 'json' = 'csv') => {
    const res = await apiInstance.get(`admin/exports/${type}`, { params: { format }, responseType: 'blob' });
    return res.data;
  };

  /** List user integrations/exports — matches native getIntegrations */
  const getIntegrations = async (params?: any) => {
    const res = await apiInstance.get('admin/integrations', { 
      params: { ...params, limit: 20 } 
    });
    return res.data;
  };

  /** Update integration status — matches native updateExportStatus */
  const updateExportStatus = async (userId: string, payload: { exported: boolean }) => {
    const res = await apiInstance.put(`admin/integrations/${userId}/export-status`, payload);
    return res.data;
  };

  /** Export individual user data as PDF — matches native exportIntegrationsPDF */
  const exportIntegrationsPDF = async (params?: any) => {
    const res = await apiInstance.get('admin/integrations/export/pdf', {
      params: { ...params, maxRows: 250 },
      responseType: 'blob',
    });
    return res.data;
  };

  // ── Crisis & AI Settings ──────────────────────────────────────────────
  const getCrisisConfig = async () => {
    const res = await apiInstance.get('admin/crisis-config');
    return res.data;
  };

  const updateCrisisConfig = async (config: any) => {
    const res = await apiInstance.put('admin/crisis-config', config);
    return res.data;
  };

  /** List crisis history log — matches native AdminCrisisConf listing logic */
  const getCrisisLog = async (params?: any) => {
    const res = await apiInstance.get('admin/crisis/log', { params });
    return res.data;
  };

  /** Get current AI admin settings — matches native getAdminAISettings */
  const getAdminAISettings = async () => {
    const res = await apiInstance.get('admin-settings/ai');
    return res.data;
  };

  /** Update AI admin settings — matches native updateAdminAISettings */
  const updateAdminAISettings = async (payload: any) => {
    const res = await apiInstance.put('admin-settings/ai', payload);
    return res.data;
  };

  // ── Roles ────────────────────────────────────────────────────────────────
  const getRolesPermissions = async () => {
    const res = await apiInstance.get('admin/roles');
    return res.data;
  };

  const updateRolePermissions = async (role: string, permissions: string[]) => {
    const res = await apiInstance.put(`admin/roles/${role}`, { permissions });
    return res.data;
  };

  return useMemo(() => ({
    getReportStats,
    adminListUsers, getUsers, getUserDetail, adminGetUserDetail, adminSuspendUser, adminDeleteUser, adminBulkDeleteUsers, adminBulkUpdateUserRoles, toggleUserStatus,
    getSubAdmins, createSubAdmin, addSubAdmin, getSubAdminDetail, updateSubAdminPermissions, updateSubAdmin, deleteSubAdmin, removeSubAdmin,
    getListenerRequests, getListenerVerifications, getListenerVerificationDetail, reviewListenerVerification, reviewListenerRequest,
    getReports, getReportDetail, getReportDetails, updateReportStatus, takeAction, submitReport,
    getFinancialStats, getPaymentHistory, getAdminPaymentStats, exportPaymentHistoryPDF,
    exportData, getIntegrations, updateExportStatus, exportIntegrationsPDF,
    getCrisisConfig, updateCrisisConfig, getCrisisLog,
    getAdminAISettings, updateAdminAISettings,
    getRolesPermissions, updateRolePermissions,
  }), []);
};
