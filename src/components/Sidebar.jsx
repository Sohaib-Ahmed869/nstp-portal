import React, { useEffect, useState } from "react";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserPlusIcon,
  HomeIcon,
  CircleStackIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  RocketLaunchIcon,
  WrenchScrewdriverIcon,
  TrophyIcon,
  DocumentIcon
} from "@heroicons/react/24/outline";
import { SidebarItem } from "./SidebarItem";

import nstpPng from '../assets/nstplogowhite.png'

const sidebarItems = [
  { icon: <HomeIcon />, text: "Home", url: "home" },
  { icon: <ChartBarIcon />, text: "Dashboard", url: "dashboard" },
  { icon: <UserPlusIcon />, text: "Registration", url: "registration" },
  { icon: <CircleStackIcon />, text: "Resources", url: "resources" },
  { icon: <TruckIcon />, text: "Parking", url: "parking" },
  { icon: <ClipboardDocumentCheckIcon />, text: "Assessment", url: "assessment" },
  { icon: <WrenchScrewdriverIcon />, text: "Services", url: "services" },
  { icon: <RocketLaunchIcon />, text: "Opportunities", url: "opportunities" },
  { icon: <DocumentIcon />, text: "Request", url: "request" },
  { icon: <TrophyIcon />, text: "Performance", url: "performance" },
];

const Sidebar = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const toggleDrawer = () => {
    setIsExpanded(!isExpanded);
  };

  const closeDrawer = () => {
    if (isExpanded) {
      toggleDrawer();
    }
  };

  useEffect(() => {
    setSelectedItem(window.location.pathname);

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
        <div className="flex-grow p-16 pt-0 ml-20 overflow-auto">
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
          {/* Page content here */}
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