import apiInstance from '../apiInstance';

export const useAdmin = () => {
  // Stats
  const getReportStats = async () => {
    const res = await apiInstance.get('admin/stats/report');
    return res.data;
  };

  // Users
  const getUsers = async (params?: { page?: number; limit?: number; search?: string; type?: string }) => {
    const res = await apiInstance.get('admin/users', { params });
    return res.data;
  };

  const getUserDetail = async (userId: string) => {
    const res = await apiInstance.get(`admin/users/${userId}`);
    return res.data;
  };

  const toggleUserStatus = async (userId: string, action: 'suspend' | 'activate' | 'ban') => {
    const res = await apiInstance.post(`admin/users/${userId}/${action}`);
    return res.data;
  };

  // Sub-admins
  const getSubAdmins = async () => {
    const res = await apiInstance.get('admin/sub-admins');
    return res.data;
  };

  const addSubAdmin = async (payload: { email: string; permissions: string[] }) => {
    const res = await apiInstance.post('admin/sub-admins', payload);
    return res.data;
  };

  const updateSubAdminPermissions = async (id: string, permissions: string[]) => {
    const res = await apiInstance.put(`admin/sub-admins/${id}/permissions`, { permissions });
    return res.data;
  };

  const removeSubAdmin = async (id: string) => {
    const res = await apiInstance.delete(`admin/sub-admins/${id}`);
    return res.data;
  };

  // Listener Requests
  const getListenerRequests = async (status?: string) => {
    const res = await apiInstance.get('admin/listener-requests', { params: { status } });
    return res.data;
  };

  const reviewListenerRequest = async (id: string, action: 'approve' | 'reject', notes?: string) => {
    const res = await apiInstance.post(`admin/listener-requests/${id}/review`, { action, notes });
    return res.data;
  };

  // Reports
  const getReports = async (params?: { page?: number; limit?: number; status?: string }) => {
    const res = await apiInstance.get('admin/reports', { params });
    return res.data;
  };

  const getReportDetail = async (id: string) => {
    const res = await apiInstance.get(`admin/reports/${id}`);
    return res.data;
  };

  const takeAction = async (reportId: string, action: string, notes?: string) => {
    const res = await apiInstance.post(`admin/reports/${reportId}/action`, { action, notes });
    return res.data;
  };

  // Submit user report - matches mobile API
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

  // Financial
  const getFinancialStats = async (period?: string) => {
    const res = await apiInstance.get('admin/financial/stats', { params: { period } });
    return res.data;
  };

  const getPaymentHistory = async (params?: any) => {
    const res = await apiInstance.get('admin/financial/payments', { params });
    return res.data;
  };

  // Exports
  const exportData = async (type: string, format: 'csv' | 'json' = 'csv') => {
    const res = await apiInstance.get(`admin/exports/${type}`, { params: { format }, responseType: 'blob' });
    return res.data;
  };

  // Crisis Config
  const getCrisisConfig = async () => {
    const res = await apiInstance.get('admin/crisis-config');
    return res.data;
  };

  const updateCrisisConfig = async (config: any) => {
    const res = await apiInstance.put('admin/crisis-config', config);
    return res.data;
  };

  // Roles
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
    getUsers, getUserDetail, toggleUserStatus,
    getSubAdmins, addSubAdmin, updateSubAdminPermissions, removeSubAdmin,
    getListenerRequests, reviewListenerRequest,
    getReports, getReportDetail, takeAction, submitReport,
    getFinancialStats, getPaymentHistory,
    exportData,
    getCrisisConfig, updateCrisisConfig,
    getRolesPermissions, updateRolePermissions,
  };
};
