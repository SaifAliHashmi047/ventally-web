import { Routes, Route, Navigate } from 'react-router-dom';
import { ListenerLayout } from '../components/Layout/ListenerLayout';

// Listener Pages
import { ListenerDashboard } from '../pages/Listener/ListenerDashboard';
import { ListenerRequests } from '../pages/Listener/ListenerRequests';
import { ListenerWallet } from '../pages/Listener/ListenerWallet';
import { ListenerSettings } from '../pages/Listener/ListenerSettings';

// Common Pages
import { ProfileScreen } from '../pages/Common/ProfileScreen';
import { EditProfile } from '../pages/Common/EditProfile';
import { SessionsHistory } from '../pages/Common/SessionsHistory';
import { SecuritySettings } from '../pages/Common/SecuritySettings';
import { ChangePassword } from '../pages/Common/ChangePassword';
import { LegalPolicies } from '../pages/Common/LegalPolicies';
import { ContactUs } from '../pages/Common/ContactUs';
import { DeleteAccount } from '../pages/Common/DeleteAccount';
import { Notifications } from '../pages/Common/Notifications';
import { NotificationDetail } from '../pages/Common/NotificationDetail';

// Chat/Call Pages
import { RecentChats } from '../pages/Chat/RecentChats';
import { ChatScreen } from '../pages/Chat/ChatScreen';
import { SessionFeedback } from '../pages/Chat/SessionFeedback';
import { SessionRating } from '../pages/Chat/SessionRating';
import { ListenerActiveCall } from '../pages/Listener/ListenerActiveCall';

export const ListenerRouter = () => {
  return (
    <ListenerLayout>
      <Routes>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<ListenerDashboard />} />
        <Route path="requests" element={<ListenerRequests />} />
        <Route path="wallet" element={<ListenerWallet />} />
        <Route path="settings" element={<ListenerSettings />} />
        <Route path="call/:roomId" element={<ListenerActiveCall />} />
        {/* Common */}
        <Route path="profile" element={<ProfileScreen />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="sessions" element={<SessionsHistory />} />
        <Route path="security" element={<SecuritySettings />} />
        <Route path="security/change-password" element={<ChangePassword />} />
        <Route path="legal" element={<LegalPolicies />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="delete-account" element={<DeleteAccount />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="notifications/:id" element={<NotificationDetail />} />
        <Route path="chat" element={<RecentChats />} />
        <Route path="chat/:id" element={<ChatScreen />} />
        <Route path="session/:id/feedback" element={<SessionFeedback />} />
        <Route path="session/:id/rating" element={<SessionRating />} />
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </ListenerLayout>
  );
};
