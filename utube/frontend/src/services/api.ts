import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

//No need for request interceptor for Authorization header

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
export default api;
