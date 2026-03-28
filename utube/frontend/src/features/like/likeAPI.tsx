import api from "../../services/api"

// toggle like
export const toggleLikeAPI = async (videoId: string) => {
  const res = await api.post(
    `/likes/video/${videoId}`,
    {},
    { withCredentials: true }
  )

  return res.data.data
}