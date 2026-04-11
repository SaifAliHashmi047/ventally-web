# Ventally Web — Full React Native → React.js Conversion

## Summary

Convert the `ventallyTest` React Native app into a production-ready React.js (Vite + Tailwind CSS) web application. The RN app has **3 user roles** (Venter, Listener, Admin) each with deep, separate screens and navigation trees. The existing `ventally-web` only partially covers auth flows and a generic dashboard with no role separation.

---

## 🔍 Current State Analysis

### React Native App — Roles & Screen Count
| Role | Screens |
|------|---------|
| **Auth (shared)** | Splash, OnBoarding, Login, SignUp, SignUpOTP, Nickname, Language, Terms, OptionalQuestions, GenderIdentity, Ethnicity, RacialIdentity, AgeGroup, LGBTQIdentity, FaithOrBelief, SpecialTopics, ChoosePlan, BasicPlanDetails, PaymentMethods, AddPaymentMethod, PaymentMethodSaved, SubscriptionSuccess, SubscriptionDetails, ResetPassword, EmailVerification, PhoneVerification, CreateNewPassword, ResetSuccessful, BiometricEnable, MicrophoneRequest, SpeakerRequest, Listener onboarding (Training, LegalFlow, Verification) |
| **Venter** | VenterHome, VenterCall, VenterAllCalls, VenterMessages, VenterWallet, VenterAddFunds, VenterTransactions, VenterSettings, VenterMoodLog, VenterMoods, VenterMonthlyMood, VenterMoodHistory, VenterMoodDetails, VenterMoodTrends, VenterMoodVariation, VenterReflections, VenterReflectionDetail, VenterAddReflection, VenterRecoveryDashboard, VenterLogProgress, VenterRecoveryCalendar, VenterRecoveryDetails, VenterEditRecoveryLog, VenterProgressSummary, VenterJourneyDashboard, VenterCrisis (Warning/Safe/Disclaimer/ImmediateHelp/988), VenterPaymentCheck, VenterNoCredit, VenterAddCredit, VenterMySubscription, VenterSettings (General/Notifications/ChangeBackground/SubmitFeedback/ChangeAccountType) |
| **Listener** | ListenerHome, ListenerRequests, ListenerActiveCall, ListenerWallet, PayoutMethod, LinkBankAccount, ListenerSettings, ListenerLegalPolicies, ListenerChangeAccountType, ListenerCrisisEscalation, ListenerSessionFeedback, ListenerSessionRating |
| **Admin** | AdminHome, AdminUsers, AdminUserDetail, AdminSubAdmins, AdminSubAdminProfile, AdminAddSubAdmin, AdminSelectPermissions, AdminRolesPermissions, AdminPermissionsUpdateSuccess, AdminListenerRequests, AdminReviewRequest, AdminReports, AdminReportDetail, AdminTakeAction, AdminViewChat, AdminFinancialStats, AdminPaymentHistory, AdminSettings, AdminSecurity, AdminResetPassword, AdminChangeEmailPhone, AdminVerifyOTP, AdminSecuritySuccess, AdminExports, AdminCrisisConf |
| **Common (all roles)** | ProfileScreen, EditProfile, SessionsHistory, PayoutSettings, SecuritySettings, LegalPolicies, ContactUs, ChangePassword, QuietHours, Appeal, TermsOfUse, PrivacyPolicy, SafetyPolicy, ListenerGuidelines, DeleteAccount, Notifications, NotificationDetail, Chat, RecentChats, FindingListener, ActiveCall, SessionFeedback, SessionRating, Report |

### Existing Web App Gaps
- ❌ No role-based routing (single generic dashboard)
- ❌ No Venter-specific pages (mood, reflections, recovery, wallet, crypto)
- ❌ No Listener-specific pages (requests, availability, earnings)
- ❌ No Admin pages at all
- ❌ No chat/call UI
- ❌ No crisis flow
- ❌ No profile/settings screens
- ❌ Tailwind CSS not installed (package.json uses vanilla CSS)
- ✅ Auth flow mostly complete (needs polish)
- ✅ API layer exists (apiInstance)
- ✅ Redux store with correct slices
- ✅ Glassmorphism design system started

---

## User Review Required

> [!IMPORTANT]
> Tailwind CSS is not in the current `ventally-web` `package.json`. I will install Tailwind CSS v3 with PostCSS. If you prefer v4, let me know before approving.

> [!WARNING]
> This is a large undertaking. I will build it **incrementally in phases**:
> - Phase 1: Foundation (Tailwind, design system, layout, routing)
> - Phase 2: Role-based routing + auth screens polish
> - Phase 3: Venter dashboard + core screens
> - Phase 4: Listener dashboard + core screens
> - Phase 5: Admin dashboard + screens
> - Phase 6: Chat/Call UI
> - Phase 7: Common screens (profile, settings, notifications)
> - Phase 8: Polish + responsiveness

