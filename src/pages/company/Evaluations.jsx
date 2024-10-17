import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import { ArrowsUpDownIcon, CheckBadgeIcon, ClockIcon, EyeIcon, MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { TenantService } from '../../services';

const Evaluations = () => {
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const evaluationsPerPage = 10;
    const navigate= useNavigate()

    useEffect(() => {
        // Simulate API call for 2 seconds before populating states with data
        async function fetchData() {
            try {
                const response = await TenantService.getEvaluations();
                console.log(response);
                if (response.error) {
                    console.log(response.error);
                    return
                }

                console.log(response.data.evaluations);
                // map data to state
                const evaluations = response.data.evaluations.map((evaluation) => ({
                    id: evaluation._id,
                    adminName: evaluation.admin.name,
                    deadline: new Date(evaluation.deadline).toLocaleString(),
                    completed: evaluation.is_submitted,
                }));

                setEvaluations(evaluations);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchData();
        
        // setTimeout(() => {
        //     setEvaluations([
        //         { id: '1', adminName: 'John Doe', deadline: '2024-12-12', completed: false, },
        //     ]);
            
        //     setLoading(false);
        // }, 2000);
    }, []);

    const filteredEvaluations = evaluations
        .filter((evaluation) =>
            evaluation.adminName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            evaluation.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return new Date(a.deadline) - new Date(b.deadline);
            } else {
                return new Date(b.deadline) - new Date(a.deadline);
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
                    <p className="text-2xl font-semibold">Feedback and Evaluation Requests</p>
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
                        Sort by Deadline ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {currentEvaluations.map((evaluation) => (
                        <div key={evaluation.id} className="ring-base-200 ring-1 rounded-lg p-5 shadow-lg bg-base-100 flex">
                            <div className="w-1/2">
                                <h2 className="card-title">{evaluation.adminName || "Anonymous Admin"}</h2>
                                <p>{evaluation.description}</p>
                                <p className="text-sm my-3 text-gray-500">{"Deadline: "+  evaluation.deadline }</p>
                                {evaluation.completed ? (
                                    <span className="badge badge-success text-base-100 py-3"> <CheckBadgeIcon className="size-5 mr-1" /> Completed</span>
                                ) : (
                                    <span className="badge badge-accent text-base-100 py-3"> <ClockIcon className="size-5 mr-1" /> Pending</span>
                                ) }
                            </div>
                            <div className="flex w-1/2 justify-end items-center gap-3">
                               
                                
                                    <button className="btn btn-primary text-base-100" onClick = {
                                        () => navigate('' + evaluation.id)
                                    } >
                                        {evaluation.completed ? <EyeIcon className="size-6" /> : <PencilSquareIcon className="size-6" />}
                                        {evaluation.completed ? "View" : "Fill Evaluation"}
                                    </button>

                            
                            
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