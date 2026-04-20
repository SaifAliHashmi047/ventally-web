import apiInstance from '../apiInstance';

export const useAdmin = () => {

  // ── Stats ────────────────────────────────────────────────────────────────
  const getReportStats = async () => {
    const res = await apiInstance.get('reports/admin/stats');
    return res.data;
  };

  // ── Users (admin moderation) ─────────────────────────────────────────────
  /** List users — matches native adminListUsers */
  const adminListUsers = async (
    search?: string,
    role?: 'venter' | 'listener' | 'both',
    limit = 20,
    offset = 0,
  ) => {
    const res = await apiInstance.get('admin/users', { params: { search, role, limit, offset } });
    return res.data;
  };

  /** Legacy alias used by some web pages */
  const getUsers = adminListUsers;

  /** User detail — matches native adminGetUserDetail */
  const adminGetUserDetail = async (userId: string) => {
    const res = await apiInstance.get(`admin/users/${userId}`);
    return res.data;
  };

  /** Legacy alias */
  const getUserDetail = adminGetUserDetail;

  /** Suspend / reactivate user */
  const adminSuspendUser = async (userId: string, payload: { action: 'suspend' | 'reactivate'; reason?: string }) => {
    const res = await apiInstance.put(`admin/users/${userId}/suspend`, payload);
    return res.data;
  };

  /** Delete user */
  const adminDeleteUser = async (userId: string) => {
    const res = await apiInstance.delete(`admin/users/${userId}`);
    return res.data;
  };

  /** Quick toggle compatible with current AdminUserDetail */
  const toggleUserStatus = async (userId: string, action: 'suspend' | 'activate' | 'ban') => {
    const res = await apiInstance.post(`admin/users/${userId}/${action}`);
    return res.data;
  };

  /** Bulk delete */
  const adminBulkDeleteUsers = async (userIds: string[]) => {
    const res = await apiInstance.delete('admin/users', { data: { userIds } });
    return res.data;
  };

  /** Bulk role update */
  const adminBulkUpdateUserRoles = async (payload: { userIds: string[]; role: string }) => {
    const res = await apiInstance.put('admin/users/roles', payload);
    return res.data;
  };

  // ── Sub-Admins ───────────────────────────────────────────────────────────
  const getSubAdmins = async () => {
    const res = await apiInstance.get('sub-admins');
    return res.data;
  };

  const createSubAdmin = async (payload: { email: string; permissions?: Record<string, boolean> }) => {
    const res = await apiInstance.post('sub-admins', payload);
    return res.data;
  };

  /** Legacy alias (web used addSubAdmin) */
  const addSubAdmin = createSubAdmin;

  const getSubAdminDetail = async (subAdminId: string) => {
    const res = await apiInstance.get(`sub-admins/${subAdminId}`);
    return res.data;
  };

  const updateSubAdminPermissions = async (
    subAdminId: string,
    payload: { permissions: Record<string, boolean> | string[] },
  ) => {
    const res = await apiInstance.put(`sub-admins/${subAdminId}`, payload);
    return res.data;
  };

  const updateSubAdminStatus = async (
    subAdminId: string,
    payload: { status: 'active' | 'suspended' },
  ) => {
    const res = await apiInstance.put(`sub-admins/${subAdminId}/status`, payload);
    return res.data;
  };

  const deleteSubAdmin = async (subAdminId: string) => {
    const res = await apiInstance.delete(`sub-admins/${subAdminId}`);
    return res.data;
  };

  /** Legacy alias */
  const removeSubAdmin = deleteSubAdmin;

  const getPendingSubAdmins = async () => {
    const res = await apiInstance.get('sub-admins/pending');
    return res.data;
  };

  // ── Listener Requests / Verifications ────────────────────────────────────
  const getListenerVerifications = async (
    limit = 50,
    offset = 0,
    status?: 'pending' | 'approved' | 'rejected',
  ) => {
    const res = await apiInstance.get('listener-verifications/admin/all', {
      params: { limit, offset, status },
    });
    return res.data;
  };

  /** Legacy alias */
  const getListenerRequests = getListenerVerifications;

  const getListenerVerificationDetail = async (verificationId: string) => {
    const res = await apiInstance.get(`listener-verifications/admin/${verificationId}`);
    return res.data;
  };

  const reviewListenerVerification = async (
    verificationId: string,
    payload: { action: 'approve' | 'reject'; notes?: string },
  ) => {
    const res = await apiInstance.put(`listener-verifications/admin/${verificationId}`, payload);
    return res.data;
  };

  /** Legacy alias used in AdminReviewRequest */
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

  const updateReportStatus = async (reportId: string, payload: { status: string; notes?: string }) => {
    const res = await apiInstance.put(`reports/admin/${reportId}`, payload);
    return res.data;
  };

  /** Legacy alias used in AdminTakeAction */
  const takeAction = async (reportId: string, action: string, notes?: string) => {
    const res = await apiInstance.post(`admin/reports/${reportId}/action`, { action, notes });
    return res.data;
  };

  /** User-facing report submission */
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

  // ── Financial / Payments ─────────────────────────────────────────────────
  const getAdminPaymentStats = async () => {
    const res = await apiInstance.get('admin/payments/stats');
    return res.data;
  };

  const getPaymentHistory = async (
    search?: string,
    userId?: string,
    status?: string,
    from?: string,
    to?: string,
    limit = 20,
    offset = 0,
  ) => {
    const res = await apiInstance.get('admin/payments/history', {
      params: { search, userId, status, from, to, limit, offset },
    });
    return res.data;
  };

  const exportPaymentHistoryPDF = async (
    search?: string,
    userId?: string,
    status?: string,
    from?: string,
    to?: string,
    maxRows = 250,
  ) => {
    const res = await apiInstance.get('admin/payments/history/export/pdf', {
      params: { search, userId, status, from, to, maxRows },
      responseType: 'blob',
    });
    return res.data;
  };

  /** Legacy alias */
  const getFinancialStats = async (period?: string) => {
    const res = await apiInstance.get('admin/financial/stats', { params: { period } });
    return res.data;
  };

  // ── Integrations / Exports ───────────────────────────────────────────────
  const getIntegrations = async (
    search?: string,
    role?: 'venter' | 'listener' | 'both',
    status?: string,
    limit = 20,
    offset = 0,
  ) => {
    const res = await apiInstance.get('admin/integrations', {
      params: { search, role, status, limit, offset },
    });
    return res.data;
  };

  const updateExportStatus = async (userId: string, payload: { exportStatus: string }) => {
    const res = await apiInstance.put(`admin/integrations/${userId}/export-status`, payload);
    return res.data;
  };

  const exportIntegrationsPDF = async (
    search?: string,
    role?: string,
    status?: string,
    maxRows = 250,
    userId?: string,
  ) => {
    const res = await apiInstance.get('admin/integrations/export/pdf', {
      params: { search, role, status, maxRows, userId },
      responseType: 'blob',
    });
    return res.data;
  };

  /** Legacy alias */
  const exportData = async (type: string, format: 'csv' | 'json' = 'csv') => {
    const res = await apiInstance.get(`admin/exports/${type}`, { params: { format }, responseType: 'blob' });
    return res.data;
  };

  // ── Crisis Config ────────────────────────────────────────────────────────
  const getCrisisConfig = async () => {
    const res = await apiInstance.get('admin/crisis-config');
    return res.data;
  };

  const updateCrisisConfig = async (config: any) => {
    const res = await apiInstance.put('admin/crisis-config', config);
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

  // ── AI Settings ──────────────────────────────────────────────────────────
  const getAdminAISettings = async () => {
    const res = await apiInstance.get('admin-settings/ai');
    return res.data;
  };

  const updateAdminAISettings = async (payload: any) => {
    const res = await apiInstance.put('admin-settings/ai', payload);
    return res.data;
  };

  return {
    // Stats
    getReportStats,
    // Users
    adminListUsers, getUsers,
    adminGetUserDetail, getUserDetail,
    adminSuspendUser, adminDeleteUser,
    toggleUserStatus,
    adminBulkDeleteUsers, adminBulkUpdateUserRoles,
    // Sub-admins
    getSubAdmins, createSubAdmin, addSubAdmin,
    getSubAdminDetail,
    updateSubAdminPermissions, updateSubAdminStatus,
    deleteSubAdmin, removeSubAdmin,
    getPendingSubAdmins,
    // Listener requests
    getListenerVerifications, getListenerRequests,
    getListenerVerificationDetail,
    reviewListenerVerification, reviewListenerRequest,
    // Reports
    getReports, getReportDetail, getReportDetails,
    updateReportStatus, takeAction, submitReport,
    // Financial
    getAdminPaymentStats, getPaymentHistory,
    exportPaymentHistoryPDF, getFinancialStats,
    // Integrations/Exports
    getIntegrations, updateExportStatus,
    exportIntegrationsPDF, exportData,
    // Crisis
    getCrisisConfig, updateCrisisConfig,
    // Roles
    getRolesPermissions, updateRolePermissions,
    // AI
    getAdminAISettings, updateAdminAISettings,
  };
};
