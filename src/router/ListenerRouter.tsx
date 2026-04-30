import { Routes, Route, Navigate } from 'react-router-dom';
import { ListenerLayout } from '../components/Layout/ListenerLayout';
import { LegalDocViewer } from '../pages/Common/LegalDocViewer';
import { Appeal } from '../pages/Common/Appeal';

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
import { ReportScreen } from '../pages/Chat/ReportScreen';
import { ListenerActiveCall } from '../pages/Listener/ListenerActiveCall';
import { PayoutMethodScreen } from '../pages/Listener/PayoutMethodScreen';
import { LinkBankAccountScreen } from '../pages/Listener/LinkBankAccountScreen';
import { ListenerCrisisEscalation } from '../pages/Listener/ListenerCrisisEscalation';
import { ListenerCrisisWarning } from '../pages/Listener/ListenerCrisisWarning';
import { ListenerChangeAccountType } from '../pages/Listener/ListenerChangeAccountType';
import { ListenerNotificationsSettings } from '../pages/Listener/ListenerNotificationsSettings';
import { ListenerSessionFeedback } from '../pages/Listener/ListenerSessionFeedback';
import { ListenerSessionRating } from '../pages/Listener/ListenerSessionRating';
import { UpdateEmail } from '../pages/Common/UpdateEmail';
import { PayoutSettings } from '../pages/Common/PayoutSettings';
import { GenderIdentitySelect } from '../pages/Common/GenderIdentitySelect';
import { RacialIdentitySelect } from '../pages/Common/RacialIdentitySelect';
import { EthnicitySelect } from '../pages/Common/EthnicitySelect';
import { AgeGroupSelect } from '../pages/Common/AgeGroupSelect';
import { LGBTQSelect } from '../pages/Common/LGBTQSelect';
import { FaithOrBeliefSelect } from '../pages/Common/FaithOrBeliefSelect';
import { SpecialTopicsSelect } from '../pages/Common/SpecialTopicsSelect';
import { VenterQuestionsFlow } from '../pages/Auth/VenterQuestionsFlow';
import { LanguageSelection } from '../pages/Auth/LanguageSelection';

// Change-account flow screens (listener → venter)
import { NicknameScreen } from '../pages/Auth/NicknameScreen';
import { ChoosePlan } from '../pages/Auth/ChoosePlan';
import { PaymentMethodsScreen } from '../pages/Auth/PaymentMethodsScreen';
import { AddPaymentMethodScreen } from '../pages/Auth/AddPaymentMethodScreen';
import { PaymentMethodSavedScreen } from '../pages/Auth/PaymentMethodSavedScreen';
import { SubscriptionSuccessScreen } from '../pages/Auth/SubscriptionSuccessScreen';

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
        <Route path="update-email" element={<UpdateEmail />} />
        <Route path="notifications-settings" element={<ListenerNotificationsSettings />} />
        <Route path="legal" element={<LegalPolicies />} />
        <Route path="legal/:docId" element={<LegalDocViewer />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="appeal" element={<Appeal />} />
        <Route path="delete-account" element={<DeleteAccount />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="notifications/:id" element={<NotificationDetail />} />
        <Route path="language" element={<LanguageSelection />} />
        <Route path="chat" element={<RecentChats />} />
        <Route path="chat/:id" element={<ChatScreen />} />
        <Route path="session/:id/feedback" element={<ListenerSessionFeedback />} />
        <Route path="session/:id/rating" element={<ListenerSessionRating />} />
        <Route path="session/:id/report" element={<ReportScreen />} />
        <Route path="report" element={<ReportScreen />} />
        <Route path="payout" element={<PayoutSettings />} />
        {/* Profile Preference Edit pages — same component as signup, auto-detected editMode */}
        <Route path="profile/preferences/:stepId" element={<VenterQuestionsFlow />} />
        {/* Profile Selector Sub-pages (legacy) */}
        <Route path="profile/gender" element={<GenderIdentitySelect />} />
        <Route path="profile/racial-identity" element={<RacialIdentitySelect />} />
        <Route path="profile/ethnicity" element={<EthnicitySelect />} />
        <Route path="profile/age-group" element={<AgeGroupSelect />} />
        <Route path="profile/lgbtq" element={<LGBTQSelect />} />
        <Route path="profile/faith" element={<FaithOrBeliefSelect />} />
        <Route path="profile/special-topics" element={<SpecialTopicsSelect />} />
        <Route path="payout-method" element={<PayoutMethodScreen />} />
        <Route path="bank-account" element={<LinkBankAccountScreen />} />
        <Route path="crisis-warning" element={<ListenerCrisisWarning />} />
        <Route path="crisis-escalation" element={<ListenerCrisisEscalation />} />
        <Route path="change-account-type" element={<ListenerChangeAccountType />} />

        {/* Listener → Venter account-change flow (stays inside home layout) */}
        <Route path="change-account/nickname"       element={<NicknameScreen />} />
        <Route path="change-account/choose-plan"    element={<ChoosePlan />} />
        <Route path="change-account/payment"        element={<PaymentMethodsScreen />} />
        <Route path="change-account/payment/add"    element={<AddPaymentMethodScreen />} />
        <Route path="change-account/payment/saved"  element={<PaymentMethodSavedScreen />} />
        <Route path="change-account/success"        element={<SubscriptionSuccessScreen />} />

        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </ListenerLayout>
  );
};
