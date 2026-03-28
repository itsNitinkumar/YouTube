import api from "../../services/api"

export const fetchNotificationsAPI = async () => {
  const res = await api.get("/notifications", {
    withCredentials: true,
  })
  return res.data.data
}