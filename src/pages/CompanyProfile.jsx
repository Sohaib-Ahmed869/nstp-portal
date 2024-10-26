import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserGroupIcon, ChatBubbleOvalLeftEllipsisIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, BriefcaseIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon, ShieldExclamationIcon, CalendarIcon, DocumentCheckIcon, CalendarDateRangeIcon, ChatBubbleLeftRightIcon, UserIcon, EnvelopeIcon, PhoneIcon, UserCircleIcon, ArrowDownTrayIcon, PresentationChartLineIcon, CurrencyDollarIcon, DocumentIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import nstpLogo from '../assets/nstplogocolored.png'
import ReactApexChart from 'react-apexcharts';

/* Components */
import EmployeeStats from '../components/EmployeeStats';
import Sidebar from '../components/Sidebar';
import ComparativeChart from '../components/ComparativeChart';
import NSTPLoader from '../components/NSTPLoader';
import SideDrawer from '../components/SideDrawer';
import EmployeeProfileModal from '../components/EmployeeProfileModal';
import FloatingLabelInput from '../components/FloatingLabelInput';

/* Services and context */
import { AdminService, TenantService } from '../services';
import { TowerContext } from '../context/TowerContext'

/* Utils */
import { formatDate } from '../util/date';
import showToast from '../util/toast';
import { getPieChartOptions } from '../util/charts';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

import { saveAs } from 'file-saver';

/* Constants */
const MAX_CHAR_COUNT = 400; // max characters for notes
const CONTRACT_DURATION_THRESHOLD = 90; // after 90% of contract duration, the radial progress will become red

