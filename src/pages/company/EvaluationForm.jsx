import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useParams } from 'react-router-dom';
import { CheckBadgeIcon, ChartBarIcon, RocketLaunchIcon, BuildingOffice2Icon, DocumentTextIcon } from '@heroicons/react/24/outline';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import { TenantService } from '../../services';
import showToast from '../../util/toast';
const investmentFields = ['investorOrigin', 'typeOfInvestor', 'investorName', 'investmentAmount'];

const EMPTY_FORM_DATA = {
  economicPerformance: {
    totalSales: '',
    salesToNSTPTenants: '',
    salesToExportCustomers: '',
    earningEBITDA: '',
    investmentInRD: '',
    investmentInSalesMarketing: '',
    investmentInHRD: '',
    totalCustomers: '',
    b2bCustomers: '',
    raisedInvestment: '',
    investorOrigin: '',
    typeOfInvestor: '',
    investorName: '',
    investmentAmount: '',
    totalEmployees: '',
    employeesInRD: '',
    employeesInMarketingSales: '',
    employeesInAdminFinanceHR: '',
    interns: '',
    supportStaff: '',
    averageEmployeeRetention: '',
    averageInternshipDuration: '',
    averageSalarySkilled: '',
  },
  innovationTechnologyTransfer: {
    technologiesDeveloped: '',
    IPsFiled: '',
    IPsAwarded: '',
    totalIPsOwned: '',
    technologyTransfers: '',
    nationalResearchProjects: '',
    valueNationalResearchProjects: '',
    internationalResearchProjects: '',
    valueInternationalResearchProjects: '',
    collaborationsWithNSTP: '',
  },
  interactionWithNUST: {
    internshipsOffered: '',
    jobsOffered: '',
    facultyPlacements: '',
    researchProjects: '',
    valueResearchProjects: '',
    participatedInJobFair: '',
  },
  otherDetails: {
    keyAchievements: '',
    comments: '',
    undertaking: false,
  },
};

