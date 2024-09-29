import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { BuildingOffice2Icon, ChartBarSquareIcon, ChartPieIcon, CpuChipIcon, EnvelopeIcon, TrashIcon, UserCircleIcon, UserGroupIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import { AdminService } from "../../services";

const EMPTY_FORM_DATA = {
  registration: {
    category: "",
    organizationName: "",
    presentAddress: "",
    website: "",
    companyEmail: "",
  },
  contactInfo: {
    applicantName: "",
    applicantPhone: "",
    applicantEmail: "",
    applicantLandline: "",
  },
  stakeholders: [
    {
      name: "",
      designation: "",
      email: "",
      presentAddress: "",
      nationality: "",
      dualNationality: "",
      profile: "",
      isNustAlumni: false,
      isNustEmployee: false,
    },
  ],
  companyProfile: {
    companyHeadquarters: "",
    yearsInBusiness: "",
    numberOfEmployees: 0,
    registrationNumber: 0,
  },
  industrySector: {
    category: "",
    rentalSpaceSqFt: 0,
    timeFrame: "",
  },
  companyResourceComposition: {
    management: 0,
    engineering: 0,
    marketingAndSales: 0,
    remainingPredominantArea: "",
    areasOfResearch: "",
    nustSchoolToCollab: "",
  },
}

const CATEGORIES =
  "AgriTech, AutoTech, DefTech, EdTech, EnergyTech, FinTech, HealthTech, Other - SmartTech";

const CompanyAddition = () => {
  const [loading, setLoading] = useState(false);
  const [submitModalTitle, setSubmitModalTitle] = useState("");
  const [submitModalText, setSubmitModalText] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);

  const handleChange = (section, field, value, index = null) => {
    if (index !== null) {
      console.log(`Changing ${section}[${index}].${field} to ${value}`);
    } else {
      console.log(`Changing ${section}.${field} to ${value}`);
    }

    if (index !== null) {
      setFormData((prevState) => {
        const updatedArray = [...prevState[section]];
        updatedArray[index] = {
          ...updatedArray[index],
          [field]: value,
        };
        return {
          ...prevState,
          [section]: updatedArray,
        };
      });
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [field]: value,
        },
      }));
    }
  };

  const renderFields = (section, fields, index = null) => {
    const data = index !== null ? formData[section][index] : formData[section];
    if (!data) {
      console.error(`Section ${section} does not exist in formData`);
      return null;
    }

    return fields.map(({ name, type, labelName, longText }) => (
      <div
        key={name}
        className={`col-span-1 ${longText || type == "radio" ? "col-span-2" : ""
          } max-sm:col-span-1`}
      >
        {type === "boolean" ? (
          <div className="">
            <label className="flex items-center justify-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name={name}
                id={`floating_${name}`}
                checked={data[name]}
                onChange={(e) =>
                  handleChange(section, name, e.target.checked, index)
                }
                className="checkbox checkbox-primary"
              />
              <span className="label-text">
                {labelName && labelName !== ""
                  ? labelName
                  : name
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
              </span>
            </label>
          </div>
        ) : type == "radio" ? ( //theres only one radio group on the page, in that case labelName will be a string with comma separated values including the  possible categories of the industry
          <div className="flex flex-row flex-wrap gap-2">
            {labelName &&
              labelName.split(", ").map((category, idx) => (
                <div key={idx} className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="radio"
                      name={name}
                      value={category}
                      checked={data[name] === category}
                      onChange={(e) =>
                        handleChange(section, name, category, index)
                      }
                      className="radio checked:bg-primary mr-2"
                    />
                    <span className="label-text">{category}</span>
                  </label>
                </div>
              ))}
          </div>
        ) : (
          <FloatingLabelInput
            name={name}
            id={`floating_${name}`}
            label={
              labelName && labelName != ""
                ? labelName
                : name
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())
            }
            type={type}
            value={data[name]}
            onChange={(e) => handleChange(section, name, e.target.value, index)}
          />
        )}
      </div>
    ));
  };

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };
  
  const validateFormData = () => {
    const {
      registration,
      contactInfo,
      stakeholders,
      companyProfile,
      industrySector,
      companyResourceComposition,
    } = formData;
  
    let missingFields = [];
  
    // Check registration fields
    for (const key in registration) {
      if (registration[key] === "") {
        missingFields.push(`Registration: ${formatKey(key)}`);
      }
    }
  
    // Check contactInfo fields
    for (const key in contactInfo) {
      if (contactInfo[key] === "") {
        missingFields.push(`Contact Info: ${formatKey(key)}`);
      }
    }
  
    // Check stakeholders fields
    for (const stakeholder of stakeholders) {
      for (const key in stakeholder) {
        if (key !== "dualNationality" && stakeholder[key] === "") {
          missingFields.push(`Stakeholder: ${formatKey(key)}`);
        }
      }
    }
  
    // Check companyProfile fields
    for (const key in companyProfile) {
      if (companyProfile[key] === "") {
        missingFields.push(`Company Profile: ${formatKey(key)}`);
      }
    }
  
    // Check industrySector fields
    for (const key in industrySector) {
      if (industrySector[key] === "") {
        missingFields.push(`Industry Sector: ${formatKey(key)}`);
      }
    }
  
    // Additional checks for industrySector
    if (industrySector.rentalSpaceSqFt < 350) {
      missingFields.push("Industry Sector: Rental Space Sq Ft (must be at least 350 Sq Ft)");
    }
  
    // Additional checks for companyProfile
    if (companyProfile.numberOfEmployees < 1) {
      missingFields.push("Company Profile: Number Of Employees (must be at least 1)");
    }
    if (companyProfile.yearsInBusiness < 1) {
      missingFields.push("Company Profile: Years In Business (must be at least 1 year)");
    }
  
    // Check companyResourceComposition fields
    for (const key in companyResourceComposition) {
      if (
        key !== "remainingPredominantArea" &&
        key !== "nustSchoolToCollab" &&
        companyResourceComposition[key] === ""
      ) {
        missingFields.push(`Company Resource Composition: ${formatKey(key)}`);
      }
    }
  
    // Additional checks for companyResourceComposition
    const { management, engineering, marketingAndSales } = companyResourceComposition;
    const total = Number(management) + Number(engineering) + Number(marketingAndSales);
  
    if (total > 100) {
      missingFields.push("Company Resource Composition: Total Percentage (must not exceed 100%)");
    }
  
    return missingFields;
  };
  
  useEffect(() => {
    if (loading) {
      document.getElementById("loading-modal").showModal();
    } else {
      document.getElementById("loading-modal").close();
    }
  }, [loading]);

  const handleFormSubmit = async () => {
    console.log(formData);
    const missingFields = validateFormData();
    if (missingFields.length === 0) {
      setLoading(true);
  
      console.log(
        "🚀 ~ formData ~ ",
        formData.registration,
        formData.contactInfo,
        formData.stakeholders,
        formData.companyProfile,
        formData.industrySector,
        formData.companyResourceComposition
      );
  
      try {
        const response = await AdminService.addTenant(
          formData.registration,
          formData.contactInfo,
          formData.stakeholders,
          formData.companyProfile,
          formData.industrySector,
          formData.companyResourceComposition
        );
        console.log(response);
  
        setSubmitModalTitle("Form Submitted");
        setSubmitModalText(
          "Your form has been submitted successfully. We will get back to you soon."
        );
        document.getElementById("submit-modal").showModal();
        setFormData(EMPTY_FORM_DATA);
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitModalTitle("Submission Failed");
        setSubmitModalText(
          "An error occurred while submitting the form. Please try again later."
        );
        document.getElementById("submit-modal").showModal();
      } finally {
        setLoading(false);
      }
    } else {
      setSubmitModalTitle("Form not filled correctly");
      setSubmitModalText(
        `The following fields are missing or incorrect:\n\n${missingFields.join("\n")}`
      );
      console.log("Please fill all mandatory fields.");
      document.getElementById("submit-modal").showModal();
    }
  };

  return (
    <Sidebar>
      {/* Modal showed while loading */}
      <dialog id="loading-modal" className="modal">
        <div className="modal-box">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <h3 className="font-bold text-lg">Please Wait...</h3>
          <p className="py-4">
            We are processing your data. Please don't close this window.
          </p>
        </div>
      </dialog>

      {/* Modal showed after form submission (error or success depending on scenario) */}
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

      {/* page content on a card */}
      <div className="bg-base-100 rounded-lg ring-1 ring-base-200 lg:m-10 md:m-5 max-sm:m-5 max-sm:mx-2 max-sm:p-3 p-10">
        <div className="grid gap-5 max-sm:grid-cols-1 md:grid-cols-2">
          {/** Registration Section */}
          <div className="col-span-2 max-sm:col-span-1">
            <div className="flex items-center gap-2">
              <UserPlusIcon className="size-6" />
              <h1 className="font-bold text-xl">Registration</h1>
            </div>
            <hr className="my-4"></hr>
          </div>
          {renderFields("registration", [
            { name: "category", type: "text" },
            { name: "organizationName", type: "text" },
            { name: "presentAddress", type: "text", longText: true },
            { name: "website", type: "text" },
            { name: "companyEmail", type: "email" },
          ])}

          {/** Contact Info Section */}
          <div className="col-span-2 max-sm:col-span-1">
          <div className="flex items-center gap-2">
              <EnvelopeIcon className="size-6" />
              <h1 className="font-bold text-xl">Contact Information</h1>
            </div>
            <hr className="my-4"></hr>
          </div>
          {renderFields("contactInfo", [
            { name: "applicantName", type: "text" },
            { name: "applicantPhone", type: "text" },
            { name: "applicantEmail", type: "email" },
            { name: "applicantLandline", type: "text" },
          ])}

          {/** Stakeholders Section */}
          <div className="col-span-2 max-sm:col-span-1">
            <div className="w-full flex justify-between items-center mt-5">
            <div className="flex items-center gap-2">
              <UserGroupIcon className="size-6" />
              <h1 className="font-bold text-xl">Stakeholder Profiles</h1>
            </div>
              <button
                onClick={() => {
                  setFormData((prevState) => ({
                    ...prevState,
                    stakeholders: [
                      ...prevState.stakeholders,
                      {
                        name: "",
                        designation: "",
                        email: "",
                        presentAddress: "",
                        nationality: "",
                        dualNationality: "",
                        profile: "",
                        isNustAlumni: false,
                        isNustEmployee: false,
                      },
                    ],
                  }));
                  document
                    .getElementById(
                      "stakeholder-" + (formData.stakeholders.length - 1)
                    )
                    .scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                      inline: "nearest",
                    });
                }}
                className="btn btn-primary text-white"
              >
                <UserPlusIcon className="size-5" />
                Add
              </button>
            </div>
            <p className="text-gray-400 text-sm max-md:mt-5">
              {
                "(Note: Details of all Director(s) / Stakeholder(s) are mandatory)"
              }
            </p>
            <hr className="my-4"></hr>
          </div>
          {/** Map over stakeholders array and render fields for each */}
          {formData.stakeholders.map((stakeholder, index) => (
            <div
              key={index}
              className="col-span-2 max-sm:col-span-1 ring-1 rounded-lg p-5 ring-gray-400"
              id={"stakeholder-" + index}
            >
              <div className="flex justify-between items-center">
                <p className="text-primary font-bold mb-5 flex items-center gap-2">
                  <UserCircleIcon className="size-6" />
                  {"Stakeholder " + (index + 1)}
                </p>
                <div>
                  {index > 0 && (
                    <button
                      onClick={() => {
                        setFormData((prevState) => {
                          const updatedArray = [...prevState.stakeholders];
                          updatedArray.splice(index, 1);
                          return {
                            ...prevState,
                            stakeholders: updatedArray,
                          };
                        });
                      }}
                      className="btn btn-primary text-white"
                    >
                      <TrashIcon className="size-5" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <div className="grid gap-5 max-sm:grid-cols-1 md:grid-cols-2">
                {renderFields(
                  "stakeholders",
                  [
                    { name: "name", type: "text" },
                    { name: "designation", type: "text" },
                    { name: "email", type: "email" },
                    { name: "presentAddress", type: "text" },
                    { name: "nationality", type: "text" },
                    {
                      name: "dualNationality",
                      type: "text",
                      labelName: "If dual national, enter other nationality",
                    },
                    {
                      name: "profile",
                      type: "text",
                      labelName: "Brief profile of individual/LinkedIn Profile",
                      longText: true,
                    },
                    {
                      name: "isNustAlumni",
                      type: "boolean",
                      labelName: "The individual is a NUST Alumni",
                    },
                    {
                      name: "isNustEmployee",
                      type: "boolean",
                      labelName: "The individual is a NUST Employee",
                    },
                  ],
                  index
                )}
              </div>
            </div>
          ))}

          {/** Company Profile Section */}
          <div className="col-span-2 max-sm:col-span-1 mt-5">
          <div className="flex items-center gap-2">
              <BuildingOffice2Icon className="size-6" />
              <h1 className="font-bold text-xl">Company Profile</h1>
            </div>
            <hr className="my-4"></hr>
          </div>
          {renderFields("companyProfile", [
            {
              name: "companyHeadquarters",
              type: "text",
              labelName: "Where are company headquarters?",
            },
            {
              name: "yearsInBusiness",
              type: "number",
              labelName: "How long has the company been in business? (Years)",
            },
            { name: "numberOfEmployees", type: "number" },
            {
              name: "registrationNumber",
              type: "text",
              labelName: "Registration Number in Pakistan",
            },
          ])}

          {/** Industry Sector Section */}
          <div className="col-span-2 max-sm:col-span-1">
          <div className="flex items-center gap-2">
              <CpuChipIcon className="size-6" />
              <h1 className="font-bold text-xl">Industry Sector</h1>
            </div>
            <hr className="my-4"></hr>
          </div>
          {renderFields("industrySector", [
            { name: "category", type: "radio", labelName: CATEGORIES },
            {
              name: "rentalSpaceSqFt",
              type: "number",
              labelName: "Rental Space (Sq. Ft.) (Minimum 350 Sq Ft)",
            },
            {
              name: "timeFrame",
              type: "text",
              labelName: "What time frame are you looking to move in?",
            },
          ])}

          {/** Company Resource Composition Section */}
          <div className="col-span-2 max-sm:col-span-1">
          <div className="flex items-center gap-2">
              <ChartPieIcon className="size-6" />
              <h1 className="font-bold text-xl">Company Resource Composition</h1>
            </div>
            <hr className="my-4"></hr>
          </div>
          {renderFields("companyResourceComposition", [
            { name: "management", type: "number", labelName: "Management (%)" },
            {
              name: "engineering",
              type: "number",
              labelName: "Engineering (%)",
            },
            {
              name: "marketingAndSales",
              type: "number",
              labelName: "Marketing & Sales (%)",
            },
            {
              name: "remainingPredominantArea",
              type: "text",
              labelName:
                "For remaining, please specify what area is predominant",
            },
            {
              name: "areasOfResearch",
              type: "text",
              labelName:
                "What area of research is your company actively involved in? (Separate multiple with semicolon)",
              longText: true,
            },
            {
              name: "nustSchoolToCollab",
              type: "text",
              labelName:
                "If applicable, which NUST School/Department would you be likely to collaborate with?",
              longText: true,
            },
          ])}
        </div>
        <p className="mt-5 text-gray-400">
          Note: All the data you have provided will remain confidential.
        </p>
        <button
          onClick={handleFormSubmit}
          className="btn btn-primary mt-5 text-white"
        >
          Submit
        </button>
      </div>
    </Sidebar>
  );
};

export default CompanyAddition;
