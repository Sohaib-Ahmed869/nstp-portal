import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const handleResponse = async (response) => {
  try {
    // console.log("🚀 ~ handleResponse ~ response:", response);
    if (response.status >= 200 && response.status < 300) {
      return { data: response.data, message: response.data.message };
    } else {
      return { error: response.data.message };
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
      return await handleResponse(error.response);
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
      return await handleResponse(error.response);
    }
  },

  getEmployees: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/employees`, {
        withCredentials: true,
      });

      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getCardAllocations: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/card/allocations`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getEtagAllocations: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/etag/allocations`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
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
      return await handleResponse(error.response);
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
      return await handleResponse(error.response);
    }
  },

  getGatePasses: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/gatepasses`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  requestGatePass: async (guestName, guestCnic, guestContact, gateNumber) => {
    try {
      console.log(
        "🚀 ~ requestGatePass ~ guestData",
        guestName,
        guestCnic,
        guestContact,
        gateNumber
      );
      const response = await axios.post(
        `${BASE_URL}/tenant/gatepass/request`,
        {
          guestName,
          guestCnic,
          guestContact,
          gateNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("🚀 ~ requestGatePass ~ response", response);
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getWorkPermits: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/workpermits`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  requestWorkPermit: async (permitBody) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/tenant/workpermit/request`,
        {
          permitBody,
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
      return await handleResponse(error.response);
    }
  },

  layOffEmployee: async (employeeId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/tenant/employee/layoff`,
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
      return await handleResponse(error.response);
    }
  },

  getOccurences: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/occurences`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getComplaints: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/complaints`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  generateComplaint: async (complaint) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/tenant/complaint/generate`,
        {
          complaintType: complaint.type,
          subject: complaint.subject,
          description: complaint.desc,
          serviceType: complaint.serviceTypeId,
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
      return await handleResponse(error.response);
    }
  },
};

export default TenantService;