const EvaluationForm = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [submitModalTitle, setSubmitModalTitle] = useState('');
  const [submitModalText, setSubmitModalText] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await TenantService.getEvaluation(id);
        if (response.error) {
          console.log(response.error);
          return;
        }
        console.log(response.data.evaluation);
        const evaluation = response.data.evaluation;

        // map data to state

      } catch (error) {
        console.error('Error fetching evaluation:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();

  }, []);

  const handleChange = (section, field, value) => {
    setFormData((prevState) => {
      const updatedState = {
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: value,
        },
      };

      // Handle visibility of investment-related fields
      if (section === 'economicPerformance' && field === 'raisedInvestment' && value === 'No') {
        updatedState.economicPerformance.investorOrigin = '';
        updatedState.economicPerformance.typeOfInvestor = '';
        updatedState.economicPerformance.investorName = '';
        updatedState.economicPerformance.investmentAmount = '';
      }

      return updatedState;
    });
  };

  const renderFields = (section, fields) => {
    return fields.map(({ name, type, labelName, options, longText }) => {
      // Conditionally render investment-related fields
      if (section === 'economicPerformance' && investmentFields.includes(name) && formData.economicPerformance.raisedInvestment !== 'Yes') {
        return null;
      }

      return (
        <div
          key={name}
          className={`col-span-1 ${longText || type === 'radio' ? 'col-span-2' : ''} max-sm:col-span-1`}
        >
          {type === 'boolean' ? (
            <div className="">
              <label className="flex items-center justify-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={name}
                  id={`floating_${name}`}
                  checked={formData[section][name]}
                  onChange={(e) => handleChange(section, name, e.target.checked)}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">{labelName || name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
              </label>
            </div>
          ) : type === 'radio' ? (
            <div className="flex flex-col">
              {<p className="font-bold">{labelName}</p>}
              <div className="flex flex-row flex-wrap gap-2">
                {options && options.split(', ').map((option, idx) => (
                  <div key={idx} className="form-control">
                    <label className="label cursor-pointer">
                      <input
                        type="radio"
                        name={name}
                        value={option}
                        checked={formData[section][name] === option}
                        onChange={(e) => handleChange(section, name, option)}
                        className="radio checked:bg-primary mr-2"
                      />
                      <span className="label-text">{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <FloatingLabelInput
              name={name}
              id={`floating_${name}`}
              label={labelName || name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              type={type}
              value={formData[section][name]}
              onChange={(e) => handleChange(section, name, e.target.value)}
            />
          )}
        </div>
      );
    });
  };

  const validateFormData = () => {
    const missingFields = [];

    // Check required fields in economicPerformance section
    const requiredFields = [
      'totalSales', 'salesToNSTPTenants', 'salesToExportCustomers', 'earningEBITDA',
      'investmentInRD', 'investmentInSalesMarketing', 'investmentInHRD', 'totalCustomers',
      'b2bCustomers', 'raisedInvestment', 'totalEmployees', 'employeesInRD',
      'employeesInMarketingSales', 'employeesInAdminFinanceHR', 'interns', 'supportStaff',
      'averageEmployeeRetention', 'averageInternshipDuration', 'averageSalarySkilled'
    ];
    if (formData.otherDetails.undertaking === false) {
      missingFields.push('Undertaking not ticked');
    }
    requiredFields.forEach(field => {
      if (!formData.economicPerformance[field]) {
        missingFields.push(`Economic Performance: ${field}`);
      }
    });

    // Check investment-related fields if raisedInvestment is 'Yes'
    if (formData.economicPerformance.raisedInvestment === 'Yes') {
      investmentFields.forEach(field => {
        if (!formData.economicPerformance[field]) {
          missingFields.push(`Economic Performance: ${field}`);
        }
      });
    }

    // Add similar validation for other sections if needed

    return missingFields;
  };
  useEffect(() => {
    if (loading) {
      document.getElementById('loading-modal').showModal();
    } else {
      document.getElementById('loading-modal').close();
    }
  }, [loading]);

  const handleSubmit = async () => {
    console.log(formData);
    console.log('evaluation id', id);
    const missingFields = validateFormData();
    if (missingFields.length === 0) {
      setLoading(true);
      try {
        // API call to be added later
        const response = await TenantService.submitEvaluation(id, formData);
        if (response.error) {
          console.log(response.error);
          showToast(false, response.error);
          return;
        }

        console.log(response.message);
        showToast(true, response.message);

        setSubmitModalTitle('Form Submitted');
        setSubmitModalText('Your evaluation form has been submitted successfully.');
        document.getElementById('submit-modal').showModal();
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitModalTitle('Submission Failed');
        setSubmitModalText('An error occurred while submitting the form. Please try again later.');
        document.getElementById('submit-modal').showModal();
      } finally {
        setLoading(false);
      }
    } else {
      setSubmitModalTitle('Form not filled correctly');
      setSubmitModalText(`The following fields are missing or incorrect:\n\n${missingFields.join('\n')}`);
      document.getElementById('submit-modal').showModal();
    }
  };

  return (
    <Sidebar>
      {/* Loading Modal */}
      <dialog id="loading-modal" className="modal">
        <div className="modal-box">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <h3 className="font-bold text-lg">Please Wait...</h3>
          <p className="py-4">We are processing your data. Please don't close this window.</p>
        </div>
      </dialog>

      {/* Submit Modal */}
      <dialog id="submit-modal" className="modal whitespace-pre-wrap">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{submitModalTitle}</h3>
          <p className="py-4">{submitModalText}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Main Form */}
      <div className="bg-base-100 rounded-lg ring-1 ring-base-200 lg:m-10 md:m-5 max-sm:m-5 max-sm:mx-2 max-sm:p-3 p-10">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold">Performance Evaluation form</p>
        </div>
        <hr className="my-5 text-gray-200"></hr>
        <div className="grid gap-5 max-sm:grid-cols-1 md:grid-cols-2">
          {/* Economic Performance Section */}
          <div className="col-span-2 max-sm:col-span-1">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="size-6" />
              <h1 className="font-bold text-xl">Economic Performance</h1>
            </div>
            <hr className="my-4"></hr>
          </div>
          {renderFields('economicPerformance', [
            { name: 'totalSales', type: 'number', labelName: 'Total Sales (PKR) *' },
            { name: 'salesToNSTPTenants', type: 'number', labelName: 'Sales to other NSTP tenants (PKR) *' },
            { name: 'salesToExportCustomers', type: 'number', labelName: 'Sales to export customers (USD) *' },
            { name: 'earningEBITDA', type: 'number', labelName: 'Earning (EBITDA) (PKR) *' },
            { name: 'investmentInRD', type: 'number', labelName: 'Investment in R&D (PKR) *' },
            { name: 'investmentInSalesMarketing', type: 'number', labelName: 'Investment in sales and marketing (PKR) *' },
            { name: 'investmentInHRD', type: 'number', labelName: 'Investment in human resources development (PKR) *' },
            { name: 'totalCustomers', type: 'number', labelName: 'Total Customers (Local + International) *' },
            { name: 'b2bCustomers', type: 'number', labelName: 'B2B Customers *' },
            { name: 'raisedInvestment', type: 'radio', options: 'Yes, No', labelName: 'Have you raised any investment in the current year? *' },
            { name: 'investorOrigin', type: 'radio', options: 'International, Local', labelName: 'Investor origin *' },
            { name: 'typeOfInvestor', type: 'radio', options: 'Friends & Family, Angel, Venture Capital, Grant, Loan', labelName: 'Type of investor *' },
            { name: 'investorName', type: 'text', labelName: 'Investor/investment firm name' },
            { name: 'investmentAmount', type: 'number', labelName: 'Investment amount USD' },
            { name: 'totalEmployees', type: 'number', labelName: 'Total employees *' },
            { name: 'employeesInRD', type: 'number', labelName: 'No employees in R&D / Technical development *' },
            { name: 'employeesInMarketingSales', type: 'number', labelName: 'No. of employees in marketing and sales *' },
            { name: 'employeesInAdminFinanceHR', type: 'number', labelName: 'No. of employees in administration / finance / HR *' },
            { name: 'interns', type: 'number', labelName: 'No. of Interns *' },
            { name: 'supportStaff', type: 'number', labelName: 'No. of Support Staff (Other Employees) *' },
            { name: 'averageEmployeeRetention', type: 'number', labelName: 'Average Employee retention (years) *' },
            { name: 'averageInternshipDuration', type: 'number', labelName: 'Average internship duration (months) *' },
            { name: 'averageSalarySkilled', type: 'number', labelName: 'Average salary paid for skilled / professional jobs *' },
          ])}

          {/* Innovation and Technology Transfer Section */}
          <div className="col-span-2 max-sm:col-span-1">
            <div className="flex items-center gap-2">
              <RocketLaunchIcon className="size-6" />
              <h1 className="font-bold text-xl">Innovation and Technology Transfer</h1>
            </div>
            <hr className="my-4"></hr>
          </div>
          {renderFields('innovationTechnologyTransfer', [
            { name: 'technologiesDeveloped', type: 'number', labelName: 'Number of technologies / products / services developed *' },
            { name: 'IPsFiled', type: 'number', labelName: 'Number of IPs filed *' },
            { name: 'IPsAwarded', type: 'number', labelName: 'Number of IPs awarded *' },
            { name: 'totalIPsOwned', type: 'number', labelName: 'Total Number of IPs owned *' },
            { name: 'technologyTransfers', type: 'number', labelName: 'Number of technology transfers *' },
            { name: 'nationalResearchProjects', type: 'number', labelName: 'No. of National Research project(s) *' },
            { name: 'valueNationalResearchProjects', type: 'number', labelName: 'Value of National Research project(s) (PKR) *' },
            { name: 'internationalResearchProjects', type: 'number', labelName: 'No. of International Research project(s) *' },
            { name: 'valueInternationalResearchProjects', type: 'number', labelName: 'Value of International Research project(s) (PKR) *' },
            { name: 'collaborationsWithNSTP', type: 'number', labelName: 'Number of collaborations and partnerships with NSTP (with other tenants) *' },
          ])}

          {/* Interaction with NUST Section */}
          <div className="col-span-2 max-sm:col-span-1">
            <div className="flex items-center gap-2">
              <BuildingOffice2Icon className="size-6" />
              <h1 className="font-bold text-xl">Interaction with NUST</h1>
            </div>
            <hr className="my-4"></hr>
          </div>
          {renderFields('interactionWithNUST', [
            { name: 'internshipsOffered', type: 'number', labelName: 'Number of internships offered to NUST students *' },
            { name: 'jobsOffered', type: 'number', labelName: 'Number of Jobs offered to NUST students *' },
            { name: 'facultyPlacements', type: 'number', labelName: 'Number of placements for NUST faculty members *' },
            { name: 'researchProjects', type: 'number', labelName: 'Number of research projects with NUST *' },
            { name: 'valueResearchProjects', type: 'number', labelName: 'Value (PKR) of research projects with NUST *' },
            { name: 'participatedInJobFair', type: 'radio', options: 'Yes, No', labelName: 'Did the company participate in NUST Job Fair? *' },
          ])}

          {/* Other Details Section */}
          <div className="col-span-2 max-sm:col-span-1">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="size-6" />
              <h1 className="font-bold text-xl">Other Details</h1>
            </div>
            <hr className="my-4"></hr>
          </div>
          {renderFields('otherDetails', [
            { name: 'keyAchievements', type: 'text', labelName: 'Key achievements during the assessment period', longText: true },
            { name: 'comments', type: 'text', labelName: 'Comments/suggestions', longText: true },
            { name: 'undertaking', type: 'boolean', labelName: 'I hereby certify that the information provided is true and accurate *' },
          ])}
        </div>
        <div className="flex justify-end mt-5">
          <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </Sidebar>
  );
}

export default EvaluationForm;