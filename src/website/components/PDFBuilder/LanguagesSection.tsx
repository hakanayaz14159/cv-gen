"use client";

import { Dispatch, SetStateAction, useState, useRef } from "react";
import { CVInformations, CVLanguage } from "../../../lib/types";
import { LanguageProficiency } from "cv-gen";

type Props = {
  personalCV: Partial<CVInformations>;
  setPersonalCV: Dispatch<SetStateAction<Partial<CVInformations>>>;
};

const LanguagesSection = ({ personalCV, setPersonalCV }: Props) => {
  // Language state
  const [language, setLanguage] = useState("");
  const [proficiency, setProficiency] = useState<LanguageProficiency>(LanguageProficiency.B2);

  // Refs to prevent double submissions
  const isAddingLanguage = useRef(false);

  // Function to handle adding language
  const handleAddLanguage = () => {
    if (isAddingLanguage.current || !language.trim()) {
      return;
    }

    isAddingLanguage.current = true;

    // Capture current values
    const languageData = {
      language: language.trim(),
      proficiency
    };

    // Reset form fields immediately
    setLanguage("");
    setProficiency(LanguageProficiency.B2);

    // Create language object
    const lang: CVLanguage = {
      language: languageData.language,
      proficiency: languageData.proficiency
    };

    // Update CV state
    setPersonalCV((p) => {
      const newCV = { ...p };
      if (!newCV.languages) {
        newCV.languages = [];
      }
      newCV.languages = [...newCV.languages, lang];
      return newCV;
    });

    // Reset flag after a delay
    setTimeout(() => {
      isAddingLanguage.current = false;
    }, 200);
  };

  return (
    <fieldset className="fieldset col-span-3 p-4">
      <legend className="fieldset-legend">
        Languages
      </legend>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="fieldset-label">Language</label>
          <input
            type="text"
            className="input w-full mb-2"
            placeholder="English, Spanish, etc."
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />

          <label className="fieldset-label">Proficiency Level</label>
          <select
            className="select w-full mb-4"
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value as LanguageProficiency)}
          >
            <option value={LanguageProficiency.A1}>A1 - Beginner</option>
            <option value={LanguageProficiency.A2}>A2 - Elementary</option>
            <option value={LanguageProficiency.B1}>B1 - Intermediate</option>
            <option value={LanguageProficiency.B2}>B2 - Upper Intermediate</option>
            <option value={LanguageProficiency.C1}>C1 - Advanced</option>
            <option value={LanguageProficiency.C2}>C2 - Proficient</option>
            <option value={LanguageProficiency.NATIVE}>Native Speaker</option>
          </select>

          <button
            className="btn btn-action w-full"
            onClick={handleAddLanguage}
            disabled={!language.trim()}
          >
            Add Language
          </button>
        </div>

        <div>
          <label className="fieldset-label">Current Languages</label>
          <div className="overflow-y-auto max-h-96 border border-base-300 rounded-lg p-3">
            {personalCV.languages && personalCV.languages.length > 0 ? (
              <div className="flex flex-col gap-2">
                {personalCV.languages.map((lang, langIdx) => (
                  <div key={langIdx} className="p-3 bg-base-200 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-lg">{lang.language}</span>
                        <span className="ml-2 badge badge-lg bg-base-100">{lang.proficiency}</span>
                      </div>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => {
                          setPersonalCV((p) => {
                            if (p.languages) {
                              p.languages = p.languages.filter((_, i) => i !== langIdx);
                            }
                            return Object.assign({}, p);
                          });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-base-content/70 italic">
                No languages added yet. Add your language proficiencies to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default LanguagesSection;
