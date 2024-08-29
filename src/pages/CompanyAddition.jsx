import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { UserPlusIcon } from '@heroicons/react/24/outline';
import FloatingLabelInput from '../components/FloatingLabelInput';

const CompanyAddition = () => {
    const [formData, setFormData] = useState({
        registration: {
            category: '',
            organizationName: '',
            presentAddress: '',
            website: '',
        },
        contactInfo: {
            applicantName: '',
            applicantPhone: '',
            applicantEmail: '',
            applicantLandline: '',
        },
        stakeholders: [
            {
                name: '',
                designation: '',
                email: '',
                presentAddress: '',
                nationality: '',
                dualNationality: '',
                profile: '',
                isNustAlumni: false,
                isNustEmployee: false,
            }
        ],
        companyProfile: {
            companyHeadquarters: '',
            yearsInBusiness: '',
            numberOfEmployees: 0,
            registrationNumber: 0,
        },
        industrySector: {
            category: '',
            rentalSpaceSqFt: 0,
            timeFrame: ''
        },
        companyResourceComposition: {
            management: 0,
            engineering: 0,
            marketingAndSales: 0,
            remainingPredominantArea: '',
            areasOfResearch: '',
            nustSchoolToCollab: ''
        }
    });

    const handleChange = (section, field, value, index = null) => {
        if (index !== null) {
            console.log(`Changing ${section}[${index}].${field} to ${value}`);
        } else {
            console.log(`Changing ${section}.${field} to ${value}`);
        }

        if (index !== null) {
            setFormData(prevState => {
                const updatedArray = [...prevState[section]];
                updatedArray[index] = {
                    ...updatedArray[index],
                    [field]: value
                };
                return {
                    ...prevState,
                    [section]: updatedArray
                };
            });
        } else {
            setFormData(prevState => ({
                ...prevState,
                [section]: {
                    ...prevState[section],
                    [field]: value
                }
            }));
        }
    };

    const renderFields = (section, fields, index = null) => {
        const data = index !== null ? formData[section][index] : formData[section];
        if (!data) {
            console.error(`Section ${section} does not exist in formData`);
            return null;
        }

        return fields.map(({ name, type }) => (
            <div key={name} className="col-span-1">
                {type === 'boolean' ? (
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name={name}
                            id={`floating_${name}`}
                            checked={data[name]}
                            onChange={(e) => handleChange(section, name, e.target.checked, index)}
                        />
                        <span className="ml-2">{name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span> {/*format the variable to be the label*/}
                    </label>
                ) : (
                    <FloatingLabelInput
                        name={name}
                        id={`floating_${name}`}
                        label={name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} //format the variable to be the label
                        type={type}
                        value={data[name]}
                        onChange={(e) => handleChange(section, name, e.target.value, index)}
                    />
                )}
            </div>
        ));
    };


    return (
        <Sidebar>
            <div className="bg-base-100 rounded-lg ring-1 ring-base-200 lg:m-10 md:m-5 max-sm:m-5 p-10">
                <div className="grid grid-cols-2 gap-5">

                    {/** Registration Section */}
                    <div className="col-span-2">
                        <h1 className="font-bold text-xl">Registration</h1>
                        <hr className="my-4" ></hr>
                    </div>
                    {renderFields('registration', [
                        { name: 'category', type: 'text' },
                        { name: 'organizationName', type: 'text' },
                        { name: 'presentAddress', type: 'text' },
                        { name: 'website', type: 'text' }
                    ])}

                    {/** Contact Info Section */}
                    <div className="col-span-2">
                        <h1 className="font-bold text-xl">Contact Info</h1>
                        <hr className="my-4" ></hr>
                    </div>
                    {renderFields('contactInfo', [
                        { name: 'applicantName', type: 'text' },
                        { name: 'applicantPhone', type: 'text' },
                        { name: 'applicantEmail', type: 'text' },
                        { name: 'applicantLandline', type: 'text' }
                    ])}

                    {/** Stakeholders Section */}
                    <div className="col-span-2">
                        <div className="w-full flex justify-between items-center mt-5"><h1 className="font-bold text-xl">Stakeholders</h1>
                            <button onClick={() => setFormData(prevState => ({ //button to add new stakeholder
                                ...prevState, stakeholders: [...prevState.stakeholders, {
                                    name: '',
                                    designation: '',
                                    email: '',
                                    presentAddress: '',
                                    nationality: '',
                                    dualNationality: '',
                                    profile: '',
                                    isNustAlumni: false,
                                    isNustEmployee: false,
                                }]
                            }))} className="btn btn-primary text-white"> 
                            <UserPlusIcon className="size-5" />Add
                            </button>
                        </div>

                        <hr className="my-4" ></hr>
                    </div>
                    {/** Map over stakeholders array and render fields for each */}
                    {formData.stakeholders.map((stakeholder, index) => (
                        <div key={index} className="col-span-2 ring-1 rounded-lg p-5 ring-gray-400">
                            <p className="text-primary font-bold mb-5"> {"Stakeholder " + (index + 1)}</p>
                            <div className="grid grid-cols-2 gap-5">{renderFields(`stakeholders`, [
                                { name: 'name', type: 'text' },
                                { name: 'designation', type: 'text' },
                                { name: 'email', type: 'text' },
                                { name: 'presentAddress', type: 'text' },
                                { name: 'nationality', type: 'text' },
                                { name: 'dualNationality', type: 'text' },
                                { name: 'profile', type: 'text' },
                                { name: 'isNustAlumni', type: 'boolean' },
                                { name: 'isNustEmployee', type: 'boolean' }
                            ], index)}</div>
                            
                        </div>
                    ))}

                    {/** Company Profile Section */}
                    <div className="col-span-2 mt-5">
                        <h1 className="font-bold text-xl">Company Profile</h1>
                        <hr className="my-4" ></hr>
                    </div>
                    {renderFields('companyProfile', [
                        { name: 'companyHeadquarters', type: 'text' },
                        { name: 'yearsInBusiness', type: 'number' },
                        { name: 'numberOfEmployees', type: 'number' },
                        { name: 'registrationNumber', type: 'number' }
                    ])}

                    {/** Industry Sector Section */}
                    <div className="col-span-2">
                        <h1 className="font-bold text-xl">Industry Sector</h1>
                        <hr className="my-4" ></hr>
                    </div>
                    {renderFields('industrySector', [
                        { name: 'category', type: 'text' },
                        { name: 'rentalSpaceSqFt', type: 'number' },
                        { name: 'timeFrame', type: 'text' }
                    ])}

                    {/** Company Resource Composition Section */}
                    <div className="col-span-2">
                        <h1 className="font-bold text-xl">Company Resource Composition</h1>
                        <hr className="my-4" ></hr>
                    </div>
                    {renderFields('companyResourceComposition', [
                        { name: 'management', type: 'number' },
                        { name: 'engineering', type: 'number' },
                        { name: 'marketingAndSales', type: 'number' },
                        { name: 'remainingPredominantArea', type: 'text' },
                        { name: 'areasOfResearch', type: 'text' },
                        { name: 'nustSchoolToCollab', type: 'text' }
                    ])}

                </div>
                <p className="mt-5 text-gray-400">Note: All the data you have provided will remain confidential.</p>
                <button onClick={() => console.log(formData)} className="btn btn-primary mt-5 text-white">Submit</button>
            </div>
        </Sidebar>
    );
};

export default CompanyAddition;