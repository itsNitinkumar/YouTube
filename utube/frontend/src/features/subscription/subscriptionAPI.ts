import api from "../../services/api"

// toggle subscribe
export const toggleSubscribeAPI = async (creatorId: string) => {
  const res = await api.post(
    `/subscriptions/${creatorId}`,
    {},
    { withCredentials: true }
  )

  return res.data.data
}