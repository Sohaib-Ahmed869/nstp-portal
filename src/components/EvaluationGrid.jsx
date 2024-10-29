import { BuildingOffice2Icon, ChartBarIcon, DocumentTextIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

/**
|--------------------------------------------------
| For displaying the results of evaluationForm filled by tenant
|--------------------------------------------------
*/

const EvaluationGrid = ({ evaluation }) => {
    const fieldMappings = {
        // Economic Performance
        sales_total: "Total Sales (PKR)",
        sales_tenants: "Sales to other NSTP tenants (PKR)",
        sales_exports: "Sales to export customers (USD)",
        earning: "Earning (EBITDA) (PKR)",
        investment_rnd: "Investment in R&D (PKR)",
        investment_snm: "Investment in sales and marketing (PKR)",
        investment_hr: "Investment in human resources development (PKR)",
        customers_total: "Total Customers (Local + International)",
        customers_b2b: "B2B Customers",
        investment_raised: "Have you raised any investment in the current year?",
        inverstor_origin: "Investor Origin",
        investor_type: "Type of investor",
        investor_name: "Investor/investment firm name",
        investment_amount: "Investment amount USD",
        employees_total: "Total employees",
        employees_rnd: "No employees in R&D / Technical development",
        employees_snm: "No. of employees in marketing and sales",
        employees_hr: "No. of employees in administration / finance / HR",
        employees_interns: "No. of Interns",
        employees_support: "No. of Support Staff (Other Employees)",
        avg_employee_retention: "Average Employee retention (years)",
        avg_internship_duration: "Average internship duration (months)",
        avg_salary: "Average salary paid for skilled / professional jobs",

        // Innovation & Technology Transfer
        num_technologies: "Number of technologies / products / services developed",
        num_ips_filed: "Number of IPs filed",
        num_ips_awarded: "Number of IPs awarded",
        num_ips_owned: "Total Number of IPs owned",
        num_technologies_transfers: "Number of technology transfers",
        num_research_national: "No. of National Research project(s)",
        value_research_national: "Value of National Research project(s) (PKR)",
        num_research_international: "No. of International Research project(s)",
        value_research_international: "Value of International Research project(s) (PKR)",
        num_collaborations: "Number of collaborations and partnerships with NSTP (with other tenants)",

        // Interaction with NUST
        num_internships: "Number of internships offered to NUST students",
        num_jobs: "Number of Jobs offered to NUST students",
        num_placements: "Number of placements for NUST faculty members",
        num_research_projects: "Number of research projects with NUST",
        value_research_projects: "Value (PKR) of research projects with NUST",
        participation_jobfair: "Did the company participate in NUST Job Fair?",

        // Other Details
        achievements: "Key achievements during the assessment period",
        comments: "Comments/suggestions"
    };

    const getFieldDisplayName = (key) => fieldMappings[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="grid grid-cols-1 gap-6 p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center gap-2 bg-primary bg-opacity-20 p-6 rounded-lg">
                <ChartBarIcon className="size-8 text-secondary" />
                <h2 className="text-xl font-bold text-secondary">Economic Performance</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                {Object.entries(evaluation.economic_performance).filter(([key]) => key !== '_id').map(([key, value]) => (
                    <div key={key} className="flex flex-row gap-4">
                        <span className="font-bold">{getFieldDisplayName(key)}:</span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 bg-primary bg-opacity-20 p-6 rounded-lg">
                <RocketLaunchIcon className="size-8 text-secondary" />
                <h2 className="text-xl font-bold text-secondary">Innovation & Technology</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                {Object.entries(evaluation.innovation_technology).filter(([key]) => key !== '_id').map(([key, value]) => (
                    <div key={key} className="flex flex-row gap-4">
                        <span className="font-bold">{getFieldDisplayName(key)}:</span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 bg-primary bg-opacity-20 p-6 rounded-lg">
                <BuildingOffice2Icon className="size-8 text-secondary" />
                <h2 className="text-xl font-bold text-secondary">NUST Interaction</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                {Object.entries(evaluation.nust_interaction).filter(([key]) => key !== '_id').map(([key, value]) => (
                    <div key={key} className="flex flex-row gap-4">
                        <span className="font-bold">{getFieldDisplayName(key)}:</span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 bg-primary bg-opacity-20 p-6 rounded-lg">
                <DocumentTextIcon className="size-8 text-secondary" />
                <h2 className="text-xl font-bold text-secondary">Other Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                {Object.entries(evaluation.other_details).filter(([key]) => key !== '_id').map(([key, value]) => (
                    <div key={key} className="flex flex-row gap-4">
                        <span className="font-bold">{getFieldDisplayName(key)}:</span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvaluationGrid;