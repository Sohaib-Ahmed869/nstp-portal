import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const handleResponse = async (response) => {
  try {
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
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/card/allocations?${queryParam}`,
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
      return await AdminService.getCardAllocations(
        towerId,
        "is_requested=true"
      );
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getIssuedCardAllocations: async (towerId) => {
    try {
      return await AdminService.getCardAllocations(towerId, "is_issued=true");
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getNonPendingCardAllocations: async (towerId) => {
    try {
      return await AdminService.getCardAllocations(
        towerId,
        "is_requested=false"
      );
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getEtagAllocations: async (towerId, queryParam) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/etag/allocations?${queryParam}`,
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
      return await AdminService.getEtagAllocations(
        towerId,
        "is_requested=true"
      );
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getIssuedEtagAllocations: async (towerId) => {
    try {
      return await AdminService.getEtagAllocations(towerId, "is_issued=true");
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getNonPendingEtagAllocations: async (towerId) => {
    try {
      return await AdminService.getEtagAllocations(
        towerId,
        "is_requested=false"
      );
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  handleCardAllocationRequest: async (allocationId, action, reasonDecline) => {
    try {
      if (action === "approve") {
        return await AdminService.approveCardAllocationRequest(allocationId);
      } else {
        return await AdminService.rejectCardAllocationRequest(
          allocationId,
          reasonDecline
        );
      }
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  approveCardAllocationRequest: async (allocationId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/card/accept`,
        {
          allocationId,
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

  rejectCardAllocationRequest: async (allocationId, reasonDecline) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/card/reject`,
        {
          allocationId,
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

  handleEtagAllocationRequest: async (allocationId, action, reasonDecline) => {
    try {
      if (action === "approve") {
        return await AdminService.approveEtagAllocationRequest(allocationId);
      } else {
        return await AdminService.rejectEtagAllocationRequest(
          allocationId,
          reasonDecline
        );
      }
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  approveEtagAllocationRequest: async (allocationId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/etag/accept`,
        {
          allocationId,
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

  rejectEtagAllocationRequest: async (allocationId, reasonDecline) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/etag/reject`,
        {
          allocationId,
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

  getServices: async (towerId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/services`,
        {
          withCredentials: true,
        }
      );

      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  addService: async (towerId, name, description, icon) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/service/add`,
        {
          towerId,
          name,
          description,
          icon,
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

  editService: async (serviceId, name, description, icon) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/service/edit`,
        {
          serviceId,
          name,
          description,
          icon,
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

  deleteService: async (serviceId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/admin/service/delete`, {
        data: { serviceId },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getLostAndFound: async (towerId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/lost-and-found`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getRoomTypes: async (towerId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/room-types`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getRooms: async (towerId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/towers/${towerId}/rooms`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  addRoomType: async (towerId, room) => {
    try {
      console.log(room);
      const rateList = room.rate_list.map((category) => ({
        category: category.category,
        rates: category.rates.map((rate) => ({
          rate_type: rate.rate_type,
          rate: rate.rate,
        })),
      }));

      console.log(rateList);
      const response = await axios.post(
        `${BASE_URL}/admin/room-type/add`,
        {
          towerId,
          name: room.name,
          capacity: room.capacity,
          rateList: rateList,
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
