import { useNavigate } from 'react-router-dom';
import type { User } from '../store/slices/userSlice';

export const useRoleNavigation = () => {
  const navigate = useNavigate();

  const getNextStep = (user: User | null, currentPath?: string): string | null => {
    if (!user) return '/onboarding';

    const role = user.activeRole || user.userType || user.role;
    const normalizedRole = role?.toLowerCase();

    let target: string | null = null;

    // 1. Check Verification (Common for both)
    if (user.isVerified === false) {
      target = '/signup/otp';
    }
    // 2. Role Specific Checks
    else if (normalizedRole === 'venter') {
      if (!user.displayName) {
        target = '/signup/nickname';
      } else {
        target = '/venter/home';
      }
    }
    else if (normalizedRole === 'listener') {
      // if (!user.listenerSignature) {
      //   target = '/signup/listener-legal';
      // } 
      // else 
        if (!user.verificationDocumentStatus || user.verificationDocumentStatus === 'not_submitted') {
        target = '/signup/verification';
      } else if (user.verificationDocumentStatus === 'pending') {
        target = '/signup/verification-in-progress';
      } else {
        target = '/listener/home';
      }
    }
    else if (normalizedRole === 'admin' || normalizedRole === 'sub_admin') {
      target = '/admin/dashboard';
    }

    // Don't redirect if we are already there
    if (target && currentPath === target) return null;
    if (target && currentPath?.startsWith(target)) return null;

    return target;
  };

  const navigateToNextStep = (user: User | null, currentPath?: string) => {
    const nextStep = getNextStep(user, currentPath);
    if (nextStep) {
      navigate(nextStep, { replace: true });
    }
  };

  return { getNextStep, navigateToNextStep };
};
