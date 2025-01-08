import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmployeeRouter from "../../routes/Employee";
import Account from "../other/Account";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const ButtonItem = ({ isHovered, name, icon, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = (path) => {
    navigate(path);
  };
  const isActive = location.pathname === path;
  if (name === null || icon === null) {
    return <div></div>;
  }
  return (
    <button
      onClick={() => handleClick(path)}
      className={`relative p-2 rounded hover:bg-[#3E4143] w-full text-left flex items-center transition-all text-[#fff] ${
        isHovered ? "justify-start" : "justify-center"
      } `}
    >
      <span
        className={`absolute left-0 top-0 bottom-0 right-2 w-1  bg-purple-500 transition-all  duration-300 mb-1 block 
          ${isActive ? "block" : "hidden"}
          `}
      />
      <div className={`${isActive ? "ml-3" : ""}`}>
        {icon ? icon : <h1 className="text-2xl font-bold">U</h1>}
      </div>
      <h3
        className={`truncate overflow-hidden whitespace-nowrap text-ellipsis transition-all duration-300 ml-4 ${
          isHovered ? "inline-block" : "hidden"
        }`}
      >
        {name}
      </h3>
    </button>
  );
};

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed top-0 left-0 bottom-0 h-full bg-[#2C2F31] transition-all duration-300 hover:w-64 w-14 z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center p-4">
        <h1 to="/" className="text-2xl font-bold mb-8 text-white">
          S
        </h1>
        <nav className="flex-1 w-full">
          {EmployeeRouter.map((item, index) => (
            <ButtonItem
              key={index}
              name={item.name}
              icon={item.icon}
              path={item.path}
              isHovered={isHovered}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="fixed flex  left-14 top-0 right-0 h-16  justify-end  ">
        <div className="flex gap-3 text-center  w-[100px] justify-center">
          <FaArrowLeft
            onClick={() => navigate(-1)}
            className="my-auto text-xl hover:text-blue-gray-700 hover:cursor-pointer"
          />
          <FaArrowRight
            onClick={() => navigate(1)}
            className="my-auto text-xl hover:text-blue-gray-700 hover:cursor-pointer"
          />
        </div>
        <div className="container mx-auto px-6 py-3 flex  items-center justify-end ">
          <Account />
        </div>
      </div>
    </>
  );
};

const StaffLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main
          className={`flex-1 p-6 mt-16 ml-14  transition-all duration-1000 `}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
