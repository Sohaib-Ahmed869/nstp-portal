import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import { UserPlusIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Employees = () => {
  const [loading, setLoading] = useState(true);
  const dropdownRefs = useRef({});
  const [employeeTableData, setEmployeeTableData] = useState([
    {
      id: 1,
      tenant_id: '123',
      tenant_name: 'Tenant A',
      email: 'hart@example.com',
      name: 'Hart Hagerty',
      photo: 'photo_url',
      designation: 'Engineer',
      cnic: '12345-6789012-3',
      dob: '1990-01-01',
      date_joining: '2020-01-01',
      contract_type: 'Permanent',
      contract_end: '2025-01-01',
      status_employment: true,
      is_nustian: true,
      e_tags: '21',
      gate_entries: 'Purple',
      work_permit: 'Purple',
      card_num: '1234567890',
    },
    {
      id: 2,
      tenant_id: '124',
      tenant_name: 'Tenant B',
      email: 'brice@example.com',
      name: 'Brice Swyre',
      photo: 'photo_url',
      designation: 'Tax Accountant',
      cnic: '12345-6789012-4',
      dob: '1985-05-05',
      date_joining: '2019-05-05',
      contract_type: 'Contract',
      contract_end: '2023-05-05',
      status_employment: true,
      is_nustian: false,
      e_tags: 'Tax Accountant',
      gate_entries: 'Red',
      work_permit: 'Purple',
      card_num: null,
    },
    {
      id: 3,
      tenant_id: '124',
      tenant_name: 'Tenant B',
      email: 'brice@example.com',
      name: 'Brice Swyre',
      photo: 'photo_url',
      designation: 'Tax Accountant',
      cnic: '12345-6789012-4',
      dob: '1985-05-05',
      date_joining: '2019-05-05',
      contract_type: 'Contract',
      contract_end: '2023-05-05',
      status_employment: true,
      is_nustian: false,
      e_tags: 'Tax Accountant',
      gate_entries: 'Red',
      work_permit: 'Purple',
      card_num: "Awaiting Approval",
    },
    // Add more dummy data as needed
  ]);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSortChange = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const filteredData = employeeTableData
    .filter((row) => {
      if (filter === 'All') return true;
      return row.status_employment === (filter === 'Active');
    })
    .filter((row) => {
      return (
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.designation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'designation', label: 'Designation' },
    { key: 'cnic', label: 'CNIC' },
    { key: 'dob', label: 'DOB' },
    { key: 'date_joining', label: 'Date Joining' },
    { key: 'contract_type', label: 'Contract Type' },
    { key: 'contract_end', label: 'Contract End' },
    { key: 'status_employment', label: 'Status Employment' },
    { key: 'is_nustian', label: 'Is Nustian' },
    { key: 'e_tags', label: 'E tags' },
    { key: 'gate_entries', label: 'Gate Entries' },
    { key: 'work_permit', label: 'Work Permit' },
    { key: 'card_num', label: 'Card Num' },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach((id) => {
        if (dropdownRefs.current[id] && !dropdownRefs.current[id].contains(event.target)) {
          setDropdownOpen((prevState) => ({
            ...prevState,
            [id]: false,
          }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Sidebar>
      {loading && <NSTPLoader />}
      <div className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && 'hidden'}`}>
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Employees</h1>
          <button className="btn btn-primary text-white">
            <UserPlusIcon className="size-6" />
            Add New Employee
          </button>
        </div>
        <div className="flex flex-row items-center justify-between mt-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="input input-bordered w-full max-w-xs"
          />
          <select value={filter} onChange={handleFilterChange} className="select select-bordered w-full max-w-xs">
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        {employeeTableData.length === 0 ? (
          <p className="text-gray-500">No data to show for now.</p>
        ) : (
          <div className="h-full min-h-content overflow-y-auto">
            <p className="my-2 text-gray-500 text-sm">Click on any column header to sort data</p>
            <table className="table mt-5 min-h-full rounded-lg overflow-clip">
              <thead>
                <tr className="bg-base-200 cursor-pointer">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      onClick={() => column.sortable !== false && handleSortChange(column.key)}
                    >
                      {sortField === column.key ? sortOrder === 'asc' ? '▲' : '▼' : ''}
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={row.id} className="relative group">
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.designation}</td>
                    <td>{row.cnic}</td>
                    <td>{new Date(row.dob).toLocaleDateString()}</td>
                    <td>{new Date(row.date_joining).toLocaleDateString()}</td>
                    <td>{row.contract_type}</td>
                    <td>{row.contract_end ? new Date(row.contract_end).toLocaleDateString() : '-'}</td>
                    <td>{row.status_employment ? 'Active' : 'Inactive'}</td>
                    <td>{row.is_nustian ? 'Yes' : 'No'}</td>
                    <td>{row.e_tags}</td>
                    <td>{row.gate_entries}</td>
                    <td>{row.work_permit}</td>
                    <td className={`${row.card_num && row.card_num === 'Awaiting Approval' ? 'bg-yellow-100 text-yellow-900' : ''}`}>
                      {row.card_num ? row.card_num : '-'}
                    </td>
                    <td className="relative">
                      <button
                        className="btn btn-outline btn-primary btn-sm"
                        onClick={() => toggleDropdown(row.id)}
                      >
                        {dropdownOpen[row.id] ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                      </button>
                      {dropdownOpen[row.id] && (
                        <div
                          ref={(el) => (dropdownRefs.current[row.id] = el)}
                          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                        >
                          <ul className="py-1">
                            {!row.card_num && (
                              <li>
                                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                  Request card
                                </button>
                              </li>
                            )}
                            <li>
                              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                Layoff
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default Employees;