> [!CAUTION]
> The existing auth pages in `ventally-web/src/pages/Auth/` will be refactored for visual consistency with the new design system.

---

## Proposed Changes

### Phase 1: Foundation Setup

#### [MODIFY] package.json
- Install: `tailwindcss@3`, `@tailwindcss/forms`, `postcss`, `autoprefixer`

#### [NEW] tailwind.config.js
- Map all RN theme colors to Tailwind tokens
- Custom spacing scale matching mobile proportions
- Glassmorphism utility classes

#### [NEW] postcss.config.js

#### [MODIFY] src/index.css
- Keep existing CSS vars but align with Tailwind theme
- Add comprehensive glassmorphism utilities

#### [MODIFY] src/router/AppRouter.tsx
- Replace single-dashboard approach with role-based routing
- Add: `VenterRouter`, `ListenerRouter`, `AdminRouter`
- Protected routes with role guards

---

### Phase 2: Layout System

#### [MODIFY] src/components/Layout/WebLayout.tsx
- Make it role-aware (different nav items per role)
- Add top nav bar for mobile
- Add breadcrumbs

#### [NEW] src/components/Layout/VenterLayout.tsx
#### [NEW] src/components/Layout/ListenerLayout.tsx
#### [NEW] src/components/Layout/AdminLayout.tsx

---

### Phase 3: Core Reusable Components

#### [NEW] src/components/ui/GlassCard.tsx
#### [NEW] src/components/ui/Button.tsx
#### [NEW] src/components/ui/Input.tsx
#### [NEW] src/components/ui/Modal.tsx
#### [NEW] src/components/ui/Badge.tsx
#### [NEW] src/components/ui/Toggle.tsx
#### [NEW] src/components/ui/MoodSelector.tsx
#### [NEW] src/components/ui/EmptyState.tsx
#### [NEW] src/components/ui/PageHeader.tsx
#### [NEW] src/components/ui/StatCard.tsx
#### [NEW] src/components/charts/LineChart.tsx
#### [NEW] src/components/charts/BarChart.tsx
#### [NEW] src/components/charts/MoodChart.tsx

---

### Phase 4: API Service Layer

#### [NEW] src/api/hooks/useMood.ts
#### [NEW] src/api/hooks/useReflections.ts
#### [NEW] src/api/hooks/useRecovery.ts
#### [NEW] src/api/hooks/useAvailability.ts
#### [NEW] src/api/hooks/useEarnings.ts
#### [NEW] src/api/hooks/useCalls.ts
#### [NEW] src/api/hooks/useChat.ts
#### [NEW] src/api/hooks/useAdmin.ts
#### [NEW] src/api/hooks/useNotifications.ts
#### [NEW] src/api/hooks/usePayments.ts

---

### Phase 5: Auth Pages (Refactor + Extended)

All existing auth pages refactored to use Tailwind + new design system:

#### [MODIFY] src/pages/Auth/LoginWeb.tsx
#### [MODIFY] src/pages/Auth/SignUpWeb.tsx
#### [NEW] src/pages/Auth/OnBoarding.tsx
#### [MODIFY] src/pages/Auth/VenterQuestionsFlow.tsx
#### [MODIFY] src/pages/Auth/ChoosePlan.tsx
#### [NEW] src/pages/Auth/PaymentMethods.tsx
#### [NEW] src/pages/Auth/SubscriptionSuccess.tsx

---

### Phase 6: Venter Pages (40 screens)

#### [NEW] src/pages/Venter/VenterDashboard.tsx
#### [NEW] src/pages/Venter/VenterWallet.tsx
#### [NEW] src/pages/Venter/VenterAddFunds.tsx
#### [NEW] src/pages/Venter/VenterTransactions.tsx
#### [NEW] src/pages/Venter/VenterMoodLog.tsx
#### [NEW] src/pages/Venter/VenterMoods.tsx
#### [NEW] src/pages/Venter/VenterMoodTrends.tsx
#### [NEW] src/pages/Venter/VenterMoodHistory.tsx
#### [NEW] src/pages/Venter/VenterMoodDetails.tsx
#### [NEW] src/pages/Venter/VenterReflections.tsx
#### [NEW] src/pages/Venter/VenterAddReflection.tsx
#### [NEW] src/pages/Venter/VenterReflectionDetail.tsx
#### [NEW] src/pages/Venter/VenterRecoveryDashboard.tsx
#### [NEW] src/pages/Venter/VenterJourneyDashboard.tsx
#### [NEW] src/pages/Venter/VenterLogProgress.tsx
#### [NEW] src/pages/Venter/VenterProgressSummary.tsx
#### [NEW] src/pages/Venter/VenterSettings.tsx
#### [NEW] src/pages/Venter/VenterCrisisFlow.tsx
#### [NEW] src/pages/Venter/VenterSubscription.tsx

