"use client";

import { Dispatch, SetStateAction, useState, useRef } from "react";
import { CVInformations, CVExperience, CVPosition } from "../../../lib/types";
import AddItemInput from "./shared/AddItemInput";
import ItemsList from "./shared/ItemsList";

interface Props {
  personalCV: Partial<CVInformations>;
  setPersonalCV: Dispatch<SetStateAction<Partial<CVInformations>>>;
};

const ExperiencesSection = ({ personalCV, setPersonalCV }: Props) => {
  // Experience state
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isCurrentPosition, setIsCurrentPosition] = useState(false);
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [techStacks, setTechStacks] = useState<string[]>([]);

  // Refs to prevent double submissions
  const isAddingExperience = useRef(false);

  // Function to handle adding responsibility
  const handleAddResponsibility = (newResponsibility: string) => {
    setResponsibilities(prev => [...prev, newResponsibility]);
  };

  // Function to handle removing responsibility
  const handleRemoveResponsibility = (index: number) => {
    setResponsibilities(prev => prev.filter((_, i) => i !== index));
  };

  // Function to handle adding tech stack
  const handleAddTechStack = (newTechStack: string) => {
    setTechStacks(prev => [...prev, newTechStack]);
  };

  // Function to handle removing tech stack
  const handleRemoveTechStack = (index: number) => {
    setTechStacks(prev => prev.filter((_, i) => i !== index));
  };

  // Function to handle adding experience
  const handleAddExperience = () => {
    if (isAddingExperience.current || !companyName.trim() || !role.trim() || !fromDate) {
      return;
    }

    isAddingExperience.current = true;

    // Capture current values
    const experienceData = {
      companyName: companyName.trim(),
      role: role.trim(),
      description: description.trim(),
      responsibilities: [...responsibilities],
      techStacks: [...techStacks],
      fromDate,
      toDate,
      isCurrentPosition
    };

    // Reset form fields immediately
    setCompanyName("");
    setRole("");
    setFromDate("");
    setToDate("");
    setIsCurrentPosition(false);
    setDescription("");
    setResponsibilities([]);
    setTechStacks([]);

    // Create position object
    const position: CVPosition = {
      role: experienceData.role,
      fromDate: new Date(experienceData.fromDate),
      description: experienceData.description,
      responsibilities: experienceData.responsibilities
    };

    if (!experienceData.isCurrentPosition && experienceData.toDate) {
      position.toDate = new Date(experienceData.toDate);
    }

    // Create experience object
    const experience: CVExperience = {
      companyName: experienceData.companyName,
      positions: [position],
      techStack: experienceData.techStacks
    };

    // Update CV state
    setPersonalCV((p) => {
      const newCV = { ...p };
      if (!newCV.experiences) {
        newCV.experiences = [];
      }
      newCV.experiences = [...newCV.experiences, experience];
      return newCV;
    });

    // Reset flag after a delay
    setTimeout(() => {
      isAddingExperience.current = false;
    }, 200);
  };

  return (
    <fieldset className="fieldset col-span-3 p-4">
      <legend className="fieldset-legend">
        Experiences
      </legend>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="fieldset-label">Company Name</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Acme Corporation"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div>
              <label className="fieldset-label">Role</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Senior Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="fieldset-label">From Date</label>
              <input
                type="date"
                className="input w-full"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label className="fieldset-label">To Date</label>
              <div className="flex flex-col">
                <input
                  type="date"
                  className="input w-full"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  disabled={isCurrentPosition}
                />
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    className="checkbox mr-2"
                    checked={isCurrentPosition}
                    onChange={(e) => setIsCurrentPosition(e.target.checked)}
                  />
                  <span className="text-sm">Current Position</span>
                </div>
              </div>
            </div>
          </div>

          <label className="fieldset-label">Description</label>
          <textarea
            className="textarea w-full mb-2"
            placeholder="Brief description of your role and responsibilities..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="fieldset-label">Responsibilities</label>
          <AddItemInput
            placeholder="Led a team of 5 developers..."
            onAdd={handleAddResponsibility}
          />

          <ItemsList
            items={responsibilities}
            onRemove={handleRemoveResponsibility}
            emptyMessage="No responsibilities added yet."
          />

          <label className="fieldset-label mt-4">Tech Stack</label>
          <AddItemInput
            placeholder="React, Node.js, AWS, etc."
            onAdd={handleAddTechStack}
          />

          <ItemsList
            items={techStacks}
            onRemove={handleRemoveTechStack}
            emptyMessage="No tech stack items added yet."
          />

          <button
            className="btn btn-action w-full mt-4"
            onClick={handleAddExperience}
            disabled={!companyName.trim() || !role.trim() || !fromDate}
          >
            Add Experience
          </button>
        </div>

        <div>
          <label className="fieldset-label">Current Experiences</label>
          <div className="overflow-y-auto max-h-96 border border-base-300 rounded-lg p-3">
            {personalCV.experiences && personalCV.experiences.length > 0 ? (
              personalCV.experiences.map((exp, expIdx) => (
                <div key={expIdx} className="mb-6 pb-4 border-b border-base-300 last:border-b-0 last:mb-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{exp.companyName}</h3>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => {
                        setPersonalCV((p) => {
                          if (p.experiences) {
                            p.experiences = p.experiences.filter((_, i) => i !== expIdx);
                          }
                          return Object.assign({}, p);
                        });
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  {exp.positions.map((pos, posIdx) => (
                    <div key={posIdx} className="ml-4 mt-3 p-2 bg-base-200 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{pos.role}</div>
                          <div className="text-sm opacity-80">
                            {new Date(pos.fromDate).toLocaleDateString()} -
                            {pos.toDate ? new Date(pos.toDate).toLocaleDateString() : 'Present'}
                          </div>
                        </div>
                      </div>

                      {pos.description && (
                        <div className="mt-2 text-sm">
                          <p>{pos.description}</p>
                        </div>
                      )}

                      {pos.responsibilities && pos.responsibilities.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-semibold">Responsibilities:</span>
                          <ul className="list-disc pl-5 text-sm mt-1">
                            {pos.responsibilities.map((resp, respIdx) => (
                              <li key={respIdx}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}

                  {exp.techStack && exp.techStack.length > 0 && (
                    <div className="mt-3 ml-4">
                      <span className="text-sm font-semibold">Tech Stack:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exp.techStack.map((tech, techIdx) => (
                          <span key={techIdx} className="badge badge-lg bg-base-200 text-base-content">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-base-content/70 italic">
                No experiences added yet. Add your work experience to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default ExperiencesSection;
