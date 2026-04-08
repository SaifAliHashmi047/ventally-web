import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { WebLayout } from '../components/Layout/WebLayout';
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
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { DummyPage } from '../pages/DummyPage';
import { MessagePage } from '../pages/MessagePage';
import { NotificationPage } from '../pages/NotificationPage';
import { SettingsPage } from '../pages/SettingsPage';

const AppRouter = () => {
  const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginWeb />} />
          <Route path="/signup" element={<SignUpWeb />} />
          <Route path="/signup/otp" element={<SignUpOTP />} />
          <Route path="/signup/nickname" element={<NicknameScreen />} />
          <Route path="/signup/language" element={<LanguageSelection />} />
          <Route path="/signup/terms" element={<TermsAndConditions />} />
          <Route path="/signup/questions" element={<OptionalQuestionsHero />} />
          <Route path="/signup/questions/:stepId" element={<VenterQuestionsFlow />} />
          <Route path="/signup/choose-plan" element={<ChoosePlan />} />
          <Route path="/signup/listener-training" element={<ListenerTraining />} />
          <Route path="/signup/listener-legal" element={<ListenerLegalFlow />} />
          <Route path="/signup/verification" element={<ListenerVerification />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route element={<WebLayout><Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/test" element={<DummyPage />} />
          <Route path="/chat" element={<MessagePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes></WebLayout>} path="*" />
      )}
    </Routes>
  );
};

export default AppRouter;
