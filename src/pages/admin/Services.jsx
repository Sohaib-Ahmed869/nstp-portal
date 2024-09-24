import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import { WrenchIcon, PlusCircleIcon, WrenchScrewdriverIcon, WifiIcon, BoltIcon, LockClosedIcon, PencilIcon, ChevronRightIcon, ClipboardDocumentCheckIcon, LifebuoyIcon, LightBulbIcon, BriefcaseIcon, TrashIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

const Services = () => {
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState([]);
    const [expandedServiceId, setExpandedServiceId] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentServiceId, setCurrentServiceId] = useState(null);


    // State for form fields
    const [newService, setNewService] = useState({
        name: '',
        description: '',
        icon: WrenchIcon,
    });

    // Function to handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewService((prevService) => ({
            ...prevService,
            [name]: value,
        }));
    };

    // Function to handle icon selection
    const handleIconChange = (icon) => {
        setNewService((prevService) => ({
            ...prevService,
            icon,
        }));
    };


    // Function to handle form submission for editing a service
    const saveEditedService = () => {
        setModalLoading(true);
        setTimeout(() => {
            setServices((prevServices) =>
                prevServices.map((service) =>
                    service.id === currentServiceId
                        ? { ...service, ...newService }
                        : service
                )
            );

            setModalLoading(false);
            document.getElementById('add_service_form').close();
            resetForm();
        }, 2000);
    };

    // Function to handle form submission for adding a new service
    const handleSubmit = () => {
        setModalLoading(true);
        setTimeout(() => {
            console.log(newService);
            // Append to the services array
            setServices((prevServices) => [
                ...prevServices,
                {
                    id: (prevServices.length + 1).toString(),
                    name: newService.name,
                    description: newService.description,
                    icon: newService.icon,
                },
            ]);

            setModalLoading(false);
            document.getElementById('add_service_form').close();
            resetForm();
        }, 2000);
    };


    // Function to handle form cancellation
    const handleCancel = () => {
        resetForm();
        document.getElementById('add_service_form').close();
    };

    // Function to reset form fields
    const resetForm = () => {
        setNewService({
            name: '',
            description: '',
            icon: WrenchIcon,
        });
        setIsEditMode(false);
        setCurrentServiceId(null);
    };


    useEffect(() => {
        // Api call here to fetch data and populate the above states
        // Dummy data for services
        setServices([
            { id: "1", name: "Plumbing", description: "Fixing of pipes and water systems, leakages, and spillages. Services related to public facilities not included.", icon: WrenchIcon },
            { id: "2", name: "Electrical", description: "Fixing of electrical system issues, power outages, and other electrical-related problems.", icon: BoltIcon },
            { id: "3", name: "Cleaning", description: "Cleaning of common areas, especially the lobby, hallways, and restrooms.", icon: WrenchScrewdriverIcon },
            { id: "4", name: "Security", description: "Security services, monitoring, and access control.", icon: LockClosedIcon },
            { id: "5", name: "Internet and WiFi", description: "Installation and maintenance of internet and WiFi services, as well as troubleshooting.", icon: WifiIcon },
        ]);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    // Function to handle edit button click
    const handleEdit = (serviceId) => {
        const serviceToEdit = services.find(service => service.id === serviceId);
        setNewService({
            name: serviceToEdit.name,
            description: serviceToEdit.description,
            icon: serviceToEdit.icon,
        });
        setIsEditMode(true);
        setCurrentServiceId(serviceId);
        document.getElementById('add_service_form').showModal();
    };

    const handleDelete = (serviceId) => {
        setModalLoading(true);
        setTimeout(() => {
            setServices((prevServices) => prevServices.filter(service => service.id !== serviceId));
            setModalLoading(false);
            document.getElementById('delete_service_modal').close()
        }, 2000);
        
        console.log(`Delete service with id: ${serviceId}`);
    };

    const toggleExpand = (serviceId) => {
        setExpandedServiceId(expandedServiceId === serviceId ? null : serviceId);
    };

    return (
        <Sidebar>
            {loading && <NSTPLoader />}


            {/* Add/Edit Service Modal */}
            <dialog id="add_service_form" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{isEditMode ? 'Edit Service' : 'Add New Service'}</h3>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Service Name</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={newService.name}
                            onChange={handleInputChange}
                            className="input input-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea
                            name="description"
                            value={newService.description}
                            onChange={handleInputChange}
                            className="textarea textarea-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Icon</span>
                        </label>
                        <div className="flex gap-2">
                            {[WrenchIcon, WrenchScrewdriverIcon, BoltIcon, LockClosedIcon, WifiIcon, BriefcaseIcon, DocumentCheckIcon].map((Icon, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`btn ${newService.icon === Icon ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => handleIconChange(Icon)}
                                >
                                    <Icon className="size-6" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="modal-action">
                        <button className="btn" onClick={handleCancel}>Cancel</button>
                        <button
                            className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}
                            onClick={isEditMode ? saveEditedService : handleSubmit}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Submit"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/** confirmation modal for deletion of service */}
            <dialog id="delete_service_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Delete Service</h3>
                    <p>Are you sure you want to delete this service?</p>
                    <div className="alert-warning">This action may result in unexpected consequences or behaviour.</div>
                    <div className="modal-action">
                        <button className="btn btn-outline" onClick={() => document.getElementById('delete_service_modal').close()}>Cancel</button>
                        <button className={`btn btn-primary ${modalLoading && "btn-disabled"}`} onClick={() => { handleDelete(currentServiceId);  }}>
                            {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Submit"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Main Page Content */}
            <div className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && "hidden"}`}>
                {/* Header + add new emp btn */}
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-bold">Services</h1>
                    <button
                        className="btn btn-primary text-white"
                        onClick={() => {
                            setIsEditMode(false);
                            document.getElementById("add_service_form").showModal();
                        }}
                    >
                        <PlusCircleIcon className="size-6" />
                        Add New Service
                    </button>
                </div>
                <hr className="my-5 text-gray-200" />

                <div className="flex flex-col gap-5">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`relative card p-5 rounded-lg transition-all duration-300 ${expandedServiceId === service.id ? 'transform scale-95' : ''}`}
                        >
                            <div className="absolute top-0 p-3 rounded-tr-md rounded-br-md right-0 h-full bg-primary flex items-center justify-center cursor-pointer" onClick={() => toggleExpand(service.id)}>
                                <ChevronRightIcon className={`size-6 text-base-100 transition-transform duration-300 ${expandedServiceId === service.id ? 'rotate-180' : ''}`} />
                            </div>
                            <div className='flex items-center gap-3 mb-3'>
                                <div className="rounded-full bg-secondary p-2">
                                    <service.icon className='size-6 text-base-100' />
                                </div>
                                <h1 className='text-xl font-semibold'>{service.name}</h1>
                            </div>
                            <p className='text-gray-500'>{service.description}</p>
                            {expandedServiceId === service.id && (
                                <div className="flex gap-2 mt-3">
                                    <button
                                        className='btn btn-outline btn-primary text-white'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(service.id);
                                        }}
                                    >
                                        <PencilIcon className='size-5' />
                                        Edit
                                    </button>
                                    <button
                                        className='btn btn-outline btn-error'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            document.getElementById('delete_service_modal').showModal();
                                            setCurrentServiceId(service.id);
                                        }}
                                    >
                                        <TrashIcon className='size-5' />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Sidebar>
    );
};

export default Services;