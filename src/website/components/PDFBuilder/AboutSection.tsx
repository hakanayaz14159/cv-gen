"use client";

import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { CVInformations } from "../../../lib/types";

type Props = {
  personalCV: Partial<CVInformations>;
  setPersonalCV: Dispatch<SetStateAction<Partial<CVInformations>>>;
};

const AboutSection = ({ personalCV, setPersonalCV }: Props) => {
  // About state
  const [aboutText, setAboutText] = useState("");

  // Debounce timer ref
  const aboutDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize aboutText with existing about value if it exists
  useEffect(() => {
    if (personalCV.about) {
      setAboutText(personalCV.about);
    }
  }, [personalCV.about]);

  return (
    <fieldset className="fieldset col-span-3 p-4">
      <legend className="fieldset-legend">
        About
      </legend>
      <textarea
        className="textarea w-full h-32"
        placeholder="Write a brief summary about yourself, your skills, and your career goals..."
        value={aboutText}
        onChange={(e) => {
          const newAboutText = e.target.value;
          setAboutText(newAboutText);

          // Clear any existing timer
          if (aboutDebounceTimerRef.current) {
            clearTimeout(aboutDebounceTimerRef.current);
          }

          // Set a new timer to update the CV after a delay
          aboutDebounceTimerRef.current = setTimeout(() => {
            setPersonalCV((p) => {
              if (newAboutText.trim().length > 0) {
                p.about = newAboutText.trim();
              } else {
                delete p.about;
              }
              return Object.assign({}, p);
            });
          }, 500); // 500ms debounce
        }}
      />
    </fieldset>
  );
};

export default AboutSection;
