"use client";

import { useEffect, useState, useRef } from "react";
import { CVGeneratorConfig, CVInformations, CVSkill, CVExperience, CVPosition, CVEducation, CVCertificate, CVLanguage } from "../../lib/types";
import { SchoolStatus, LanguageProficiency } from "cv-gen";
import { formatPhoneNumberPart, formatUrl, isValidEmail, COMMON_COUNTRY_CODES } from "../helper/formatters";

type Props = {
  changeCB: (update: Partial<CVInformations>) => void;
  onConfigChange: (config: CVGeneratorConfig) => void;
};

const PDFBuilder = ({ changeCB, onConfigChange }: Props) => {
  const [personalCV, setPersonalCV] = useState<Partial<CVInformations>>({});
  const [configOverride, setConfigOverride] = useState<CVGeneratorConfig>({});

  // Contact information state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");

  // Skills state
  const [skillGroup, setSkillGroup] = useState("");
  const [skillGroups, setSkillGroups] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentSkillExperience, setCurrentSkillExperience] = useState<number>(0);
  const [currentSkillFeatured, setCurrentSkillFeatured] = useState<boolean>(false);

  // Refs to prevent double submissions
  const isAddingSkill = useRef(false);
  const isAddingSkillGroup = useRef(false);
  const isAddingResponsibility = useRef(false);
  const isAddingTechStack = useRef(false);
  const isAddingExperience = useRef(false);
  const isAddingProjectResponsibility = useRef(false);
  const isAddingProjectTechStack = useRef(false);
  const isAddingProject = useRef(false);
  const isAddingEducationNote = useRef(false);
  const isAddingEducation = useRef(false);
  const isAddingCertificate = useRef(false);
  const isAddingLanguage = useRef(false);

  // Experience state
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isCurrentPosition, setIsCurrentPosition] = useState(false);
  const [description, setDescription] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [responsibilities, setResponsibilities] = useState<string[]>([]);
  const [techStack, setTechStack] = useState("");
  const [techStacks, setTechStacks] = useState<string[]>([]);

  // Function to handle adding experience - defined outside the click handler
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
    setResponsibility("");
    setResponsibilities([]);
    setTechStack("");
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

  // Project state
  const [projectName, setProjectName] = useState("");
  const [projectRole, setProjectRole] = useState("");
  const [projectFromDate, setProjectFromDate] = useState("");
  const [projectToDate, setProjectToDate] = useState("");
  const [isCurrentProject, setIsCurrentProject] = useState(false);
  const [projectDescription, setProjectDescription] = useState("");
  const [projectResponsibility, setProjectResponsibility] = useState("");
  const [projectResponsibilities, setProjectResponsibilities] = useState<string[]>([]);
  const [projectTechStack, setProjectTechStack] = useState("");
  const [projectTechStacks, setProjectTechStacks] = useState<string[]>([]);
  const [projectType, setProjectType] = useState("");

  // Function to handle adding project - defined outside the click handler
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
    setProjectResponsibility("");
    setProjectResponsibilities([]);
    setProjectTechStack("");
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

  // Function to handle adding education - defined outside the click handler
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

  // Certificate state
  const [certificateName, setCertificateName] = useState("");
  const [issuingOrganization, setIssuingOrganization] = useState("");
  const [acquiredDate, setAcquiredDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [hasExpiry, setHasExpiry] = useState(false);
  const [verificationId, setVerificationId] = useState("");

  // Function to handle adding certificate - defined outside the click handler
  const handleAddCertificate = () => {
    if (isAddingCertificate.current || !certificateName.trim() || !issuingOrganization.trim() || !acquiredDate) {
      return;
    }

    isAddingCertificate.current = true;

    // Capture current values
    const certificateData = {
      certificateName: certificateName.trim(),
      issuingOrganization: issuingOrganization.trim(),
      acquiredDate,
      expiryDate,
      hasExpiry,
      verificationId: verificationId.trim()
    };

    // Reset form fields immediately
    setCertificateName("");
    setIssuingOrganization("");
    setAcquiredDate("");
    setExpiryDate("");
    setHasExpiry(false);
    setVerificationId("");

    // Create certificate object
    const certificate: CVCertificate = {
      name: certificateData.certificateName,
      issuingOrganization: certificateData.issuingOrganization,
      acquiredWhen: new Date(certificateData.acquiredDate)
    };

    if (certificateData.hasExpiry && certificateData.expiryDate) {
      certificate.endsWhen = new Date(certificateData.expiryDate);
    }

    if (certificateData.verificationId !== "") {
      certificate.verificationId = certificateData.verificationId;
    }

    // Update CV state
    setPersonalCV((p) => {
      const newCV = { ...p };
      if (!newCV.certificates) {
        newCV.certificates = [];
      }
      newCV.certificates = [...newCV.certificates, certificate];
      return newCV;
    });

    // Reset flag after a delay
    setTimeout(() => {
      isAddingCertificate.current = false;
    }, 200);
  };

  // Language state
  const [language, setLanguage] = useState("");
  const [proficiency, setProficiency] = useState<LanguageProficiency>(LanguageProficiency.B2);

  // Function to handle adding language - defined outside the click handler
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
        <div className="relative">
          <input
            type="text"
            className={`input w-full ${personalCV.contactInformations?.email && !isValidEmail(personalCV.contactInformations.email) ? 'border-red-500' : ''}`}
            placeholder="alexandra.johnson@example.com"
            onChange={(e) => {
              const email = e.target.value.trim();
              setPersonalCV((p) => {
                if (p.contactInformations === undefined) {
                  p.contactInformations = {};
                }

                if (email.length > 0) {
                  // Store the email and validate it
                  p.contactInformations.email = email;
                } else {
                  delete p.contactInformations.email;
                }

                return Object.assign({}, p);
              });
            }}
          />
          {personalCV.contactInformations?.email && !isValidEmail(personalCV.contactInformations.email) && (
            <div className="text-xs text-red-500 mt-1">
              Please enter a valid email address
            </div>
          )}
        </div>
        <label className="fieldset-label">Phone Number</label>
        <div className="relative">
          <div className="flex mb-1">
            <select
              className="select select-bordered w-1/3 mr-2"
              value={selectedCountryCode}
              onChange={(e) => {
                setSelectedCountryCode(e.target.value);

                // Update the CV data with the new country code
                setPersonalCV((p) => {
                  if (p.contactInformations === undefined) {
                    p.contactInformations = {};
                  }

                  // Combine country code with existing phone number
                  if (phoneNumber.trim().length > 0) {
                    p.contactInformations.phoneNumber = `${e.target.value} ${phoneNumber}`.trim();
                  }

                  return Object.assign({}, p);
                });
              }}
            >
              {COMMON_COUNTRY_CODES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag ? `${country.flag} ` : ''}{country.code} {country.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="input input-bordered w-2/3"
              placeholder="555 123 4567"
              value={phoneNumber}
              onChange={(e) => {
                // Get the raw input value and format it (just the number part)
                const inputValue = e.target.value;
                const formattedValue = formatPhoneNumberPart(inputValue, selectedCountryCode);

                // Update the state with the formatted value
                setPhoneNumber(formattedValue);

                // Update the CV data
                setPersonalCV((p) => {
                  if (p.contactInformations === undefined) {
                    p.contactInformations = {};
                  }

                  if (formattedValue.trim().length > 0) {
                    // Combine country code with formatted phone number
                    p.contactInformations.phoneNumber = `${selectedCountryCode} ${formattedValue}`.trim();
                  } else {
                    // If phone number is empty but country code is selected, just store the country code
                    p.contactInformations.phoneNumber = selectedCountryCode;
                  }

                  return Object.assign({}, p);
                });
              }}
            />
          </div>
        </div>
        <label className="fieldset-label">Website / Portfolio</label>
        <input
          type="text"
          className="input"
          placeholder="https://alexandrajohnson.dev"
          onChange={(e) => {
            setPersonalCV((p) => {
              if (p.contactInformations === undefined) {
                p.contactInformations = {};
              }

              if (e.target.value.trim().length > 0) {
                // Format the URL to ensure it has the proper protocol
                p.contactInformations.webpage = formatUrl(e.target.value.trim());
              } else {
                delete p.contactInformations.webpage;
              }

              return Object.assign({}, p);
            });
          }}
        />
        <label className="fieldset-label">Github</label>
        <input
          type="text"
          className="input"
          placeholder="https://github.com/alexjohnson"
          onChange={(e) => {
            setPersonalCV((p) => {
              if (p.contactInformations === undefined) {
                p.contactInformations = {};
              }

              if (e.target.value.trim().length > 0) {
                // Format the GitHub URL to ensure it has the proper protocol
                p.contactInformations.github = formatUrl(e.target.value.trim());
              } else {
                delete p.contactInformations.github;
              }

              return Object.assign({}, p);
            });
          }}
        />

        <label className="fieldset-label">Linkedin</label>
        <input
          type="text"
          className="input"
          placeholder="https://linkedin.com/in/alexandra-johnson"
          onChange={(e) => {
            setPersonalCV((p) => {
              if (p.contactInformations === undefined) {
                p.contactInformations = {};
              }

              if (e.target.value.trim().length > 0) {
                // Format the LinkedIn URL to ensure it has the proper protocol
                p.contactInformations.linkedIn = formatUrl(e.target.value.trim());
              } else {
                delete p.contactInformations.linkedIn;
              }

              return Object.assign({}, p);
            });
          }}
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
          onChange={(e) => {
            setPersonalCV((p) => {
              if (e.target.value.trim().length > 0) {
                p.about = e.target.value.trim();
              } else {
                delete p.about;
              }

              return Object.assign({}, p);
            });
          }}
        ></textarea>
      </fieldset>
      <fieldset className="fieldset bg-base-100 col-span-3 border border-base-300 p-4">
        <legend className="fieldset-legend text-lg bg-primary p-1">
          Skills
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="fieldset-label">Skill Group</label>
            <div className="flex flex-row mb-2">
              <input
                type="text"
                className="input join-item"
                placeholder="Programming Languages"
                value={skillGroup}
                onChange={(e) => setSkillGroup(e.target.value)}
              />
              <button
                className="btn btn-neutral join-item"
                onClick={() => {
                  // Prevent multiple clicks
                  if (isAddingSkillGroup.current) return;

                  if (skillGroup.trim() !== "" && !skillGroups.includes(skillGroup)) {
                    isAddingSkillGroup.current = true;

                    const trimmedGroupName = skillGroup.trim();

                    // Update state
                    setSkillGroups([...skillGroups, trimmedGroupName]);
                    setPersonalCV((p) => {
                      if (!p.skillDetails) {
                        p.skillDetails = {};
                      }
                      if (!p.skillDetails[trimmedGroupName]) {
                        p.skillDetails[trimmedGroupName] = [];
                      }
                      return Object.assign({}, p);
                    });

                    // Reset input
                    setSkillGroup("");

                    // Reset flag after a short delay
                    setTimeout(() => {
                      isAddingSkillGroup.current = false;
                    }, 100);
                  }
                }}
              >
                Add Group
              </button>
            </div>

            {skillGroups.length > 0 && (
              <div className="mb-4">
                <label className="fieldset-label">Select Group</label>
                <select
                  className="select w-full"
                  onChange={(e) => setSkillGroup(e.target.value)}
                >
                  <option value="">Select a skill group</option>
                  {skillGroups.map((group, index) => (
                    <option key={index} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            )}

            {skillGroup && (
              <div>
                <label className="fieldset-label">Add Skill to {skillGroup}</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Skill name"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <label className="fieldset-label">Experience (years):</label>
                    <input
                      type="number"
                      className="input w-24"
                      min="0"
                      max="20"
                      value={currentSkillExperience}
                      onChange={(e) => setCurrentSkillExperience(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="fieldset-label">Featured:</label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={currentSkillFeatured}
                      onChange={(e) => setCurrentSkillFeatured(e.target.checked)}
                    />
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => {
                      // Prevent multiple clicks
                      if (isAddingSkill.current) return;

                      if (currentSkill.trim() !== "" && skillGroup) {
                        isAddingSkill.current = true;

                        const trimmedSkillName = currentSkill.trim();

                        // Check if skill already exists in the current state
                        const currentSkills = personalCV.skillDetails?.[skillGroup] || [];
                        const skillExists = currentSkills.some(
                          skill => skill.name.toLowerCase() === trimmedSkillName.toLowerCase()
                        );

                        if (skillExists) {
                          alert(`Skill "${trimmedSkillName}" already exists in ${skillGroup}`);
                          isAddingSkill.current = false;
                          return;
                        }

                        // Create the new skill
                        const newSkill: CVSkill = {
                          name: trimmedSkillName,
                          experience: currentSkillExperience,
                          featured: currentSkillFeatured
                        };

                        // Create a new skills array with the new skill added
                        const updatedSkills = [...currentSkills, newSkill];

                        // Create a new skillDetails object
                        const updatedSkillDetails = {
                          ...personalCV.skillDetails,
                          [skillGroup]: updatedSkills
                        };

                        // Update the CV with the new skillDetails
                        const updatedCV = {
                          ...personalCV,
                          skillDetails: updatedSkillDetails
                        };

                        // Set the updated CV
                        setPersonalCV(updatedCV);

                        // Reset form fields
                        setCurrentSkill("");
                        setCurrentSkillExperience(0);
                        setCurrentSkillFeatured(false);

                        // Reset the flag after a short delay
                        setTimeout(() => {
                          isAddingSkill.current = false;
                        }, 100);
                      }
                    }}
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="fieldset-label">Current Skills</label>
            <div className="overflow-y-auto max-h-60 border border-base-300 rounded-lg p-2">
              {skillGroups.map((group) => (
                <div key={group} className="mb-4">
                  <h3 className="font-bold">{group}</h3>
                  <ul className="list-disc pl-5">
                    {personalCV.skillDetails && personalCV.skillDetails[group] &&
                      personalCV.skillDetails[group].map((skill, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                          <span>
                            {skill.name} ({skill.experience} years)
                            {skill.featured && <span className="text-primary ml-2">★</span>}
                          </span>
                          <button
                            className="btn btn-xs btn-error"
                            onClick={() => {
                              setPersonalCV((p) => {
                                if (p.skillDetails && p.skillDetails[group]) {
                                  p.skillDetails[group] = p.skillDetails[group].filter((_, i) => i !== idx);
                                }
                                return Object.assign({}, p);
                              });
                            }}
                          >
                            Remove
                          </button>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="fieldset bg-base-100 col-span-3 border border-base-300 p-4">
        <legend className="fieldset-legend text-lg bg-primary p-1">
          Experiences
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="fieldset-label">Company Name</label>
            <input
              type="text"
              className="input w-full mb-2"
              placeholder="TechCorp Solutions"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <label className="fieldset-label">Role/Position</label>
            <input
              type="text"
              className="input w-full mb-2"
              placeholder="Senior Software Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />

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
              placeholder="Brief description of your role"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <label className="fieldset-label">Responsibilities</label>
            <div className="flex flex-row mb-2">
              <input
                type="text"
                className="input join-item"
                placeholder="Led a team of 5 developers..."
                value={responsibility}
                onChange={(e) => setResponsibility(e.target.value)}
              />
              <button
                className="btn btn-neutral join-item"
                onClick={() => {
                  // Prevent multiple clicks
                  if (isAddingResponsibility.current) return;

                  if (responsibility.trim() !== "") {
                    isAddingResponsibility.current = true;

                    const trimmedResponsibility = responsibility.trim();

                    // Update state
                    setResponsibilities([...responsibilities, trimmedResponsibility]);

                    // Reset input
                    setResponsibility("");

                    // Reset flag after a short delay
                    setTimeout(() => {
                      isAddingResponsibility.current = false;
                    }, 100);
                  }
                }}
              >
                Add
              </button>
            </div>

            {responsibilities.length > 0 && (
              <div className="mb-4 border border-base-300 rounded-lg p-2 max-h-32 overflow-y-auto">
                <ul className="list-disc pl-5">
                  {responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="text-sm">{resp}</span>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => {
                          setResponsibilities(responsibilities.filter((_, i) => i !== idx));
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <label className="fieldset-label">Tech Stack</label>
            <div className="flex flex-row mb-2">
              <input
                type="text"
                className="input join-item"
                placeholder="JavaScript"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
              />
              <button
                className="btn btn-neutral join-item"
                onClick={() => {
                  // Prevent multiple clicks
                  if (isAddingTechStack.current) return;

                  if (techStack.trim() !== "") {
                    isAddingTechStack.current = true;

                    const trimmedTechStack = techStack.trim();

                    // Update state
                    setTechStacks([...techStacks, trimmedTechStack]);

                    // Reset input
                    setTechStack("");

                    // Reset flag after a short delay
                    setTimeout(() => {
                      isAddingTechStack.current = false;
                    }, 100);
                  }
                }}
              >
                Add
              </button>
            </div>

            {techStacks.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1">
                {techStacks.map((tech, idx) => (
                  <div key={idx} className="badge badge-primary badge-lg gap-1">
                    {tech}
                    <button
                      className="btn btn-xs btn-circle btn-ghost"
                      onClick={() => {
                        setTechStacks(techStacks.filter((_, i) => i !== idx));
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn btn-primary w-full mt-4"
              onClick={handleAddExperience}
            >
              Add Experience
            </button>
          </div>

          <div>
            <label className="fieldset-label">Current Experiences</label>
            <div className="overflow-y-auto max-h-96 border border-base-300 rounded-lg p-2">
              {personalCV.experiences && personalCV.experiences.map((exp, expIdx) => (
                <div key={expIdx} className="mb-6 pb-4 border-b border-base-300">
                  <div className="flex justify-between items-center">
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
                    <div key={posIdx} className="ml-4 mt-2">
                      <div className="font-semibold">{pos.role}</div>
                      <div className="text-sm">
                        {new Date(pos.fromDate).toLocaleDateString()} -
                        {pos.toDate ? new Date(pos.toDate).toLocaleDateString() : 'Present'}
                      </div>
                      {pos.description && <p className="text-sm mt-1">{pos.description}</p>}

                      {pos.responsibilities && pos.responsibilities.length > 0 && (
                        <div className="mt-1">
                          <span className="text-sm font-semibold">Responsibilities:</span>
                          <ul className="list-disc pl-5 text-sm">
                            {pos.responsibilities.map((resp, respIdx) => (
                              <li key={respIdx}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}

                  {exp.techStack && exp.techStack.length > 0 && (
                    <div className="mt-2 ml-4">
                      <span className="text-sm font-semibold">Tech Stack:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exp.techStack.map((tech, techIdx) => (
                          <span key={techIdx} className="badge badge-outline">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="fieldset bg-base-100 col-span-3 border border-base-300 p-4">
        <legend className="fieldset-legend text-lg bg-primary p-1">
          Projects
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="fieldset-label">Project Name</label>
            <input
              type="text"
              className="input w-full mb-2"
              placeholder="Enterprise Resource Planning System"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <label className="fieldset-label">Project Type</label>
            <input
              type="text"
              className="input w-full mb-2"
              placeholder="Client Project, Open Source, Personal, etc."
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            />

            <label className="fieldset-label">Role/Position</label>
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
              placeholder="Brief description of your role in the project"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            ></textarea>

            <label className="fieldset-label">Responsibilities</label>
            <div className="flex flex-row mb-2">
              <input
                type="text"
                className="input join-item"
                placeholder="Designed the overall system architecture..."
                value={projectResponsibility}
                onChange={(e) => setProjectResponsibility(e.target.value)}
              />
              <button
                className="btn btn-neutral join-item"
                onClick={() => {
                  // Prevent multiple clicks
                  if (isAddingProjectResponsibility.current) return;

                  if (projectResponsibility.trim() !== "") {
                    isAddingProjectResponsibility.current = true;

                    const trimmedResponsibility = projectResponsibility.trim();

                    // Update state
                    setProjectResponsibilities([...projectResponsibilities, trimmedResponsibility]);

                    // Reset input
                    setProjectResponsibility("");

                    // Reset flag after a short delay
                    setTimeout(() => {
                      isAddingProjectResponsibility.current = false;
                    }, 100);
                  }
                }}
              >
                Add
              </button>
            </div>

            {projectResponsibilities.length > 0 && (
              <div className="mb-4 border border-base-300 rounded-lg p-2 max-h-32 overflow-y-auto">
                <ul className="list-disc pl-5">
                  {projectResponsibilities.map((resp, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="text-sm">{resp}</span>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => {
                          setProjectResponsibilities(projectResponsibilities.filter((_, i) => i !== idx));
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <label className="fieldset-label">Tech Stack</label>
            <div className="flex flex-row mb-2">
              <input
                type="text"
                className="input join-item"
                placeholder="React"
                value={projectTechStack}
                onChange={(e) => setProjectTechStack(e.target.value)}
              />
              <button
                className="btn btn-neutral join-item"
                onClick={() => {
                  // Prevent multiple clicks
                  if (isAddingProjectTechStack.current) return;

                  if (projectTechStack.trim() !== "") {
                    isAddingProjectTechStack.current = true;

                    const trimmedTechStack = projectTechStack.trim();

                    // Update state
                    setProjectTechStacks([...projectTechStacks, trimmedTechStack]);

                    // Reset input
                    setProjectTechStack("");

                    // Reset flag after a short delay
                    setTimeout(() => {
                      isAddingProjectTechStack.current = false;
                    }, 100);
                  }
                }}
              >
                Add
              </button>
            </div>

            {projectTechStacks.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1">
                {projectTechStacks.map((tech, idx) => (
                  <div key={idx} className="badge badge-primary badge-lg gap-1">
                    {tech}
                    <button
                      className="btn btn-xs btn-circle btn-ghost"
                      onClick={() => {
                        setProjectTechStacks(projectTechStacks.filter((_, i) => i !== idx));
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn btn-primary w-full mt-4"
              onClick={handleAddProject}
            >
              Add Project
            </button>
          </div>

          <div>
            <label className="fieldset-label">Current Projects</label>
            <div className="overflow-y-auto max-h-96 border border-base-300 rounded-lg p-2">
              {personalCV.projects && personalCV.projects.map((project, projectIdx) => (
                <div key={projectIdx} className="mb-6 pb-4 border-b border-base-300">
                  <div className="flex justify-between items-center">
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

                  <div className="ml-4 mt-1">
                    <span className="badge badge-outline">{project.type}</span>
                  </div>

                  {project.positions.map((pos, posIdx) => (
                    <div key={posIdx} className="ml-4 mt-2">
                      <div className="font-semibold">{pos.role}</div>
                      <div className="text-sm">
                        {new Date(pos.fromDate).toLocaleDateString()} -
                        {pos.toDate ? new Date(pos.toDate).toLocaleDateString() : 'Present'}
                      </div>
                      {pos.description && <p className="text-sm mt-1">{pos.description}</p>}

                      {pos.responsibilities && pos.responsibilities.length > 0 && (
                        <div className="mt-1">
                          <span className="text-sm font-semibold">Responsibilities:</span>
                          <ul className="list-disc pl-5 text-sm">
                            {pos.responsibilities.map((resp, respIdx) => (
                              <li key={respIdx}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}

                  {project.techStack && project.techStack.length > 0 && (
                    <div className="mt-2 ml-4">
                      <span className="text-sm font-semibold">Tech Stack:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.techStack.map((tech, techIdx) => (
                          <span key={techIdx} className="badge badge-outline">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="fieldset bg-base-100 col-span-3 border border-base-300 p-4">
        <legend className="fieldset-legend text-lg bg-primary p-1">
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
            <div className="flex flex-row mb-2">
              <input
                type="text"
                className="input join-item"
                placeholder="Specialized in Distributed Systems..."
                value={educationNote}
                onChange={(e) => setEducationNote(e.target.value)}
              />
              <button
                className="btn btn-neutral join-item"
                onClick={() => {
                  // Prevent multiple clicks
                  if (isAddingEducationNote.current) return;

                  if (educationNote.trim() !== "") {
                    isAddingEducationNote.current = true;

                    const trimmedNote = educationNote.trim();

                    // Update state
                    setEducationNotes([...educationNotes, trimmedNote]);

                    // Reset input
                    setEducationNote("");

                    // Reset flag after a short delay
                    setTimeout(() => {
                      isAddingEducationNote.current = false;
                    }, 100);
                  }
                }}
              >
                Add
              </button>
            </div>

            {educationNotes.length > 0 && (
              <div className="mb-4 border border-base-300 rounded-lg p-2 max-h-32 overflow-y-auto">
                <ul className="list-disc pl-5">
                  {educationNotes.map((note, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span className="text-sm">{note}</span>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => {
                          setEducationNotes(educationNotes.filter((_, i) => i !== idx));
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="btn btn-primary w-full mt-4"
              onClick={handleAddEducation}
            >
              Add Education
            </button>
          </div>

          <div>
            <label className="fieldset-label">Current Education</label>
            <div className="overflow-y-auto max-h-96 border border-base-300 rounded-lg p-2">
              {personalCV.educations && personalCV.educations.map((edu, eduIdx) => (
                <div key={eduIdx} className="mb-6 pb-4 border-b border-base-300">
                  <div className="flex justify-between items-center">
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

                  <div className="ml-4">
                    <div className="text-sm">{edu.schoolLocation}</div>
                    <div className="font-semibold mt-1">{edu.degree}</div>
                    <div className="text-sm">
                      {new Date(edu.entranceYear).toLocaleDateString()} -
                      {edu.completionYear ? new Date(edu.completionYear).toLocaleDateString() : 'Present'}
                    </div>
                    <div className="text-sm">
                      Status: <span className="badge badge-outline">{edu.currentStatus}</span>
                      {edu.graduationScore !== undefined && (
                        <span className="ml-2">Score: {edu.graduationScore}</span>
                      )}
                    </div>

                    {edu.notes && edu.notes.length > 0 && (
                      <div className="mt-1">
                        <span className="text-sm font-semibold">Notes:</span>
                        <ul className="list-disc pl-5 text-sm">
                          {edu.notes.map((note, noteIdx) => (
                            <li key={noteIdx}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="fieldset bg-base-100 col-span-3 border border-base-300 p-4">
        <legend className="fieldset-legend text-lg bg-primary p-1">
          Certificates
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="fieldset-label">Certificate Name</label>
            <input
              type="text"
              className="input w-full mb-2"
              placeholder="AWS Certified Solutions Architect"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
            />

            <label className="fieldset-label">Issuing Organization</label>
            <input
              type="text"
              className="input w-full mb-2"
              placeholder="Amazon Web Services"
              value={issuingOrganization}
              onChange={(e) => setIssuingOrganization(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="fieldset-label">Acquired Date</label>
                <input
                  type="date"
                  className="input w-full"
                  value={acquiredDate}
                  onChange={(e) => setAcquiredDate(e.target.value)}
                />
              </div>
              <div>
                <label className="fieldset-label">Expiry Date</label>
                <div className="flex flex-col">
                  <input
                    type="date"
                    className="input w-full"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    disabled={!hasExpiry}
                  />
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      className="checkbox mr-2"
                      checked={hasExpiry}
                      onChange={(e) => setHasExpiry(e.target.checked)}
                    />
                    <span className="text-sm">Has Expiry Date</span>
                  </div>
                </div>
              </div>
            </div>

            <label className="fieldset-label">Verification ID (optional)</label>
            <input
              type="text"
              className="input w-full mb-2"
              placeholder="ABC123XYZ"
              value={verificationId}
              onChange={(e) => setVerificationId(e.target.value)}
            />

            <button
              className="btn btn-primary w-full mt-4"
              onClick={handleAddCertificate}
            >
              Add Certificate
            </button>
          </div>

          <div>
            <label className="fieldset-label">Current Certificates</label>
            <div className="overflow-y-auto max-h-96 border border-base-300 rounded-lg p-2">
              {personalCV.certificates && personalCV.certificates.map((cert, certIdx) => (
                <div key={certIdx} className="mb-4 pb-3 border-b border-base-300">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{cert.name}</h3>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => {
                        setPersonalCV((p) => {
                          if (p.certificates) {
                            p.certificates = p.certificates.filter((_, i) => i !== certIdx);
                          }
                          return Object.assign({}, p);
                        });
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="ml-4">
                    <div className="text-sm">{cert.issuingOrganization}</div>
                    <div className="text-sm">
                      Acquired: {new Date(cert.acquiredWhen).toLocaleDateString()}
                      {cert.endsWhen && (
                        <span> | Expires: {new Date(cert.endsWhen).toLocaleDateString()}</span>
                      )}
                    </div>
                    {cert.verificationId && (
                      <div className="text-sm">Verification ID: {cert.verificationId}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="fieldset bg-base-100 col-span-3 border border-base-300 p-4">
        <legend className="fieldset-legend text-lg bg-primary p-1">
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
              className="btn btn-primary w-full"
              onClick={handleAddLanguage}
            >
              Add Language
            </button>
          </div>

          <div>
            <label className="fieldset-label">Current Languages</label>
            <div className="overflow-y-auto max-h-60 border border-base-300 rounded-lg p-2">
              {personalCV.languages && personalCV.languages.map((lang, langIdx) => (
                <div key={langIdx} className="mb-2 flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{lang.language}</span>
                    <span className="ml-2 badge badge-primary">{lang.proficiency}</span>
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
              ))}
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default PDFBuilder;
