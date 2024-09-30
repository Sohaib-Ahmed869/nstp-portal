import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const handleResponse = async (response) => {
  try {
    console.log("🚀 ~ handleResponse ~ response:", response);
    if (response.status >= 200 && response.status < 300) {
      return { data: response.data, message: response.data.message };
    } else {
      return { error: response.message };
    }
  } catch (error) {
    return { error: error };
  }
};

const CommonService = {
  viewLostAndFound: async (towerId) => {
    try {
      const response = await axios.get(`${BASE_URL}/common/towers/${towerId}/lostAndFound`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return { error: error };
    }
  },
};

export default CommonService;
