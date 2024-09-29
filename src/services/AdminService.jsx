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
      return { error: error };
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
      return { error: error };
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
      return { error: error };
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
      return { error: error };
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
      return { error: error };
    }
  },

  getPendingCardAllocations: async (towerId) => {
    try {
      console.log("🚀 ~ getPendingCardAllocations ~ towerId", towerId);
      return AdminService.getCardAllocations(towerId, "is_requested");
    } catch (error) {
      return { error: error };
    }
  },

  getIssuedCardAllocations: async (towerId) => {
    try {
      return AdminService.getCardAllocations(towerId, "is_issued");
    } catch (error) {
      return { error: error };
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
      return { error: error };
    }
  },

  getPendingEtagAllocations: async (towerId) => {
    try {
      return AdminService.getEtagAllocations(towerId, "is_requested");
    } catch (error) {
      return { error: error };
    }
  },

  getIssuedEtagAllocations: async (towerId) => {
    try {
      return AdminService.getEtagAllocations(towerId, "is_issued");
    } catch (error) {
      return { error: error };
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
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return { error: error };
    }
  },

  handleEtagAllocationRequest: async (employeeId, action) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/towers/${towerId}/etag/generate`,
        {
          employeeId,
        },
        {
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
