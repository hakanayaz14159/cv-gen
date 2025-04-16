"use client";

import { Dispatch, SetStateAction } from "react";
import { CVInformations } from "../../../lib/types";

type Props = {
  personalCV: Partial<CVInformations>;
  setPersonalCV: Dispatch<SetStateAction<Partial<CVInformations>>>;
};

const PersonalDetailsSection = ({ personalCV, setPersonalCV }: Props) => {
  return (
    <fieldset className="fieldset p-4">
      <legend className="fieldset-legend">
        Personal Details
      </legend>
      <label className="fieldset-label">Full Name</label>
      <input
        type="text"
        className="input w-full"
        placeholder="Alexandra Johnson"
        value={personalCV.name || ""}
        onChange={(e) => {
          setPersonalCV((p) => {
            // Allow spaces in the name, only trim to check if it's empty
            if (e.target.value.trim().length > 0) {
              p.name = e.target.value; // Don't trim the actual value
            } else {
              delete p.name;
            }

            return Object.assign({}, p);
          });
        }}
      />
      <label className="fieldset-label">Title</label>
      <input
        type="text"
        className="input"
        placeholder="Senior Software Engineer"
        value={personalCV.personalTitle || ""}
        onChange={(e) => {
          setPersonalCV((p) => {
            // Allow spaces in the title, only trim to check if it's empty
            if (e.target.value.trim().length > 0) {
              p.personalTitle = e.target.value; // Don't trim the actual value
            } else {
              delete p.personalTitle;
            }

            return Object.assign({}, p);
          });
        }}
      />
    </fieldset>
  );
};

export default PersonalDetailsSection;
