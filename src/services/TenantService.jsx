import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const handleResponse = async (response) => {
  try {
    // console.log("🚀 ~ handleResponse ~ response:", response);
    if (response.status >= 200 && response.status < 300) {
      return { data: response.data, message: response.data.message };
    } else {
      return { error: response.message };
    }
  } catch (error) {
    return { error: error };
  }
};

const TenantService = {
  addEmployee: async (empBody) => {
    try {
      console.log("🚀 ~ addEmployee ~ employee", empBody);
      const response = await axios.post(
        `${BASE_URL}/tenant/employee/register`,
        {
          empBody,
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

  updateEmployee: async (employeeId, empBody) => {
    try {
      console.log("🚀 ~ addEmployee ~ employee", empBody);
      const response = await axios.put(
        `${BASE_URL}/tenant/employee/update`,
        {
          employeeId,
          empBody,
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

  getEmployees: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/employees`, {
        withCredentials: true,
      });

      return await handleResponse(response);
    } catch (error) {
      return { error: error };
    }
  },

  getCardAllocations: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/card/allocations`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return { error: error };
    }
  },

  getEtagAllocations: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/etag/allocations`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return { error: error };
    }
  },

  requestCard: async (employeeId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/tenant/card/request`,
        {
          employeeId,
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

  requestEtag: async (employeeId, plateNum) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/tenant/etag/request`,
        {
          employeeId,
          plateNum,
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

export default TenantService;
