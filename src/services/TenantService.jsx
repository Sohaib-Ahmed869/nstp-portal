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
  getDashboard: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/dashboard`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getProfile: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/profile`, {
        withCredentials: true,
      });
      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

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
          urgency: complaint.urgency,
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

  cancelComplaint: async (complaintId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/tenant/complaints/${complaintId}/cancel`,
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

  getServices: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/services`, {
        withCredentials: true,
      });

      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getLostAndFound: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/lost-and-found`, {
        withCredentials: true,
      });

      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getRooms: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/rooms`, {
        withCredentials: true,
      });

      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getRoomBookings: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/room/bookings`, {
        withCredentials: true,
      });

      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  getAllRoomBookings: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tenant/room/bookings/all`, {
        withCredentials: true,
      });

      return await handleResponse(response);
    } catch (error) {
      return await handleResponse(error.response);
    }
  },

  requestRoomBooking: async (bookingBody) => {
    try {
      const { date, startTime, endTime } = bookingBody;

      // Combine date with startTime and endTime
      const startDate = new Date(`${date}T${startTime}:00`);
      const endDate = new Date(`${date}T${endTime}:00`);

      console.log("🚀 ~ requestRoomBooking ~ startDate", startDate);
      console.log("🚀 ~ requestRoomBooking ~ endDate", endDate);

      // // If you need the dates in ISO string format
      // const startDateString = startDate.toISOString();
      // const endDateString = endDate.toISOString();

      // console.log("🚀 ~ requestRoomBooking ~ startDateString", startDateString);
      // console.log("🚀 ~ requestRoomBooking ~ endDateString", endDateString);

      const response = await axios.post(
        `${BASE_URL}/tenant/room/bookings/request`,
        {
          roomId: bookingBody.roomId,
          timeStart: startDate,
          timeEnd: endDate,
          reasonBooking: bookingBody.reason,
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

  cancelRoomBooking: async (bookingId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/tenant/room/bookings/${bookingId}/cancel`,
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

  initiateClearanceForm: async (clearanceBody) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/tenant/clearance/initiate`,
        {
          applicantName: clearanceBody.applicantName,
          applicantDesignation: clearanceBody.applicantDesignation,
          applicantCnic: clearanceBody.applicantCnic,
          office: clearanceBody.officeNumber,
          dateVacate: clearanceBody.vacatingDate,
          reason: clearanceBody.reasonForLeaving,
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

  submitEvaluation: async (evaluationBody) => {
    try {
      const { economicPerformance, innovationTechnology, nustInteraction, otherDetails } = evaluationBody;
      const response = await axios.post(
        `${BASE_URL}/tenant/evaluation/submit`,
        {
          evaluationBody: {
            economicPerformance: {
              sales_total: economicPerformance.salesTotal,
              sales_tenants: economicPerformance.salesTenants,
              sales_exports: economicPerformance.salesExports,
              earning: economicPerformance.earning,
              investment_rnd: economicPerformance.investmentRnd,
              investment_snm: economicPerformance.investmentSnm,
              investment_hr: economicPerformance.investmentHr,
              customers_total: economicPerformance.customersTotal,
              customers_b2b: economicPerformance.customersB2b,
              investment_raised: economicPerformance.investmentRaised,
              inverstor_origin: economicPerformance.inverstorOrigin,
              investor_type: economicPerformance.investorType,
              investor_name: economicPerformance.investorName,
              investment_amount: economicPerformance.investmentAmount,
              employees_total: economicPerformance.employeesTotal,
              employees_rnd: economicPerformance.employeesRnd,
              employees_snm: economicPerformance.employeesSnm,
              employees_hr: economicPerformance.employeesHr,
              employees_interns: economicPerformance.employeesInterns,
              employees_support: economicPerformance.employeesSupport,
              avg_employee_retention: economicPerformance.avgEmployeeRetention,
              avg_internship_duration: economicPerformance.avgInternshipDuration,
              avg_salary: economicPerformance.avgSalary,
            },
            innovationTechnology: {
              num_technologies: innovationTechnology.numTechnologies,
              num_ips_filed: innovationTechnology.numIpsFiled,
              num_ips_awarded: innovationTechnology.numIpsAwarded,
              num_ips_owned: innovationTechnology.numIpsOwned,
              num_technologies_transfers: innovationTechnology.numTechnologiesTransfers,
              num_research_national: innovationTechnology.numResearchNational,
              num_research_international: innovationTechnology.numResearchInternational,
              value_research_international: innovationTechnology.valueResearchInternational,
              num_collaborations: innovationTechnology.numCollaborations,
            },
            nustInteraction: {
              num_internships: nustInteraction.numInternships,
              num_jobs: nustInteraction.numJobs,
              num_placements: nustInteraction.numPlacements,
              num_research_projects: nustInteraction.numResearchProjects,
              value_research_projects: nustInteraction.valueResearchProjects,
              participation_jobfair: nustInteraction.participationJobfair,
            },
            otherDetails: {
              achievements: otherDetails.achievements,
              comments: otherDetails.comments,
            },
          },
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
