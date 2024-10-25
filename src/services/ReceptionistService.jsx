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

const ReceptionistService = {
  getDashboard: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/receptionist/dashboard`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  addLostAndFound: async (item, description, image) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/receptionist/lost-and-found/add`,
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
      return await handleResponse(error.response);
    }
  },

  getLostAndFound: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/receptionist/lost-and-found`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getWorkPermits: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/receptionist/workpermits`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getGatePasses: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/receptionist/gatepasses`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  handleGatePassRequest: async (
    gatepassId,
    approval,
    representative,
    reasonDecline
  ) => {
    try {
      console.log(
        "🚀 ~ handleGatePassRequest: ~ gatepassId, approval, representative, reasonDecline",
        gatepassId,
        approval,
        representative,
        reasonDecline
      );
      const response = await axios.put(
        `${BASE_URL}/receptionist/gatepass/approval`,
        {
          gatepassId,
          approval,
          representative,
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

  getCompanies: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/receptionist/tenants`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getOccurences: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/receptionist/occurences`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  addOccurence: async (tenantId, subject, description) => {
    console.log(
      "🚀 ~ addOccurence: ~ tenantId, subject, description:",
      tenantId,
      subject,
      description
    );
    try {
      const response = await axios.post(
        `${BASE_URL}/receptionist/occurence/add`,
        {
          tenantId,
          subject,
          description,
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

  getComplaints: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/receptionist/complaints`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  handleComplaint: async (complaintId, approval) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/receptionist/complaint/resolve`,
        {
          complaintId,
          approval,
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

  getRooms: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/receptionist/rooms`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getRoomBookings: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/receptionist/room/bookings`,
        {
          withCredentials: true,
        }
      );
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  handleRoomBoooking: async (bookingId, approval, reasonDecline) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/receptionist/room/bookings/approval`,
        {
          bookingId,
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

  cancelRoomBooking: async (bookingId, reasonCancel) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/receptionist/room/bookings/cancel`,
        {
          bookingId,
          reasonCancel,
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

  giveComplaintFeedback: async (complaintId, feedback) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/receptionist/complaint/feedback`,
        {
          complaintId,
          feedback,
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

export default ReceptionistService;
