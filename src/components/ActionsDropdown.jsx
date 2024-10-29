import React, {useContext, useState} from 'react'
//import all icons needed
import { ArrowDownTrayIcon, ArrowUpTrayIcon, ChatBubbleLeftRightIcon, DocumentCheckIcon, DocumentIcon, LockClosedIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, } from '@heroicons/react/24/outline';
import { saveAs } from 'file-saver';
import { AuthContext } from '../context/AuthContext';

/**
|--------------------------------------------------
| Actions Dropdown on company profile page
|  options for both tenants and admins
|--------------------------------------------------
*/
const ActionsDropdown = ({companyData}) => {

    const {role} = useContext(AuthContext)
    
  //dropdwown
  const [dropdownOpen, setDropdownOpen] = useState({});

    const actions = role == "admin" ? [
        {
          text: 'Add Note',
          icon: DocumentIcon,
          onClick: () => {
            document.getElementById('add-note-modal').showModal();
          }
        },
        companyData?.logo ? {
          text: 'Download Logo',
          icon: ArrowDownTrayIcon,
          onClick: () => {
            downloadLogo();
          },
        } : null,
        companyData?.logo ? {
          text: 'Delete Logo',
          icon: TrashIcon,
          onClick: () => {
            deleteCompanyLogo();
          }
        } : null,
        !(companyData?.logo && companyData?.logo != null) ? {
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
    
  const downloadLogo = async () => {
    try {
      saveAs(companyData?.logo, `${companyData?.username}_logo.png`);

      showToast(true, "Company logo downloaded");
    } catch (error) {
      console.error('Download error:', error);
      showToast(false, "Failed to download logo");
    }
  };

  
  const deleteCompanyLogo = () => {
    document.getElementById('delete-logo-modal').showModal();
  }

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


  return (
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
  )
}

export default ActionsDropdown
