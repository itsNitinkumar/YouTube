import api from "../../services/api";

// add history
export const addToHistoryAPI = async (videoId: string) => {
  await api.post(
    `/watch-history/track`,
    { videoId, watchDuration: 0 },
    { withCredentials: true }
  );
};

// get history
export const getHistoryAPI = async () => {
  const res = await api.get(`/watch-history`, { withCredentials: true });

  return res.data.data;
};