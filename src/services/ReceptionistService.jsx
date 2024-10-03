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

const ReceptionistService = {
  addLostAndFound: async (item, description, image) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/receptionist/lostAndFound/add`,
        {
          item,
          description,
          image,
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
      return { error: error };
    }
  },

  getWorkPermits: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/receptionist/workPermit`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return { error: error };
    }
  },
};

export default ReceptionistService;
