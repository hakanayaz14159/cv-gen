"use client";

import { useEffect, useState } from "react";
import { CVInformations } from "../../../lib/types";
import PersonalDetailsSection from "./PersonalDetailsSection";
import ContactInfoSection from "./ContactInfoSection";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import ExperiencesSection from "./ExperiencesSection";
import ProjectsSection from "./ProjectsSection";
import EducationSection from "./EducationSection";
import CertificatesSection from "./CertificatesSection";
import LanguagesSection from "./LanguagesSection";

type Props = {
  changeCB: (update: Partial<CVInformations>) => void;
};

const PDFBuilder = ({ changeCB }: Props) => {
  const [personalCV, setPersonalCV] = useState<Partial<CVInformations>>({});

  // Update parent component when personalCV changes
  useEffect(() => {
    changeCB(personalCV);
  }, [personalCV, changeCB]);

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
    </div>
  );
};

export default PDFBuilder;
