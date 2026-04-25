import { Routes, Route, Navigate } from 'react-router-dom';
import { VenterLayout } from '../components/Layout/VenterLayout';
import { VenterMoodDetails } from '../pages/Venter/VenterMoodDetails';
import { VenterRecoveryDetails } from '../pages/Venter/VenterRecoveryDetails';

// Venter Pages
import { VenterDashboard } from '../pages/Venter/VenterDashboard';
import { VenterWallet } from '../pages/Venter/VenterWallet';
import { VenterAddFunds } from '../pages/Venter/VenterAddFunds';
import { VenterTransactions } from '../pages/Venter/VenterTransactions';
import { VenterMoodLog } from '../pages/Venter/VenterMoodLog';
import { VenterMoods } from '../pages/Venter/VenterMoods';
import { VenterMoodTrends } from '../pages/Venter/VenterMoodTrends';
import { VenterMoodVariation } from '../pages/Venter/VenterMoodVariation';
import { VenterMoodHistory } from '../pages/Venter/VenterMoodHistory';
import { VenterReflections } from '../pages/Venter/VenterReflections';
import { VenterAddReflection } from '../pages/Venter/VenterAddReflection';
import { VenterReflectionDetail } from '../pages/Venter/VenterReflectionDetail';
import { VenterRecoveryDashboard } from '../pages/Venter/VenterRecoveryDashboard';
import { VenterJourneyDashboard } from '../pages/Venter/VenterJourneyDashboard';
import { VenterLogProgress } from '../pages/Venter/VenterLogProgress';
import { VenterProgressSummary } from '../pages/Venter/VenterProgressSummary';
import { LegalDocViewer } from '../pages/Common/LegalDocViewer';
import { Appeal } from '../pages/Common/Appeal';
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
import { VenterGeneralSettings } from '../pages/Venter/VenterGeneralSettings';
import { VenterNotificationsSettings } from '../pages/Venter/VenterNotificationsSettings';
import { VenterQuietHours } from '../pages/Venter/VenterQuietHours';
import { VenterChangeBackground } from '../pages/Venter/VenterChangeBackground';
import { VenterSubmitFeedback } from '../pages/Venter/VenterSubmitFeedback';
import { VenterChangeAccountType } from '../pages/Venter/VenterChangeAccountType';
import { VenterChoosePlan } from '../pages/Venter/VenterChoosePlan';
import { VenterOthers } from '../pages/Venter/VenterOthers';

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
import { UpdateEmail } from '../pages/Common/UpdateEmail';
import { PayoutSettings } from '../pages/Common/PayoutSettings';
import { GenderIdentitySelect } from '../pages/Common/GenderIdentitySelect';
import { RacialIdentitySelect } from '../pages/Common/RacialIdentitySelect';
import { EthnicitySelect } from '../pages/Common/EthnicitySelect';
import { AgeGroupSelect } from '../pages/Common/AgeGroupSelect';
import { LGBTQSelect } from '../pages/Common/LGBTQSelect';
import { FaithOrBeliefSelect } from '../pages/Common/FaithOrBeliefSelect';
import { SpecialTopicsSelect } from '../pages/Common/SpecialTopicsSelect';
import { LanguageSelection } from '../pages/Auth/LanguageSelection';

// Change-account flow screens (venter → listener)
import { ListenerTraining } from '../pages/Auth/ListenerTraining';
import { ListenerLegalFlow } from '../pages/Auth/ListenerLegalFlow';
import { ListenerVerification } from '../pages/Auth/ListenerVerification';

// Chat Pages
import { VenterMessages } from '../pages/Venter/VenterMessages';
import { VenterCall } from '../pages/Venter/VenterCall';
import { RecentChats } from '../pages/Chat/RecentChats';
import { ChatScreen } from '../pages/Chat/ChatScreen';
import { FindingListener } from '../pages/Chat/FindingListener';
import { ActiveCall } from '../pages/Chat/ActiveCall';
import { SessionFeedback } from '../pages/Chat/SessionFeedback';
import { SessionRating } from '../pages/Chat/SessionRating';
import { ReportScreen } from '../pages/Chat/ReportScreen';

