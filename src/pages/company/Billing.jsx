import React, { useState, useEffect, useContext } from 'react'
import Sidebar from '../../components/Sidebar'
import NSTPLoader from '../../components/NSTPLoader';
import { ChevronDownIcon, CalendarIcon, CheckCircleIcon, ClockIcon, PrinterIcon, CursorArrowRippleIcon } from '@heroicons/react/24/outline';

const Billing = () => {
    const [loading, setLoading] = useState(false);
    const [openCategories, setOpenCategories] = useState({});

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Set the first bill as default selected
            setSelectedBill(billingHistory[0]);
        }, 10);
    }, []);
    const [selectedBill, setSelectedBill] = useState(null);

    const [billingHistory, setBillingHistory] = useState([
        {
            id: 1,
            date: '2023-06-01',
            name: 'Monthly Bill (June)',
            paidDate: '2023-06-05',
            status: 'Paid',
            amount: 10000,
            breakDown: [
                {
                    category: 'Rent',
                    subCategory: [
                        { name: 'Standard Rent', amount: 5000 },
                        { name: 'Extras', amount: 500 },
                    ],
                },
                { category: 'Security Deposit', amount: 2000 },
                {
                    category: 'Meeting Room Bookings',
                    subCategory: [
                        { name: 'Conference Room, 24-06-2023', amount: 400 },
                        { name: 'Auditorium, 23-06-2023', amount: 4000 },
                    ],
                },
                {
                    category: 'Parking', subCategory: [
                        { name: 'Parking Space 1', amount: 400 },
                        { name: 'Parking Space 2', amount: 200 },
                    ]
                },
                {
                    category: 'Services',
                    subCategory: [
                        { name: 'Cleaning', amount: 200 },
                        { name: 'WiFi Service', amount: 200 },
                    ],
                },
            ],
        },
        {
            id: 2,
            date: '2023-07-01',
            name: 'Monthly Bill (July)',
            paidDate: '2023-07-04',
            status: 'Paid',
            amount: 10500,
            breakDown: [
                {
                    category: 'Rent',
                    subCategory: [
                        { name: 'Standard Rent', amount: 5000 },
                        { name: 'Extras', amount: 500 },
                    ],
                },
                {
                    category: 'Meeting Room Bookings',
                    subCategory: [
                        { name: 'Seminar Hall, 15-07-2023', amount: 800 },
                    ],
                },
                {
                    category: 'Services',
                    subCategory: [
                        { name: 'Cleaning', amount: 200 },
                        { name: 'Security', amount: 500 },
                        { name: 'WiFi Service', amount: 200 },
                    ],
                },
            ],
        },
        {
            id: 3,
            date: '2023-08-01',
            name: 'Monthly Bill (August)',
            paidDate: '-', // Not paid yet
            status: 'Pending',
            amount: 9800,
            breakDown: [
                {
                    category: 'Rent',
                    subCategory: [
                        { name: 'Standard Rent', amount: 5000 },
                    ],
                },
                {
                    category: 'Meeting Room Bookings',
                    subCategory: [
                        { name: 'Conference Room, 05-08-2023', amount: 500 },
                    ],
                },
                { category: 'Services', amount: 300 }, // No subCategory here
                {
                    category: 'Parking', subCategory: [
                        { name: 'Parking Space 1', amount: 400 },
                        { name: 'Parking Space 2', amount: 200 },
                    ]
                },
                {
                    category: 'Rebate',
                    subCategory: [
                        { name: 'Early Payment Discount', amount: -500 },
                    ],
                },
            ],
        },
        {
            id: 4,
            date: '2023-09-01',
            name: 'Monthly Bill (September)',
            paidDate: '2023-09-05',
            status: 'Paid',
            amount: 11000,
            breakDown: [
                {
                    category: 'Rent',
                    subCategory: [
                        { name: 'Standard Rent', amount: 5200 },
                        { name: 'Extra Office Space', amount: 800 },
                    ],
                },
                { category: 'Security Deposit', amount: 2000 },
                {
                    category: 'Services',
                    subCategory: [
                        { name: 'Cleaning', amount: 200 },
                        { name: 'Cafeteria', amount: 500 },
                        { name: 'WiFi Service', amount: 300 },
                    ],
                },
                {
                    category: 'Maintenance',
                    amount: 1000, // No subCategory
                },
                {
                    category: 'Parking', subCategory: [
                        { name: 'Parking Space 1', amount: 400 },
                        { name: 'Parking Space 2', amount: 200 },
                    ]
                },
                {
                    category: 'Rebate', amount: -500
                },


            ],
        },
        {
            id: 5,
            date: '2023-09-01',
            name: 'Monthly Bill (July)',
            paidDate: '2023-09-05',
            status: 'Paid',
            amount: 11000,
            breakDown: [
                {
                    category: 'Rent',
                    subCategory: [
                        { name: 'Standard Rent', amount: 5200 },
                        { name: 'Extra Office Space', amount: 800 },
                    ],
                },
                { category: 'Security Deposit', amount: 2000 },
                {
                    category: 'Services',
                    subCategory: [
                        { name: 'Cleaning', amount: 200 },
                        { name: 'Cafeteria', amount: 500 },
                        { name: 'WiFi Service', amount: 300 },
                    ],
                },
                {
                    category: 'Maintenance',
                    amount: 1000, // No subCategory
                },
                {
                    category: 'Parking', subCategory: [
                        { name: 'Parking Space 1', amount: 400 },
                        { name: 'Parking Space 2', amount: 200 },
                    ]
                },
                {
                    category: 'Rebate', amount: -500
                },


            ],
        },
    ]);

    const calculateCategoryTotal = (category) => {
        if (category.amount !== undefined) return category.amount;
        return category.subCategory?.reduce((sum, item) => sum + item.amount, 0) || 0;
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR'
        }).format(amount);
    };

    const getStatusColor = (status) => {
        return status === 'Paid' ? 'text-success' : 'text-warning';
    };

    return (
        <Sidebar>
            {loading && <NSTPLoader />}
            <div className={`bg-base-100 mt-5 md:px-10 md:py-6 lg:mt-10 ring-1 ring-gray-200 rounded-lg ${loading && "hidden"}`}>
                <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Billing History</h1>
                        <button className="btn btn-primary text-base-100 flex gap-3 items-center">
                            <ChevronDownIcon className="h-5 w-5" />
                            Actions
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row min-h-[600px]">
                    {/* Bill Selection Sidebar */}
                    <div className="w-full md:w-80 border-r border-gray-200 max-h-full overflow-y-auto">
                        <div className="p-4">
                            {billingHistory.map((bill) => (
                                <div
                                    key={bill.id}
                                    onClick={() => setSelectedBill(bill)}
                                    className={`p-4 rounded-lg mb-3 cursor-pointer transition-all ${selectedBill?.id === bill.id ? selectedBill.status == "Paid" ? 'bg-primary/10 ring-1 ring-primary hover:bg-primary/20' : 'bg-error/10 hover:bg-error/20 ring-1 ring-error' : 'bg-base-100 ring-1 ring-base-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium">{bill.name}</h3>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <CalendarIcon className="h-4 w-4 mr-1" />
                                                {bill.date}
                                            </div>
                                        </div>
                                        <div className={`flex items-center ${getStatusColor(bill.status)}`}>
                                            {bill.status === 'Paid' ?
                                                <CheckCircleIcon className="h-5 w-5" /> :
                                                <ClockIcon className="h-5 w-5" />
                                            }
                                        </div>
                                    </div>
                                    <div className="mt-2 font-semibold">
                                        {formatAmount(bill.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bill Details Section with Fixed Collapse */}
                    <div className="flex-1 p-6 lg:p-10 lg:px-14">
                        {selectedBill && (
                            <div>
                                <div className="mb-6">
                                    <div className="flex justify-between">
                                        {/** Title of bill,status and paid date if applicable */}
                                        <div>
                                            <h2 className="text-2xl font-semibold mb-2">{selectedBill.name}</h2>
                                            <div className="flex items-center gap-4">
                                                <span className={`badge  text-base-100 p-3 flex gap-2 ${selectedBill.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                                                    {selectedBill.status == "Paid" ? <CheckCircleIcon className="size-4" /> : <ClockIcon className="size-4" />}
                                                    {selectedBill.status}
                                                </span>
                                                {selectedBill.paidDate !== '-' && (
                                                    <span className="text-sm text-gray-500">
                                                        Paid on {selectedBill.paidDate}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Action buttons for the bill */}
                                        <div className="flex gap-2">

                                            <button className="btn btn-outline btn-primary">
                                                <PrinterIcon className="h-5 w-5" />
                                                Print Bill
                                            </button>
                                            {
                                                selectedBill.status === 'Pending' && (
                                                    <button className="btn btn-primary text-base-100">
                                                        <CursorArrowRippleIcon className="h-5 w-5 animate-ping animate-infinite animate-duration-1000 animate-delay-0 animate-ease-in animate-alternate-reverse animate-fill-forwards" />
                                                        Pay Now
                                                    </button>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {selectedBill.breakDown.map((category, idx) => (
                                        category.subCategory ? (
                                            // Category has subcategories - render a collapsible section
                                            <div key={idx} className="ring-secondary/50 ring-1 rounded mb-2 shadow-md">
                                                <div
                                                    className="cursor-pointer text-base border-b-2 rounded  border-b-light-secondary/50  font-medium flex justify-between items-center p-4"
                                                    onClick={() => {
                                                        setOpenCategories(prevState => ({
                                                            ...prevState,
                                                            [idx]: !prevState[idx]
                                                        }));
                                                    }}
                                                >
                                                    <span>{category.category}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-semibold">
                                                            {formatAmount(calculateCategoryTotal(category))}
                                                        </span>
                                                        <ChevronDownIcon
                                                            className={`h-5 w-5 transform transition-transform duration-300 ${openCategories[idx] ? 'rotate-180' : 'rotate-0'
                                                                }`}
                                                        />
                                                    </div>
                                                </div>
                                                {openCategories[idx] && (
                                                    <div className="">
                                                        <div className="space-y-2 pt-2 pl-4 pr-4 pb-4">
                                                            {category.subCategory.map((sub, subIdx) => (
                                                                <div key={subIdx} className="flex justify-between items-center p-2 rounded">
                                                                    <span>{sub.name}</span>
                                                                    <span>{formatAmount(sub.amount)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            // Category has no subcategories - render a simple div
                                            <div key={idx} className="bg-base-100 ring-1 ring-secondary/50 p-4 rounded flex justify-between items-center mb-2">
                                                <span className="text-base font-medium">{category.category}</span>
                                                <span className="font-semibold mr-7">
                                                    {formatAmount(calculateCategoryTotal(category))}
                                                </span>
                                            </div>
                                        )
                                    ))}
                                </div>

                                <div className="mt-6 p-4 bg-primary/20 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Total Amount</span>
                                        <span className="text-xl font-bold">
                                            {formatAmount(selectedBill.amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                </div>
            </div>
        </Sidebar>
    )
}

export default Billing
