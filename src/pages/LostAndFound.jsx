import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/Sidebar";
import NSTPLoader from "../components/NSTPLoader";
import FloatingLabelInput from "../components/FloatingLabelInput";
import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { ReceptionistService, TenantService, AdminService } from "../services";
import { TowerContext } from "../context/TowerContext";
import showToast from "../util/toast";

const LostAndFound = ({ role }) => {
  const [loading, setLoading] = useState(true);
  const [lostItems, setLostItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("1");
  const [page, setPage] = useState(1);

  const [loadingMore, setLoadingMore] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    image: "",
  });
  const [expandedCard, setExpandedCard] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [errors, setErrors] = useState({});

  const { tower } = useContext(TowerContext);

  useEffect(() => {
    // Simulate API call to fetch data
    async function fetchData() {
      try {
        let response;
        if (role == "receptionist") {
          response = await ReceptionistService.getLostAndFound();
          if (response.error) {
            console.error("Error fetching lost items:", response.error);
            return;
          }
        } else if(role == "tenant") {
            response = await TenantService.getLostAndFound();
            if (response.error) {
                console.error("Error fetching lost items:", response.error);
                return;
            }
        } else if(role == "admin") {
            response = await AdminService.getLostAndFound(tower.id);
            if (response.error) {
                console.error("Error fetching lost items:", response.error);
                return;
            }
        }
        
        console.log("Lost Items:", response.data.lostAndFound);
        const mappedData = response.data.lostAndFound.map((item) => ({
          id: item._id,
          title: item.item,
          desc: item.description,
          dateAdded: new Date(item.date_found).toLocaleDateString(),
          photo: item.image || null,
          isClaimed: item.is_claimed, //boolean stores value if claimed or not
        }));

        setLostItems(mappedData);
      } catch (error) {
        console.error("Error fetching lost items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  /** add new complaint related funcs */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.desc) newErrors.desc = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setModalLoading(true);

    try {
      const response = await ReceptionistService.addLostAndFound(
        formData.title,
        formData.desc,
        formData.image
      );
      if (response.error) {
        console.error("Error adding lost item:", response.error);
        return;
      }
      console.log("Lost item added:", response.data);
      showToast(true, "Lost item added successfully");

      setLostItems((prevItems) => [
        {
          id: prevItems.length + 1,
          title: formData.title,
          desc: formData.desc,
          dateAdded: new Date().toISOString().split("T")[0],
        },
        ...prevItems,
      ]);
      setFormData({ title: "", desc: "", image: "" });
    } catch (error) {
      console.error("Error adding lost item:", error);
      showToast(false);
    } finally {
      setModalLoading(false);
      document.getElementById("item_form").close();
    }
  };

  /** load more items related funcs */
  const loadMoreItems = () => {
    setLoadingMore(true);
    // Simulate API call to load more items
    setTimeout(() => {
      setLostItems((prevItems) => [
        ...prevItems,
        {
          id: prevItems.length + 1,
          title: "Lost Item " + (prevItems.length + 1),
          desc: "Description of lost item " + (prevItems.length + 1),
          dateAdded: "2023-10-02",
        },
        // Add more dummy items here
      ]);
      setLoadingMore(false);
      setPage((prevPage) => prevPage + 1);
    }, 2000);
  };

  const filteredItems = lostItems
    .filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.dateAdded) - new Date(b.dateAdded)
        : new Date(b.dateAdded) - new Date(a.dateAdded)
    )
    .slice(0, page * 10);
  /** card click, delete or complete marking for receptionist */
  const handleCardClick = (itemId) => {
    setExpandedCard(expandedCard === itemId ? null : itemId);
  };

  const handleModalAction = (action, item) => {
    setModalAction(action);
    setSelectedItem(item);
    document.getElementById("confirmation-modal").showModal();
  };

  const confirmAction = () => {
    setModalLoading(true);
    console.log(selectedItem); //ITEM TO RESOLVE

    setTimeout(() => {
      //----- call this chunk of code after item has been marked as claimed successfully.
      setLostItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === selectedItem.id) {
            return { ...item, isClaimed: true };
          }
          return item;
        })
      );
      showToast(true, "Item marked as claimed successfully");
      setModalLoading(false);
      document.getElementById("confirmation-modal").close();
      setExpandedCard(null);

      //--------end chunk of code
    }, 2000);
  };

  return (
    <Sidebar>
      {loading && <NSTPLoader />}

      {/** form to add new item (recp only) */}
      <dialog id="item_form" className="modal">
        <div className="modal-box min-w-3xl max-w-3xl">
          <h3 className="font-bold text-lg mb-3">Register New Item</h3>

          <form onSubmit={handleSubmit}>
            <FloatingLabelInput
              name="title"
              type="text"
              id="title"
              label="Title"
              value={formData.title}
              onChange={handleInputChange}
              required={true}
            />
            {errors.title && (
              <span className="text-red-500 col-span-2">{errors.title}</span>
            )}

            <FloatingLabelInput
              name="desc"
              type="textarea"
              id="desc"
              label="Description"
              value={formData.desc}
              onChange={handleInputChange}
              required={true}
            />
            {errors.desc && (
              <span className="text-red-500 col-span-2">{errors.desc}</span>
            )}

            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs file-input-secondary"
            />
          </form>

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => {
                document.getElementById("item_form").close();
                setErrors({});
                setFormData({ title: "", desc: "", image: "" });
              }}
            >
              Cancel
            </button>
            <button
              className={`btn btn-primary text-base-100 ${
                modalLoading && "btn-disabled"
              }`}
              onClick={handleSubmit}
            >
              {modalLoading && (
                <span className="loading loading-spinner"></span>
              )}{" "}
              {modalLoading ? "Please wait..." : "Submit"}
            </button>
          </div>
        </div>
      </dialog>

      {/** confirmation modal for resolving/deleting a psot (recp only) */}
      <dialog id="confirmation-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Confirm {modalAction === "resolve" ? "Claim" : "Deletion"}
          </h3>
          <p className="py-4">
            Are you sure you want to {modalAction} this item and mark it as
            claimed?
          </p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() =>
                document.getElementById("confirmation-modal").close()
              }
            >
              Cancel
            </button>
            <button
              className={`btn btn-primary ${modalLoading && "btn-disabled"}`}
              onClick={confirmAction}
            >
              {modalLoading && (
                <span className="loading loading-spinner"></span>
              )}
              {modalLoading ? "Please wait..." : "Yes"}
            </button>
          </div>
        </div>
      </dialog>

      {/** main content */}
      <div
        className={`bg-base-100 mt-5 lg:mt-10 ring-1 ring-gray-200 p-5 pb-14 rounded-lg ${
          loading && "hidden"
        }`}
      >
        {/* Header + add new item btn */}
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold">Lost and Found</h1>
          {role == "receptionist" && (
            <button
              className="btn btn-primary text-white"
              onClick={() => document.getElementById("item_form").showModal()}
            >
              <PlusCircleIcon className="size-6" />
              Register new item
            </button>
          )}
        </div>

        {/* Search + Filter */}
        <div className="flex max-md:flex-col lg:flex-row lg:items-center lg:justify-between mt-4">
          <div className="relative w-full lg:max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="input input-bordered w-full pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>

          <button
            className="btn btn-outline mt-3 md:mt-0 md:ml-4"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            <ArrowsUpDownIcon className="h-5 w-5" />
            Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
        </div>

        {/* Lost Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-6">
              {filteredItems
                .filter((_, itemIndex) => itemIndex % 4 === colIndex)
                .map((item) => (
                  <div
                    key={item.id}
                    className="card transition-all duration-300  cursor-pointer bg-base-100 shadow-xl"
                    onClick={() => handleCardClick(item.id)}
                  >
                    {item.photo && (
                      <figure>
                        <img src={item.photo} alt={item.title} />
                      </figure>
                    )}
                    <div className="card-body">
                      <h2 className="card-title">
                        {item.title}
                        {item.isClaimed && (
                          <span>
                            <div className="badge badge-success text-base-100">
                              {" "}
                              <CheckIcon className="size-4" /> Claimed
                            </div>
                          </span>
                        )}
                      </h2>
                      <p>{item.desc}</p>
                      <p className="text-sm text-gray-500">{item.dateAdded}</p>
                      {expandedCard === item.id && (
                        <div className="mt-4 flex flex-wrap">
                          <button
                            className="btn btn-sm btn-outline btn-success mr-2"
                            onClick={() => handleModalAction("resolve", item)}
                          >
                            Mark as Claimed
                          </button>
                          {/* <button className="btn btn-sm btn-outline btn-error " onClick={() => handleModalAction('delete', item)}>Delete Posting</button> */}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {filteredItems.length < lostItems.length && (
          <div className="flex justify-center mt-6">
            <button
              className={`btn btn-primary text-base-100 ${
                loadingMore && "btn-disabled"
              }`}
              onClick={loadMoreItems}
            >
              {loadingMore && <span className="loading loading-spinner"></span>}
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default LostAndFound;
