"use client";

import { Dispatch, SetStateAction, useState, useRef } from "react";
import { CVInformations, CVPosition } from "../../../lib/types";
import AddItemInput from "./shared/AddItemInput";
import ItemsList from "./shared/ItemsList";

type Props = {
  personalCV: Partial<CVInformations>;
  setPersonalCV: Dispatch<SetStateAction<Partial<CVInformations>>>;
};

const ProjectsSection = ({ personalCV, setPersonalCV }: Props) => {
  // Project state
  const [projectName, setProjectName] = useState("");
  const [projectRole, setProjectRole] = useState("");
  const [projectFromDate, setProjectFromDate] = useState("");
  const [projectToDate, setProjectToDate] = useState("");
  const [isCurrentProject, setIsCurrentProject] = useState(false);
  const [projectDescription, setProjectDescription] = useState("");
  const [projectResponsibilities, setProjectResponsibilities] = useState<string[]>([]);
  const [projectTechStacks, setProjectTechStacks] = useState<string[]>([]);
  const [projectType, setProjectType] = useState("");

  // Refs to prevent double submissions
  const isAddingProject = useRef(false);

  // Function to handle adding project responsibility
  const handleAddProjectResponsibility = (newResponsibility: string) => {
    setProjectResponsibilities(prev => [...prev, newResponsibility]);
  };

  // Function to handle removing project responsibility
  const handleRemoveProjectResponsibility = (index: number) => {
    setProjectResponsibilities(prev => prev.filter((_, i) => i !== index));
  };

  // Function to handle adding project tech stack
  const handleAddProjectTechStack = (newTechStack: string) => {
    setProjectTechStacks(prev => [...prev, newTechStack]);
  };

  // Function to handle removing project tech stack
  const handleRemoveProjectTechStack = (index: number) => {
    setProjectTechStacks(prev => prev.filter((_, i) => i !== index));
  };

  // Function to handle adding project
  const handleAddProject = () => {
    if (isAddingProject.current || !projectName.trim() || !projectRole.trim() || !projectFromDate || !projectType.trim()) {
      return;
    }

    isAddingProject.current = true;

    // Capture current values
    const projectData = {
      projectName: projectName.trim(),
      projectRole: projectRole.trim(),
      projectDescription: projectDescription.trim(),
      projectType: projectType.trim(),
      projectResponsibilities: [...projectResponsibilities],
      projectTechStacks: [...projectTechStacks],
      projectFromDate,
      projectToDate,
      isCurrentProject
    };

    // Reset form fields immediately
    setProjectName("");
    setProjectRole("");
    setProjectFromDate("");
    setProjectToDate("");
    setIsCurrentProject(false);
    setProjectDescription("");
    setProjectResponsibilities([]);
    setProjectTechStacks([]);
    setProjectType("");

    // Create position object
    const position: CVPosition = {
      role: projectData.projectRole,
      fromDate: new Date(projectData.projectFromDate),
      description: projectData.projectDescription,
      responsibilities: projectData.projectResponsibilities
    };

    if (!projectData.isCurrentProject && projectData.projectToDate) {
      position.toDate = new Date(projectData.projectToDate);
    }

    // Update CV state
    setPersonalCV((p) => {
      const newCV = { ...p };
      if (!newCV.projects) {
        newCV.projects = [];
      }
      newCV.projects = [...newCV.projects, {
        projectName: projectData.projectName,
        positions: [position],
        techStack: projectData.projectTechStacks,
        type: projectData.projectType
      }];
      return newCV;
    });

    // Reset flag after a delay
    setTimeout(() => {
      isAddingProject.current = false;
    }, 200);
  };

  return (
    <fieldset className="fieldset col-span-3 p-4">
      <legend className="fieldset-legend">
        Projects
      </legend>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="fieldset-label">Project Name</label>
              <input
                type="text"
                className="input w-full"
                placeholder="E-commerce Platform"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div>
              <label className="fieldset-label">Project Type</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Personal, Open Source, Client, etc."
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              />
            </div>
          </div>

          <label className="fieldset-label">Your Role</label>
          <input
            type="text"
            className="input w-full mb-2"
            placeholder="Lead Developer"
            value={projectRole}
            onChange={(e) => setProjectRole(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="fieldset-label">From Date</label>
              <input
                type="date"
                className="input w-full"
                value={projectFromDate}
                onChange={(e) => setProjectFromDate(e.target.value)}
              />
            </div>
            <div>
              <label className="fieldset-label">To Date</label>
              <div className="flex flex-col">
                <input
                  type="date"
                  className="input w-full"
                  value={projectToDate}
                  onChange={(e) => setProjectToDate(e.target.value)}
                  disabled={isCurrentProject}
                />
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    className="checkbox mr-2"
                    checked={isCurrentProject}
                    onChange={(e) => setIsCurrentProject(e.target.checked)}
                  />
                  <span className="text-sm">Current Project</span>
                </div>
              </div>
            </div>
          </div>

          <label className="fieldset-label">Description</label>
          <textarea
            className="textarea w-full mb-2"
            placeholder="Brief description of the project and your contributions..."
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />

          <label className="fieldset-label">Responsibilities</label>
          <AddItemInput
            placeholder="Designed the database schema..."
            onAdd={handleAddProjectResponsibility}
          />

          <ItemsList
            items={projectResponsibilities}
            onRemove={handleRemoveProjectResponsibility}
            emptyMessage="No responsibilities added yet."
          />

          <label className="fieldset-label mt-4">Tech Stack</label>
          <AddItemInput
            placeholder="React, Node.js, MongoDB, etc."
            onAdd={handleAddProjectTechStack}
          />

          <ItemsList
            items={projectTechStacks}
            onRemove={handleRemoveProjectTechStack}
            emptyMessage="No tech stack items added yet."
          />

          <button
            className="btn btn-action w-full mt-4"
            onClick={handleAddProject}
            disabled={!projectName.trim() || !projectRole.trim() || !projectFromDate || !projectType.trim()}
          >
            Add Project
          </button>
        </div>

        <div>
          <label className="fieldset-label">Current Projects</label>
          <div className="overflow-y-auto max-h-96 border border-base-300 rounded-lg p-3">
            {personalCV.projects && personalCV.projects.length > 0 ? (
              personalCV.projects.map((project, projectIdx) => (
                <div key={projectIdx} className="mb-6 pb-4 border-b border-base-300 last:border-b-0 last:mb-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{project.projectName}</h3>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => {
                        setPersonalCV((p) => {
                          if (p.projects) {
                            p.projects = p.projects.filter((_, i) => i !== projectIdx);
                          }
                          return Object.assign({}, p);
                        });
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="ml-2 mt-1 mb-2">
                    <span className="badge badge-lg bg-base-200 text-base-content">{project.type}</span>
                  </div>

                  {project.positions.map((pos, posIdx) => (
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

                  {project.techStack && project.techStack.length > 0 && (
                    <div className="mt-3 ml-4">
                      <span className="text-sm font-semibold">Tech Stack:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.techStack.map((tech, techIdx) => (
                          <span key={techIdx} className="badge badge-lg bg-base-200 text-base-content">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-base-content/70 italic">
                No projects added yet. Add your projects to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default ProjectsSection;
