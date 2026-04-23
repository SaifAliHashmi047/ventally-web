import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

// Auth Pages
import { Onboarding } from '../pages/Auth/Onboarding';
import { LoginWeb } from '../pages/Auth/LoginWeb';
import { SignUpWeb } from '../pages/Auth/SignUpWeb';
import { SignUpOTP } from '../pages/Auth/SignUpOTP';
import { NicknameScreen } from '../pages/Auth/NicknameScreen';
import { LanguageSelection } from '../pages/Auth/LanguageSelection';
import { TermsAndConditions } from '../pages/Auth/TermsAndConditions';
import { OptionalQuestionsHero } from '../pages/Auth/OptionalQuestionsHero';
import { VenterQuestionsFlow } from '../pages/Auth/VenterQuestionsFlow';
import { ChoosePlan } from '../pages/Auth/ChoosePlan';
import { ListenerTraining } from '../pages/Auth/ListenerTraining';
import { ListenerLegalFlow } from '../pages/Auth/ListenerLegalFlow';
import { ListenerVerification } from '../pages/Auth/ListenerVerification';
import { VerificationInProgress } from '../pages/Auth/VerificationInProgress';
import { VerificationVerified } from '../pages/Auth/VerificationVerified';
import { ResetPasswordWeb } from '../pages/Auth/ResetPasswordWeb';
import { EmailVerificationWeb } from '../pages/Auth/EmailVerificationWeb';
import { CreateNewPasswordWeb } from '../pages/Auth/CreateNewPasswordWeb';
import { ResetSuccessfulWeb } from '../pages/Auth/ResetSuccessfulWeb';

// Common Public Pages
import { LegalDocViewer } from '../pages/Common/LegalDocViewer';

// Role Routers
import { VenterRouter } from './VenterRouter';
import { ListenerRouter } from './ListenerRouter';
import { AdminRouter } from './AdminRouter';

import { PaymentMethodsScreen } from '../pages/Auth/PaymentMethodsScreen';
import { AddPaymentMethodScreen } from '../pages/Auth/AddPaymentMethodScreen';
import { PaymentMethodSavedScreen } from '../pages/Auth/PaymentMethodSavedScreen';
import { SubscriptionSuccessScreen } from '../pages/Auth/SubscriptionSuccessScreen';
import { MainBackground } from '../components/ui/MainBackground';

import { useRoleNavigation } from '../hooks/useRoleNavigation';

const StateGuard = ({ children, role }: { children: React.ReactNode, role: string }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const location = useLocation();
  const { getNextStep } = useRoleNavigation();
  const nextStep = getNextStep(user, location.pathname);

  // If nextStep is a dashboard path, it means they are ready. 
  // If nextStep is an onboarding path (OTP, Nickname, etc), redirect them.
  if (nextStep && nextStep.startsWith('/signup')) {
    return <Navigate to={nextStep} replace />;
  }

  return <>{children}</>;
};

const AppRouter = () => {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
  const user = useSelector((state: RootState) => state.user.user as any);
  const userType = user?.userType || user?.role;

  // Determine post-login redirect based on role
  const getRoleHome = () => {
    if (userType === 'listener') return '/listener';
    if (userType === 'admin' || userType === 'sub_admin') return '/admin';
    return '/venter'; // default: venter
  };

  return (
    <Routes>
      {/* ── Onboarding & Auth routes — always accessible so mid-onboarding users don't break ── */}
      <Route path="/" element={<Onboarding />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/login" element={<LoginWeb />} />
      <Route path="/signup" element={<SignUpWeb />} />
      <Route path="/signup/otp" element={<SignUpOTP />} />
      <Route path="/signup/nickname" element={<NicknameScreen />} />
      <Route path="/signup/language" element={<LanguageSelection />} />
      <Route path="/signup/terms" element={<TermsAndConditions />} />
      <Route path="/signup/questions" element={<OptionalQuestionsHero />} />
      <Route path="/signup/questions/:stepId" element={<VenterQuestionsFlow />} />
      <Route path="/signup/choose-plan" element={<ChoosePlan />} />
      <Route path="/signup/payment" element={<PaymentMethodsScreen />} />
      <Route path="/signup/payment/add" element={<AddPaymentMethodScreen />} />
      <Route path="/signup/payment/saved" element={<PaymentMethodSavedScreen />} />
      <Route path="/signup/success" element={<SubscriptionSuccessScreen />} />
      <Route path="/signup/listener-training" element={<ListenerTraining />} />
      <Route path="/signup/listener-legal" element={<ListenerLegalFlow />} />
      <Route path="/signup/verification" element={<ListenerVerification />} />
      <Route path="/signup/verification-in-progress" element={<VerificationInProgress />} />
      <Route path="/signup/verification-verified" element={<VerificationVerified />} />
      <Route path="/forgot-password" element={<ResetPasswordWeb />} />
      <Route path="/forgot-password/verify-email" element={<EmailVerificationWeb />} />
      <Route path="/forgot-password/new-password" element={<CreateNewPasswordWeb />} />
      <Route path="/forgot-password/done" element={<ResetSuccessfulWeb />} />

      {/* ── Public Legal Document Viewer ── */}
      <Route path="/legal/:docId" element={
        <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
          <MainBackground />
          <div className="relative z-10 flex flex-col flex-1 w-full min-h-0">
            <LegalDocViewer />
          </div>
        </div>
      } />

      {/* ── App routes — gated by authentication ── */}
      {isAuthenticated ? (
        <>
          {/* Venter Routes */}
          <Route path="/venter/*" element={
            userType === 'listener' ? <Navigate to="/listener" replace /> :
            userType === 'admin' || userType === 'sub_admin' ? <Navigate to="/admin" replace /> :
            <StateGuard role="venter"><VenterRouter /></StateGuard>
          } />

          {/* Listener Routes */}
          <Route path="/listener/*" element={
            userType !== 'listener' ? <Navigate to={getRoleHome()} replace /> :
            <StateGuard role="listener"><ListenerRouter /></StateGuard>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            userType !== 'admin' && userType !== 'sub_admin' ? <Navigate to={getRoleHome()} replace /> :
            <StateGuard role="admin"><AdminRouter /></StateGuard>
          } />

          {/* Root redirect based on role */}
          <Route path="*" element={<Navigate to={getRoleHome()} replace />} />
        </>
      ) : (
        /* Unauthenticated — catch-all sends to onboarding */
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      )}
    </Routes>
  );
};

export default AppRouter;

