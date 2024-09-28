import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const handleResponse = async (response) => {
  console.log("🚀 ~ handleResponse ~ response:", response);
  try {
    console.log("🚀 ~ handleResponse ~ response:", response);
    if (response.status >= 200 && response.status < 300) {
      return { data: response.data, message: response.data.message };
    } else {
      return { error: response.message, response };
    }
  } catch (error) {
    return { error: error };
  }
};

const AdminService = {
  getTenants: async (towerId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/tower/${towerId}/tenants`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return { error: error };
    }
  },

  addTenant: async (
    registration,
    contactInfo,
    stakeholders,
    companyProfile,
    industrySector,
    companyResourceComposition
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/tenant/add`,
        {
          registration,
          contactInfo,
          stakeholders,
          companyProfile,
          industrySector,
          companyResourceComposition,
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
};

export default AdminService;
