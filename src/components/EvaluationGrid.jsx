import { BuildingOffice2Icon, ChartBarIcon, DocumentTextIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const EvaluationGrid = ({ evaluation }) => {
    return (
        <div className="grid grid-cols-1 gap-6 p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center gap-2 bg-primary bg-opacity-20 p-6 rounded-lg">
                <ChartBarIcon className="size-8 text-secondary" />
                <h2 className="text-xl font-bold text-secondary">Economic Performance</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(evaluation.economic_performance).filter(([key]) => key !== '_id').map(([key, value]) => (
                    <div key={key} className="flex flex-row gap-4">
                        <span className="font-bold">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 bg-primary bg-opacity-20 p-6 rounded-lg">
                <RocketLaunchIcon className="size-8 text-secondary" />
                <h2 className="text-xl font-bold text-secondary">Innovation & Technology</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(evaluation.innovation_technology).filter(([key]) => key !== '_id').map(([key, value]) => (
                    <div key={key} className="flex flex-row gap-4">
                        <span className="font-bold">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 bg-primary bg-opacity-20 p-6 rounded-lg">
                <BuildingOffice2Icon className="size-8 text-secondary" />
                <h2 className="text-xl font-bold text-secondary">NUST Interaction</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(evaluation.nust_interaction).filter(([key]) => key !== '_id').map(([key, value]) => (
                    <div key={key} className="flex flex-row gap-4">
                        <span className="font-bold">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 bg-primary bg-opacity-20 p-6 rounded-lg">
                <DocumentTextIcon className="size-8 text-secondary" />
                <h2 className="text-xl font-bold text-secondary">Other Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(evaluation.other_details).filter(([key]) => key !== '_id').map(([key, value]) => (
                    <div key={key} className="flex flex-row gap-4">
                        <span className="font-bold">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default EvaluationGrid;