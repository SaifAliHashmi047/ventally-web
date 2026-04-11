import apiInstance from '../apiInstance';

export const useReflections = () => {
  const getTodayReflection = async () => {
    const res = await apiInstance.get('reflections/today');
    return res.data;
  };

  const getReflectionHistory = async (limit = 10, offset = 0) => {
    const res = await apiInstance.get('reflections/history', { params: { limit, offset } });
    return res.data;
  };

  const addReflection = async (text: string) => {
    const res = await apiInstance.post('reflections', { reflection_text: text });
    return res.data;
  };

  const updateReflection = async (id: string, text: string) => {
    const res = await apiInstance.put(`reflections/${id}`, { reflection_text: text });
    return res.data;
  };

  const deleteReflection = async (id: string) => {
    const res = await apiInstance.delete(`reflections/${id}`);
    return res.data;
  };

  return {
    getTodayReflection,
    getReflectionHistory,
    addReflection,
    updateReflection,
    deleteReflection,
  };
};
