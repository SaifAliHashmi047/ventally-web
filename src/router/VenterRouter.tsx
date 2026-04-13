import { Routes, Route, Navigate } from 'react-router-dom';
import { VenterLayout } from '../components/Layout/VenterLayout';
import { VenterMoodDetails } from '../pages/Venter/VenterMoodDetails';

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
import { VenterRecoveryCalendar } from '../pages/Venter/VenterRecoveryCalendar';
import { VenterSettings } from '../pages/Venter/VenterSettings';
import { VenterCrisisFlow } from '../pages/Venter/VenterCrisisFlow';
import { VenterCrisisWarning } from '../pages/Venter/VenterCrisisWarning';
import { VenterCrisisSafe } from '../pages/Venter/VenterCrisisSafe';
import { VenterCrisisDisclaimer } from '../pages/Venter/VenterCrisisDisclaimer';
import { VenterCrisisImmediateHelp } from '../pages/Venter/VenterCrisisImmediateHelp';
import { VenterCrisis988Support } from '../pages/Venter/VenterCrisis988Support';
import { VenterSubscription } from '../pages/Venter/VenterSubscription';
import { SubscriptionDetailsScreen } from '../pages/Venter/SubscriptionDetailsScreen';
import { VenterPaymentCheckScreen } from '../pages/Venter/VenterPaymentCheckScreen';
import { VenterNoCreditScreen } from '../pages/Venter/VenterNoCreditScreen';
import { VenterAllCallsScreen } from '../pages/Venter/VenterAllCallsScreen';

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
        <Route path="mood/:id" element={<VenterMoodDetails />} />
        <Route path="mood/monthly" element={<VenterMoodTrends />} />
        <Route path="mood/variation" element={<VenterMoodTrends />} />
        <Route path="reflections" element={<VenterReflections />} />
        <Route path="reflections/add" element={<VenterAddReflection />} />
        <Route path="reflections/:id" element={<VenterReflectionDetail />} />
        <Route path="recovery" element={<VenterRecoveryDashboard />} />
        <Route path="recovery/journey" element={<VenterJourneyDashboard />} />
        <Route path="recovery/log" element={<VenterLogProgress />} />
        <Route path="recovery/summary" element={<VenterProgressSummary />} />
        <Route path="recovery/calendar" element={<VenterRecoveryCalendar />} />
        <Route path="recovery/:id" element={<VenterRecoveryDashboard />} />
        <Route path="recovery/edit/:id" element={<VenterLogProgress />} />
        <Route path="crisis" element={<VenterCrisisFlow />} />
        <Route path="crisis-warning" element={<VenterCrisisWarning />} />
        <Route path="crisis-safe" element={<VenterCrisisSafe />} />
        <Route path="crisis-disclaimer" element={<VenterCrisisDisclaimer />} />
        <Route path="crisis-immediate-help" element={<VenterCrisisImmediateHelp />} />
        <Route path="crisis-988-support" element={<VenterCrisis988Support />} />
        <Route path="subscription" element={<VenterSubscription />} />
        <Route path="subscription/details" element={<SubscriptionDetailsScreen />} />
        <Route path="settings" element={<VenterSettings />} />
        <Route path="payment-check" element={<VenterPaymentCheckScreen />} />
        <Route path="no-credit" element={<VenterNoCreditScreen />} />
        <Route path="all-calls" element={<VenterAllCallsScreen />} />
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
