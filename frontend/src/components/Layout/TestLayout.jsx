import React from "react";
import { useState } from "react";
const Header = () => {
  const [activeTab, setActiveTab] = useState("Home");

  const tabs = [
    "Home",
    "Transactions",
    "Payments",
    "Deposits",
    "Credits",
    "Archive",
    "Archive",
    "Archive",
  ];

  return (
    <div className=" w-auto">
      <div className="max-w-6xl mx-auto transition-all duration-300">
        <div className="flex justify-around py-4 gap-2 ">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`relative px-4 py-2 cursor-pointer text-gray-700 hover:text-black ${
                activeTab === tab ? "font-bold" : "font-medium"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute left-0 right-0 bottom-0 h-1 bg-black rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      {/* Header */}
      <header className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">

        <h1 className="text-xl font-bold text-gray-700">Lines Bank</h1>
        <Header />
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <span className="ml-2 text-gray-700">Jack Davidson</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-12 gap-4 mt-6">
        {/* Left Panel */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-gray-600">Current Balance</h2>
            <p className="text-2xl font-bold text-gray-800">$15,092.45</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-yellow-400 rounded"></div>
                <span>Visa 8514</span>
              </div>
              <button className="text-blue-500">Add</button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-gray-600">Real Estate Loan</h2>
            <p className="text-xl text-red-500">- $113,920.00</p>
            <p className="text-sm text-gray-500">20 payments left</p>
            <button className="mt-4 w-full bg-yellow-400 text-white py-2 rounded-lg">
              Pay now
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-gray-600">Brokerage Account</h2>
            <p className="text-2xl font-bold text-gray-800">$0.00</p>
          </div>
        </div>

        {/* Center Panel */}
        <div className="col-span-6 bg-white p-4 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Debit Card under new terms</h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <button className="bg-blue-100 text-blue-700 py-2 rounded-lg">
                Fast Calculation
              </button>
              <button className="bg-blue-100 text-blue-700 py-2 rounded-lg">
                Payments in 1 day
              </button>
              <button className="bg-blue-100 text-blue-700 py-2 rounded-lg">
                24-hour Support
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">By Details</div>
            <div className="bg-gray-100 p-4 rounded-lg">Card Number</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-gray-600">My Investments</h2>
            <ul className="mt-4 space-y-2">
              <li className="flex justify-between">
                <span>Apple Inc.</span>
                <span className="text-green-500">+0.33%</span>
              </li>
              <li className="flex justify-between">
                <span>Netflix</span>
                <span className="text-red-500">-0.29%</span>
              </li>
              <li className="flex justify-between">
                <span>Airbnb</span>
                <span className="text-green-500">+24.13%</span>
              </li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-gray-600">Convert Currency</h2>
            <div className="mt-4">
              <p>
                From <strong>$3,215.00</strong>
              </p>
              <p>
                To <strong>£2,528.71</strong>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
