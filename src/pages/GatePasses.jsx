import React, { useEffect, useState, useContext } from 'react'
import Sidebar from '../components/Sidebar'
import NSTPLoader from '../components/NSTPLoader'
import FloatingLabelInput from '../components/FloatingLabelInput'
import { PlusCircleIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon, CheckIcon, ClockIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline'
import { TenantService, ReceptionistService } from '../services'
import showToast from '../util/toast'
import { TowerContext } from '../context/TowerContext'

const GatePasses = ({ role }) => {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState("guestName");
    const [sortOrder, setSortOrder] = useState("asc");
    const [filter, setFilter] = useState("All");
    const [selectedGatePass, setSelectedGatePass] = useState(null);
    const [gatePassesTableData, setGatePassesTableData] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [reasonForRejection, setReasonForRejection] = useState("");
    const [nstpRepresentative, setNstpRepresentative] = useState("");
    const [objectToAdd, setObjectToAdd] = useState({
        date: "",
        sponsor: "NSTP",
        guestName: "",
        guestCNIC: "",
        guestContact: "",
        gateNumber: "",
        nstpRepresentative: null,
        issued: false,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [reasonDecline, setReasonDecline] = useState("");
    const { tower } = useContext(TowerContext);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setObjectToAdd((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleSubmit = async () => {
        setModalLoading(true);

        try {
            const response = await TenantService.requestGatePass(
                objectToAdd.guestName,
                objectToAdd.guestCNIC,
                objectToAdd.guestContact,
                objectToAdd.gateNumber
            );
            console.log(response);

            if (response.error) {
                console.log(response.error);
                showToast(false)

                return;
            }

            const newObject = {
                ...objectToAdd,
                date: new Date().toLocaleString(),
                issued: false,
            };

            setGatePassesTableData((prev) => [...prev, newObject]);
            showToast(true, "Gate pass requested successfully")
        } catch (error) {
            console.log(error);
            return;
        } finally {
            setModalLoading(false);
            document.getElementById('gate_pass_modal').close();
        }
    };

    // Simulate loading
    useEffect(() => {
        setLoading(true);
        if (role === "tenant") {
            async function fetchGatePasses() {
                try {
                    const response = await TenantService.getGatePasses();
                    if (response.error) {
                        console.log(response.error);
                        return;
                    }

                    // console.log(response.data.gatePasses);

                    const mappedData = response.data.gatePasses.map(pass => ({
                        id: pass._id,
                        date: new Date(pass.date).toLocaleString(),
                        sponsor: pass.sponsor,
                        guestName: pass.guest_name,
                        guestCNIC: pass.guest_cnic,
                        guestContact: pass.guest_contact,
                        gateNumber: pass.gate_number.toString(),
                        nstpRepresentative: "", // Assuming no representative for tenant
                        issued: pass.is_approved,
                    }));

                    setGatePassesTableData(mappedData);
                    setGatePassesTableData((prevData) => prevData.sort((a, b) => new Date(b.date) - new Date(a.date)));
                } catch (error) {
                    console.log(error);
                    showToast(false);
                    return;
                } finally {
                    setLoading(false);
                }
            }

            fetchGatePasses();
        } else if (role === "receptionist") {
            async function fetchGatePasses() {
                try {
                    const response = await ReceptionistService.getGatePasses();
                    if (response.error) {
                        console.log(response.error);
                        return;
                    }
                    console.log(response.data.gatePasses);

                    // map the data

                    const mappedData = response.data.gatePasses.map(pass => ({
                        id: pass._id,
                        date: new Date(pass.date).toLocaleString(),
                        tenantName: pass.tenant_id.registration.organizationName,
                        sponsor: pass.tower.name,
                        guestName: pass.guest_name,
                        guestCNIC: pass.guest_cnic,
                        guestContact: pass.guest_contact,
                        gateNumber: pass.gate_number.toString(),
                        nstpRepresentative: pass.nstp_representative,
                        issued: pass.is_approved,
                    }));

                    setGatePassesTableData(mappedData);
                    setGatePassesTableData((prevData) => prevData.sort((a, b) => a.issued - b.issued));
                } catch (error) {
                    console.log(error);
                    showToast(false);
                    return;
                } finally {
                    setLoading(false);
                }
            }

            fetchGatePasses();
        }

        // Default sort by date, latest first for tenants
        if (role === "tenant") {
        } else if (role === "receptionist") {
            // Default sort by status for receptionists
        }
    }, [role]);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSortChange = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
    };

    const filteredData = gatePassesTableData
        .filter((row) => {
            if (filter === "All") return true;
            return filter === "Issued" ? row.issued : !row.issued;
        })
        .filter((row) => {
            return (
                row.tenantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.guestCNIC.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.guestContact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.sponsor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.guestContact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.nstpRepresentative?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        })
        .sort((a, b) => {
            if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
            if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

    const fieldConfigs = [
        { name: "guestName", type: "text", id: "guestName", label: "Guest Name", value: objectToAdd.guestName, required: true },
        { name: "guestCNIC", type: "text", id: "guestCNIC", label: "Guest CNIC", value: objectToAdd.guestCNIC, required: true },
        { name: "guestContact", type: "text", id: "guestContact", label: "Guest Contact", value: objectToAdd.guestContact, required: true },
        { name: "gateNumber", type: "text", id: "gateNumber", label: "Gate Number", value: objectToAdd.gateNumber, required: true },
    ];

    const handleApproveReject = async () => {
        setModalLoading(true);
        try {
            const approval = selectedGatePass?.action === "approve"; 

            console.log("selectedGatePass.id", selectedGatePass.id)
            console.log("selectedGatePass.action", selectedGatePass.action)
            console.log( "approval", approval)
            console.log("nstpRepresentative", nstpRepresentative)
            console.log("reasonForRejection", reasonForRejection)

            const nstpRep = nstpRepresentative.trim() !== "" ? nstpRepresentative.trim() : null;
            const reasonDecline = reasonForRejection.trim() !== "" ? reasonForRejection.trim() : null;

            const response = await ReceptionistService.handleGatePassRequest(selectedGatePass, approval, nstpRep, reasonDecline);
            if (response.error) {
                console.log(response.error);
                showToast(false, "An error occurred. The gate pass was not " + selectedGatePass.action +"ed.");
                return;
            }

            // //TODO STATUS FIELD NEEDS TO BE UPDATED.
            // const updatedGatePasses = gatePassesTableData.map((gatePass) =>
            //     gatePass.id === selectedGatePass ? { ...gatePass, issued: true } : gatePass
            // );

            // setGatePassesTableData(updatedGatePasses);
            showToast(true);

        } catch (error) {
            console.log(error);
            showToast(false);
            return;
        } finally {
            setModalLoading(false);
            setNstpRepresentative("");
            setReasonForRejection("");
            setSelectedGatePass(null);
            document.getElementById('approve_gate_pass_modal').close();
        }
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Sidebar>
            {/* Loading spinner */}
            {loading && <NSTPLoader />}

            {/* Modal to add a gate pass */}
            <dialog id="gate_pass_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">Request Gate Pass</h3>
                    <form>
                        {fieldConfigs.map((field) => (
                            <FloatingLabelInput
                                key={field.id}
                                name={field.name}
                                type={field.type}
                                id={field.id}
                                label={field.label}
                                value={field.value}
                                onChange={handleInputChange}
                                required={field.required}
                            />
                        ))}
                    </form>
                    <div className="modal-action">
                        <button className={`btn mr-1 ${modalLoading && "btn-disabled"}`} onClick={() => document.getElementById('gate_pass_modal').close()}>Cancel</button>
                        <button className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`} onClick={handleSubmit}>
                            {modalLoading && <span className="loading loading-spinner"></span>}
                            {modalLoading ? "Please wait..." : "Request"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Modal to approve a gate pass- recp only */}
            <dialog id="approve_gate_pass_modal" className="modal">
                <div className="modal-box  w-11/12 max-w-xl max-h-max">
                <div className="flex items-center gap-3 mb-2">
                        {selectedGatePass?.action == "approve" ?
                            <HandThumbUpIcon className="size-8 text-primary" />
                            :
                            <HandThumbDownIcon className="size-8 text-error" />
                        }
                        <h3 className="font-bold text-lg">{selectedGatePass?.action === 'approve' ? 'Approve Gate Pass' : 'Reject Gate Pass'}</h3>
                    </div> 
                    <p className="text-base mt-2">
                        Are you sure you want to {selectedGatePass?.action} this request?
                    </p>
                    {selectedGatePass?.action !== "approve"  ? (
                        <>
                        <p> Please provide the reason for rejection: </p>
                        <textarea
                            value={reasonForRejection}
                            onChange={(e) => setReasonForRejection(e.target.value)}
                            className="textarea textarea-bordered w-full mt-2"
                            placeholder="Reason for rejection"  
                            rows={7}
                        />
                        </>
                    ):
                    <>
                        <p> Please provide the NSTP Representative: </p>
                        <input
                            value={nstpRepresentative}
                            onChange={(e) => setNstpRepresentative(e.target.value)}
                            className="input input-bordered w-full mt-2"
                            placeholder="NSTP Representative name"  
                        />
                        </> 
                    }
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('approve_gate_pass_modal').close()}>Cancel</button>
                        <button
                            className={`btn btn-success ${modalLoading && "btn-disabled"} ${selectedGatePass?.action === "approve" && "btn-primary"} ${selectedGatePass?.action === "reject" && "btn-error"}`}
                            onClick={() => handleApproveReject()}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>}
                            {modalLoading ? "Please wait..." : selectedGatePass? selectedGatePass.action == "approve" ? "Approve" : "Reject" : "Confirm"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* main content */}
            <div className={`bg-base-100 rounded-md shadow-md p-5 lg:p-10 mt-10 ${loading && "hidden"}`}>
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold">Gate Passes</p>
                    {role == "tenant" && (<button className="btn btn-primary text-white" onClick={() => document.getElementById('gate_pass_modal').showModal()}>
                        <PlusCircleIcon className="size-6" />
                        Request Gate Pass
                    </button>)}
                </div>
                <hr className="my-5 text-gray-200"></hr>

                {/* Search + Filter */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
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
                    <div className="w-full lg:max-w-xs flex items-center">
                        <AdjustmentsHorizontalIcon className="size-8 text-gray-400 mr-3" />
                        <select
                            value={filter}
                            onChange={handleFilterChange}
                            className="select select-bordered w-full lg:max-w-xs"
                        >
                            <option value="All">All</option>
                            <option value="Issued">Issued</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>

                <div className="w-full overflow-auto">
                    <h2 className="text-lg font-semibold mb-5">Gate Passes</h2>
                    <table className="table w-full">
                        <thead>
                            <tr className='bg-base-200 cursor-pointer'>
                                <th onClick={() => handleSortChange("date")}>Date {sortField === "date" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                {
                                    role != "tenant" && <th onClick={() => handleSortChange("tenantName")}>Tenant Name {sortField === "tenantName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                }
                                <th onClick={() => handleSortChange("guestName")}>Guest Name {sortField === "guestName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("guestCNIC")}>Guest CNIC {sortField === "guestCNIC" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("guestContact")}>Guest Contact {sortField === "guestContact" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("gateNumber")}>Gate Number {sortField === "gateNumber" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("nstpRepresentative")}>NSTP Rep {sortField === "nstpRepresentative" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("sponsor")}>Sponsor {sortField === "sponsor" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                <th onClick={() => handleSortChange("issued")}>Status {sortField === "issued" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</th>
                                {role == "receptionist" && (
                                    <th>Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-gray-500">No data to show for now.</td>
                                </tr>
                            ) : (
                                currentItems.map((gatePass) => (
                                    <tr key={gatePass.id}>
                                        <td>{gatePass.date}</td>
                                        {role != "tenant" && <td>{gatePass.tenantName}</td>}
                                        <td>{gatePass.guestName}</td>
                                        <td>{gatePass.guestCNIC}</td>
                                        <td>{gatePass.guestContact}</td>
                                        <td>{gatePass.gateNumber}</td>
                                        <td>{!gatePass.nstpRepresentative || gatePass.nstpRepresentative === "" ? "-" : gatePass.nstpRepresentative}</td>
                                        <td>{gatePass.sponsor}</td>
                                        <td>
                                            <div className={`badge p-3 ${gatePass.issued ? "badge-success text-lime-100" : "badge-accent text-white"} text-sm`}> 
                                                {gatePass.issued ? 
                                                    <CheckIcon className="size-4 mr-2" /> 
                                                    : 
                                                    <ClockIcon className="size-4 mr-2" />
                                                } 
                                                {gatePass.issued ? "Issued" : "Pending"}
                                            </div>
                                        </td>
                                        {role === "receptionist" && (
                                            <td>
                                                {role === "receptionist" && !gatePass.issued && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className="btn btn-success btn-outline btn-sm"
                                                            onClick={() => {
                                                                console.log("click")
                                                                setSelectedGatePass({id: gatePass.id, action: "approve"});
                                                                document.getElementById('approve_gate_pass_modal').showModal();
                                                            }}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-error btn-outline btn-sm"
                                                            onClick={() => {
                                                                setSelectedGatePass({id: gatePass.id, action: "reject"});
                                                                document.getElementById('approve_gate_pass_modal').showModal();
                                                            }}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center mt-4">
                        <button
                            className="btn btn-outline"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="btn btn-outline"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
};

export default GatePasses;