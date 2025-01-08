import React, { useState } from "react";

const TabMenu = (props) => {
  const { tabs, bg } = props;
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const backgroundClass = bg || "bg-gradient-to-r from-gray-400 to-gray-500";

  return (
    <div>
      <div className={`w-full bg-gray-300 p-1 rounded-md`}>
        <div className="relative flex justify-between">
          {tabs?.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.name)}
              className={`relative flex-1 text-center p-2 font-semibold text-black`}
            >
              {tab.name}
            </button>
          ))}
          <div
            className={`absolute bottom-0 h-10 rounded-md shadow-lg transform transition-all duration-300 ease-in-out bg-white opacity-100`}
            style={{
              width: `${100 / tabs.length}%`,
              left: `${
                tabs.findIndex((tab) => tab.name === activeTab) *
                (100 / tabs.length)
              }%`,
            }}
          >
            <div
              className={`flex-1 text-center p-2 font-semibold text-black mx-auto flex transform transition-all duration-300 
              ease-in-out bg-white rounded-md items-center justify-center`}
              style={{ opacity: 0.9 }}
            >
              {activeTab}
            </div>
          </div>
        </div>
      </div>
      {tabs?.map((tab) => (
        <div
          key={tab.id}
          className={`py-4 w-full h-full   ${
            activeTab === tab.name ? "block" : "hidden"
          }`}
        >
          {tab.Element}
        </div>
      ))}
    </div>
  );
};

export default TabMenu;
