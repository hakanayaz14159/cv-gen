import type { jsPDF } from "jspdf";
import { CVSection, LanguageProficiency, SchoolStatus } from "./enum";

export interface ContactDetails {
  email?: string;
  phoneNumber?: string;
  webpage?: string;
  github?: string;
  linkedIn?: string;
}

export interface CVSkill {
  name: string;
  experience?: number;
  featured?: boolean;
}

export interface CVCertificate {
  name: string;
  issuingOrganization: string;
  acquiredWhen: Date;
  endsWhen?: Date;
  verificationId?: string;
}

export interface CVPosition {
  role: string;
  fromDate: Date;
  toDate?: Date;
  description?: string;
  responsibilities?: string[];
}

export interface CVExperience {
  companyName: string;
  positions: CVPosition[];
  techStack?: string[];
}

export interface CVProject {
  projectName: string;
  positions: CVPosition[];
  techStack?: string[];
  type: string;
}

export interface CVEducation {
  schoolName: string;
  schoolLocation: string;
  degree: string;
  entranceYear: Date;
  completionYear?: Date;
  currentStatus: SchoolStatus;
  graduationScore?: number;
  notes?: string[];
}

export interface CVLanguage {
  language: string;
  proficiency: LanguageProficiency;
}

export interface CVGeneratorConfig {
  layout?: CVSection[];
  marginX?: number;
  marginY?: number;
  lineSpacing?: number;
  font?: string;
  fontScale?: number;
  contactOrientation?: "horizontal" | "vertical";
  languageGrader?: "common" | "cefr";
  titleLocation?: "left" | "center" | "right";
}

export interface CVInformations {
  name: string;
  personalTitle: string;
  contactInformations: ContactDetails;
  about?: string;
  skillDetails: Record<string, CVSkill[]>;
  experiences?: CVExperience[];
  projects?: CVProject[];
  educations?: CVEducation[];
  certificates?: CVCertificate[];
  languages?: CVLanguage[];
}

export interface Position {
  x: number;
  y: number;
}

export interface CVGeneratorInterface {
  config: Required<CVGeneratorConfig>;
  doc: jsPDF;
  posTracker: Position;
}
