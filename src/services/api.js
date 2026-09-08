import axios from "axios";

const api = axios.create({
  baseURL: "https://expense-tracker-backend-beige-rho.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});


// ==========================================
// Request Interceptor
// ==========================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ==========================================
// Response Interceptor
// ==========================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    // ----------------------------------------
    // Unauthorized
    // ----------------------------------------

    if (error.response?.status === 401) {
      const token = localStorage.getItem("access_token");

      // Only perform auth cleanup if a token exists.
      // This avoids unnecessary auth events for
      // normal public requests such as login.
      if (token) {
        localStorage.removeItem("access_token");

        window.dispatchEvent(
          new Event("auth-changed")
        );
      }
    }

    return Promise.reject(error);
  }
);


export default api;