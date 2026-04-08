import type { User } from '../store/slices/userSlice';

/** Map backend user payload to Redux `User` (aligned with mobile `setUser` usage). */
export function mapApiUserToStore(apiUser: Record<string, unknown> | null | undefined): User {
  if (!apiUser) {
    return {
      id: '',
      name: '',
      email: '',
      role: '',
      image: '',
      balance: 0,
    };
  }
  const u = apiUser as Record<string, any>;
  const userType = u.userType as string | undefined;
  const role: User['role'] =
    userType === 'listener' ? 'listener' : userType === 'admin' ? 'admin' : userType === 'venter' ? 'venter' : '';

  return {
    id: String(u.id ?? u.userId ?? ''),
    name: (u.displayName || u.name || u.email?.split?.('@')?.[0] || '') as string,
    email: (u.email || '') as string,
    role,
    userType,
    displayName: u.displayName as string | undefined,
    phone: u.phone ?? null,
    image: (u.image || u.profileImage || u.avatarUrl || '') as string,
    balance: typeof u.balance === 'number' ? u.balance : undefined,
    isVerified: u.isVerified as boolean | undefined,
    activeRole: u.activeRole as string | undefined,
    availableRoles: u.availableRoles as string[] | undefined,
  };
}
