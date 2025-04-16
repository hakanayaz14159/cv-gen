"use client";

import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import { CVInformations, CVSkill } from "../../../lib/types";
import AddItemInput from "./shared/AddItemInput";
import ItemsList from "./shared/ItemsList";

// Extended CVSkill type with group property for UI purposes
interface ExtendedCVSkill extends CVSkill {
  group: string;
}

// Extended CVInformations type with skills array for UI purposes
interface ExtendedCVInformations extends Partial<CVInformations> {
  skills?: ExtendedCVSkill[];
}

type Props = {
  personalCV: ExtendedCVInformations;
  setPersonalCV: Dispatch<SetStateAction<ExtendedCVInformations>>;
};

const SkillsSection = ({ personalCV, setPersonalCV }: Props) => {
  // Skills state
  const [skillGroup, setSkillGroup] = useState("");
  const [skillGroups, setSkillGroups] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentSkillExperience, setCurrentSkillExperience] = useState<number>(0);
  const [currentSkillFeatured, setCurrentSkillFeatured] = useState<boolean>(false);

  // Ref to prevent double submissions
  const isAddingSkill = useRef(false);

  // Initialize skill groups from CV data if it exists
  useEffect(() => {
    if (personalCV.skills) {
      const groups = [...new Set(personalCV.skills.map((skill: ExtendedCVSkill) => skill.group))];
      setSkillGroups(groups as string[]);
    }
  }, []);

  const handleAddSkillGroup = (newGroup: string) => {
    if (skillGroups.includes(newGroup)) return;

    setSkillGroups(prev => [...prev, newGroup]);
    setSkillGroup(newGroup);
  };

  const handleRemoveSkillGroup = (index: number) => {
    const groupToRemove = skillGroups[index];

    // Remove the group from the list
    setSkillGroups(prev => prev.filter((_, i) => i !== index));

    // If the current selected group is being removed, reset it
    if (skillGroup === groupToRemove) {
      setSkillGroup("");
    }

    // Remove all skills with this group from the CV
    setPersonalCV(prev => {
      const newCV = { ...prev } as ExtendedCVInformations;
      if (newCV.skills) {
        newCV.skills = newCV.skills.filter((skill: ExtendedCVSkill) => skill.group !== groupToRemove);
      }
      return newCV;
    });
  };

  const handleAddSkill = () => {
    if (isAddingSkill.current || !currentSkill.trim() || !skillGroup) return;

    isAddingSkill.current = true;

    // Create the new skill
    const newSkill: ExtendedCVSkill = {
      name: currentSkill.trim(),
      group: skillGroup,
      experience: currentSkillExperience,
      featured: currentSkillFeatured
    };

    // Add the skill to the CV
    setPersonalCV(prev => {
      const newCV = { ...prev } as ExtendedCVInformations;
      if (!newCV.skills) {
        newCV.skills = [];
      }
      newCV.skills = [...newCV.skills, newSkill];
      return newCV;
    });

    // Reset the form
    setCurrentSkill("");
    setCurrentSkillExperience(0);
    setCurrentSkillFeatured(false);

    // Reset the flag after a delay
    setTimeout(() => {
      isAddingSkill.current = false;
    }, 100);
  };

  return (
    <fieldset className="fieldset col-span-3 p-4">
      <legend className="fieldset-legend">
        Skills
      </legend>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="fieldset-label">Skill Groups</label>
          <AddItemInput
            placeholder="Frontend, Backend, DevOps, etc."
            onAdd={handleAddSkillGroup}
          />

          <ItemsList
            items={skillGroups}
            onRemove={handleRemoveSkillGroup}
            emptyMessage="No skill groups added yet. Add a group to categorize your skills."
          />

          <div className="mt-4">
            <label className="fieldset-label">Add Skill</label>
            <div className="mb-2">
              <label className="text-sm">Select Group</label>
              <select
                className="select w-full"
                value={skillGroup}
                onChange={(e) => setSkillGroup(e.target.value)}
                disabled={skillGroups.length === 0}
              >
                <option value="" disabled>Select a skill group</option>
                {skillGroups.map((group, idx) => (
                  <option key={idx} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="text-sm">Skill Name</label>
              <input
                type="text"
                className="input w-full"
                placeholder="JavaScript, Python, Docker, etc."
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                disabled={!skillGroup}
              />
            </div>

            <div className="mb-2">
              <label className="text-sm">Experience (years)</label>
              <input
                type="number"
                className="input w-full"
                min="0"
                step="0.5"
                value={currentSkillExperience}
                onChange={(e) => setCurrentSkillExperience(Number(e.target.value))}
                disabled={!skillGroup}
              />
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                className="checkbox mr-2"
                checked={currentSkillFeatured}
                onChange={(e) => setCurrentSkillFeatured(e.target.checked)}
                disabled={!skillGroup}
              />
              <label className="text-sm">Featured Skill</label>
            </div>

            <button
              className="btn btn-action w-full"
              onClick={handleAddSkill}
              disabled={!skillGroup || !currentSkill.trim()}
            >
              Add Skill
            </button>
          </div>
        </div>

        <div>
          <label className="fieldset-label">Current Skills</label>
          <div className="overflow-y-auto max-h-96 border border-base-300 rounded-lg p-3">
            {personalCV.skills && personalCV.skills.length > 0 ? (
              <div>
                {skillGroups.map((group) => {
                  const groupSkills = personalCV.skills?.filter((skill: ExtendedCVSkill) => skill.group === group) || [];
                  if (groupSkills.length === 0) return null;

                  return (
                    <div key={group} className="mb-4">
                      <h3 className="font-semibold text-lg mb-2">{group}</h3>
                      <div className="flex flex-wrap gap-2 ml-2">
                        {groupSkills.map((skill: ExtendedCVSkill, skillIdx: number) => (
                          <div key={skillIdx} className="badge badge-lg bg-base-200 text-base-content flex items-center gap-1">
                            <span>{skill.name}</span>
                            {skill.experience > 0 && (
                              <span className="text-xs opacity-70">({skill.experience}y)</span>
                            )}
                            {skill.featured && (
                              <span className="text-xs">★</span>
                            )}
                            <button
                              className="ml-1 text-xs hover:text-error"
                              onClick={() => {
                                setPersonalCV(prev => {
                                  const newCV = { ...prev } as ExtendedCVInformations;
                                  if (newCV.skills) {
                                    // Find the exact skill to remove
                                    const skillIndex = newCV.skills.findIndex((s: ExtendedCVSkill) =>
                                      s.name === skill.name &&
                                      s.group === skill.group &&
                                      s.experience === skill.experience
                                    );
                                    if (skillIndex !== -1) {
                                      newCV.skills = [
                                        ...newCV.skills.slice(0, skillIndex),
                                        ...newCV.skills.slice(skillIndex + 1)
                                      ];
                                    }
                                  }
                                  return newCV;
                                });
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-base-content/70 italic">
                No skills added yet. Add your skills to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default SkillsSection;