export const VenterRouter = () => {
  return (
    <VenterLayout>
      <Routes>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="others" element={<VenterOthers />} />
        <Route path="home" element={<VenterDashboard />} />
        <Route path="wallet" element={<VenterWallet />} />
        <Route path="wallet/add-funds" element={<VenterAddFunds />} />
        <Route path="wallet/transactions" element={<VenterTransactions />} />
        <Route path="mood" element={<VenterMoods />} />
        <Route path="mood/log" element={<VenterMoodLog />} />
        <Route path="mood/trends" element={<VenterMoodTrends />} />
        <Route path="mood/history" element={<VenterMoodHistory />} />
        <Route path="mood/:id" element={<VenterMoodDetails />} />
        <Route path="mood/monthly" element={<VenterMoodVariation />} />
        <Route path="mood/variation" element={<VenterMoodVariation />} />
        <Route path="reflections" element={<VenterReflections />} />
        <Route path="reflections/add" element={<VenterAddReflection />} />
        <Route path="reflections/:id" element={<VenterReflectionDetail />} />
        <Route path="recovery" element={<VenterRecoveryDashboard />} />
        <Route path="recovery/journey" element={<VenterJourneyDashboard />} />
        <Route path="recovery/log" element={<VenterLogProgress />} />
        <Route path="recovery/summary" element={<VenterProgressSummary />} />
        <Route path="recovery/calendar" element={<VenterRecoveryCalendar />} />
        <Route path="recovery/:id" element={<VenterRecoveryDetails />} />
        <Route path="recovery/details/:id" element={<VenterRecoveryDetails />} />
        <Route path="recovery/edit/:id" element={<VenterLogProgress />} />
        <Route path="crisis" element={<VenterCrisisFlow />} />
        <Route path="crisis-warning" element={<VenterCrisisWarning />} />
        <Route path="crisis-safe" element={<VenterCrisisSafe />} />
        <Route path="crisis-disclaimer" element={<VenterCrisisDisclaimer />} />
        <Route path="crisis-immediate-help" element={<VenterCrisisImmediateHelp />} />
        <Route path="crisis-988-support" element={<VenterCrisis988Support />} />
        <Route path="subscription" element={<VenterSubscription />} />
        <Route path="subscription/plans" element={<VenterChoosePlan />} />
        <Route path="subscription/details" element={<SubscriptionDetailsScreen />} />
        <Route path="settings" element={<VenterSettings />} />
        <Route path="payment-check" element={<VenterPaymentCheckScreen />} />
        <Route path="no-credit" element={<VenterNoCreditScreen />} />
        <Route path="all-calls" element={<VenterAllCallsScreen />} />
        {/* Settings Sub-screens */}
        <Route path="general-settings" element={<VenterGeneralSettings />} />
        <Route path="general-settings/change-background" element={<VenterChangeBackground />} />
        <Route path="general-settings/submit-feedback" element={<VenterSubmitFeedback />} />
        <Route path="notifications-settings" element={<VenterNotificationsSettings />} />
        <Route path="notifications/quiet-hours" element={<VenterQuietHours />} />
        <Route path="change-account-type" element={<VenterChangeAccountType />} />

        {/* Venter → Listener account-change flow (stays inside home layout) */}
        <Route path="change-account/listener-training" element={<ListenerTraining />} />
        <Route path="change-account/listener-legal"    element={<ListenerLegalFlow />} />
        <Route path="change-account/verification"      element={<ListenerVerification />} />
        {/* Common */}
        <Route path="profile" element={<ProfileScreen />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="sessions" element={<SessionsHistory />} />
        <Route path="security" element={<SecuritySettings />} />
        <Route path="security/change-password" element={<ChangePassword />} />
        <Route path="update-email" element={<UpdateEmail />} />
        {/* Profile Selector Sub-pages */}
        <Route path="profile/gender" element={<GenderIdentitySelect />} />
        <Route path="profile/racial-identity" element={<RacialIdentitySelect />} />
        <Route path="profile/ethnicity" element={<EthnicitySelect />} />
        <Route path="profile/age-group" element={<AgeGroupSelect />} />
        <Route path="profile/lgbtq" element={<LGBTQSelect />} />
        <Route path="profile/faith" element={<FaithOrBeliefSelect />} />
        <Route path="profile/special-topics" element={<SpecialTopicsSelect />} />
        <Route path="legal" element={<LegalPolicies />} />
        <Route path="legal/:docId" element={<LegalDocViewer />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="appeal" element={<Appeal />} />
        <Route path="delete-account" element={<DeleteAccount />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="notifications/:id" element={<NotificationDetail />} />
        <Route path="language" element={<LanguageSelection />} />
        {/* Chat/Call */}
        <Route path="chat" element={<VenterMessages />} />
        <Route path="chat/all" element={<RecentChats />} />
        <Route path="chat/:id" element={<ChatScreen />} />
        <Route path="calls" element={<VenterCall />} />
        <Route path="finding-listener" element={<FindingListener />} />
        <Route path="call/:roomId" element={<ActiveCall />} />
        <Route path="session/:id/rating" element={<SessionRating />} />
        <Route path="session/:id/feedback" element={<SessionFeedback />} />
        <Route path="report" element={<ReportScreen />} />
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </VenterLayout>
  );
};
