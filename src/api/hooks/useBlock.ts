import apiInstance from '../apiInstance';

export const useBlock = () => {
  const blockUser = async (userId: string, reason?: string) => {
    const res = await apiInstance.post(`users/${userId}/block`, { reason });
    return res.data;
  };

  const unblockUser = async (userId: string) => {
    const res = await apiInstance.delete(`users/${userId}/block`);
    return res.data;
  };

  const getBlockedUsers = async () => {
    const res = await apiInstance.get('users/blocked');
    return res.data;
  };

  return { blockUser, unblockUser, getBlockedUsers };
};
