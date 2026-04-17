import apiInstance from '../apiInstance';

export interface UserRoleConfigResponse {
  availableRoles: string[];
  activeRole: string;
}

export interface SwitchRolePayload {
  targetRole: string;
}

export interface SwitchRoleResponse {
  message?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  user?: {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    image?: string;
    activeRole?: string;
    availableRoles?: string[];
    [key: string]: unknown;
  };
}

export interface UpdateAvailableRolesPayload {
  role: string;
  action: 'add' | 'remove';
}

export interface UpdateAvailableRolesResponse {
  message?: string;
  availableRoles?: string[];
}

/**
 * Custom hook for User Roles API endpoints
 */
export const useRoles = () => {
  /**
   * Get user's current role configuration
   */
  const getUserRoles = async (): Promise<UserRoleConfigResponse> => {
    const response = await apiInstance.get<UserRoleConfigResponse>('users/roles');
    return response?.data;
  };

  /**
   * Add or remove roles from user's available roles
   */
  const updateAvailableRoles = async (payload: UpdateAvailableRolesPayload): Promise<UpdateAvailableRolesResponse> => {
    const response = await apiInstance.put<UpdateAvailableRolesResponse>('users/available-roles', payload);
    return response?.data;
  };

  /**
   * Switch user's active role
   */
  const switchRole = async (payload: SwitchRolePayload): Promise<SwitchRoleResponse> => {
    const response = await apiInstance.post<SwitchRoleResponse>('users/switch-role', payload);
    return response?.data;
  };

  return {
    getUserRoles,
    updateAvailableRoles,
    switchRole,
  };
};

export default useRoles;
