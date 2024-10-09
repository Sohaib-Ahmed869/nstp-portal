import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const handleResponse = async (response) => {
  try {
    console.log("🚀 ~ handleResponse ~ response:", response);
    if (response.status >= 200 && response.status < 300) {
      return { data: response.data, message: response.data.message };
    } else {
      return { error: response.data.message };
    }
  } catch (error) {
    return { error: error };
  }
};

const AuthService = {
  receptionistLogin: async (username, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login/receptionist`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("🚀 ~ AuthService ~ response", response);
      return await handleResponse(response);
    } catch (error) {
      return { error: error.response.data.message };
    }
  },
  adminLogin: async (username, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login/admin`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return { error: error.response.data.message };
    }
  },
  supervisorLogin: async (username, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login/supervisor`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return { error: error.response.data.message };
    }
  },
  tenantLogin: async (username, password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/login/tenant`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return { error: error.response.data.message };
    }
  },

  logout: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/logout`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },
};

export default AuthService;
