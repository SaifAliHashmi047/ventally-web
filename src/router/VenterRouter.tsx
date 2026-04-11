import { Routes, Route, Navigate } from 'react-router-dom';
import { VenterLayout } from '../components/Layout/VenterLayout';

// Venter Pages
import { VenterDashboard } from '../pages/Venter/VenterDashboard';
import { VenterWallet } from '../pages/Venter/VenterWallet';
import { VenterAddFunds } from '../pages/Venter/VenterAddFunds';
import { VenterTransactions } from '../pages/Venter/VenterTransactions';
import { VenterMoodLog } from '../pages/Venter/VenterMoodLog';
import { VenterMoods } from '../pages/Venter/VenterMoods';
import { VenterMoodTrends } from '../pages/Venter/VenterMoodTrends';
import { VenterMoodHistory } from '../pages/Venter/VenterMoodHistory';
import { VenterReflections } from '../pages/Venter/VenterReflections';
import { VenterAddReflection } from '../pages/Venter/VenterAddReflection';
import { VenterReflectionDetail } from '../pages/Venter/VenterReflectionDetail';
import { VenterRecoveryDashboard } from '../pages/Venter/VenterRecoveryDashboard';
import { VenterJourneyDashboard } from '../pages/Venter/VenterJourneyDashboard';
import { VenterLogProgress } from '../pages/Venter/VenterLogProgress';
import { VenterProgressSummary } from '../pages/Venter/VenterProgressSummary';
import { VenterSettings } from '../pages/Venter/VenterSettings';
import { VenterCrisisFlow } from '../pages/Venter/VenterCrisisFlow';
import { VenterSubscription } from '../pages/Venter/VenterSubscription';

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

// Chat Pages
import { RecentChats } from '../pages/Chat/RecentChats';
import { ChatScreen } from '../pages/Chat/ChatScreen';
import { FindingListener } from '../pages/Chat/FindingListener';
import { ActiveCall } from '../pages/Chat/ActiveCall';
import { SessionFeedback } from '../pages/Chat/SessionFeedback';
import { SessionRating } from '../pages/Chat/SessionRating';

export const VenterRouter = () => {
  return (
    <VenterLayout>
      <Routes>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<VenterDashboard />} />
        <Route path="wallet" element={<VenterWallet />} />
        <Route path="wallet/add-funds" element={<VenterAddFunds />} />
        <Route path="wallet/transactions" element={<VenterTransactions />} />
        <Route path="mood" element={<VenterMoods />} />
        <Route path="mood/log" element={<VenterMoodLog />} />
        <Route path="mood/trends" element={<VenterMoodTrends />} />
        <Route path="mood/history" element={<VenterMoodHistory />} />
        <Route path="reflections" element={<VenterReflections />} />
        <Route path="reflections/add" element={<VenterAddReflection />} />
        <Route path="reflections/:id" element={<VenterReflectionDetail />} />
        <Route path="recovery" element={<VenterRecoveryDashboard />} />
        <Route path="recovery/journey" element={<VenterJourneyDashboard />} />
        <Route path="recovery/log" element={<VenterLogProgress />} />
        <Route path="recovery/summary" element={<VenterProgressSummary />} />
        <Route path="crisis" element={<VenterCrisisFlow />} />
        <Route path="subscription" element={<VenterSubscription />} />
        <Route path="settings" element={<VenterSettings />} />
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
        {/* Chat/Call */}
        <Route path="chat" element={<RecentChats />} />
        <Route path="chat/:id" element={<ChatScreen />} />
        <Route path="finding-listener" element={<FindingListener />} />
        <Route path="call/:roomId" element={<ActiveCall />} />
        <Route path="session/:id/feedback" element={<SessionFeedback />} />
        <Route path="session/:id/rating" element={<SessionRating />} />
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </VenterLayout>
  );
};