const calculateDuration = (startDate, endDate) => {
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years} years, ${months} months, and ${days} days`;
};


/**
|--------------------------------------------------
| Company profile component - admin can view company details, actions: end tenure, terminate employees, give evaluation
| company can view their own profile, actions: terminate employees, request clearance,  etc.
|--------------------------------------------------
*/

const Company = ({ role }) => {
  const { companyId } = useParams();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const { tower } = useContext(TowerContext);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [notesLoading, setNotesLoading] = useState(false);
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field]
    }));
  };

  const terminateEmployee = async (employeeId) => {
    // add loading state
    console.log(`Terminating employee with ID: ${employeeId}`);
    try {
      const response = await AdminService.terminateEmployee(employeeId);
      if (response.error) {
        console.error("Error terminating employee:", response);
        showToast(false, response.error.message);
        return;
      }
      showToast(true, "Employee terminated successfully.");

      // remove employee from the list

    } catch (error) {
      console.error("Error terminating employee:", error);
      showToast(false, "An error occurred while terminating employee.");
    } finally {
      // remove loading state
    }
    // API CALL to terminate
  };


  const [companyData, setCompanyData] = useState({ //DONT remove this dummmy state, loading issues otherwise
    name: "Tech Innovators",
    type: "Startup",
    category: "EdTech",
    joiningDate: "2022-01-15",
    contractStartDate: "2022-01-15",
    contractEndDate: "2022-04-15",
    description: "A leading tech company specializing in innovative solutions, we ensure that our employees are always at the forefront of technology and innovation, and we are always looking for new talent to join our team. We specialize in your needs, leading tech company specializing in innovative solutions, we ensure that our employees are always at the forefront of technology and innovation.",
    totalEmployees: 102,
    activeEmployees: 90,
    cardsNotIssued: 12,
    cardsIssued: 90,
    interns: {
      nustian: 30,
      nonNustian: 20,
      total: 50
    },
    gatePasses: { "Received": 20, "Pending": 10 },
    workPermits: 40,
    eTags: { "Received": 20, "Pending": 10 },
    vehiclesRegistered: 25,
    gateEntries: 200,
    foreignGateEntries: 15,
    jobsInternships: 10,
    meetingRoomUsage: 120,
    violations: 5,
    contractDuration: 75,
    notes: [
      {
        id: "1",
        adminName: "Admin1",
        date: "2022-10-10",
        note: "This is a note from admin1",
      },
      {
        id: "2",
        adminName: "Admin2",
        date: "2022-10-11",
        note: "This is a note from admin2",
      },
      {
        id: "3",
        adminName: "Admin3",
        date: "2022-10-12",
        note: "This is a note from admin3",
      },
      {
        id: "4",
        adminName: "Admin4",
        date: "2022-10-13",
        note: "This is a note from admin4",
      },
      {
        id: "5",
        adminName: "Admin5",
        date: "2022-10-14",
        note: "This is a note from admin5",
      },
      {
        id: "6",
        adminName: "Admin6",
        date: "2022-10-15",
        note: "This is a note from admin6",
      }
    ],
    employees: [
      {
        "_id": "66df197161c2c1ed67fe5c27",
        "tenant_id": "66d97748124403bf36e695e8",
        "tenant_name": "Hexlertech",
        "email": "musa@gmail.com",
        "name": "Musa Haroon Satti",
        "photo": "https://randomuser.me/api/portraits/men/21.jpg",
        "designation": "Full Stack Developer",
        "cnic": "6110166894529",
        "dob": "2024-09-06",
        "address": "F/10-1 Street 11 House 29",
        "date_joining": "2024-10-11",
        "employee_type": "Intern",
        "contract_duration": "",
        "status_employment": true,
        "is_nustian": true,
        "__v": 0,
        "etags": 1,
        "card_num": 0,
        "card": {
          "_id": "66df197161c2c1ed67fe5c28",
          "tenant_id": "66d97748124403bf36e695e8",
          "employee_id": "66df197161c2c1ed67fe5c27",
          "is_issued": true,
          "is_requested": false,
          "is_returned": false,
          "__v": 0,
          "card_number": 0,
          "date_issued": "2024-09-09T16:48:50.533Z"
        }
      },
      {
        "_id": "66df2a84c84208453e73701a",
        "tenant_id": "66d97748124403bf36e695e8",
        "tenant_name": "Hexlertech",
        "email": "musaharoon.2003@gmail.com",
        "name": "Musa Haroon Satti",
        "photo": "https://randomuser.me/api/portraits/men/10.jpg",
        "designation": "Full Stack Developer",
        "cnic": "6110166894528",
        "dob": "2024-09-05",
        "address": "F/10-1 Street 11 House 29",
        "date_joining": "2024-10-04",
        "employee_type": "Contract",
        "contract_duration": "6 Months",
        "status_employment": true,
        "is_nustian": false,
        "__v": 0,
        "etags": 1,
        "card": {
          "_id": "66df2a84c84208453e73701b",
          "tenant_id": "66d97748124403bf36e695e8",
          "employee_id": "66df2a84c84208453e73701a",
          "is_issued": false,
          "is_requested": true,
          "is_returned": false,
          "__v": 0,
          "date_requested": "2024-09-09T17:06:10.755Z"
        }
      },
      {
        "_id": "123f2a84c84208453e73701a",
        "tenant_id": "66d91238124403bf36e695e8",
        "tenant_name": "Hexlertech",
        "email": "haadiya@gmail.com",
        "name": "Haadiya Sajid",
        "photo": "https://randomuser.me/api/portraits/women/2.jpg",
        "designation": "Full Stack Developer",
        "cnic": "6110112394528",
        "dob": "2024-09-05",
        "address": "F/10-1 Street 11 House 29",
        "date_joining": "2024-10-04",
        "employee_type": "Contract",
        "contract_duration": "6 Months",
        "status_employment": true,
        "is_nustian": false,
        "__v": 0,
        "etags": 1,
        "card": {
          "_id": "66df2a84c84208453e73701b",
          "tenant_id": "66d97748124403bf36e695e8",
          "employee_id": "66df2a84c84208453e73701a",
          "is_issued": false,
          "is_requested": true,
          "is_returned": false,
          "__v": 0,
          "date_requested": "2024-09-09T17:06:10.755Z"
        }
      }
    ]
  });
  const [error, setError] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantDesignation: '',
    applicantCnic: '',
    officeNumber: '',
    vacatingDate: '',
    reasonForLeaving: ''
  });

  const [stickyNotes, setStickyNotes] = useState([]);

  const downloadLogo = async () => {
    try {
      // // Fetch the image from Firebase Storage
      // const response = await fetch(companyData.logo, {
      //   mode: 'cors', 
      // });

      // console.log("Response:", response);
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }

      // // Convert the response to a blob
      // const blob = await response.blob();

      // // Create a Blob URL
      // const url = window.URL.createObjectURL(blob);

      // // Create a temporary anchor element
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `${companyData.name}_logo.png`; // Set the desired file name

      // // Append the link to the body
      // document.body.appendChild(link);

      // // Programmatically click the link to trigger the download
      // link.click();

      // // Clean up by removing the link and revoking the Blob URL
      // link.remove();
      // window.URL.revokeObjectURL(url);

      saveAs(companyData.logo, `${companyData.username}_logo.png`);

      showToast(true, "Company logo downloaded");
    } catch (error) {
      console.error('Download error:', error);
      showToast(false, "Failed to download logo");
    }
  };

  const actions = role == "admin" ? [
    {
      text: 'Add Note',
      icon: DocumentIcon,
      onClick: () => {
        document.getElementById('add-note-modal').showModal();
      }
    },
    companyData.logo ? {
      text: 'Download Logo',
      icon: ArrowDownTrayIcon,
      onClick: () => {
        // const link = document.createElement('a');
        // link.href = companyData.logo;
        // link.download = `${companyData.name}_logo.png`;
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        // showToast(true, "Company logo downloaded");

        downloadLogo();
      },
    } : null,
    companyData.logo ? {
      text: 'Delete Logo',
      icon: TrashIcon,
      onClick: () => {
        deleteCompanyLogo();
      }
    } : null,
    !(companyData.logo && companyData.logo != null) ? {
      text: 'Upload Logo',
      icon: ArrowUpTrayIcon,
      onClick: () => {
        document.getElementById('upload-logo-modal').showModal();
      }
    } : null,
    {
      text: 'Request Evaluation',
      icon: ChatBubbleLeftRightIcon,
      onClick: () => {
        document.getElementById('evaluation-feedback-modal').showModal();
      },
    },
  ].filter(Boolean) : [
    {
      text: 'Request Clearance',
      icon: DocumentCheckIcon,
      onClick: () => {
        document.getElementById('tenure-end-modal').showModal();
      },
    },
    {
      text: 'Change Password',
      icon: LockClosedIcon,
      onClick: () => {
        document.getElementById('change-password-modal').showModal();
      },
    },
  ];

  const [logoToUpload, setLogoToUpload] = useState(null);//for uploading logo

  const [dropdownOpen, setDropdownOpen] = useState({});
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const confirmDeleteCompanyLogo = async () => {
    //api call to delete logo
    setModalLoading(true);
    console.log("Deleting company logo...");
    try {

      const response = await AdminService.deleteTenantLogo(companyId);
      if (response.error) {
        console.error("Error deleting company logo:", response.error);
        showToast(false, response.error);
        return;
      }

      console.log("Company logo deleted successfully:", response.message);

      setCompanyData((prevData) => ({
        ...prevData,
        logo: null
      }));

      showToast(true, response.message);
      // setTimeout (() => 
      //   { console.log("meow")
      //     setModalLoading(false);
      //     setCompanyData((prevData) => ({
      //       ...prevData,
      //       logo: null
      //     }));

      //   //api call here
      //   showToast(true, "Company logo deleted successfully.");
      //   document.getElementById('delete-logo-modal').close()

      //   }, 2000); //remove this timout wrapper when api call done

    }
    catch (error) {
      console.error("Error deleting company logo:", error);
      showToast(false, "An error occurred while deleting company logo.");
    }
    finally {
      setModalLoading(false);
      document.getElementById('delete-logo-modal').close();
    }
  }

  const deleteCompanyLogo = () => {
    document.getElementById('delete-logo-modal').showModal();
  }

  const changePassword = async (e) => {
    e.preventDefault();
    console.log(passwordData);
    // check empty fields and if new password matches confirm password
    if (passwordData.currentPassword.trim() === '' || passwordData.newPassword.trim() === '' || passwordData.confirmPassword.trim() === '') {
      showToast(false, "All fields are required.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast(false, "New password and confirm password do not match.");
      return;
    }
    //api call here to change 
    setModalLoading(true);

    try {
      const response = await TenantService.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      if (response.error) {
        console.error("Error changing password:", response.error);
        showToast(false, response.error);
        return;
      }

      console.log("Password changed successfully:", response.message);
      showToast(true, response.message);
    } catch (error) {
      console.error("Error changing password:", error);
      showToast(false, "An error occurred while changing password.");
    } finally {
      // Clear the fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordVisibility({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
      });
      // Close the modal
      document.getElementById('change-password-modal').close();
      setModalLoading(false);
    }

    // // Clear the fields
    // setPasswordData({
    //   currentPassword: '',
    //   newPassword: '',
    //   confirmPassword: ''
    // });
    // // Close the modal
    // document.getElementById('change-password-modal').close();
    // showToast(true, "Password changed successfully.");
    // setModalLoading(false);
  };
  const handleCancelPassword = () => {
    // Clear the fields
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordVisibility({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false
    })
    // Close the modal
    document.getElementById('change-password-modal').close();
  };
  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const toggleIfOpen = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const fetchAdminNotes = async () => {
    try {
      const response = await AdminService.getTenantNotes(tower.id, companyId);
      if (response.error) {
        console.error("Error fetching company notes:", response.error);
        showToast(false, response.error);
        return false;
      }
      //Syntax for note:
      //{
      //         id: new Date().getTime().toString(),
      //         adminName: "Admin7",
      //         date: new Date().toISOString().split('T')[0],
      //         note: noteContent,
      //       },
      console.log("Admin notes:", response.data.notes);
      setStickyNotes(response.data.notes.map((note) => ({
        id: note.id,
        adminName: note.adminName,
        date: formatDate(note.date),
        note: note.note,
        isEditable: note.isEditable,
      }))
      );

      return true;
    } catch (error) {
      console.error("Error fetching company notes:", error);
      showToast(false, "An error occurred while fetching company notes.");
      return false;
    }
  };

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        if (companyId) {
          const response = await AdminService.getTenant(tower.id, companyId);
          if (!response.error) {
            const fetchedData = response.data.tenant;
            console.log("FETC", fetchedData)
            // Calculate contract end date (one month after joining date)
            const contractStartDate = new Date(fetchedData.dateJoining);
            const contractEndDate = new Date(contractStartDate);
            contractEndDate.setMonth(contractEndDate.getMonth() + 1); //PLACEHOLDER

            // Calculate contract duration and elapsed time
            const totalContractDuration = contractEndDate - contractStartDate;
            const elapsedTime = new Date() - contractStartDate;
            const contractDurationPercentage = Math.min(
              Math.floor((elapsedTime / totalContractDuration) * 100),
              100
            );

            // Format dates
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const formattedJoiningDate = contractStartDate.toLocaleDateString('en-GB', options);
            const formattedContractStartDate = contractStartDate.toLocaleDateString('en-GB', options);
            const formattedContractEndDate = contractEndDate.toLocaleDateString('en-GB', options);

            // Map the fetched data to the existing state structure
            const consolidatedData = {
              name: fetchedData.registration.organizationName,
              type: fetchedData.registration.category,
              category: fetchedData.industrySector.category,
              logo: fetchedData.registration.companyLogo, // || nstpLogo,
              rentalSpaceSqft: fetchedData.industrySector.rentalSpaceSqFt + " sq ft",
              companyHeadquarters: fetchedData.companyProfile.companyHeadquarters,
              contactPerson: fetchedData.contactInfo.applicantName,
              contactEmail: fetchedData.contactInfo.applicantEmail,
              contactPhone: fetchedData.contactInfo.applicantPhone,
              joiningDate: formattedJoiningDate,
              contractStartDate: formattedContractStartDate,
              offices: fetchedData.offices,
              companyResourceComposition: fetchedData.companyResourceComposition,
              contractEndDate: formattedContractEndDate,

              totalEmployees: fetchedData.totalEmployees,
              activeEmployees: fetchedData.activeEmployees,
              cardsNotIssued: fetchedData.cardsNotIssued,
              cardsIssued: fetchedData.cardsIssued,
              interns: {
                nustian: fetchedData.nustianInterns,
                nonNustian: fetchedData.nonNustianInterns,
                total: fetchedData.nustianInterns + fetchedData.nonNustianInterns,
              },
              workPermits: fetchedData.workpermits,
              violations: fetchedData.violations,
              contractDuration: contractDurationPercentage,
              employees: fetchedData.employees,
              meetingMinutes: fetchedData.meetingMinutes,
              meetingMinutesMoney: fetchedData.meetingMinutesMoney,
              eTags: fetchedData.etags,
              gatePasses: fetchedData.gatepasses,
              notes: [ //fetching for admin means notes returned
                {
                  id: "1",
                  adminName: "Admin1",
                  date: "2022-10-10",
                  note: "This is a note from admin1",
                },
                {
                  id: "2",
                  adminName: "Admin2",
                  date: "2022-10-11",
                  note: "This is a note from admin2",
                },
              ],
              username: fetchedData.username,
            };
            console.log("setting company data to: ", consolidatedData)
            setCompanyData(consolidatedData);
          } else {
            showToast(false, response.error);
            setError(true)
            console.log("Error fetching company data:", response.error);
          }
        } else {
          // fetch for tenant
          const response = await TenantService.getProfile();
          if (!response.error) {
            const fetchedData = response.data.tenant;
            console.log("FETC", fetchedData)

            // Calculate contract end date (one month after joining date)
            const contractStartDate = new Date(fetchedData.dateJoining);
            const contractEndDate = new Date(contractStartDate);
            contractEndDate.setMonth(contractEndDate.getMonth() + 1); //PLACEHOLDER

            // Calculate contract duration and elapsed time
            const totalContractDuration = contractEndDate - contractStartDate;
            const elapsedTime = new Date() - contractStartDate;
            const contractDurationPercentage = Math.min(
              Math.floor((elapsedTime / totalContractDuration) * 100),
              100
            );

            // Format dates
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const formattedJoiningDate = contractStartDate.toLocaleDateString('en-GB', options);
            const formattedContractStartDate = contractStartDate.toLocaleDateString('en-GB', options);
            const formattedContractEndDate = contractEndDate.toLocaleDateString('en-GB', options);

            // Map the fetched data to the existing state structure
            const consolidatedData = {
              name: fetchedData.registration.organizationName,
              type: fetchedData.registration.category,
              category: fetchedData.industrySector.category,
              rentalSpaceSqft: fetchedData.industrySector.rentalSpaceSqFt + " sq ft",
              companyHeadquarters: fetchedData.companyProfile.companyHeadquarters,
              contactPerson: fetchedData.contactInfo.applicantName,
              contactEmail: fetchedData.contactInfo.applicantEmail,
              contactPhone: fetchedData.contactInfo.applicantPhone,
              joiningDate: formattedJoiningDate,
              contractStartDate: formattedContractStartDate,
              offices: fetchedData.offices,
              companyResourceComposition: fetchedData.companyResourceComposition,
              contractEndDate: formattedContractEndDate,
              totalEmployees: fetchedData.totalEmployees,
              activeEmployees: fetchedData.activeEmployees,
              cardsNotIssued: fetchedData.cardsNotIssued,
              cardsIssued: fetchedData.cardsIssued,
              interns: {
                nustian: fetchedData.nustianInterns,
                nonNustian: fetchedData.nonNustianInterns,
                total: fetchedData.nustianInterns + fetchedData.nonNustianInterns,
              },
              workPermits: fetchedData.workpermits,
              violations: fetchedData.violations,
              contractDuration: contractDurationPercentage,
              employees: fetchedData.employees,
              meetingMinutes: fetchedData.meetingMinutes,
              meetingMinutesMoney: fetchedData.meetingMinutesMoney,
              eTags: fetchedData.etags,
              gatePasses: fetchedData.gatepasses,
              notes: [
                {
                  id: "1",
                  adminName: "Admin1",
                  date: "2022-10-10",
                  note: "This is a note from admin1",
                },
                {
                  id: "2",
                  adminName: "Admin2",
                  date: "2022-10-11",
                  note: "This is a note from admin2",
                },
              ],
            };
            console.log("setting company data to: ", consolidatedData)
            setCompanyData(consolidatedData);
          } else {
            showToast(false, response.error);
            setError(true)
            console.log("Error fetching tenant data:", response.error);
          }
        }
      } catch (error) {
        setError(true)
        console.error("Error fetching company data:", error);
        showToast(false, "An error occurred while fetching company data.");
      } finally {
        setError(false)
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  const submitClearanceForm = async () => {
    setModalLoading(true);

    try {
      const response = await TenantService.initiateClearanceForm(formData);
      console.log("Response:", response);
      if (response.error) {
        console.error("Error submitting clearance form:", response.error);
        showToast(false, response.error);
        return;
      }
      console.log("Clearance form submitted successfully:", response.data.clearance);
      showToast(true, response.message);
    } catch (error) {
      console.error("Error submitting clearance form:", error);
      showToast(false, "An error occurred while submitting clearance form.");
    } finally {
      setModalLoading(false);
      document.getElementById('tenure-end-modal').close();
    }
  };

  //handle change for clearnace form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const sendFeedback = async () => {
    setModalLoading(true);
    // const deadline = new Date("2024-10-10T09:00:00.000Z");
    console.log("Deadline:", deadline);
    //deadline gona be in the format, 11:59 of the same date
    try {
      const response = await AdminService.requestEvaluation(companyId, deadline + "T23:59:00.000Z");
      if (response.error) {
        console.error("Error requesting evaluation:", response.error);
        showToast(false, response.error);
        return;
      }
      console.log("Evaluation requested successfully:", response.message);
      showToast(true, response.message);

    } catch (error) {
      console.error("Error sending feedback:", error);
      showToast(false, "An error occurred while sending feedback.");
    } finally {
      setModalLoading(false);
      document.getElementById('evaluation-feedback-modal').close();
    }
  }

  const handleStickyNoteInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHAR_COUNT) {
      setNoteContent(value);
      setCharCount(value.length);
      adjustTextareaHeight(e.target);
    }
  };

  const adjustTextareaHeight = (textarea) => {
    textarea.style.height = 'auto'; // Reset the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scroll height
  };

  const postNote = async () => {
    if (noteContent.trim() === '') {
      showToast(false, "Note cannot be empty.");
      return;
    }
    setModalLoading(true);
    //api call to post note
    console.log("Posting note:", noteContent);

    try {
      const response = await AdminService.addTenantNote(companyId, noteContent);
      if (response.error) {
        console.error("Error posting note:", response.error);
        showToast(false, response.error);
        return;
      }
      console.log("Note posted successfully:", response.data.note);
      showToast(true, response.message);
      // fetchAdminNotes();

    } catch (error) {
      console.error("Error posting note:", error);
      showToast(false, "An error occurred while posting note.");
    } finally {
      // Clear the fields
      setNoteContent('');
      setCharCount(0);
      // Close the modal
      document.getElementById('add-note-modal').close();
      setModalLoading(false);
    }
  }

  const uploadCompanyLogo = async () => {
    if (!logoToUpload) {
      showToast(false, "Please select a file to upload.");
      return;
    }

    setModalLoading(true);
    const formData = new FormData();
    formData.append('logo', logoToUpload);
    formData.append('tenantId', companyId);

    try {
      const response = await AdminService.uploadTenantLogo(formData);
      if (response.error) {
        console.log(response.error)
        showToast(false, response.error);
        return;
      }

      console.log("Logo uploaded successfully:", response.message);
      console.log(response.data.imageUrl)

      setCompanyData((prevData) => ({
        ...prevData,
        logo: response.data.imageUrl
      }));

      document.getElementById('upload-logo-modal').close();
      showToast(true, response.message);

    } catch (error) {
      console.error("Error uploading logo:", error);
      showToast(false, "An error occurred while uploading logo.");
    } finally {
      setModalLoading(false);
    }

    // Perform the upload logic here API CALLLSs

    // setTimeout(() => {
    //   showToast(true, "Successfully Uploaded Logo");
    //   setModalLoading(false);
    //   document.getElementById('upload-logo-modal').close();
    //   setLogoToUpload(null);
    //   setCompanyData((prevData) => ({
    //     ...prevData,
    //     logo: URL.createObjectURL(logoToUpload)
    //   }));
    // }, 2000);
  };

  return (
    <Sidebar>
      {loading && <NSTPLoader />}
      {error && <div className="alert alert-error">An error occurred while fetching company data.</div>}

      {/** DIALOGS */}
      {/* Terminate Confirmation Modal */}
      <dialog id="terminate-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Terminate Employee</h3>
          <p className="py-4">Are you sure you want to terminate the employee, {selectedEmployee?.name}?</p>
          <div className="modal-action">
            <button className="btn" onClick={() => document.getElementById('terminate-modal').close()}>Cancel</button>
            <button
              className="btn btn-error text-base-100"
              onClick={() => {
                terminateEmployee(selectedEmployee._id);
                document.getElementById('terminate-modal').close();
              }}
            >
              Confirm Termination
            </button>
          </div>
        </div>
      </dialog>

      {/*end tenure confirmation modal */}
      <dialog id="tenure-end-modal" className="modal">
        <div className="modal-box min-w-3xl max-w-3xl">
          <h3 className="font-bold text-lg mb-3">Clearance Form</h3>
          <form className='grid grid-cols-2 gap-3'>
            <FloatingLabelInput
              name="applicantName"
              type="text"
              id="applicantName"
              label="Applicant Name"
              value={formData.applicantName}
              onChange={handleInputChange}
            />
            <FloatingLabelInput
              name="applicantDesignation"
              type="text"
              id="applicantDesignation"
              label="Applicant Designation"
              value={formData.applicantDesignation}
              onChange={handleInputChange}
            />
            <FloatingLabelInput
              name="applicantCnic"
              type="text"
              id="applicantCnic"
              label="Applicant CNIC"
              value={formData.applicantCnic}
              onChange={handleInputChange}
            />
            <FloatingLabelInput
              name="officeNumber"
              type="text"
              id="officeNumber"
              label="Office Number"
              value={formData.officeNumber}
              onChange={handleInputChange}
            />
            <FloatingLabelInput
              name="vacatingDate"
              type="date"
              id="vacatingDate"
              label="Date for Vacating Office"
              value={formData.vacatingDate}
              onChange={handleInputChange}
            />
            <div className="col-span-2">
              <FloatingLabelInput
                name="reasonForLeaving"
                type="textarea"
                id="reasonForLeaving"
                label="Reason for Leaving"
                value={formData.reasonForLeaving}
                onChange={handleInputChange}
              />
            </div>
            <div role="alert" className="col-span-2 alert bg-yellow-300 bg-opacity-40 text-yellow-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Warning: This is a serious action. Proceed with caution!</span>
            </div>
          </form>
          <div className="modal-action">
            <button className="btn" onClick={() => document.getElementById('tenure-end-modal').close()}>Cancel</button>
            <button
              className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}
              onClick={(e) => {
                e.preventDefault();
                submitClearanceForm();
              }}
            >
              {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Submit"}
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="upload-logo-modal" className="modal">
        <div className="modal-box">
          <div className="flex flex-col gap-5">
            <h3 className="font-bold text-lg flex items-center">
              <ArrowUpTrayIcon className="size-8 text-primary mr-2" />
              Upload Company Logo</h3>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered"
              id="logo-upload"
              onChange={(e) => setLogoToUpload(e.target.files[0])}
            />
          </div>
          <div className="modal-action">
            <button className="btn" onClick={() => { setLogoToUpload(null); document.getElementById('upload-logo-modal').close() }}>Cancel</button>
            <button className={`btn btn-primary ${modalLoading && "btn-disabled"}`} onClick={uploadCompanyLogo}>
              {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Upload"}
            </button>
          </div>
        </div>
      </dialog>

      {/* add sticky note modal */}
      <dialog id="add-note-modal" className="modal bg-opacity-0">
        <div className="modal-box bg-opacity-0 shadow-none">
          <h3 className="font-bold text-lg"></h3>
          <div className="rounded-2xl shadow-lg bg-yellow-100 border-t-[10px] border-yellow-300 border-opacity-60">
            <textarea
              rows={5}
              placeholder="Type your note here..."
              className="my-2 textarea focus:outline-none focus:border-0 focus:ring-0 bg-opacity-0 w-full resize-none"
              value={noteContent}
              onChange={handleStickyNoteInputChange}
              onInput={(e) => adjustTextareaHeight(e.target)}
            />
          </div>

          <div className="modal-action mt-3 justify-between">
            <p className="text-right text-sm text-white ml-1 mt-1">{charCount}/{MAX_CHAR_COUNT}</p>
            <div className="flex gap-2">
              <button className="btn hover:bg-white shadow-lg" onClick={() => { setNoteContent(''); setCharCount(0); document.getElementById('add-note-modal').close() }}>Cancel</button>
              <button className={`btn btn-primary bg-light-primary hover:bg-light-primary shadow-lg ${(modalLoading || charCount <= 0) && "btn-disabled"}`}
                onClick={postNote}
              >
                {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Post Note"}
              </button>
            </div>
          </div>

        </div>
      </dialog>

      {/* Feedback modal with rejection date*/}
      <dialog id="evaluation-feedback-modal" className="modal">
        <div className="modal-box">
          <div className="flex items-center gap-2 mb-3">
            <ChatBubbleOvalLeftEllipsisIcon className="size-8 text-primary" />
            <h3 className="font-bold text-xl">Request Evaluation/Feedback</h3>
          </div>
          <p className="pb-4">Please enter deadline date and press confirm. The deadline will be 23:59 of the entered date.</p>
          <div className="flex gap-2 my-3 items-center">
            <p className="text-base font-bold">Deadline</p>
            <input type="date" placeholder='Deadline' className="input input-bordered w-full" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>

          <div className="modal-action">
            <button className="btn" onClick={() => document.getElementById('evaluation-feedback-modal').close()}>Cancel</button>
            <button className={`btn btn-primary ${modalLoading && "btn-disabled"}`} onClick={sendFeedback}>
              {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Confirm"}
            </button>
          </div>
        </div>
      </dialog>

      {/** Change password modal */}
      <dialog id="change-password-modal" className="modal">
        <form method="dialog" className="modal-box" onSubmit={changePassword}>
          <div className="flex items-center">
            <LockClosedIcon className="size-8 mr-2 text-primary" />
            <h3 className="font-bold text-lg">Change Password</h3>
          </div>
          <p>When your account is first created, your initial password is <strong>nstptenant</strong> </p>
          <div className="py-4">
            <div className="relative mb-4">
              <input
                type={passwordVisibility.currentPassword ? 'text' : 'password'}
                name="currentPassword"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                className="input input-bordered w-full"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('currentPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {passwordVisibility.currentPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type={passwordVisibility.newPassword ? 'text' : 'password'}
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className="input input-bordered w-full"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('newPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {passwordVisibility.newPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                className="input input-bordered w-full"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {passwordVisibility.confirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={handleCancelPassword}>Cancel</button>
            <button type="submit" className={`btn btn-primary text-base-100 ${modalLoading && "btn-disabled"}`}> {modalLoading && <span className="loading loading-spinner"></span>} {modalLoading ? "Please wait..." : "Submit"}</button>
          </div>
        </form>
      </dialog>

      {/* View Profile Modal */}
      <EmployeeProfileModal employeeProfileSelected={selectedEmployee} />

      {/** Confirm delete logo modal */}
      <DeleteConfirmationModal
        id="delete-logo-modal"
        title="Delete Company Logo"
        message="Are you sure you want to delete the company logo? This cannot be undone."
        onConfirm={confirmDeleteCompanyLogo}
        modalLoading={modalLoading}
      />

      {/** END DIALOGS */}

      {/** Side drawer for sticky notes */}
      <SideDrawer drawerContent={stickyNotes} setDrawerContent={setStickyNotes}  >

        {/** MAIN CONTENT */}
        <div className={`bg-base-100 rounded-md shadow-md p-5 lg:p-10 mt-10 ${loading && "hidden"}`}>

          {/** First row, company info and actions */}
          <div className="flex lg:flex-row flex-col ">
            {/* Header with company info, description, logo and join date */}
            <div className=" order-2 lg:order-1 flex max-sm:flex-col justify-start items-start gap-5">
              {companyData.logo ?
                <img src={companyData.logo} alt="Company Logo" className="size-48  rounded-lg ring-1 ring-gray-200" />
                :
                <div className="size-48 rounded-lg ring-1 ring-gray-200 bg-gray-200 flex items-center justify-center">
                  <p className="text-sm"> No Logo </p>
                </div>
              }
              <div className="">
                <h1 className="text-4xl font-semibold text-primary">{companyData.name}</h1>
                <div className='badge badge-secondary mt-2 mb-1'>{companyData.type}</div>
                <div className='badge badge-secondary mt-2 mb-1 ml-2'>{companyData.category}</div>
                {/* <p className="text-base text-secondary mt-2">{companyData.description}</p> */}

                <div className="flex flex-col md:flex-row gap-0 my-2">
                  <div className=" flex  items-center gap-1 bg-secondary p-1 rounded-lg rounded-tr-none rounded-br-none px-3 text-base-100"> <UserIcon className="size-4" /> {companyData.contactPerson} </div>
                  <div className=" flex  items-center gap-1  p-1 border border-primary border-r-0 border-l-0 px-3 text-primary font-bold"> <EnvelopeIcon className="size-4" /> {companyData.contactEmail} </div>
                  <div className=" flex  items-center gap-1  p-1 rounded-lg rounded-tl-none rounded-bl-none  px-3 text-primary font-bold border border-primary border-l-0 max-md:border-r-0 md:"> <PhoneIcon className="size-4" /> {companyData.contactPhone} </div>
                </div>
                <div className="flex gap-3">
                  <p className="text-base text-secondary">Rental Space: {companyData.rentalSpaceSqft} </p>
                  <p className="text-base text-secondary">Headquarters: {companyData.companyHeadquarters} </p>

                </div>
                <div className="flex flex-row gap-7 mt-2">
                  <div className="flex">
                    <CalendarIcon className="h-6 w-6 text-secondary" />
                    <span className="text-secondary ml-2 font-semibold">{"Joined on " + companyData.joiningDate}</span>
                  </div>
                  <div className="">Contract start: {companyData.contractStartDate}</div>
                  <div className="">Contract end: {companyData.contractEndDate}</div>
                </div>
              </div>
            </div>

            {/** ACTIONS dropdwon on right */}
            <div className=' order-1 lg:order-2 flex-1 flex lg:flex-col gap-3 justify-end lg:justify-normal lg:mb-0 mb-5 lg:items-end'>
              {role == "admin" &&
                (
                  <>
                    <button
                      className={`text-base-100 drawer-button btn-outline btn btn-primary ${notesLoading && "btn-disabled"} `}
                      onClick={async () => {
                        setNotesLoading(true);
                        await fetchAdminNotes();
                        setNotesLoading(false);
                        document.getElementById('sticky-notes-label').click();
                        toggleIfOpen('actions')
                      }} >
                      {notesLoading && <span className="loading loading-spinner"></span>}
                      {notesLoading ? "Fetching..." : "Admin Notes"}

                    </button>
                    <label id="sticky-notes-label" htmlFor='sticky-notes' className="hidden" ></label>
                  </>
                )
              }
              <div className="relative">
                <button
                  className="btn text-base-100 btn-primary"
                  onClick={() => toggleDropdown('actions')}
                >
                  Actions
                  {dropdownOpen['actions'] ? (
                    <ChevronUpIcon className="h-5 w-5" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5" />
                  )}
                </button>
                {dropdownOpen['actions'] && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <ul className="py-1">
                      {actions.map((action, index) => (
                        <li key={index}>
                          <button
                            className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={() => {
                              action.onClick();
                              toggleDropdown('actions');
                            }}
                          >
                            <action.icon className="h-5 w-5 mr-2" />
                            {action.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="my-5 text-gray-200"></hr>

          {/* First row (employee stats, numerical stats) */}
          <div className="grid md:grid-cols-2 gap-5 mt-5 ">
            <EmployeeStats
              total={companyData.totalEmployees}
              active={companyData.activeEmployees}
              cardsNotIssued={companyData.cardsNotIssued}
              cardsIssued={companyData.cardsIssued}
            />
            {/* Company Stats grid */}
            <div className="card p-5 grid divide-y divide-x divide-gray-200 grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <PresentationChartLineIcon className="inline-block h-8 w-8" />
                </div>
                <div className="stat-title">Meetings</div>
                <div className="stat-value">{companyData.meetingMinutes || "0"}</div>
                <div className="stat-desc">Minutes </div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <CurrencyDollarIcon className="inline-block h-8 w-8" />
                </div>
                <div className="stat-title">Meetings</div>
                <div className="stat-value">{companyData.meetingMinutesMoney || "0"}</div>
                <div className="stat-desc">PKR Outstanding</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <BriefcaseIcon className="inline-block h-8 w-8" />
                </div>
                <div className="stat-title">Work permits</div>
                <div className="stat-value">{companyData.workPermits}</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <ShieldExclamationIcon className="inline-block h-8 w-8" />
                </div>
                <div className="stat-title">Violations</div>
                <div className="stat-value">{companyData.violations}</div>
              </div>

            </div>
          </div>

          {/* second row (3 col stats) */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 mt-5 ">

            {/* internee stats and piechart */}
            <div className="mt-2 lg:col-span-1 md:col-span-2 sm:col-span-1 card p-5 flex flex-row justify-between items-start">
              <div>
                <span className="font-bold text-4xl flex flex-row items-center gap-2">
                  <UserGroupIcon className="size-7" /> {companyData.interns.total}
                </span>
                <p className="mb-3 mt-1 font-bold"> Internees </p>
                <div className="mb-2 p-2 rounded-md bg-accent text-white">{companyData.interns.nustian + " NUSTians"}</div>
                <div className="p-2 rounded-md bg-primary text-white">{companyData.interns.nonNustian + " Non NUSTians"}</div>
              </div>
              <div id="pie-chart">
                <ReactApexChart options={getPieChartOptions(companyData.interns)} series={getPieChartOptions(companyData.interns).series} type="pie" height={220} />
              </div>
            </div>

            {/* Contract duration stats and radial progress */}
            <div className="mt-2 card p-5 flex flex-col lg:flex-row lg:justify-between lg:items-center">
              <div>
                <span className="font-bold text-4xl flex flex-row items-center gap-2">
                  <CalendarDateRangeIcon className="size-7" /> {companyData.contractDuration + "%"}
                </span>
                <p className="mb-3 mt-1 font-bold"> Contract complete </p>
                <div className=""> <strong>Company Joining Date:  </strong>{companyData.joiningDate}</div>
                <span className="mt-2 block"><strong> Contract start:  </strong>{companyData.contractStartDate}</span>
                <span className="mt-2 block"><strong> Contract end: </strong> {companyData.contractEndDate}</span>
                <span className="mt-2 block"><strong> Total Stay: </strong> {calculateDuration(new Date(companyData.joiningDate), new Date())}</span>
              </div>
              <div>
                <div className={`radial-progress bg-neutral mt-10 lg:mt-0 ${companyData.contractDuration >= CONTRACT_DURATION_THRESHOLD ? "text-error" : "text-primary"}`} style={{ "--value": `${companyData.contractDuration}`, "--size": "7rem", "--thickness": "13px" }} role="progressbar">
                  {companyData.contractDuration}%
                </div>
              </div>
            </div>


            {/* Company Resource Composition */}
            <div className="mt-2 card p-5">
              <h2 className="text-xl font-bold mb-4">Company Resource Composition</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Management</h3>
                  <p>{companyData.companyResourceComposition?.management}%</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Engineering</h3>
                  <p>{companyData.companyResourceComposition?.engineering}%</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Marketing and Sales</h3>
                  <p>{companyData.companyResourceComposition?.marketingAndSales}%</p>
                </div>
                {/* <div>
                  <h3 className="text-lg font-semibold">Remaining Predominant Area</h3>
                  <p>{companyData.companyResourceComposition?.remainingPredominantArea}</p>
                </div> */}
                <div>
                  <h3 className="text-lg font-semibold">Areas of Research</h3>
                  <ul className="list-disc list-inside">
                    {companyData.companyResourceComposition?.areasOfResearch.split(';').map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
                {/* <div>
                  <h3 className="text-lg font-semibold">NUST School to Collaborate</h3>
                  <p>{companyData.companyResourceComposition?.nustSchoolToCollab}</p>
                </div> */}
              </div>
            </div>
          </div>

          {/** 3rd row (comparativeCharts of gatepasses and etags) */}
          <div className="grid md:grid-cols-2 gap-5 mt-5">
            <div className="card p-5">
              <ComparativeChart title="Gate Passes" comparisonData={companyData.gatePasses} />
            </div>
            <div className="card p-5">
              <ComparativeChart title="ETags" comparisonData={companyData.eTags} />
            </div>
          </div>
          <hr className="mt-12 mb-5 text-gray-200"></hr>
          {/* Employees list */}
          <div>
            <h1 className="text-2xl font-semibold mt-5">Employees</h1>
            {companyData.employees.length === 0 ? <div className="text-secondary">No employees found</div>
              :
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">

                {companyData.employees.map((employee) => (
                  <div key={employee._id} className="relative card p-5 flex flex-col gap-5 items-start group">
                    <div className="flex gap-2">
                      <div className="avatar">
                        <div className="w-20 rounded-full bg-gray-300">

                          {employee.photo ? <img src={employee.photo} alt={employee.name} /> :
                            <UserCircleIcon className="size-20 text-gray-400" />}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold">{employee.name}</h2>
                        <p className="text-sm text-gray-500">{employee.designation}</p>
                        <p className="text-sm text-gray-500">{"Joined on " + new Date(employee.date_joining).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-base-100 rounded-md bg-opacity-50 backdrop-blur-sm flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        <button
                          className="btn btn-primary text-base-100"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            document.getElementById('employee_profile').showModal();
                          }}
                        >
                          View Profile
                        </button>
                        {role == "tenant" && <button
                          className="btn btn-error text-base-100"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            document.getElementById('terminate-modal').showModal();
                          }}
                        >
                          Terminate
                        </button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </SideDrawer>
    </Sidebar>
  );
};

export default Company;