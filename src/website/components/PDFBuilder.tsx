"use client";

import { useEffect, useState } from "react";
import { CVGeneratorConfig, CVInformations } from "../../lib/types";

type Props = {
  changeCB: (update: Partial<CVInformations>) => void;
  onConfigChange: (config: CVGeneratorConfig) => void;
};

const PDFBuilder = ({ changeCB, onConfigChange }: Props) => {
  const [personalCV, setPersonalCV] = useState<Partial<CVInformations>>({});
  const [configOverride, setConfigOverride] = useState<CVGeneratorConfig>({});

  useEffect(() => {
    changeCB(personalCV);
  }, [personalCV]);

  useEffect(() => {
    onConfigChange(configOverride);
  }, [configOverride]);

  return (
    <div className="grid grid-cols-3 gap-2">
      <fieldset className="fieldset bg-base-100 border border-base-300 p-4">
        <legend className="fieldset-legend text-lg bg-primary p-1">
          Personal Details
        </legend>
        <label className="fieldset-label">Full Name</label>
        <input
          type="text"
          className="input w-full"
          placeholder="Alexandra Johnson"
          onChange={(e) => {
            setPersonalCV((p) => {
              if (e.target.value.trim().length > 0) {
                p.name = e.target.value.trim();
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
          onChange={(e) => {
            setPersonalCV((p) => {
              if (e.target.value.trim().length > 0) {
                p.personalTitle = e.target.value.trim();
              } else {
                delete p.personalTitle;
              }

              return Object.assign({}, p);
            });
          }}
        />
        <label className="fieldset-label">Position</label>
        <select
          defaultValue="left"
          className="select"
          onChange={(e) => {
            const value = e.target.value;
            switch (value) {
              case "left":
              case "right":
              case "center":
                setConfigOverride((p) => ({
                  ...p,
                  titleLocation: value,
                }));
                break;
            }
          }}
        >
          <option value={"left"}>Left</option>
          <option value={"right"}>Right</option>
          <option value={"center"}>Center</option>
        </select>
      </fieldset>
      <fieldset className="fieldset grid grid-cols-2 col-span-2 bg-base-100 border border-base-300 p-4">
        <legend className="fieldset-legend text-lg bg-primary p-1">
          Contact Informations
        </legend>
        <label className="fieldset-label">Email</label>
        <input
          type="text"
          className="input"
          placeholder="alexandra.johnson@example.com"
          onChange={(e) => {
            setPersonalCV((p) => {
              if (p.contactInformations === undefined) {
                p.contactInformations = {};
              }

              if (e.target.value.trim().length > 0) {
                p.contactInformations.email = e.target.value.trim();
              } else {
                delete p.contactInformations.email;
              }

              return Object.assign({}, p);
            });
          }}
        />
        <label className="fieldset-label">Phone Number</label>
        <input
          type="text"
          className="input"
          placeholder="+1 (555) 123-4567"
          onChange={(e) => {
            setPersonalCV((p) => {
              if (p.contactInformations === undefined) {
                p.contactInformations = {};
              }

              if (e.target.value.trim().length > 0) {
                p.contactInformations.phoneNumber = e.target.value.trim();
              } else {
                delete p.contactInformations.email;
              }

              return Object.assign({}, p);
            });
          }}
        />
        <label className="fieldset-label">Website / Portfolio</label>
        <input
          type="text"
          className="input"
          placeholder="https://alexandrajohnson.dev"
        />
        <label className="fieldset-label">Github</label>
        <input
          type="text"
          className="input"
          placeholder="https://github.com/alexjohnson"
        />

        <label className="fieldset-label">Linkedin</label>
        <input
          type="text"
          className="input"
          placeholder="https://linkedin.com/in/alexandra-johnson"
        />
      </fieldset>
      <fieldset className="fieldset grid col-span-3 bg-base-100 border border-base-300 p-4">
        <legend className="fieldset-legend text-lg bg-primary p-1">
          About
        </legend>
        <label className="fieldset-label">Summary</label>
        <textarea
          className="textarea h-24 resize-none w-full"
          placeholder="What you can tell about yourself ? Make it short"
        ></textarea>
      </fieldset>
      <fieldset className="fieldset bg-base-100 col-span-2 border border-base-300 p-4">
        <legend className="fieldset-legend text-lg bg-primary p-1">
          Skills
        </legend>
        <label className="fieldset-label">Skill Group</label>

        <div className="flex flex-row">
          <input
            type="text"
            className="input join-item"
            placeholder="Alexandra"
          />
          <button className="btn btn-neutral join-item">Add Skill Group</button>
        </div>
        <div>
          <div></div>
        </div>
      </fieldset>
    </div>
  );
};

export default PDFBuilder;
