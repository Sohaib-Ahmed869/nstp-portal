import React, { useState, useEffect, useContext } from 'react'
import Sidebar from '../../components/Sidebar'
import NSTPLoader from '../../components/NSTPLoader';
import { ChevronDownIcon, CalendarIcon, CheckCircleIcon, ClockIcon, PrinterIcon, AdjustmentsHorizontalIcon, ArrowLeftIcon, MagnifyingGlassIcon, CursorArrowRippleIcon, ExclamationTriangleIcon, ArrowDownTrayIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { generatePDF, printPDF } from '../../util/bill-pdf';
import { calculateDaysDifference } from '../../util/date';
const PENALTY_RATE = 100; // Penalty rate per day for overdue bills

const Billing = () => {
    const [loading, setLoading] = useState(false);
    const [openCategories, setOpenCategories] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('All');
    const [selectedBill, setSelectedBill] = useState(null);
    const [billingHistory, setBillingHistory] = useState([
        {
            id: 1,
            date: '2023-06-01',
            dueDate: '2023-06-05',
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
            dueDate: '2024-12-12',
            name: 'Monthly Bill (July)',
            paidDate: '-',
            status: 'Pending',
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
            dueDate: '2023-08-05',
            name: 'Monthly Bill (August)',
            paidDate: '-', // Not paid yet
            status: 'Overdue',
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

    ]);

    // Handler functions
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterOption(e.target.value);
    };

    const filteredBills = billingHistory
        .filter((bill) => bill.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((bill) => {
            switch (filterOption) {
                case 'Under100000':
                    return bill.amount < 100000;
                case 'Over100000':
                    return bill.amount >= 100000;
                case 'Paid':
                    return bill.status === 'Paid';
                case 'Pending':
                    return bill.status === 'Pending';
                case 'Overdue':
                    return bill.status === 'Overdue';
                default:
                    return true;
            }
        })
        .sort((a, b) => {
            switch (filterOption) {
                case 'AmountLowHigh':
                    return a.amount - b.amount;
                case 'AmountHighLow':
                    return b.amount - a.amount;
                case 'DateOldNew':
                    return new Date(a.date) - new Date(b.date);
                case 'DateNewOld':
                    return new Date(b.date) - new Date(a.date);
                default:
                    return 0;
            }
        });

    useEffect(() => {
        if (selectedBill && !filteredBills.some(bill => bill.id === selectedBill.id)) {
            setSelectedBill(null);
        }
    }, [filteredBills, selectedBill]);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // Set the first bill as default selected
            setSelectedBill(billingHistory.length > 0 ? billingHistory[0] : null);
        }, 10);
    }, []);

    // Helper function to get payment information based on bill status
    const getPaymentInfo = (bill) => {
        const today = new Date();
        const dueDate = new Date(bill.dueDate);

        if (bill.status === 'Paid') {
            return (
                <span className="text-sm text-gray-500">
                    Paid on: {bill.paidDate}
                </span>
            );
        } else if (today.getTime() < dueDate.getTime()) {
            const daysRemaining = calculateDaysDifference(today, dueDate);
            return (
                <span className="text-sm text-gray-500">
                    Due in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                </span>
            );
        } else {
            const daysOverdue = calculateDaysDifference(dueDate, today);
            return (
                <span className="text-sm text-red-600 font-bold flex items-center justify-end">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    Overdue by {daysOverdue} day{daysOverdue !== 1 ? 's' : ''}
                </span>
            );
        }
    };

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
        return status === 'Paid' ? 'text-success' : status == "Pending" ? 'text-accent' : 'text-warning';
    };

    return (
        <Sidebar>
            {loading && <NSTPLoader />}
            {/* <button className="btn btn-secondary  mt-10 mb-3" onClick={() => window.history.back()}>
                        <ArrowLeftIcon className="h-5 w-5" />
                        Go back
                    </button> */}

            <div className={`bg-base-100 md:px-10 mt-5 lg:mt-10 md:py-6 ring-1 ring-gray-200 rounded-lg ${loading && "hidden"}`}>
                <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Your Billing History</h1>
                        <button className="btn btn-primary text-base-100 flex gap-3 items-center">
                            <ChevronDownIcon className="h-5 w-5" />
                            Actions
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row min-h-[600px]">
                    {/* Bill Selection Sidebar */}
                    <div className="w-full md:w-80 md:max-h-[50rem] max-h-96 p-4 md:p-0 border-b-4 md:border-b-0 scrollbar-hide overflow-y-auto border-r border-gray-200 ">
                        <div className="p-4">
                            {/* Search and Filter Inputs */}
                            <div className="flex flex-col gap-2 border-b pb-3 mb-5">
                                <div className="relative w-full md:max-w-xs mr-2">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="input input-bordered w-full pl-10"
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                                </div>
                                <div className="w-auto flex items-center justify-end">
                                    <AdjustmentsHorizontalIcon className="size-8 text-gray-400 mr-3" />
                                    <select
                                        value={filterOption}
                                        onChange={handleFilterChange}
                                        className="select select-bordered w-full md:max-w-xs"
                                    >
                                        <option value="All">All</option>
                                        <option value="AmountLowHigh">Amount: Low to High</option>
                                        <option value="AmountHighLow">Amount: High to Low</option>
                                        <option value="DateOldNew">Date: Old to New</option>
                                        <option value="DateNewOld">Date: New to Old</option>
                                        <option value="Under100000">Amount Under 100,000</option>
                                        <option value="Over100000">Amount Over 100,000</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Overdue">Overdue</option>
                                    </select>
                                </div>
                            </div>
                            {/* Display filtered and sorted bills */}
                            {filteredBills.map((bill) => (
                                <div
                                    key={bill.id}
                                    onClick={() => { setSelectedBill(bill); setOpenCategories({}) }}
                                    className={`p-4 rounded-lg mb-3 cursor-pointer transition-all ${selectedBill?.id === bill.id ? selectedBill.status === "Paid" ? 'bg-primary/10 ring-1 ring-primary hover:bg-primary/20' : selectedBill.status === "Pending" ? 'bg-accent/5 hover:bg-accent/10 ring-1 ring-accent' : 'bg-error/10 hover:bg-error/20 ring-1 ring-error' : 'bg-base-100 ring-1 ring-base-200 hover:bg-base-200/20'
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
                                                bill.status === "Pending" ?
                                                    <ClockIcon className="h-5 w-5" /> :
                                                    <ExclamationTriangleIcon className="h-5 w-5" />
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
                        {selectedBill ? (
                            <div>
                                {/* Title of bill, status, and payment info */}
                                <div className="mb-10 flex flex-col justify-between lg:flex-row items-start lg:items-center mt-3">
                                    {/* Left box */}
                                    <div className="">
                                        <h2 className="text-3xl font-semibold mb-2">{selectedBill.name}</h2>
                                        <span className={`badge text-base-100 p-3 flex gap-2 ${selectedBill.status === 'Paid' ? 'badge-success' : selectedBill.status == "Pending" ? 'badge-accent' : 'badge-error'}`}>
                                            {selectedBill.status === "Paid" ? <CheckCircleIcon className="size-4" /> : selectedBill.status === "Pending" ? <ClockIcon className="size-4" /> : <ExclamationTriangleIcon className="size-4" />}
                                            {selectedBill.status}
                                        </span>
                                    </div>

                                    {/* Right box */}
                                    <div className=" mt-4 lg:mt-0 text-end ">
                                        <div className="mb-2 flex flex-col gap-3">
                                            <span className="text-sm text-secondary ">Generated on: {selectedBill.date}</span>
                                            <span className="text-sm text-gray-500 ">Due on: {selectedBill.dueDate}</span>
                                        </div>
                                        {/* Display payment info based on bill status */}
                                        {getPaymentInfo(selectedBill)}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {selectedBill.breakDown.map((category, idx) => (
                                        category.subCategory ? (
                                            // Category has subcategories - render a collapsible section
                                            <div key={idx} className="ring-secondary/50 ring-1 rounded-lg mb-2 shadow-md">
                                                <div
                                                    className="cursor-pointer text-base border-b-2 rounded-lg border-b-light-secondary/50  font-medium flex justify-between items-center p-4"
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
                                            <div key={idx} className="bg-base-100 ring-1 ring-secondary/50 p-4 rounded-lg flex justify-between items-center mb-2">
                                                <span className="text-base font-medium">{category.category}</span>
                                                <span className="font-semibold mr-7">
                                                    {formatAmount(calculateCategoryTotal(category))}
                                                </span>
                                            </div>
                                        )
                                    ))}

                                    {/** In case of overdue, add a penalty (PENALTY_RATE * number of overdue days) */}
                                    {selectedBill.status !== 'Paid' && selectedBill.dueDate && calculateDaysDifference(new Date(selectedBill.dueDate), new Date()) > 0 && (
                                        <div className="bg-error/10 p-4 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-semibold">Penalty</span>
                                                    <span> Rate: {PENALTY_RATE}/- per overdue day</span>
                                                </div>
                                                <span className="text-error font-bold">
                                                    {formatAmount(PENALTY_RATE * calculateDaysDifference(new Date(selectedBill.dueDate), new Date()))}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 p-4 bg-primary/20 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Total Amount</span>
                                        <span className="text-xl font-bold">

                                            {selectedBill.status != "Overdue" ? formatAmount(selectedBill.amount) : formatAmount(selectedBill.amount + (PENALTY_RATE * calculateDaysDifference(new Date(selectedBill.dueDate), new Date())))}
                                        </span>
                                    </div>
                                </div>

                                {/* Action buttons for the bill */}
                                <div className="flex w-full justify-end gap-2 mt-7">
                                    <button className="btn btn-outline btn-primary" onClick={() => printPDF(selectedBill)} >
                                        <PrinterIcon className="h-5 w-5" />
                                        Print Bill
                                    </button>
                                    <button
                                        className="btn btn-outline btn-secondary"
                                        onClick={() => generatePDF(selectedBill)}
                                    >
                                        <ArrowDownTrayIcon className="h-5 w-5" />
                                        Download PDF
                                    </button>

                                    {
                                        selectedBill.status != 'Paid' && (
                                            <button className="btn btn-primary text-base-100">
                                                <CursorArrowRippleIcon className="h-5 w-5 animate-ping animate-infinite animate-duration-1000 animate-delay-0 animate-ease-in animate-alternate-reverse animate-fill-forwards" />
                                                Pay Now
                                            </button>
                                        )
                                    }
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-xl  text-gray-400 mt-20">
                                <ClipboardDocumentListIcon className="size-20" />
                                Select a bill to view.
                            </div>
                        )}
                    </div>


                </div>
            </div>
        </Sidebar>
    )
}

export default Billing
