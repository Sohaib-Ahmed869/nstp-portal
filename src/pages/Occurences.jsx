import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import NSTPLoader from '../components/NSTPLoader';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { MagnifyingGlassIcon, PlusCircleIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { ReceptionistService, TenantService } from '../services';
import showToast from '../util/toast';

const Occurences = ({ role }) => {
    const [loading, setLoading] = useState(true);
    const [occurences, setOccurences] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [formData, setFormData] = useState({ company: '', title: '', desc: '' });
    const [errors, setErrors] = useState({});
    const [companyList, setCompanyList] = useState(['TechCorp', 'HealthPlus', 'EduLearn', 'FinServe', 'RetailMart']);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        // Simulate API call to initially fetch data
        async function fetchData() {
            try {
                if(role === 'receptionist') {
                    const response = await ReceptionistService.getOccurences();
                    if (response.error) {
                        console.log(response.error);
                        return;
                    }
                    console.log(response.data.tenants);
                    const companies = response.data.tenants.map((tenant) => {
                        return { id: tenant._id, name: tenant.name };
                    });
                    setCompanyList(companies);
                    

                    // extract occurences from response
                    
                } else if (role === 'tenant') {
                    
                    const response = await TenantService.getOccurences();
                    if (response.error) {
                        console.log(response.error);
                        return;
                    }
                    console.log(response.data.complaints);

                    // set occurences

                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchData();
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSortOrderChange = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const loadMoreItems = () => {
        setLoadingMore(true);
        // Simulate API call to load more items
        setTimeout(() => {
            console.log('Loading more items...');
            setPage((prevPage) => prevPage + 1);
            setLoadingMore(false);
        }, 2000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalLoading(true);

        // Validate form data
        const newErrors = {};
        if (!formData.company) newErrors.company = 'Company is required';
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.desc) newErrors.desc = 'Description is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setModalLoading(false);
            return;
        }

        console.log(formData);

        setErrors({});

        // API call to add new item
        try{ 
            // fix companyId
            let companyId = "66f7b251d42fec9018e6046b";
            const response = await ReceptionistService.addOccurence(companyId, formData.title, formData.desc);
            console.log("🚀 ~ handleSubmit ~ response:", response)
            
            if (response.error) {
                console.log(response.error);
                return;
            }
            
            console.log(response.data.complaint);
            const newOccurrence = response.data.complaint;
            // setOccurences([newOccurrence, ...occurences]);
            showToast(true, 'Occurrence registered successfully.');
        } catch (error) {
            console.log(error);
            showToast(false, 'An error occurred. Please try again later.');
        } finally {
            setFormData({ company: '', title: '', desc: '' });
            setModalLoading(false);
            document.getElementById('add-new-occurence').close();
        }

        // setTimeout(() => {
        //     // Reset form and close modal
        //     setFormData({ company: '', title: '', desc: '' });
        //     setModalLoading(false);
        //     setOccurences([newOccurrence, ...occurences]);
        //     document.getElementById('add-new-occurence').close();
        // }, 2000);
    };

    const filteredItems = occurences
        .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => (sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)))
        .slice(0, page * 10);
    return (
        <Sidebar>
            {loading && <NSTPLoader />}

            {/** form to add new item (recp only) */}
            <dialog id="add-new-occurence" className="modal">
                <div className="modal-box min-w-3xl max-w-3xl">
                    <h3 className="font-bold text-lg mb-3">Register New Occurrence</h3>

                    <form onSubmit={handleSubmit}>
                        <div className="form-control mb-4">
                            <label htmlFor="company" className="label">Company</label>
                            <select
                                name="company"
                                id="company"
                                className="select select-bordered"
                                value={formData.company}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select a company</option>
                                {companyList.map((company) => (
                                    <option key={company.id} value={company.id}>{company.name}</option>
                                ))}
                            </select>
                            {errors.company && <span className="text-red-500">{errors.company}</span>}
                        </div>

                        <FloatingLabelInput
                            name="title"
                            type="text"
                            id="title"
                            label="Title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required={true}
                        />
                        {errors.title && <span className="text-red-500 col-span-2">{errors.title}</span>}

                        <FloatingLabelInput
                            name="desc"
                            type="textarea"
                            id="desc"
                            label="Description"
                            value={formData.desc}
                            onChange={handleInputChange}
                            required={true}
                        />
                        {errors.desc && <span className="text-red-500 col-span-2">{errors.desc}</span>}
                    </form>

                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('item_form').close()}>Cancel</button>
                        <button
                            className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}
                            onClick={handleSubmit}
                        >
                            {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Submit"}
                        </button>
                    </div>
                </div>
            </dialog>

            {/* Main Page Content */}
            <div className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && "hidden"}`}>
                {/* Header + add new  btn */}
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-bold">Occurences Against Company</h1>
                    {role == "receptionist" && <button
                        className="btn btn-primary text-white"
                        onClick={() => {
                            document.getElementById("add-new-occurence").showModal();
                        }}
                    >
                        <PlusCircleIcon className="size-6" />
                        Register New Occurence
                    </button>}
                </div>
                <hr className="my-5 text-gray-200" />

                <div className="flex md:flex-row flex-col justify-between">
                    <div className="relative w-full md:max-w-xs mb-5">
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
                        onClick={handleSortOrderChange}
                    >
                        <ArrowsUpDownIcon className="h-5 w-5" />
                        Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                    </button>

                </div >


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {Array.from({ length: 4 }).map((_, colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-6">
                            {filteredItems
                                .filter((_, itemIndex) => itemIndex % 4 === colIndex)
                                .map((item) => (
                                    <div key={item.id} className="card bg-base-100 shadow-xl p-4">
                                        {role === 'receptionist' && item.company && <h2 className="card-title text-lg text-primary">{item.company}</h2>}
                                        <h2 className="card-title dark:text-primary text-secondary my-2 ">{item.title}</h2>
                                        <p>{item.desc}</p>
                                        <p className="text-sm text-gray-500">{item.date}</p>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>

                {filteredItems.length < occurences.length && (
                    <div className="flex justify-center mt-6">
                        <button className={`btn btn-primary text-base-100 ${loadingMore && 'btn-disabled'}`} onClick={loadMoreItems}>
                            {loadingMore && <span className="loading loading-spinner"></span>}
                            {loadingMore ? 'Loading...' : 'Load More'}
                        </button>
                    </div>
                )}



            </div>

        </Sidebar>
    )
}

export default Occurences
