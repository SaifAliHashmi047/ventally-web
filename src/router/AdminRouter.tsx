import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/Layout/AdminLayout';

// Admin Pages
import { AdminDashboard } from '../pages/Admin/AdminDashboard';
import { AdminUsers } from '../pages/Admin/AdminUsers';
import { AdminUserDetail } from '../pages/Admin/AdminUserDetail';
import { AdminSubAdmins } from '../pages/Admin/AdminSubAdmins';
import { AdminReports } from '../pages/Admin/AdminReports';
import { AdminReportDetail } from '../pages/Admin/AdminReportDetail';
import { AdminListenerRequests } from '../pages/Admin/AdminListenerRequests';
import { AdminReviewRequest } from '../pages/Admin/AdminReviewRequest';
import { AdminFinancialStats } from '../pages/Admin/AdminFinancialStats';
import { AdminRolesPermissions } from '../pages/Admin/AdminRolesPermissions';
import { AdminSettings } from '../pages/Admin/AdminSettings';
import { AdminExports } from '../pages/Admin/AdminExports';

// Common Pages
import { Notifications } from '../pages/Common/Notifications';
import { NotificationDetail } from '../pages/Common/NotificationDetail';
import { ProfileScreen } from '../pages/Common/ProfileScreen';
import { SecuritySettings } from '../pages/Common/SecuritySettings';
import { ChangePassword } from '../pages/Common/ChangePassword';

export const AdminRouter = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id" element={<AdminUserDetail />} />
        <Route path="sub-admins" element={<AdminSubAdmins />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="reports/:id" element={<AdminReportDetail />} />
        <Route path="listener-requests" element={<AdminListenerRequests />} />
        <Route path="listener-requests/:id" element={<AdminReviewRequest />} />
        <Route path="financial" element={<AdminFinancialStats />} />
        <Route path="roles" element={<AdminRolesPermissions />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="exports" element={<AdminExports />} />
        {/* Common */}
        <Route path="notifications" element={<Notifications />} />
        <Route path="notifications/:id" element={<NotificationDetail />} />
        <Route path="profile" element={<ProfileScreen />} />
        <Route path="security" element={<SecuritySettings />} />
        <Route path="security/change-password" element={<ChangePassword />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
};
