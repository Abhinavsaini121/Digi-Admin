import axios from "axios";

const api = axios.create({
  baseURL: "https://test.pearl-developer.com/dryfruits/public/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
