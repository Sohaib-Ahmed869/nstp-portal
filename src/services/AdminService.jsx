import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const handleResponse = async (response) => {
  console.log("🚀 ~ handleResponse ~ response:", response);
  try {
    console.log("🚀 ~ handleResponse ~ response:", response);
    if (response.status >= 200 && response.status < 300) {
      return { data: response.data, message: response.data.message };
    } else {
      return { error: response.data.message, response };
    }
  } catch (error) {
    return { error: error };
  }
};

const AdminService = {
  getDashboard: async (towerId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/dashboard`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getTenants: async (towerId) => {
    try {
      console.log("🚀 ~ getTenants ~ towerId", towerId);
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/tenants`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getTenant: async (towerId, tenantId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/tenants/${tenantId}`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
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
      return await handleResponse(error.response);
    }
  },

  getOfficeRequests: async (towerId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/office/requests`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  assignOffice: async (towerId, tenantId, office) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/office/assign`,
        {
          towerId,
          tenantId,
          office,
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

  getCardAllocations: async (towerId, queryParam) => {
    console.log("🚀 ~ getCardAllocations: ~ queryParam:", queryParam);
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/card/allocations?${queryParam}=true`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getPendingCardAllocations: async (towerId) => {
    try {
      console.log("🚀 ~ getPendingCardAllocations ~ towerId", towerId);
      return AdminService.getCardAllocations(towerId, "is_requested");
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getIssuedCardAllocations: async (towerId) => {
    try {
      return AdminService.getCardAllocations(towerId, "is_issued");
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getEtagAllocations: async (towerId, queryParam) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/etag/allocations?${queryParam}=true`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getPendingEtagAllocations: async (towerId) => {
    try {
      return AdminService.getEtagAllocations(towerId, "is_requested");
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getIssuedEtagAllocations: async (towerId) => {
    try {
      return AdminService.getEtagAllocations(towerId, "is_issued");
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  handleCardAllocationRequest: async (employeeId, action) => {
    try {
      console.log("🚀 ~ handleCardAllocationRequest ~ employeeId", employeeId);
      const response = await axios.post(
        `${BASE_URL}/admin/card/generate`,
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

  handleEtagAllocationRequest: async (employeeId, action) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/etag/generate`,
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

  getWorkPermits: async (towerId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/workpermits`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  handleWorkPermit: async (workPermitId, approval, reasonDecline) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/workPermit/resolve`,
        {
          workPermitId,
          approval,
          reasonDecline,
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

  terminateEmployee: async (employeeId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/employee/layoff`,
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

  getComplaints: async (towerId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/complaints`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  handleComplaint: async (complaintId, approval, reasonDecline) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/complaint/resolve`,
        {
          complaintId,
          approval,
          reasonDecline,
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

export default AdminService;
