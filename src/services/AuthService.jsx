import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const handleResponse = async (response) => {
  try {
    if (response.status >= 200 && response.status < 300) {
      console.log("🚀 ~ handleResponse ~ response:", response);
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
      const response = await axios.post(`${BASE_URL}/auth/receptionist-login`, {
        username,
        password,
      });
      return await handleResponse(response);
    } catch (error) {
      return { error: error };
    }
  },
  adminLogin: async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/admin-login`, {
        username,
        password,
      });
      return await handleResponse(response);
    } catch (error) {
      return { error: error };
    }
  },
  supervisorLogin: async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/supervisor-login`, {
        username,
        password,
      });
      return await handleResponse(response);
    } catch (error) {
      return { error: error };
    }
  },
  tenantLogin: async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/tenant-login`, {
        username,
        password,
      });
      return await handleResponse(response);
    } catch (error) {
      return { error: error };
    }
  },
};

export default AuthService;
