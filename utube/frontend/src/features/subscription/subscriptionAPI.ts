import api from "../../services/api";

// Toggle subscribe to creator
export const toggleSubscribeAPI = async (creatorId: string) => {
  const res = await api.post(
    `/creators/${creatorId}/subscribe`,
    {},
    { withCredentials: true }
  );

  return res.data.data;
};

// Get creator's subscribers
export const getCreatorSubscribersAPI = async (creatorId: string) => {
  const res = await api.get(`/creators/${creatorId}/subscribers`);

  return res.data.data;
};