import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import NSTPLoader from '../components/NSTPLoader';
import FloatingLabelInput from '../components/FloatingLabelInput';
import { PlusCircleIcon, MagnifyingGlassIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { CommonService, ReceptionistService } from '../services';
import { TowerContext } from '../context/TowerContext';

const LostAndFound = ({ role }) => {
    const [loading, setLoading] = useState(true);
    const [lostItems, setLostItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('1');
    const [page, setPage] = useState(1);

    const [loadingMore, setLoadingMore] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        image: ''
    });
    const [expandedCard, setExpandedCard] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [errors, setErrors] = useState({});

    const { tower } = useContext(TowerContext);

    useEffect(() => {
        // Simulate API call to fetch data

        async function fetchData() {
            try {
                const response = await CommonService.viewLostAndFound(tower.id);
                // console.log('Lost Items:', response);
                if (response.error) {
                    console.error('Error fetching lost items:', response.error);
                    return;
                }
                console.log('Lost Items:', response.data.lostAndFound);
                // setLostItems(response.data);
            } catch (error) {
                console.error('Error fetching lost items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();


        // setTimeout(() => {
            // setLostItems([
            //     { id: 1, title: 'Lost Wallet', desc: 'Black leather wallet, including an interesting engraving. ', dateAdded: '2023-10-01', photo: 'https://www.bates.edu/news/files/2019/12/191213-lost-and-found-084750.jpg' },
            //     { id: 2, title: 'Lost Keys', desc: 'strange-looking car keys without any buttons, khokla key, does this thing even work?', dateAdded: '2023-09-25', },
            //     { id: 3, title: 'Lost Watch', desc: 'Silver wristwatch', dateAdded: '2023-09-20' },
            //     { id: 4, title: 'Lost Phone', desc: 'Black iPhone 12, with a blue cover and some money included in it for free!', dateAdded: '2023-09-15', photo: 'https://www.repoapp.com/wp-content/uploads/2015/11/shms-lost-and-found.jpg' },
            //     { id: 5, title: 'Lost Glasses', desc: 'Black frame glasses', dateAdded: '2023-09-10' },
            //     { id: 6, title: 'Lost Ring', desc: 'Gold ring with diamond', dateAdded: '2023-09-05', photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDMStsQ_jFWL5e9Bl5_ajExux4sj49_yBITQ&s' },
            //     { id: 7, title: 'Lost Bag', desc: 'Brown leather bag', dateAdded: '2023-09-01' },
            //     { id: 8, title: 'Lost Earphones', desc: 'White wireless earphones', dateAdded: '2023-08-25', photo: 'https://www.bates.edu/news/files/2019/12/191213-lost-and-found-084750.jpg' },
            //     { id: 9, title: 'Lost Bracelet', desc: 'Silver bracelet with gems', dateAdded: '2023-08-20' },
            //     { id: 10, title: 'Lost Scarf', desc: 'Red woolen scarf seems hand knitted and quite worn out, surprisnly.', dateAdded: '2023-08-15' },
            //     { id: 11, title: 'Lost Umbrella', desc: 'Black foldable umbrella', dateAdded: '2023-08-10' },
            //     { id: 12, title: 'Lost Laptop', desc: 'HP Omen gaming looks exactly like the laptop belonging to CTO Hexler Tech.', dateAdded: '2023-08-05' },
            //     { id: 13, title: 'Lost Book', desc: 'The Alchemist by Paulo Coelho', dateAdded: '2023-08-01', photo: 'https://www.repoapp.com/wp-content/uploads/2015/11/shms-lost-and-found.jpg' },
            //     { id: 14, title: 'Lost Shoes', desc: 'Nike Air Max', dateAdded: '2023-07-25' },
            //     { id: 15, title: 'Lost Jacket', desc: 'Blue denim jacket with several large patches and holes, bhai kisi ghareb ko de do', dateAdded: '2023-07-20' },
            //     { id: 16, title: 'Lost Cap', desc: 'Black baseball cap', dateAdded: '2023-07-15', },
            //     { id: 17, title: 'Lost Gloves', desc: 'Leather gloves', dateAdded: '2023-07-10' },
            //     { id: 18, title: 'Lost bunch of keys', desc: 'Brown leather belt', dateAdded: '2023-07-05', photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDMStsQ_jFWL5e9Bl5_ajExux4sj49_yBITQ&s' },
            //     { id: 19, title: 'Lost Perfume', desc: 'Chanel No. 5', dateAdded: '2023-07-01' },
            //     { id: 20, title: 'Lost Necklace', desc: 'Gold chain with pendant', dateAdded: '2023-06-25' },
            // ]);
            // setLoading(false);
        // }, 2000);
    }, []);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    /** add new complaint related funcs */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.desc) newErrors.desc = 'Description is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setModalLoading(true);

        try{
            const response = await ReceptionistService.addLostAndFound(formData.title, formData.desc, formData.image);
            if (response.error) {
                console.error('Error adding lost item:', response.error);
                return;
            }
            console.log('Lost item added:', response.data);

            // setLostItems((prevItems) => [
            //     { id: prevItems.length + 1, title: formData.title, desc: formData.desc, dateAdded: new Date().toISOString().split('T')[0] },
            //     ...prevItems
            // ]);
            // setFormData({ title: '', desc: '', image: '' });

        } catch (error) {
            console.error('Error adding lost item:', error);
        } finally {
            setModalLoading(false);
            document.getElementById('item_form').close();
        }

        // Simulate API call
        // setTimeout(() => {
        //     console.log('Form Data:', formData);
        //     setLostItems((prevItems) => [
        //         { id: prevItems.length + 1, title: formData.title, desc: formData.desc, dateAdded: new Date().toISOString().split('T')[0] },
        //         ...prevItems
        //     ]);
        //     setFormData({ title: '', desc: '', image: '' });

        //     setModalLoading(false);
        //     document.getElementById('item_form').close();
        // }, 2000);
    };


    /** load more items related funcs */
    const loadMoreItems = () => {
        setLoadingMore(true);
        // Simulate API call to load more items
        setTimeout(() => {
            setLostItems((prevItems) => [
                ...prevItems,
                { id: prevItems.length + 1, title: 'Lost Item ' + (prevItems.length + 1), desc: 'Description of lost item ' + (prevItems.length + 1), dateAdded: '2023-10-02' },
                // Add more dummy items here
            ]);
            setLoadingMore(false);
            setPage((prevPage) => prevPage + 1);
        }, 2000);
    };

    const filteredItems = lostItems
        .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => (sortOrder === 'asc' ? new Date(a.dateAdded) - new Date(b.dateAdded) : new Date(b.dateAdded) - new Date(a.dateAdded)))
        .slice(0, page * 10);
    /** card click, delete or complete marking for receptionist */
    const handleCardClick = (itemId) => {
        setExpandedCard(expandedCard === itemId ? null : itemId);
    };

    const handleModalAction = (action, item) => {
        setModalAction(action);
        setSelectedItem(item);
        document.getElementById('confirmation-modal').showModal();
    };

    const confirmAction = () => {
        setModalLoading(true);
        setTimeout(() => {
            console.log(`${modalAction} action confirmed for item:`, selectedItem);
            setModalLoading(false);
            document.getElementById('confirmation-modal').close();
            setExpandedCard(null);
        }, 2000);
    };

    return (
        <Sidebar>
            {loading && <NSTPLoader />}

            {/** form to add new item (recp only) */}
            <dialog id="item_form" className="modal">
                <div className="modal-box min-w-3xl max-w-3xl">
                    <h3 className="font-bold text-lg mb-3">Register New Item</h3>

                    <form onSubmit={handleSubmit}>
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

                        <FloatingLabelInput
                            name="image"
                            type="text"
                            id="image"
                            label="Image URL (optional)"
                            value={formData.image}
                            onChange={handleInputChange}
                        />
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

            {/** confirmation modal for resolving/deleting a psot (recp only) */}
            <dialog id="confirmation-modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirm {modalAction === 'resolve' ? 'Resolution' : 'Deletion'}</h3>
                    <p className="py-4">Are you sure you want to {modalAction} this item?</p>
                    <div className="modal-action">
                        <button className="btn" onClick={() => document.getElementById('confirmation-modal').close()}>Cancel</button>
                        <button className={`btn btn-primary ${modalLoading && 'btn-disabled'}`} onClick={confirmAction}>
                            {modalLoading && <span className="loading loading-spinner"></span>}
                            {modalLoading ? 'Please wait...' : 'Yes'}
                        </button>
                    </div>
                </div>
            </dialog>

            {/** main content */}
            <div className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && 'hidden'}`}>
                {/* Header + add new item btn */}
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-bold">Lost and Found</h1>
                    {role == "receptionist" && (
                        <button className="btn btn-primary text-white" onClick={() => document.getElementById('item_form').showModal()}>
                            <PlusCircleIcon className="size-6" />
                            Register new item
                        </button>
                    )}
                </div>

                {/* Search + Filter */}
                <div className="flex max-md:flex-col lg:flex-row lg:items-center lg:justify-between mt-4">
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
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                        <ArrowsUpDownIcon className="h-5 w-5" />
                        Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                    </button>
                </div>

                {/* Lost Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {Array.from({ length: 4 }).map((_, colIndex) => (
                        <div key={colIndex} className="flex flex-col gap-6">
                            {filteredItems
                                .filter((_, itemIndex) => itemIndex % 4 === colIndex)
                                .map((item) => (
                                    <div key={item.id} className="card transition-all duration-300  cursor-pointer bg-base-100 shadow-xl" onClick={() => handleCardClick(item.id)}>
                                        {item.photo && (
                                            <figure>
                                                <img src={item.photo} alt={item.title} />
                                            </figure>
                                        )}
                                        <div className="card-body">
                                            <h2 className="card-title">{item.title}</h2>
                                            <p>{item.desc}</p>
                                            <p className="text-sm text-gray-500">{item.dateAdded}</p>
                                            {expandedCard === item.id && (
                                                <div className="mt-4 flex flex-wrap">
                                                    <button className="btn btn-sm btn-outline btn-success mr-2" onClick={() => handleModalAction('resolve', item)}>Mark as Resolved</button>
                                                    <button className="btn btn-sm btn-outline btn-error " onClick={() => handleModalAction('delete', item)}>Delete Posting</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                {filteredItems.length < lostItems.length && (
                    <div className="flex justify-center mt-6">
                        <button className={`btn btn-primary text-base-100 ${loadingMore && 'btn-disabled'}`} onClick={loadMoreItems}>
                            {loadingMore && <span className="loading loading-spinner"></span>}
                            {loadingMore ? 'Loading...' : 'Load More'}
                        </button>
                    </div>
                )}
            </div>
        </Sidebar>
    );
};

export default LostAndFound;