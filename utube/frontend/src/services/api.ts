import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Don't redirect on 401 for /users/me (checkAuth)
    if (err.response?.status === 401 && !err.config.url?.includes('/users/me')) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
