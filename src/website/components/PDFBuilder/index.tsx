"use client";

import { useEffect, useState } from "react";
import { CVInformations, CVGeneratorConfig } from "../../../lib/types";
import { ExtendedCVInformations } from "../../types";
import PersonalDetailsSection from "./PersonalDetailsSection";
import ContactInfoSection from "./ContactInfoSection";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import ExperiencesSection from "./ExperiencesSection";
import ProjectsSection from "./ProjectsSection";
import EducationSection from "./EducationSection";
import CertificatesSection from "./CertificatesSection";
import LanguagesSection from "./LanguagesSection";
import DownloadButton from "./DownloadButton";

interface Props {
  changeCB: (update: Partial<CVInformations>) => void;
  config?: Partial<CVGeneratorConfig>;
};

const PDFBuilder = ({ changeCB, config }: Props) => {
  // Get the initial CV data from localStorage
  const getInitialCVData = () => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem('cv-gen-user-data');
        if (savedData) {
          const parsedData = JSON.parse(savedData) as ExtendedCVInformations;
          return parsedData;
        }
      } catch (error) {
        console.error('Error loading initial CV data:', error);
      }
    }
    return {};
  };

  const [personalCV, setPersonalCV] = useState<ExtendedCVInformations>(getInitialCVData());
  const [mergedCV, setMergedCV] = useState<CVInformations | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update parent component and merged CV when personalCV changes
  useEffect(() => {
    // Only update the parent if we have data or we've already initialized
    // This prevents overwriting localStorage with empty data on initial render
    if (Object.keys(personalCV).length > 0 || isInitialized) {
      changeCB(personalCV);
      setIsInitialized(true);
    }

    // Create a merged CV for the download button
    if (Object.keys(personalCV).length > 0) {
      setMergedCV(personalCV as CVInformations);
    }
  }, [personalCV, changeCB, isInitialized]);

  return (
    <div className="grid grid-cols-3 gap-2">
      <PersonalDetailsSection
        personalCV={personalCV}
        setPersonalCV={setPersonalCV}
      />

      <ContactInfoSection
        personalCV={personalCV}
        setPersonalCV={setPersonalCV}
      />

      <AboutSection
        personalCV={personalCV}
        setPersonalCV={setPersonalCV}
      />

      <SkillsSection
        personalCV={personalCV}
        setPersonalCV={setPersonalCV}
      />

      <ExperiencesSection
        personalCV={personalCV}
        setPersonalCV={setPersonalCV}
      />

      <ProjectsSection
        personalCV={personalCV}
        setPersonalCV={setPersonalCV}
      />

      <EducationSection
        personalCV={personalCV}
        setPersonalCV={setPersonalCV}
      />

      <CertificatesSection
        personalCV={personalCV}
        setPersonalCV={setPersonalCV}
      />

      <LanguagesSection
        personalCV={personalCV}
        setPersonalCV={setPersonalCV}
      />

      {/* Only show the download button if we have CV data */}
      {mergedCV && (
        <DownloadButton
          cvData={mergedCV}
          config={config}
        />
      )}
    </div>
  );
};

export default PDFBuilder;
