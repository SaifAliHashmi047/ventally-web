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
  const getUsers = async (params?: { page?: number; limit?: number; search?: string; type?: string }) => {
    const res = await apiInstance.get('admin/users', { params });
    return res.data;
  };

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
    const res = await apiInstance.get('admin/sub-admins');
    return res.data;
  };

  /** Matches native createSubAdmin logic used in standalone page */
  const createSubAdmin = async (payload: { email: string; password?: string; permissions?: Record<string, boolean> }) => {
    const res = await apiInstance.post('sub-admins', payload);
    return res.data;
  };

  const addSubAdmin = createSubAdmin;

  const getSubAdminDetail = async (id: string) => {
    const res = await apiInstance.get(`admin/sub-admins/${id}`);
    return res.data;
  };

  const updateSubAdminPermissions = async (id: string, payload: { permissions: Record<string, boolean> | string[] }) => {
    const res = await apiInstance.put(`admin/sub-admins/${id}/permissions`, payload);
    return res.data;
  };

  const updateSubAdmin = async (id: string, payload: any) => {
    const res = await apiInstance.put(`admin/sub-admins/${id}`, payload);
    return res.data;
  };

  const deleteSubAdmin = async (id: string) => {
    const res = await apiInstance.delete(`admin/sub-admins/${id}`);
    return res.data;
  };

  const removeSubAdmin = deleteSubAdmin;

  // ── Listener Requests ───────────────────────────────────────────────────
  const getListenerRequests = async (status?: string) => {
    const res = await apiInstance.get('admin/listener-requests', { params: { status } });
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
    const res = await apiInstance.put(`admin/reports/${reportId}/status`, payload);
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
    const res = await apiInstance.get('admin/financial/payments', { params });
    return res.data;
  };

  // ── Exports ──────────────────────────────────────────────────────────────
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

  return {
    getReportStats,
    getUsers, getUserDetail, adminGetUserDetail, adminSuspendUser, adminDeleteUser, adminBulkDeleteUsers, adminBulkUpdateUserRoles, toggleUserStatus,
    getSubAdmins, createSubAdmin, addSubAdmin, getSubAdminDetail, updateSubAdminPermissions, updateSubAdmin, deleteSubAdmin, removeSubAdmin,
    getListenerRequests, getListenerVerifications, getListenerVerificationDetail, reviewListenerVerification, reviewListenerRequest,
    getReports, getReportDetail, getReportDetails, updateReportStatus, takeAction, submitReport,
    getFinancialStats, getPaymentHistory,
    exportData,
    getCrisisConfig, updateCrisisConfig,
    getRolesPermissions, updateRolePermissions,
  };
};
