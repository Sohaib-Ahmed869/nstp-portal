import React, { useState , useEffect, useRef } from 'react'
import FloatingLabelInput from './FloatingLabelInput';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
|--------------------------------------------------
| How to Open this modal on btn click
<button
    className="btn btn-primary"
    document.getElementById('complaint_modal').showModal();
    }}
>
    View Profile
</button>

|--------------------------------------------------
*/


const ComplaintModal = () => {
  const [modalLoading, setModalLoading] = useState(false);
  const [complaintType, setComplaintType] = useState(null); //general or service
  const [complaintDesc, setComplaintDesc] = useState(null); //user provided desc
  const [complaintSubject, setComplaintSubject] = useState(null); //user provided subject
  const [complaintUrgency, setComplaintUrgency] = useState(null); //user provided urgency
  const [complaintServiceType, setComplaintServiceType] = useState(null); //the selected type out of various admin defined types of a service
  const [tabActive, setTabActive] = useState("General");
  const [error, setError]= useState("");
  const modalBoxRef = useRef(null);

  //overall set of all possible service types along with desc
  //Empty this array initialization once api call is added
  const [serviceTypes, setServiceTypes] = useState([
      { id: "133", type: "Electricity service", description: "This service covers all electrical issues and maintenance." },
      {  id: "153", type: "Water service", description: "This service handles water supply and plumbing issues." },
      {  id: "163", type: "Gas service", description: "This service deals with gas supply and related issues." },
      {  id: "173", type: "Internet and WiFi service", description: "This service manages internet connectivity and WiFi issues." },
      {  id: "183", type: "Cleaning service", description: "This service provides various types of cleaning services." },
  ]); //all the service types

  useEffect(() => {
      if (modalBoxRef.current) {
          modalBoxRef.current.style.height = "auto";
      }
  }, [tabActive, complaintDesc, complaintSubject]);

  useEffect(() => {
    //api call to fetch servicetypes
    //setServiceTypes(response.data)
  }, []);

  const getServiceDesc = (serviceType) => {
      const service = serviceTypes.find(service => service.type === serviceType);
      return service ? service.description : "";
  };

  const resetFields = () => {
      setComplaintType(null);
      setComplaintDesc(null);
      setComplaintSubject(null);
      setComplaintUrgency(null);
      setComplaintServiceType(null);
  };

  const submitComplaint = (tabActive) => {
    if (!tabActive) {
        alert("Complaint type cannot be null, please click on the right tab"); //this can never happen but just in case
        return;
    }

    if (tabActive === "General") {
        if (!complaintSubject || !complaintDesc) {
            setError("Subject and Description are required for General complaints.");
            return;
        }
    } else if (tabActive === "Services") {
        if (!complaintUrgency || !complaintServiceType) {
            setError("Urgency and Service Type are required for Service complaints.");
            return;
        }
    }

    const complaint = {
        type: tabActive,
        subject: complaintSubject,
        desc: complaintDesc,
        urgency: complaintUrgency,
        serviceTypeId: complaintServiceType ? serviceTypes.find(service => service.type === complaintServiceType).id : null,
    };
    console.log(complaint);
    //simulate loading
    setModalLoading(true);
    setTimeout(() => {
        setModalLoading(false);
        resetFields();
        document.getElementById("complaint_modal").close();
    }, 2000);
};

  return (
      <dialog id="complaint_modal" className="modal transition-height duration-300 ease-in-out">
          <div ref={modalBoxRef} className="modal-box w-3xl max-w-3xl transition-height duration-300 ease-in-out">
              <h3 className="font-bold text-2xl">Submit a complaint</h3>

              <div role="tablist" className="mt-3 tabs tabs-lifted">
                  <a role="tab" className={`tab ${tabActive === "General" && "tab-active font-bold text-primary"}`} onClick={() => {setTabActive("General"); resetFields(); setError("")}}>General</a>
                  <a role="tab" className={`tab ${tabActive === "Services" && "tab-active font-bold text-primary"}`} onClick={() => {setTabActive("Services"); resetFields(); setError("")}}>Services</a>
              </div>
              <div className="border border-r-slate-300 border-b-slate-300 border-l-slate-300 rounded-b-lg border-t-0 p-5">
                  {tabActive === "General" ? 
                      <div>
                          <h1 className="text-lg font-bold mb-5">General Complaint</h1>
                          <FloatingLabelInput label="Subject" value={complaintSubject || ""} onChange={(e) => setComplaintSubject(e.target.value)} />
                          <FloatingLabelInput label="Description" value={complaintDesc || ""} onChange={(e) => setComplaintDesc(e.target.value)} type="textarea" />
                      </div> 
                      : 
                      <div>
                         <h1 className="text-lg font-bold mb-5">Request for Services</h1>
                          {/* Select service type from a dropdown */}
                          <select className="mb-5 select select-bordered w-full" onChange={(e) => {setComplaintServiceType(e.target.value) }}>
                              <option value="">Select Service Type</option>
                              {serviceTypes.map((service, index) => <option key={index} value={service.type}>{service.type}</option>)}
                          </select>

                          {complaintServiceType && <div className="mb-5 bg-info bg-opacity-30 rounded-md p-4">
                              <div className="flex flex-row gap-2 mb-2 items-center">
                                  <InformationCircleIcon className="h-6 w-6" />
                                  <h1 className="text-lg font-bold">{complaintServiceType}</h1>
                              </div>
                              <p className="text-sm">{getServiceDesc(complaintServiceType)}</p>
                          </div>}
                          
                          <FloatingLabelInput label="Describe your issue... (optional)" value={complaintDesc || ""} onChange={(e) => setComplaintDesc(e.target.value)} type="textarea" required={false} />
                          
                          {/** radio buttons for urgnecy (low/medium/high) with a line in between for a slider look */}
                          <div className="mb-5">
                    <h1 className="text-lg font-bold mb-2">Urgency</h1>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="urgency" className="radio radio-primary" value="1" checked={complaintUrgency === 1} onChange={() => setComplaintUrgency(1)} />
                            <span>Low</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="urgency" className="radio radio-primary" value="2" checked={complaintUrgency === 2} onChange={() => setComplaintUrgency(2)} />
                            <span>Medium</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="urgency" className="radio radio-error" value="3" checked={complaintUrgency === 3} onChange={() => setComplaintUrgency(3)} />
                            <span>High</span>
                        </label>
                    </div>
                </div>


                      </div>
                  }
              </div>
              
              {error && <div className="bg-red-200 text-red-800  px-4 py-2 my-2  flex items-center justify-between rounded-md  ">
                <span>{error}</span>
                <button className="btn btn-sm btn-ghost " onClick={() => setError("")}>
                  <XMarkIcon className="h-4 w-4" />
                </button>
                </div>}

                <div className="modal-action">
                    <button className={`btn mr-2 ${modalLoading && "btn-disabled"}`} onClick={() => { resetFields(); setError(""); document.getElementById("complaint_modal").close()}}>Cancel</button>
                    <button className={`btn btn-primary ${modalLoading && "btn-disabled"}`} onClick={() => submitComplaint(tabActive)}> {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Submit"} </button>

                </div>
            </div>
        </dialog>
    );
};

export default ComplaintModal;