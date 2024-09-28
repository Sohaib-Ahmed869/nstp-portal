import React, { useEffect, useState, useContext } from 'react'
import Sidebar from '../../components/Sidebar'
import NSTPLoader from '../../components/NSTPLoader';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, ChevronUpIcon, ChevronDownIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { EyeIcon } from '@heroicons/react/20/solid';
import { AdminService } from '../../services';
import { TowerContext } from '../../context/TowerContext';

const COLUMNS = ['no', 'name', 'category', 'noEmployees', 'noInterns', 'workPasses', 'gatePasses']
const COMPANY_CATEGORIES = ['Startup', 'Company', 'Hatch8'];

const Companies = () => {
  const [companiesTableData, setCompaniesTableData] = useState([
    { id: "12", name: "Hexler", category: "Startup", noEmployees: 10, noInterns: 84, workPasses: 2, gatePasses: 12 },
    { id: "13", name: "AgriTech", category: "Startup", noEmployees: 10, noInterns: 3, workPasses: 12, gatePasses: 2 },
    { id: "14", name: "PinkFly", category: "Company", noEmployees: 20, noInterns: 3, workPasses: 2, gatePasses: 2 },
    { id: "15", name: "Zambeel", category: "Startup", noEmployees: 10, noInterns: 13, workPasses: 24, gatePasses: 2 },
    { id: "16", name: "InnoSolution", category: "Company", noEmployees: 13, noInterns: 3, workPasses: 2, gatePasses: 2 },
    { id: "17", name: "NanoTech", category: "Hatch8", noEmployees: 10, noInterns: 3, workPasses: 12, gatePasses: 12 },
    { id: "18", name: "GrowFly", category: "Hatch8", noEmployees: 14, noInterns: 3, workPasses: 24, gatePasses: 2 },
    { id: "19", name: "BigPal", category: "Startup", noEmployees: 10, noInterns: 13, workPasses: 12, gatePasses: 2 },
    { id: "20", name: "FashionMashion", category: "Startup", noEmployees: 140, noInterns: 3, workPasses: 12, gatePasses: 24 },
    { id: "21", name: "TechSolutions", category: "Company", noEmployees: 10, noInterns: 3, workPasses: 2, gatePasses: 2 },
    { id: "22", name: "InnoTech", category: "Company", noEmployees: 10, noInterns: 3, workPasses: 2, gatePasses: 2 },
    { id: "23", name: "TechFly", category: "Startup", noEmployees: 10, noInterns: 3, workPasses: 2, gatePasses: 2 },
    { id: "24", name: "TechPal", category: "Startup", noEmployees: 10, noInterns: 3, workPasses: 2, gatePasses: 2 },
    { id: "25", name: "TechMashion", category: "Company", noEmployees: 10, noInterns: 3, workPasses: 2, gatePasses: 2 },
    { id: "26", name: "TechSolutions", category: "Company", noEmployees: 10, noInterns: 3, workPasses: 2, gatePasses: 2 },
    { id: "27", name: "TechTech", category: "Startup", noEmployees: 10, noInterns: 3, workPasses: 2, gatePasses: 2 },

  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)

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
        console.log("🚀 ~ fetchData ~ tower:", tower)
        const response = await AdminService.getTenants(tower.id);
        console.log("🚀 ~ fetchData ~ response:", response)

        if(response.error) {
          console.error("Error fetching tenants:", response.response);
          return;
        }


        
        
        // Assuming response.data contains the data you need
        // setCompaniesTableData(response.data);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  // re render when table data is updated or search/fitler is applied
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
          <p className="text-gray-500">No data to show for now.</p>
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
                    <td>{company.noEmployees}</td>
                    <td>{company.noInterns}</td>
                    <td>{company.workPasses}</td>
                    <td>{company.gatePasses}</td>
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