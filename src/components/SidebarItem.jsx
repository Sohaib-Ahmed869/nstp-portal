import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";

const TooltipPortal = ({ children, target }) => {
  return ReactDOM.createPortal(children, target);
};

const SidebarItem = ({
  icon,
  text,
  url,
  setSelectedItem,
  selectedItem,
  isExpanded,
  notif
}) => {
  const tooltipRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);


  return (
    <Link to={url} onClick={() => setSelectedItem(url)}>
      <li className={`sidebar-item ${selectedItem == url ? "border-l-primary border-l-4 rounded-lg bg-base-100  " : ""}`}>
        <a className={`flex items-center ${selectedItem == url && "bg-base-200 bg-opacity-20"} `}>
          <div
            ref={tooltipRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative"
          >
            <div className="relative">
              {React.cloneElement(icon, {
                className: `h-6 w-6 ${selectedItem == url ? "text-primary" : ""}`,
              })}
              {notif && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </div>
            {!isExpanded && isHovered && (
              <TooltipPortal target={document.body}>
                <div
                  className="badge badge-neutral p-2 transition-opacity ease-in-out duration-300"
                  data-tip={text}
                  style={{
                    position: "absolute",
                    top: tooltipRef.current?.getBoundingClientRect().top,
                    left:
                      tooltipRef.current?.getBoundingClientRect().right + 30,
                  }}
                >
                  {text}
                </div>
              </TooltipPortal>
            )}
          </div>
          <span
            className={`ml-4 sidebar-text ${selectedItem == url ? "text-primary" : ""
              }`}
          >
            {text}
          </span>
        </a>
      </li>
    </Link>
  );
};

export { SidebarItem };