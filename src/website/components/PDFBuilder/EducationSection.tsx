"use client";

import { Dispatch, SetStateAction, useState, useRef } from "react";
import { CVInformations, CVEducation } from "../../../lib/types";
import { SchoolStatus } from "cv-gen";
import AddItemInput from "./shared/AddItemInput";
import ItemsList from "./shared/ItemsList";

type Props = {
  personalCV: Partial<CVInformations>;
  setPersonalCV: Dispatch<SetStateAction<Partial<CVInformations>>>;
};

const EducationSection = ({ personalCV, setPersonalCV }: Props) => {
  // Education state
  const [schoolName, setSchoolName] = useState("");
  const [schoolLocation, setSchoolLocation] = useState("");
  const [degree, setDegree] = useState("");
  const [entranceYear, setEntranceYear] = useState("");
  const [completionYear, setCompletionYear] = useState("");
  const [schoolStatus, setSchoolStatus] = useState<SchoolStatus>(SchoolStatus.COMPLETED);
  const [graduationScore, setGraduationScore] = useState<number | undefined>();
  const [educationNote, setEducationNote] = useState("");
  const [educationNotes, setEducationNotes] = useState<string[]>([]);

  // Refs to prevent double submissions
  const isAddingEducationNote = useRef(false);
  const isAddingEducation = useRef(false);

  // Function to handle adding education note
  const handleAddEducationNote = (newNote: string) => {
    setEducationNotes(prev => [...prev, newNote]);
  };

  // Function to handle removing education note
  const handleRemoveEducationNote = (index: number) => {
    setEducationNotes(prev => prev.filter((_, i) => i !== index));
  };

  // Function to handle adding education
  const handleAddEducation = () => {
    if (isAddingEducation.current || !schoolName.trim() || !schoolLocation.trim() || !degree.trim() || !entranceYear) {
      return;
    }

    isAddingEducation.current = true;

    // Capture current values
    const educationData = {
      schoolName: schoolName.trim(),
      schoolLocation: schoolLocation.trim(),
      degree: degree.trim(),
      entranceYear,
      completionYear,
      schoolStatus,
      graduationScore,
      educationNotes: [...educationNotes]
    };

    // Reset form fields immediately
    setSchoolName("");
    setSchoolLocation("");
    setDegree("");
    setEntranceYear("");
    setCompletionYear("");
    setSchoolStatus(SchoolStatus.COMPLETED);
    setGraduationScore(undefined);
    setEducationNote("");
    setEducationNotes([]);

    // Create education object
    const education: CVEducation = {
      schoolName: educationData.schoolName,
      schoolLocation: educationData.schoolLocation,
      degree: educationData.degree,
      entranceYear: new Date(educationData.entranceYear),
      currentStatus: educationData.schoolStatus
    };

    if (educationData.schoolStatus !== SchoolStatus.CONTINUING && educationData.completionYear) {
      education.completionYear = new Date(educationData.completionYear);
    }

    if (educationData.graduationScore !== undefined) {
      education.graduationScore = educationData.graduationScore;
    }

    if (educationData.educationNotes.length > 0) {
      education.notes = educationData.educationNotes;
    }

    // Update CV state
    setPersonalCV((p) => {
      const newCV = { ...p };
      if (!newCV.educations) {
        newCV.educations = [];
      }
      newCV.educations = [...newCV.educations, education];
      return newCV;
    });

    // Reset flag after a delay
    setTimeout(() => {
      isAddingEducation.current = false;
    }, 200);
  };

  return (
    <fieldset className="fieldset col-span-3 p-4">
      <legend className="fieldset-legend">
        Education
      </legend>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="fieldset-label">School/University Name</label>
              <input
                type="text"
                className="input w-full"
                placeholder="University of Technology"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
            <div>
              <label className="fieldset-label">Location</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Boston, MA"
                value={schoolLocation}
                onChange={(e) => setSchoolLocation(e.target.value)}
              />
            </div>
          </div>

          <label className="fieldset-label">Degree</label>
          <input
            type="text"
            className="input w-full mb-2"
            placeholder="Master of Science in Computer Science"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="fieldset-label">Entrance Year</label>
              <input
                type="date"
                className="input w-full"
                value={entranceYear}
                onChange={(e) => setEntranceYear(e.target.value)}
              />
            </div>
            <div>
              <label className="fieldset-label">Completion Year</label>
              <input
                type="date"
                className="input w-full"
                value={completionYear}
                onChange={(e) => setCompletionYear(e.target.value)}
                disabled={schoolStatus === SchoolStatus.CONTINUING}
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="fieldset-label">Status</label>
            <select
              className="select w-full"
              value={schoolStatus}
              onChange={(e) => setSchoolStatus(e.target.value as SchoolStatus)}
            >
              <option value={SchoolStatus.COMPLETED}>Completed</option>
              <option value={SchoolStatus.CONTINUING}>Continuing</option>
              <option value={SchoolStatus.DROPPED}>Dropped</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="fieldset-label">Graduation Score (optional)</label>
            <input
              type="number"
              className="input w-full"
              placeholder="3.85"
              step="0.01"
              min="0"
              max="4.0"
              value={graduationScore !== undefined ? graduationScore : ''}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                  setGraduationScore(undefined);
                } else {
                  setGraduationScore(parseFloat(value));
                }
              }}
            />
          </div>

          <label className="fieldset-label">Notes</label>
          <AddItemInput
            placeholder="Specialized in Distributed Systems..."
            onAdd={handleAddEducationNote}
          />

          <ItemsList
            items={educationNotes}
            onRemove={handleRemoveEducationNote}
            emptyMessage="No notes added yet."
          />

          <button
            className="btn btn-action w-full mt-4"
            onClick={handleAddEducation}
            disabled={!schoolName.trim() || !schoolLocation.trim() || !degree.trim() || !entranceYear}
          >
            Add Education
          </button>
        </div>

        <div>
          <label className="fieldset-label">Current Education</label>
          <div className="overflow-y-auto max-h-96 border border-base-300 rounded-lg p-3">
            {personalCV.educations && personalCV.educations.length > 0 ? (
              personalCV.educations.map((edu, eduIdx) => (
                <div key={eduIdx} className="mb-6 pb-4 border-b border-base-300 last:border-b-0 last:mb-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">{edu.schoolName}</h3>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => {
                        setPersonalCV((p) => {
                          if (p.educations) {
                            p.educations = p.educations.filter((_, i) => i !== eduIdx);
                          }
                          return Object.assign({}, p);
                        });
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="ml-2 p-3 bg-base-200 rounded-md">
                    {edu.schoolLocation && <div className="text-sm opacity-80">{edu.schoolLocation}</div>}
                    <div className="font-semibold mt-1">{edu.degree}</div>
                    <div className="text-sm opacity-80 mt-1">
                      {new Date(edu.entranceYear).toLocaleDateString()} -
                      {edu.completionYear ? new Date(edu.completionYear).toLocaleDateString() : 'Present'}
                    </div>
                    <div className="text-sm mt-2 flex flex-wrap gap-2">
                      <span className="badge badge-sm bg-base-100">{edu.currentStatus}</span>
                      {edu.graduationScore !== undefined && (
                        <span className="badge badge-sm bg-base-100">Score: {edu.graduationScore}</span>
                      )}
                    </div>

                    {edu.notes && edu.notes.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm font-semibold">Notes:</span>
                        <ul className="list-disc pl-5 text-sm mt-1">
                          {edu.notes.map((note, noteIdx) => (
                            <li key={noteIdx}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-base-content/70 italic">
                No education entries added yet. Add your education to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
};

export default EducationSection;
