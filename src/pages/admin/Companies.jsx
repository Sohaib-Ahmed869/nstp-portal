import React, { useEffect, useState, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import NSTPLoader from '../../components/NSTPLoader';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, PlusCircleIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/20/solid';
import { AdminService } from '../../services';
import { TowerContext } from '../../context/TowerContext';

const COLUMNS = ['no', 'name', 'category', 'registrationNum', 'email', 'noEmployees', 'industryCategory', 'noComplaints'];
const COMPANY_CATEGORIES = ['Company', 'Cube 8', 'Hatch 8', 'Startup'];

const Companies = () => {
  const [companiesTableData, setCompaniesTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const { tower } = useContext(TowerContext);

  // Handle search change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle sort change
  const handleSortChange = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page on sort change
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // API call here
        const response = await AdminService.getTenants(tower.id);
        console.log("🚀 ~ fetchData ~ response:", response);

        if (response.error) {
          console.error("Error fetching tenants:", response.response);
          return;
        }

        // Extract required data
        const companiesData = response.data.tenants.map((tenant) => ({
          id: tenant._id,
          name: tenant.registration.organizationName,
          category: tenant.registration.category,
          registrationNum: tenant.companyProfile.registrationNumber,
          email: tenant.registration.companyEmail,
          noEmployees: tenant.companyProfile.numberOfEmployees,
          industryCategory: tenant.industrySector.category,
          noComplaints: tenant.complaints.length,
        }));

        setCompaniesTableData(companiesData);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tower.id]);

  // Re-render when table data is updated or search/filter is applied
  useEffect(() => {
    const filtered = companiesTableData
      .filter((company) => company.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((company) => filter === 'All' || company.category === filter)
      .sort((a, b) => {
        if (!sortField) return 0;
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const total = Math.ceil(filtered.length / itemsPerPage);

    setFilteredData(filtered);
    setPaginatedData(paginated);
    setTotalPages(total);
  }, [companiesTableData, itemsPerPage, searchQuery, filter, sortField, sortOrder, currentPage]);

  return (
    <Sidebar>
      {loading && <NSTPLoader />}
      <div className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${loading && "hidden"}`}>
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Companies</h1>
          <Link to="/admin/add-company" className='max-sm:w-1/2 max-[450px]:w-full'>
                      <button className="btn btn-primary btn-md max-sm:btn-block max-sm:btn-sm text-white">
                        <PlusCircleIcon className="size-6 max-[450px]:hidden"></PlusCircleIcon> Add Company
                      </button>
                    </Link>
        </div>

        {/* Search & filter */}
        <div className="flex flex-row max-sm:flex-col items-center justify-between mt-4">
          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="input input-bordered w-full pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
          <div className="w-full md:w-4/12 flex items-center justify-end">
            <AdjustmentsHorizontalIcon className="size-8 text-gray-400 mr-3" />
            <select value={filter} onChange={handleFilterChange} className="select select-bordered w-full md:max-w-xs max-sm:mt-2">
              <option value="All">All</option>
              {COMPANY_CATEGORIES.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <p className="text-gray-500 mt-10">No data to show for now.</p>
        ) : (
          <div className="h-full min-h-content overflow-y-auto">
            <p className="my-2 text-gray-500 text-sm">Click on any column header to sort data</p>
            <table className="table mt-5 min-h-full rounded-lg mb-9">
              <thead>
                <tr className="bg-base-200 cursor-pointer">
                  {COLUMNS.map((field) => (
                    <th key={field} onClick={() => handleSortChange(field)}>
                      {sortField === field ? (sortOrder === 'asc' ? '▲' : '▼') : ''} {field.charAt(0).toUpperCase() + field.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((company, index) => (
                  <tr key={company.id} className="relative group">
                    <td className="text-primary">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{company.name}</td>
                    <td>{company.category}</td>
                    <td>{company.registrationNum}</td>
                    <td>{company.email}</td>
                    <td>{company.noEmployees}</td>
                    <td>{company.industryCategory}</td>
                    <td>{company.noComplaints}</td>
                    <div className="absolute inset-0  flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/admin/companies/${company.id}`} className="btn btn-ghost w-full backdrop-blur-sm ">
                        <EyeIcon className="h-5 w-5" />
                        <span>{"View " + company.name + " company page"}</span>
                      </Link>
                    </div>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <button
                className="btn btn-outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div className="flex flex-col items-center justify-center">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <span className="font-bold text-sm">
                  Showing {Math.min(itemsPerPage, filteredData.length - (currentPage - 1) * itemsPerPage)} of {filteredData.length} companies
                </span>
              </div>
              <button
                className="btn btn-outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default Companies;