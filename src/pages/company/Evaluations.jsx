import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import { ArrowsUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Evaluations = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const evaluationsPerPage = 10;

    useEffect(() => {
        // Simulate API call for 2 seconds before populating states with data
        setTimeout(() => {
            setEvaluations([
                { id: '1', adminName: 'John Doe', description: 'Great company with excellent services. I would recommend them.', date: '2024-12-12' },
                { id: '2', adminName: 'Jane Smith', description: 'Needs improvement in customer support.', date: '2024-12-13' },
                { id: '3', adminName: 'Alice Johnson', description: 'Outstanding performance and timely delivery.', date: '2024-12-14' },
                { id: '4', adminName: 'Bob Brown', description: 'Average experience, could be better. I did not like the attitude of the staff. Also, the quality of the product was not up to the mark. I believe that the company can do better.', date: '2024-12-15' },
                { id: '5', adminName: 'Charlie Davis', description: 'Exceptional quality and great communication.', date: '2024-12-16' },
                { id: '6', adminName: 'Charlie Davis', description: 'Exceptional quality and great communication.', date: '2024-12-16' },
                { id: '7', adminName: 'Charlie Davis', description: 'Exceptional quality and great communication.', date: '2024-12-16' },
                { id: '8', adminName: 'Charlie Davis', description: 'Exceptional quality and great communication.', date: '2024-12-16' },
                { id: '89', adminName: 'Charlie Davis', description: 'Exceptional quality and great communication.', date: '2024-12-16' },
                { id: '9', adminName: 'Charlie Davis', description: 'Exceptional quality and great communication.', date: '2024-12-16' },
                { id: '99', adminName: 'Charlie Davis', description: 'Exceptional quality and great communication.', date: '2024-12-16' },
                { id: '999', adminName: 'Charlie Davis', description: 'Exceptional quality and great communication.', date: '2024-12-16' },
                { id: '597', adminName: 'Charlie Davis', description: 'Exceptional quality and great communication.', date: '2024-12-16' },
                { id: '655', adminName: 'Charlie Davis', description: 'Exceptional quality and great communication.', date: '2024-12-16' },
            ]);
            setLoading(false);
        }, 2000);
    }, []);

    const filteredEvaluations = evaluations
        .filter((evaluation) =>
            evaluation.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            evaluation.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return new Date(a.date) - new Date(b.date);
            } else {
                return new Date(b.date) - new Date(a.date);
            }
        });

    const indexOfLastEvaluation = currentPage * evaluationsPerPage;
    const indexOfFirstEvaluation = indexOfLastEvaluation - evaluationsPerPage;
    const currentEvaluations = filteredEvaluations.slice(indexOfFirstEvaluation, indexOfLastEvaluation);

    const totalPages = Math.ceil(filteredEvaluations.length / evaluationsPerPage);

    return (
        <Sidebar>
            {loading && <NSTPLoader />}

            <div className={`bg-base-100 rounded-md shadow-md p-5 lg:p-10 mt-10 ${loading && "hidden"}`}>
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-semibold">Feedback and Evaluation</p>
                </div>
                <hr className="my-5 text-gray-200"></hr>
                <div className="flex justify-between flex-col md:flex-row md:items-center mb-4">
                    <div className="relative w-full lg:max-w-xs">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input input-bordered w-full pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentEvaluations.map((evaluation) => (
                        <div key={evaluation.id} className="card shadow-lg compact bg-base-100">
                            <div className="card-body">
                                <h2 className="card-title">{evaluation.adminName}</h2>
                                <p>{evaluation.description}</p>
                                <p className="text-sm text-gray-500">{new Date(evaluation.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-10">
                    <button
                        className="btn btn-outline"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="mx-2">Showing page {currentPage} of {totalPages}</span>
                    <button
                        className="btn btn-outline"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </Sidebar>
    );
};

export default Evaluations;