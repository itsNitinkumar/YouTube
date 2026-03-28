import api from "../../services/api"

export const fetchVideosAPI = async () => {
  const res = await api.get("/videos")
  return res.data.data
}