import React from "react";
import { useState } from "react";
import nstpLogoColored from "../assets/nstplogocolored.png";
import AuthService from "../services/AuthService";

const SidebarElement = ({ role, handleSidebarClick, icon, text }) => {
  return (
    <div
      className="flex flex-col items-center justify-center mx-10 max-sm:mx-0"
      onClick={() => {
        handleSidebarClick(text);
      }}
    >
      {icon}
      <p
        className={`font-semibold ${role == text ? "text-[#3d5e5a]" : "text-white"
          } transition-colors ease-in-out`}
      >
        {text}
      </p>
    </div>
  );
};

const LoginPage = () => {
  const [role, setRole] = useState("Reception");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sidebarElements = [
    {
      role: "Reception",
      icon: (
        <svg
          className="size-14 max-sm:size-8"
          viewBox="0 0 59 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.1875 32.125C0.1875 31.6774 0.408091 31.2482 0.800745 30.9318C1.1934 30.6153 1.72595 30.4375 2.28125 30.4375H4.375V27.0625C4.38263 21.9859 6.75289 17.0963 11.0173 13.3601C15.2817 9.62396 21.13 7.31308 27.4062 6.88422V3.4375H23.2188C22.6635 3.4375 22.1309 3.25971 21.7382 2.94324C21.3456 2.62677 21.125 2.19755 21.125 1.75C21.125 1.30245 21.3456 0.873225 21.7382 0.556757C22.1309 0.24029 22.6635 0.0625 23.2188 0.0625H35.7812C36.3365 0.0625 36.8691 0.24029 37.2618 0.556757C37.6544 0.873225 37.875 1.30245 37.875 1.75C37.875 2.19755 37.6544 2.62677 37.2618 2.94324C36.8691 3.25971 36.3365 3.4375 35.7812 3.4375H31.5938V6.88422C37.87 7.31308 43.7183 9.62396 47.9827 13.3601C52.2471 17.0963 54.6174 21.9859 54.625 27.0625V30.4375H56.7188C57.274 30.4375 57.8066 30.6153 58.1993 30.9318C58.5919 31.2482 58.8125 31.6774 58.8125 32.125C58.8125 32.5726 58.5919 33.0018 58.1993 33.3182C57.8066 33.6347 57.274 33.8125 56.7188 33.8125H2.28125C1.72595 33.8125 1.1934 33.6347 0.800745 33.3182C0.408091 33.0018 0.1875 32.5726 0.1875 32.125ZM56.7188 37.1875H2.28125C1.72595 37.1875 1.1934 37.3653 0.800745 37.6818C0.408091 37.9982 0.1875 38.4274 0.1875 38.875C0.1875 39.3226 0.408091 39.7518 0.800745 40.0682C1.1934 40.3847 1.72595 40.5625 2.28125 40.5625H56.7188C57.274 40.5625 57.8066 40.3847 58.1993 40.0682C58.5919 39.7518 58.8125 39.3226 58.8125 38.875C58.8125 38.4274 58.5919 37.9982 58.1993 37.6818C57.8066 37.3653 57.274 37.1875 56.7188 37.1875Z"
            fill={`${role == "Reception" ? "#3d5e5a" : "white"}`}
          />
        </svg>
      ),
    },
    {
      role: "Admin",
      icon: (
        <svg
          className="size-14 max-sm:size-8"
          viewBox="0 0 61 68"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30.5 0.0834961L0.875 12.4168V30.9168C0.875 48.0293 13.515 64.0318 30.5 67.9168C47.485 64.0318 60.125 48.0293 60.125 30.9168V12.4168L30.5 0.0834961ZM30.5 12.1085C32.4531 12.1085 34.3623 12.651 35.9863 13.6674C37.6102 14.6838 38.8759 16.1285 39.6233 17.8187C40.3707 19.5089 40.5663 21.3688 40.1853 23.1631C39.8042 24.9574 38.8637 26.6056 37.4827 27.8992C36.1016 29.1929 34.3421 30.0738 32.4265 30.4308C30.511 30.7877 28.5254 30.6045 26.721 29.9044C24.9166 29.2043 23.3743 28.0187 22.2892 26.4975C21.2042 24.9764 20.625 23.188 20.625 21.3585C20.625 18.9052 21.6654 16.5525 23.5173 14.8178C25.3692 13.083 27.881 12.1085 30.5 12.1085ZM30.5 36.4668C37.0833 36.4668 50.25 39.8277 50.25 45.9635C48.0881 49.0164 45.1533 51.5206 41.7072 53.253C38.2612 54.9854 34.411 55.892 30.5 55.892C26.589 55.892 22.7388 54.9854 19.2928 53.253C15.8467 51.5206 12.9119 49.0164 10.75 45.9635C10.75 39.8277 23.9167 36.4668 30.5 36.4668Z"
            fill={`${role == "Admin" ? "#3d5e5a" : "white"}`}
          />
        </svg>
      ),
    },
    {
      role: "Supervisor",
      icon: (
        <svg
          className="size-14 max-sm:size-8"
          viewBox="0 0 67 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M33.4997 0.333496C15.2968 0.333496 0.583008 14.5835 0.583008 32.0002C0.583008 40.3987 4.051 48.4532 10.2241 54.3919C13.2807 57.3324 16.9094 59.665 20.903 61.2564C24.8966 62.8478 29.177 63.6668 33.4997 63.6668C42.2297 63.6668 50.6022 60.3305 56.7753 54.3919C62.9483 48.4532 66.4163 40.3987 66.4163 32.0002C66.4163 27.8416 65.5649 23.7238 63.9107 19.8819C62.2565 16.0399 59.8319 12.549 56.7753 9.60845C53.7187 6.66793 50.09 4.33538 46.0963 2.74398C42.1027 1.15258 37.8224 0.333496 33.4997 0.333496ZM45.3497 20.4102C48.8718 20.4102 51.7026 23.1335 51.7026 26.5218C51.7026 29.9102 48.8718 32.6335 45.3497 32.6335C43.6648 32.6335 42.0489 31.9896 40.8575 30.8434C39.6661 29.6973 38.9968 28.1427 38.9968 26.5218C38.9638 23.1335 41.8276 20.4102 45.3497 20.4102ZM25.5997 15.4068C29.8788 15.4068 33.368 18.7635 33.368 22.8802C33.368 26.9968 29.8788 30.4168 25.5997 30.4168C21.3205 30.4168 17.8313 26.9968 17.8313 22.8802C17.8313 18.7318 21.2876 15.4068 25.5997 15.4068ZM25.5997 44.3185V56.1935C17.6997 53.8185 11.4455 47.9602 8.68051 40.4868C12.1038 36.9402 20.7609 35.1668 25.5997 35.1668C27.3443 35.1668 29.5497 35.3885 31.8538 35.8318C26.4555 38.5868 25.5997 42.2285 25.5997 44.3185ZM33.4997 57.3335C32.578 57.3335 31.7222 57.3335 30.8663 57.2068V44.3185C30.8663 39.8218 40.5438 37.5735 45.3497 37.5735C48.8718 37.5735 54.8955 38.8085 57.9897 41.2152C54.1384 50.6202 44.6255 57.3335 33.4997 57.3335Z"
            fill={`${role == "Supervisor" ? "#3d5e5a" : "white"}`}
          />
        </svg>
      ),
    },
    {
      role: "Tenant",
      icon: (
        <svg
          className="size-14 max-sm:size-8"
          viewBox="0 0 57 73"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28.5 0.1875C21.1181 0.196424 14.041 3.20525 8.82113 8.55397C3.6013 13.9027 0.664976 21.1545 0.656267 28.7188C0.64948 34.8999 2.61978 40.913 6.26552 45.8375C6.26552 45.8375 7.02489 46.862 7.14892 47.0099L28.5 72.8125L49.8612 46.9969C49.9726 46.8594 50.7345 45.8375 50.7345 45.8375L50.737 45.8297C54.3803 40.907 56.3496 34.8969 56.3438 28.7188C56.3351 21.1545 53.3987 13.9027 48.1789 8.55397C42.9591 3.20525 35.882 0.196424 28.5 0.1875ZM31.0313 41.6875H25.9688V36.5H31.0313V41.6875ZM31.0313 31.3125H25.9688V26.125H31.0313V31.3125ZM41.1563 41.6875H36.0938V20.9375H20.9063V41.6875H15.8438V20.9375C15.8438 19.5617 16.3771 18.2422 17.3265 17.2694C18.2759 16.2965 19.5636 15.75 20.9063 15.75H36.0938C37.4364 15.75 38.7241 16.2965 39.6735 17.2694C40.6229 18.2422 41.1563 19.5617 41.1563 20.9375V41.6875Z"
            fill={`${role == "Tenant" ? "#3d5e5a" : "white"}`}
          />
        </svg>
      ),
    },
  ];

  const handleSidebarClick = (text) => {
    setRole(text);
    setUsername("");
    setPassword("");
    setError("");
  };

  const submitLogin = async () => {
    try {
      const lowerCaseUsername = username.toLowerCase();
      setError("");
      setLoading(true);
      // Simulate API call

      setTimeout(async () => {
        setLoading(false);
        console.log(lowerCaseUsername, password, role);
        // Handle successful login here
        console.log("🚀 ~ setTimeout ~ role:", role);

        var response = {};
        if (role === "Reception") {
          response = await AuthService.receptionistLogin(
            lowerCaseUsername,
            password
          );
        } else if (role === "Admin") {
          response = await AuthService.adminLogin(lowerCaseUsername, password);
        } else if (role === "Supervisor") {
          response = await AuthService.supervisorLogin(
            lowerCaseUsername,
            password
          );
        } else if (role === "Tenant") {
          response = await AuthService.tenantLogin(lowerCaseUsername, password);
        }

        if (response.error) {
          setError(response.error);
        } else {
          console.log(response.message);
        }
      }, 2000);
    } catch (error) {
      setError("Server Error");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row max-sm:flex-col h-screen ">
      {/** Left sidebar including all the role options */}
      <div className="bg-primary gap-5 max-sm:gap-6 h-full max-sm:h-auto max-sm: p-4 flex items-center justify-center flex-col max-sm:flex-row  shadow-lg">
        {sidebarElements.map((element, index) => (
          <SidebarElement
            key={index}
            role={role}
            handleSidebarClick={handleSidebarClick}
            icon={element.icon}
            text={element.role}
          />
        ))}
      </div>

      {/** Right side of the page */}
      <div className="w-full h-full flex items-center justify-center max-sm:w-full">
        <div className="flex flex-col items-center justify-center w-96 max-sm:w-full max-sm:px-12">
          <img src={nstpLogoColored} alt="NSTP Logo" className="w-40 h-40" />
          <p className="mt-5 font-semibold font-lg">
            {" "}
            Welcome to {role} login{" "}
          </p>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-5 input input-bordered rounded-full w-96 max-sm:w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-5 input input-bordered rounded-full w-96 max-sm:w-full"
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            className={`btn btn-primary mt-5 w-96 max-sm:w-full text-white rounded-full ${loading ? "cursor-not-allowed btn-disabled" : ""
              }`}
            onClick={submitLogin}
          >
            {loading && <span className="loading loading-spinner"></span>}
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
