import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import NSTPLoader from '../components/NSTPLoader';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { MagnifyingGlassIcon, PlusCircleIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

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
        setTimeout(() => {
            setOccurences([
                { id: 1, company: 'TechCorp', title: 'Network Issue', desc: 'Internet connectivity is unstable and frequently drops.', date: '2023-10-01' },
                { id: 2, company: 'HealthPlus', title: 'Billing Error', desc: 'Incorrect charges on the latest invoice.', date: '2023-09-25' },
                { id: 3, company: 'EduLearn', title: 'Course Material Missing', desc: 'Some course materials are missing from the online portal.', date: '2023-09-20' },
                { id: 4, company: 'FinServe', title: 'Account Access Problem', desc: 'Unable to access account through the mobile appUnable to access account through the mobile aUnable to access account through the mobile appUnable to access account through the mobile appUnable to access account through the mobile appUnable to access account through the mobile appUnable to access account through the mobile appUnable to access account through the mobile appUnable to access account through the mobile appUnable to access account through the mobile appUnable to access account through the mobile appppUnable to access account through the mobile app.', date: '2023-09-15' },
                { id: 5, company: 'RetailMart', title: 'Product Not Delivered', desc: 'Ordered product has not been delivered even after the expected delivery date.', date: '2023-09-10' },
                { id: 6, company: 'AutoFix', title: 'Service Delay', desc: 'Car service is delayed by more than a week.', date: '2023-09-05' },
                { id: 7, company: 'HomeSecure', title: 'Alarm Malfunction', desc: 'Home alarm system is malfunctioning and triggers false alarms.', date: '2023-09-01' },
                { id: 8, company: 'Foodies', title: 'Spoiled Food', desc: 'Received spoiled food in the latest delivery.', date: '2023-08-25' },
                { id: 9, company: 'TravelEase', title: 'Flight Cancellation', desc: 'Flight was canceled without prior notice.', date: '2023-08-20' },
                { id: 10, company: 'MediCare', title: 'Appointment Issue', desc: 'Unable to book an appointment with the specialist.', date: '2023-08-15' },
                { id: 11, company: 'GreenEnergy', title: 'High Electricity Bill', desc: 'Received an unusually high electricity bill this month.', date: '2023-08-10' },
                { id: 12, company: 'PetCare', title: 'Vet Unavailable', desc: 'Veterinarian was unavailable during the scheduled appointment.', date: '2023-08-05' },
                { id: 13, company: 'BookWorld', title: 'Damaged Book', desc: 'Received a damaged book in the latest order.', date: '2023-08-01' },
                { id: 14, company: 'FitLife', title: 'Gym Equipment Broken', desc: 'Some gym equipment is broken and not being repaired.', date: '2023-07-25' },
                { id: 15, company: 'CleanSweep', title: 'Incomplete Cleaning', desc: 'House cleaning service was incomplete and unsatisfactory.', date: '2023-07-20' },
            ]);
            setCompanyList(['TechCorp', 'HealthPlus', 'EduLearn', 'FinServe', 'RetailMart', 'AutoFix', 'HomeSecure', 'Foodies', 'TravelEase', 'MediCare', 'GreenEnergy', 'PetCare', 'BookWorld', 'FitLife', 'CleanSweep']);
            setLoading(false);
        }, 2000);
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
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
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
    
        const newOccurrence = {
            ...formData,
            date: new Date().toISOString(),
        };
    
        console.log(newOccurrence);
    
        
        setErrors({});
        setTimeout(() => {
            // Reset form and close modal
        setFormData({ company: '', title: '', desc: '' });
            setModalLoading(false);
            setOccurences([newOccurrence, ...occurences]);
            document.getElementById('add-new-occurence').close();
        }, 2000);
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
                        <option key={company} value={company}>{company}</option>
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
                    <h1 className="text-2xl font-bold">Meeting Rooms</h1>
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
            {role === 'receptionist' && item.company &&  <h2 className="card-title text-lg text-primary">{item.company}</h2>}
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
