import api from "../../services/api";

// Get all notifications
export const fetchNotificationsAPI = async () => {
  const res = await api.get("/notifications", {
    withCredentials: true,
  });
  return res.data.data;
};

// Get unread count
export const getUnreadCountAPI = async () => {
  const res = await api.get("/notifications/unread-count", {
    withCredentials: true,
  });
  return res.data.data;
};

// Mark single notification as read
export const markNotificationAsReadAPI = async (notificationId: string) => {
  const res = await api.patch(
    `/notifications/${notificationId}/read`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data.data;
};

// Mark all notifications as read
export const markAllAsReadAPI = async () => {
  const res = await api.patch(
    "/notifications/read-all",
    {},
    {
      withCredentials: true,
    }
  );
  return res.data.data;
};