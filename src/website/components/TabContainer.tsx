"use client";

import { ReactNode } from "react";

type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

type Props = {
  tabs: Tab[];
  defaultActiveTab?: string;
};

const TabContainer = ({ tabs, defaultActiveTab }: Props) => {
  // Find the index of the default active tab
  const defaultTabIndex = tabs.findIndex((tab) => tab.id === defaultActiveTab);
  const defaultTab = defaultTabIndex >= 0 ? defaultTabIndex : 0;

  return (
    <div className="w-full">
      {/* DaisyUI tabs with radio inputs for automatic functionality */}
      <div role="tablist" className="tabs tabs-lift">
        {/* Tab inputs (hidden but functional) */}
        {tabs.map((tab, index) => (
          <>
            <input
              key={`${tab.id}-input`}
              type="radio"
              name="tabs"
              role="tab"
              className="tab"
              aria-label={tab.label}
              defaultChecked={index === defaultTab}
            />
            <div
              key={`${tab.id}-content`}
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 rounded-box p-6"
            >
              {tab.content}
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default TabContainer;
