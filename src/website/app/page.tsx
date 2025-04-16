"use client";
import PDFViewer from "@/components/PDFViewer";
import { softwareEngineerCV as dummyCV } from "helper/dummyCV";
import { useCallback, useState } from "react";
import { CVGeneratorConfig, CVInformations } from "../../lib/types";
import PDFBuilder from "@/components/PDFBuilder";
import TabContainer from "@/components/TabContainer";
import HomePage from "@/components/HomePage";
import ConfigPage from "@/components/ConfigPage";

export default function Page() {
  // Initialize with dummy CV to avoid null state
  const [mergedCV, setMergedCV] = useState<CVInformations>(dummyCV);
  const [config, setConfig] = useState<Partial<CVGeneratorConfig>>({});

  const onCVChange = useCallback(
    (personalCV: Partial<CVInformations>) => {
      // Merge personal CV with dummy CV
      const merged = Object.assign({}, dummyCV, personalCV);
      console.log('CV updated');
      setMergedCV(merged);
    },
    [setMergedCV],
  );

  const onConfigChange = useCallback(
    (config: CVGeneratorConfig) => {
      setConfig(config);
    },
    [setConfig],
  );

  // Define tabs with memoized content to prevent unnecessary re-renders
  const tabs = [
    {
      id: "home",
      label: "Homepage",
      content: <HomePage />
    },
    {
      id: "cv",
      label: "CV",
      content: <PDFBuilder changeCB={onCVChange} onConfigChange={onConfigChange} />
    },
    {
      id: "config",
      label: "Config",
      content: <ConfigPage />
    }
  ];

  return (
    <div className="flex flex-row bg-neutral">
      <div className="basis-1 grow h-lvh flex flex-col">
        <header className="p-4 flex flex-row bg-base-300 items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl text-white font-bold">CV-Gen</h1>
              <p className="text-sm text-gray-300">Create & Optimize a standardized CV</p>
            </div>
          </div>
        </header>
        <main className="px-4 py-2 grow overflow-y-scroll">
          <TabContainer tabs={tabs} defaultActiveTab="home" />
        </main>
      </div>
      <PDFViewer cvData={mergedCV} configOverride={config} />
    </div>
  );
}
