"use client";
import PDFViewer from "../components/PDFViewer";
import { softwareEngineerCV as dummyCV } from "../helper/dummyCV";
import { useCallback, useState, useEffect } from "react";
import { CVGeneratorConfig, CVInformations } from "../../lib/types";
import PDFBuilder from "../components/PDFBuilder";
import TabContainer from "../components/TabContainer";
import HomePage from "../components/HomePage";
import ConfigPage from "../components/ConfigPage";
import { saveUserData, loadUserData, saveConfig, loadConfig } from "../helper/localStorage";

export default function Page() {
  // Initialize state
  const [mergedCV, setMergedCV] = useState<CVInformations | null>(null);
  const [config, setConfig] = useState<Partial<CVGeneratorConfig>>({});
  const [personalCV, setPersonalCV] = useState<Partial<CVInformations>>({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    // Only run this on the client side
    if (typeof window !== 'undefined') {
      // Load user data
      const savedUserData = loadUserData();
      console.log('Loaded user data from localStorage:', savedUserData);
      if (savedUserData) {
        // Process the saved user data to ensure it's in the correct format
        const processedData = { ...savedUserData };

        // If there are skills in the saved data, make sure they're properly processed
        if (processedData.skills && Array.isArray(processedData.skills)) {
          console.log('Processing skills array from localStorage');
          // Group skills by their group property
          const skillsByGroup: Record<string, any[]> = {};

          processedData.skills.forEach((skill: any) => {
            if (skill.group) {
              if (!skillsByGroup[skill.group]) {
                skillsByGroup[skill.group] = [];
              }

              // Create a clean skill object without the group property
              const { group, ...cleanSkill } = skill;
              skillsByGroup[skill.group].push(cleanSkill);
            }
          });

          // Set the skillDetails property
          if (Object.keys(skillsByGroup).length > 0) {
            processedData.skillDetails = skillsByGroup;
            console.log('Created skillDetails from skills array:', skillsByGroup);
          }
        }

        setPersonalCV(processedData);
        // Merge with dummy data
        const merged = Object.assign({}, dummyCV, processedData);
        console.log('Merged CV data:', merged);
        setMergedCV(merged);
      } else {
        console.log('No saved user data found, using dummy data');
        // Set mergedCV to dummy data if no saved data is found
        setMergedCV(dummyCV);
      }

      // Load configuration
      const savedConfig = loadConfig();
      if (savedConfig) {
        setConfig(savedConfig);
      }

      setIsDataLoaded(true);
    }
  }, []);

  // Save user data to localStorage when it changes
  useEffect(() => {
    // Only save after initial data is loaded to prevent overwriting with empty data
    if (isDataLoaded && Object.keys(personalCV).length > 0) {
      console.log('Saving user data to localStorage:', personalCV);
      const success = saveUserData(personalCV);
      console.log('Save success:', success);
    }
  }, [personalCV, isDataLoaded]);

  // Save configuration to localStorage when it changes
  useEffect(() => {
    // Only save after initial data is loaded
    if (isDataLoaded && Object.keys(config).length > 0) {
      saveConfig(config as CVGeneratorConfig);
    }
  }, [config, isDataLoaded]);

  const onCVChange = useCallback(
    (newPersonalCV: Partial<CVInformations>) => {
      // Prevent processing empty data
      if (Object.keys(newPersonalCV).length === 0) {
        console.log('onCVChange: Received empty CV data, ignoring');
        return;
      }

      console.log('onCVChange: Processing CV data:', newPersonalCV);

      // Update personal CV state
      setPersonalCV(newPersonalCV);

      // Transform skills array to skillDetails record if needed
      const transformedCV = { ...newPersonalCV };

      if (transformedCV.skills && Array.isArray(transformedCV.skills)) {
        console.log('Processing skills array in onCVChange:', transformedCV.skills);
        // Group skills by their group property
        const skillsByGroup: Record<string, any[]> = {};

        transformedCV.skills.forEach(skill => {
          if (skill.group) {
            if (!skillsByGroup[skill.group]) {
              skillsByGroup[skill.group] = [];
            }

            // Create a clean skill object without the group property
            const { group, ...cleanSkill } = skill;
            skillsByGroup[skill.group].push(cleanSkill);
          }
        });

        // Set the skillDetails property
        if (Object.keys(skillsByGroup).length > 0) {
          transformedCV.skillDetails = skillsByGroup;
          console.log('Created skillDetails in onCVChange:', skillsByGroup);
        }
      }

      // Save the transformed CV to localStorage
      console.log('Saving transformed CV to localStorage:', transformedCV);
      const saveSuccess = saveUserData(transformedCV);
      console.log('Save success:', saveSuccess);

      // Merge transformed CV with dummy CV
      // Create a deep copy of the dummy CV to avoid reference issues
      const dummyCopy = JSON.parse(JSON.stringify(dummyCV));
      const merged = Object.assign({}, dummyCopy, transformedCV);
      console.log('Merged CV in onCVChange:', merged);
      setMergedCV(merged);
    },
    [],
  );

  const onConfigChange = useCallback(
    (newConfig: CVGeneratorConfig) => {
      // Prevent processing empty config
      if (!newConfig || Object.keys(newConfig).length === 0) {
        console.log('onConfigChange: Received empty config, ignoring');
        return;
      }

      console.log('Config changed:', newConfig);
      setConfig(newConfig);

      // Explicitly save the config to localStorage
      if (isDataLoaded) {
        const success = saveConfig(newConfig);
        console.log('Config save success:', success);
      }
    },
    [isDataLoaded],
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
      content: <PDFBuilder changeCB={onCVChange} config={config} />
    },
    {
      id: "config",
      label: "Config",
      content: <ConfigPage onConfigChange={onConfigChange} />
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
