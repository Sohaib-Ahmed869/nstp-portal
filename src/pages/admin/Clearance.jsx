import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../../components/Sidebar";
import NSTPLoader from "../../components/NSTPLoader";
import {
  NewspaperIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { AdminService } from "../../services";
import { TowerContext } from "../../context/TowerContext";
import showToast from "../../util/toast";

const Clearance = () => {
  const [loading, setLoading] = useState(true);
  const [clearanceRequests, setClearanceRequests] = useState([
    // {
    //   id: "1",
    //   tenantName: "Hexler Tech",
    //   dateRequested: "2021-10-10",
    //   status: "Pending",
    //   applicantName: "John Doe",
    //   applicantCnic: "12345-1234567-1",
    //   applicantDesignation: "0333-1234567",
    //   officeNumber: "123",
    //   vacatingDate: "2021-10-15",
    //   reasonForLeaving: "Moving to a new office",
    // },
    // {
    //   id: "2",
    //   tenantName: "Hexler Tech",
    //   dateRequested: "2021-10-10",
    //   status: "Pending",
    //   applicantName: "John Doe",
    //   applicantCnic: "12345-1234567-1",
    //   applicantDesignation: "0333-1234567",
    //   officeNumber: "123",
    //   vacatingDate: "2021-10-15",
    //   reasonForLeaving: "Moving to a new office",
    // },
    // {
    //   id: "3",
    //   tenantName: "Hexler Tech",
    //   dateRequested: "2021-10-10",
    //   status: "Pending",
    //   applicantName: "John Doe",
    //   applicantCnic: "12345-1234567-1",
    //   applicantDesignation: "0333-1234567",
    //   officeNumber: "123",
    //   vacatingDate: "2021-10-15",
    //   reasonForLeaving: "Moving to a new office",
    // },
  ]);
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const {tower} = useContext(TowerContext);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await AdminService.getClearanceRequests(tower.id);
        console.log("🚀 ~ fetchRequests ~ response", response);
        if (response.error) {
          console.error(response.error);
          showToast(false, response.error);
        }

        console.log("🚀 ~ fetchRequests ~ response.data", response.data.clearances);

        const mappedRequests = response.data.clearances.map((request) => ({
            id: request._id,
            tenantName: request.tenant_name,
            dateRequested: request.createdAt,
            status: request.is_cleared,
            applicantName: request.applicant_name,
            applicantCnic: request.applicant_cnic,
            applicantDesignation: request.applicant_designation,
            officeNumber: request.officeNumber,
            vacatingDate: new Date(request.date_vacate).toISOString().split('T')[0],
            reasonForLeaving: request.reason,
            etags: request.etags,   
            cards: request.cards,
            bookingCosts: request.bookings
        }));

        setClearanceRequests(mappedRequests);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  const toggleDetails = (id) => {
    setExpandedRequestId(expandedRequestId === id ? null : id);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRequests = clearanceRequests.filter(
    (request) =>
      request.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.applicantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedRequests = filteredRequests.sort((a, b) => {
    const dateA = new Date(a.dateRequested);
    const dateB = new Date(b.dateRequested);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <Sidebar>
      {loading && <NSTPLoader />}
      <div
        className={`bg-base-100 mt-5 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${
          loading && "hidden"
        }`}
      >
        <div className="flex items-center mb-5 gap-3">
          <NewspaperIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold">Requests for Clearance</h1>
        </div>
        <hr className="my-5 text-gray-200"></hr>
        {/* Search + Filter */}
        <div className="flex my-5 max-md:flex-col lg:flex-row lg:items-center lg:justify-between mt-4">
          <div className="relative w-full lg:max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="input input-bordered w-full pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>

          <button
            className="btn btn-outline mt-3 md:mt-0 md:ml-4"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowsUpDownIcon className="h-5 w-5" />
            Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
        </div>
        {/* <div className="grid grid-cols-1 xl:grid-cols-2 xl:gap-x-5 "> */}
        <div className="">
          {sortedRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-md ring-1 ring-base-200 p-5 mb-5"
            >
              <div className="flex md:flex-row flex-col md:justify-between md:items-center">
                <div>
                  <p className="text-lg font-semibold">{request.tenantName}</p>
                  <p className="text-sm text-gray-600">
                    Requested on {request.dateRequested}
                  </p>
                </div>
                <button
                  className="btn mt-3 md:mt-0 btn-sm btn-primary text-base-100"
                  onClick={() => toggleDetails(request.id)}
                >
                  {expandedRequestId === request.id ? (
                    <ChevronUpIcon className="size-4" />
                  ) : (
                    <ChevronDownIcon className="size-4" />
                  )}
                  {expandedRequestId === request.id
                    ? "Hide Details"
                    : "View Details"}
                </button>
              </div>
              {expandedRequestId === request.id && (
                <div className="flex flex-col">
                    <div className="mt-5 pt-5 border-t-primary border-t-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <p className="text-lg font-semibold">
                            Applicant: {request.applicantName}
                        </p>
                        <p className="text-md">CNIC: {request.applicantCnic}</p>
                        <p className="text-md">Contact: {request.applicantDesignation}</p>
                        <p className="text-md">
                            Office Number: {request.officeNumber}
                        </p>
                        <p className="text-md">
                            Vacating Date: {request.vacatingDate}
                        </p>
                        <p className="text-md">
                            Reason for Leaving: {request.reasonForLeaving}
                        </p>
                    </div>
                    <div className="mt-5 pt-5 border-t-primary border-t-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <p className="text-md">
                            <p>E-Tags Issued: {request.etags.issued}</p>
                            <p>E-Tags Returned: {request.etags.returned}</p>
                        </p>
                        <p className="text-md">
                            <p>Cards Issued: {request.cards.issued}</p>
                            <p>Cards Returned: {request.cards.returned}</p>
                        </p>
                        <p className="text-md">
                            Room Booking Costs: Rs. {request.bookingCosts}
                        </p>
                    </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default Clearance;