---

### Phase 7: Listener Pages (13 screens)

#### [NEW] src/pages/Listener/ListenerDashboard.tsx
#### [NEW] src/pages/Listener/ListenerRequests.tsx
#### [NEW] src/pages/Listener/ListenerWallet.tsx
#### [NEW] src/pages/Listener/ListenerSettings.tsx
#### [NEW] src/pages/Listener/ListenerLegalPolicies.tsx

---

### Phase 8: Admin Pages (25 screens)

#### [NEW] src/pages/Admin/AdminDashboard.tsx
#### [NEW] src/pages/Admin/AdminUsers.tsx
#### [NEW] src/pages/Admin/AdminUserDetail.tsx
#### [NEW] src/pages/Admin/AdminSubAdmins.tsx
#### [NEW] src/pages/Admin/AdminReports.tsx
#### [NEW] src/pages/Admin/AdminFinancialStats.tsx
#### [NEW] src/pages/Admin/AdminListenerRequests.tsx
#### [NEW] src/pages/Admin/AdminReviewRequest.tsx
#### [NEW] src/pages/Admin/AdminSettings.tsx
#### [NEW] src/pages/Admin/AdminRolesPermissions.tsx
#### [NEW] src/pages/Admin/AdminExports.tsx

---

### Phase 9: Chat & Call UI

#### [NEW] src/pages/Chat/RecentChats.tsx
#### [NEW] src/pages/Chat/ChatScreen.tsx
#### [NEW] src/pages/Chat/FindingListener.tsx
#### [NEW] src/pages/Chat/ActiveCall.tsx
#### [NEW] src/pages/Chat/SessionFeedback.tsx
#### [NEW] src/pages/Chat/SessionRating.tsx

---

### Phase 10: Common Pages

#### [NEW] src/pages/Common/ProfileScreen.tsx
#### [NEW] src/pages/Common/EditProfile.tsx
#### [NEW] src/pages/Common/SessionsHistory.tsx
#### [NEW] src/pages/Common/SecuritySettings.tsx
#### [NEW] src/pages/Common/ChangePassword.tsx
#### [NEW] src/pages/Common/Notifications.tsx
#### [NEW] src/pages/Common/NotificationDetail.tsx
#### [NEW] src/pages/Common/LegalPolicies.tsx
#### [NEW] src/pages/Common/ContactUs.tsx
#### [NEW] src/pages/Common/DeleteAccount.tsx

---

### Phase 11: Progress Documentation

#### [NEW] ventally-web/progress.md
Maintained throughout execution documenting completed work.

---

## Design System

### Colors (from RN theme → CSS variables + Tailwind)
```
--color-primary: #C2AEBF  (magenda)
--color-success: #32D74B
--color-error: #FF453A
--color-accent: #204845   (deep green)
--color-mood-happy: #CFEDE3
--color-mood-neutral: #E7EEF4
--color-chart1: #2D3282
--glass-bg: rgba(255,255,255,0.04)
--glass-border: rgba(255,255,255,0.12)
```

### Background
- Deep dark: `#000000` (RN dark bg)
- Surface: `#1C1C1E` (glass surface)
- Gradient: radial violet → black overlay (matching RN HomeWrapper)

### Typography
- Font: **Inter** (used in web)
- Scale matches mobile: `hp(1.4)` → `12px`, `hp(2.2)` → `18px`, `hp(3.5)` → `28px`

---

## Verification Plan

### Automated Tests
- `npm run build` — ensure no TypeScript errors
- `npm run dev` — local dev server check

### Manual Verification
- Visual comparison screenshots of each screen vs RN app
- Role switching test (login as venter / listener / admin)
- Responsive breakpoints: 375px / 768px / 1280px
- Glassmorphism rendering on Chrome / Safari

---

## Open Questions

> [!IMPORTANT]
> 1. **Tailwind version**: Using v3 (stable). OK to proceed?
> 2. **Chart library**: Planning to use `recharts` for web charts (replacing `react-native-gifted-charts`). OK?
> 3. **Call UI**: Real-time call UI needs WebRTC or Agora. The existing socket service uses socket.io. Should the web call UI just show a mock/in-progress UI, or do you want full WebRTC integration?
> 4. **Deployment**: Is this SPA only, or should I add a production build configuration?
