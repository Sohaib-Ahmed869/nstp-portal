import React, { useEffect, useState, useContext } from "react";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  RocketLaunchIcon,
  WrenchScrewdriverIcon,
  CalendarDaysIcon,
  ChatBubbleLeftEllipsisIcon,
  PuzzlePieceIcon,
  TicketIcon,
  PresentationChartLineIcon,
  IdentificationIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  WrenchIcon,
  CircleStackIcon,
  NewspaperIcon,
  PencilSquareIcon,
  ClipboardDocumentIcon
} from "@heroicons/react/24/outline";
import { SidebarItem } from "./SidebarItem";
import { AuthContext } from '../context/AuthContext';

import nstpPng from '../assets/nstplogowhite.png'



const Sidebar = ({ children }) => {
  
  //States
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const { role, actions, evalRequested } = useContext(AuthContext);

  const sidebarConfig = {
    receptionist: [
      { icon: <HomeIcon />, text: "Dashboard", url: "/" },
      { icon: <CalendarDaysIcon />, text: "Bookings", url: "/bookings" },
      { icon: <WrenchScrewdriverIcon />, text: "Complaints", url: "/complaints" },
      { icon: <TicketIcon />, text: "Gate Passes", url: "/gate-passes" },
      { icon: <ClipboardDocumentCheckIcon />, text: "Work Permits", url: "/work-permits" },
      { icon: <PuzzlePieceIcon />, text: "Lost & Found", url: "/lost-and-found" },
      { icon: <ChatBubbleLeftEllipsisIcon />, text: "Occurences", url: "/occurences" },
    ],
    admin: [
      { icon: <HomeIcon />, text: "Dashboard", url: "/" },
      { icon: <UserGroupIcon />, text: "Companies", url: "/companies" },
      // { icon: <BuildingOfficeIcon /> , text: "Assign Office", url: "/assign-office" }, // this to be removed frm flow
      { icon: <TicketIcon />, text: "E-Tags", url: "/etags" },
      { icon: <ClipboardDocumentCheckIcon />, text: "Work Permits", url: "/work-permits" },
      // { icon: <CalendarDaysIcon />, text: "Bookings", url: "/bookings" },
      { icon: <PresentationChartLineIcon />, text: "Meeting Rooms", url: "/meeting-rooms" },
      { icon: <WrenchScrewdriverIcon />, text: "Services", url: "/services" },
      { icon: <IdentificationIcon />, text: "Cards", url: "/cards" },
      { icon: <ChatBubbleLeftEllipsisIcon />, text: "Complaints", url: "/complaints" },
      { icon: <CircleStackIcon />, text: "Receptionists", url: "/receptionists" },
      { icon: <NewspaperIcon />, text: "Clearance Requests", url: "/clearance" },
      { icon: <PencilSquareIcon />, text: "Blogs", url: "/blogs" },
      { icon: <ClipboardDocumentIcon />, text: "Evaluations", url: "/evaluations" },
      { icon: <RocketLaunchIcon />, text: "Opportunities", url: "/opportunities" },
    ],
    tenant: [
      { icon: <HomeIcon />, text: "Dashboard", url: "/" },
      { icon: <RocketLaunchIcon />, text: "Profile", url: "/profile" },
      { icon: <UserGroupIcon />, text: "Employees", url: "/employees" },
      { icon: <CalendarDaysIcon />, text: "Bookings", url: "/bookings" },
      { icon: <TicketIcon />, text: "Gate Passes", url: "/gate-passes" },
      { icon: <WrenchIcon />, text: "Work Permits", url: "/work-permits" },
      { icon: <PuzzlePieceIcon />, text: "Lost & Found", url: "/lost-and-found" },
      { icon: <ChatBubbleLeftEllipsisIcon />, text: "Complaints", url: "/complaints" },
      { icon: <ExclamationTriangleIcon />, text: "Occurences", url: "/occurences" },
      { icon: <TruckIcon />, text: "Parking", url: "/parking" },
      { icon: <ClipboardDocumentCheckIcon />, text: "Evaluations", url: "/evaluations", notif: evalRequested },
    ],
  };

  const getSidebarItems = (role) => {
    return sidebarConfig[role]?.map(item => ({
      ...item,
      url: `/${role}${item.url}`
    })) || [];
  };

  const sidebarItems = getSidebarItems(role);

  const toggleDrawer = () => {
    setIsExpanded(!isExpanded);
  };

  const closeDrawer = () => {
    if (isExpanded) {
      toggleDrawer();
    }
  };

  useEffect(() => {
    //if there are more than  2 slashes , ignore the 3rd slash and the text after it
    if (window.location.pathname.split("/").length > 3) {
      setSelectedItem(`/${window.location.pathname.split("/")[1]}/${window.location.pathname.split("/")[2]}`);
    } else {
      setSelectedItem(window.location.pathname);
    }

    console.log("Eval requested", evalRequested);
  }, [selectedItem]);

  return (
    <div className="min-h-[100vh] bg-base-200 bg-opacity-20">
      {/* Sidebar for screens medium and above */}
      <div className="flex h-full max-sm:hidden">
        {/* Overlay */}
        {isExpanded && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-35 z-20"
            onClick={closeDrawer}
          ></div>
        )}
        <div
          className={`${isExpanded ? "w-64" : "w-20"
            } h-screen bg-neutral transition-width duration-300 overflow-hidden fixed top-0 z-30`}
        >
          <nav className="h-full">
            <ul
              className={`menu h-full ${isExpanded ? "w-64" : "w-20"
                } bg-primary text-white min-h-full w-60 pt-4 pl-4 pb-4 pr-0 flex flex-col justify-between`}
            >
              <div>

                <img src={nstpPng} className="w-12 h-auto mb-3 " alt="NSTP Logo" />

                <li className="sidebar-item w-10" onClick={toggleDrawer}>
                  <a className="flex items-center">
                    <button className="p-0 ">
                      {isExpanded ? (
                        <ChevronLeftIcon className="h-6 w-6" />
                      ) : (
                        <ChevronRightIcon className="h-6 w-6" />
                      )}
                    </button>
                  </a>
                </li>
              </div>

              <div>
                {sidebarItems.map((item, index) => (
                  <SidebarItem
                    key={index}
                    icon={item.icon}
                    text={item.text}
                    url={item.url}
                    setSelectedItem={setSelectedItem}
                    selectedItem={selectedItem}
                    isExpanded={isExpanded}
                    notif={item.notif}
                  />
                ))}
              </div>
              <div>
                <SidebarItem
                  icon={<ArrowLeftStartOnRectangleIcon />}
                  text={"Logout"}
                  url="/logout"
                  setSelectedItem={setSelectedItem}
                  selectedItem={selectedItem}
                  isExpanded={isExpanded}
                />
              </div>
            </ul>
          </nav>
        </div>
        <div className="flex-grow p-16  xl:px-20 3xl:px-36 pt-0 ml-20 overflow-auto ">
          {children /* this is where the page content will be rendered. */}
        </div>
      </div>

      {/* Navbar with drawer for small screens*/}
      <div className="drawer sm:hidden">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Navbar with drawer for smalls screens */}
          <div className="navbar bg-primary text-white drop-shadow-md mb-2">
            <div className="flex-1">
              <label
                htmlFor="my-drawer"
                className="btn btn-ghost drawer-button "
              >
                <Bars3Icon className="h-6 w-6" />
              </label>
            </div>
            <div className="flex-none">
              <img src={nstpPng} className="h-11 w-auto m-2" alt="NSTP Logo" />
            </div>
          </div>
          {/* Page content here for small screens */}
          <div className="p-8">{children}</div>
        </div>
        {/** side drawer for small screens */}
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-primary text-white min-h-full w-80 p-4 flex flex-col justify-between">
            <div>
              <img src={nstpPng} className="h-16 w-auto m-2" alt="NSTP Logo" />
            </div>

            <div>
              {sidebarItems.map((item, index) => (
                <SidebarItem
                  key={index}
                  icon={item.icon}
                  text={item.text}
                  url={item.url}
                  setSelectedItem={setSelectedItem}
                  selectedItem={selectedItem}
                  isExpanded={isExpanded}
                />
              ))}
            </div>
            <div>
              <SidebarItem
                icon={<ArrowLeftStartOnRectangleIcon />}
                text={"Logout"}
                url="/logout"
                setSelectedItem={setSelectedItem}
                selectedItem={selectedItem}
                isExpanded={isExpanded}
              />
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;