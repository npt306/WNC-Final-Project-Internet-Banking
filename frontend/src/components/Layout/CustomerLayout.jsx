import React, { useState, useEffect } from "react";
import CustomerRouter from "../../routes/Customer";
import { useNavigate, useLocation } from "react-router-dom";
import Account from "../../components/other/Account";
import { MenuOutlined } from "@ant-design/icons";
import { Drawer, Button } from "antd";
import { useSelector } from "react-redux";

import useSocket from "../../hooks/useSocket";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const mycustomerID = useSelector((state) => state.profile._id);
  const { state, initialize, send } = useSocket();

  useEffect(() => {
    initialize(mycustomerID);
    const currentTab = CustomerRouter.find(
      (tab) => tab.path === location.pathname
    );
    if (currentTab) {
      setActiveTab(currentTab.name);
    }
  }, [location.pathname, mycustomerID]);

  const handleClicked = (tab) => {
    setActiveTab(tab.name);
    navigate(tab.path);
    setIsDrawerVisible(false); // Đóng drawer khi click
  };

  // Menu cho desktop
  const DesktopMenu = () => (
    <div className="hidden md:flex justify-around py-4 gap-2">
      {CustomerRouter.filter((tab) => tab.name !== null).map((tab, index) => (
        <div
          key={index}
          className={`relative px-4 py-2 cursor-pointer text-gray-700 hover:text-black ${
            activeTab === tab.name ? "font-bold" : "font-medium"
          }`}
          onClick={() => handleClicked(tab)}
        >
          {tab.name}
          {activeTab === tab.name && (
            <div className="absolute left-0 right-0 bottom-0 h-1 bg-black rounded-full"></div>
          )}
        </div>
      ))}
    </div>
  );

  // Menu cho mobile
  const MobileMenu = () => (
    <div className="md:hidden">
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setIsDrawerVisible(true)}
        className="p-2"
      />
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
      >
        <div className="flex flex-col gap-4">
          {CustomerRouter.filter((tab) => tab.name !== null).map(
            (tab, index) => (
              <div
                key={index}
                className={`px-4 py-2 cursor-pointer ${
                  activeTab === tab.name
                    ? "font-bold bg-gray-100"
                    : "text-gray-700"
                }`}
                onClick={() => handleClicked(tab)}
              >
                {tab.name}
              </div>
            )
          )}
        </div>
      </Drawer>
    </div>
  );

  return (
    <div className="w-auto">
      <div className="max-w-6xl mx-auto transition-all duration-300">
        <DesktopMenu />
        <MobileMenu />
      </div>
    </div>
  );
};

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex items-center justify-between bg-white px-4 rounded-lg shadow-md">
        <h1 className="text-base md:text-xl font-bold text-gray-700 transition-all">
          SANK COM BA
        </h1>
        <Header />
        <div className="flex items-center">
          <Account />
        </div>
      </header>

      <main className="bg-white w-full md:min-w-[55vw] md:w-auto min-h-[80vh] my-4 mx-auto p-2 rounded-lg shadow-md">
        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
