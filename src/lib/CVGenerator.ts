import jsPDF from "jspdf";
import moment from "moment";
import {
  CVCertificate,
  CVEducation,
  CVExperience,
  CVLanguage,
  CVGeneratorConfig,
  CVGeneratorInterface,
  CVInformations,
  CVProject,
  CVSkill,
  ContactDetails,
  Position,
} from "./types";

import { CVSection, LanguageProficiency, SchoolStatus } from "./enum";

const aboutTitle = "About";
const expTitle = "Experiences";
const skillsTitle = "Skills";
const projectsTitle = "Projects";
const educationTitle = "Education";
const certTitle = "Certificates";
const langTitle = "Languages";

const defaultConfig: Required<CVGeneratorConfig> = {
  marginX: 10,
  marginY: 15,
  lineSpacing: 7,
  font: "Helvatica",
  fontScale: 1,
  titleLocation: "left",
  languageGrader: "common",
  contactOrientation: "horizontal",
  layout: [
    CVSection.ABOUT,
    CVSection.SKILLS,
    CVSection.EXPERIENCES,
    CVSection.PROJECTS,
    CVSection.EDUCATION,
    CVSection.CERTIFICATES,
    CVSection.LANGUAGES,
  ],
};

function levelToProficiency(proficiency: LanguageProficiency) {
  switch (proficiency) {
    case LanguageProficiency.A1:
    case LanguageProficiency.A2:
      return "Elementary Proficiency";
    case LanguageProficiency.B1:
      return "Limited Working Proficiency";
    case LanguageProficiency.B2:
      return "Professional Working Proficiency";
    case LanguageProficiency.C1:
    case LanguageProficiency.C2:
      return "Full Professional Proficiency";
    case LanguageProficiency.NATIVE:
      return "Native / Bilingual Proficiency";
  }
}

export class CVGenerator implements CVGeneratorInterface {
  config: Required<CVGeneratorConfig>;
  doc: jsPDF;
  posTracker: Position;
  fontTracker: { url: string; id: string; style: string }[];

  constructor(config: CVGeneratorConfig = {}) {
    this.config = {
      ...defaultConfig,
      ...config,
    } as Required<CVGeneratorConfig>;
    this.doc = new jsPDF();
    this.posTracker = { x: 0, y: 0 };
    this.fontTracker = [];
  }

  addFont(url: string, id: string, style: string) {
    this.fontTracker.push({ url, id, style });
  }

  ensurePageSize(checkSize: number = 1) {
    const maxHeight =
      this.doc.internal.pageSize.getHeight() - this.config.marginY;

    if (maxHeight <= this.posTracker.y + this.config.lineSpacing * checkSize) {
      this.doc.addPage("a4").setPage(this.doc.getNumberOfPages());
      this.posTracker.y = this.config.marginY;
    }
  }

  addHorizontalLine() {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    this.doc.line(
      this.config.marginX,
      this.posTracker.y,
      pageWidth - this.config.marginX,
      this.posTracker.y,
    );

    this.posTracker.y += this.config.lineSpacing * 0.2;
  }

  addTitleSection(name: string, personalTitle: string) {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    switch (this.config.titleLocation) {
      case "left":
        {
          this.doc
            .setFont(this.config.font)
            .setFontSize(18 * this.config.fontScale)
            .text(name, this.config.marginX, this.config.marginY);

          this.posTracker.y += this.doc.getTextDimensions(name).h;

          const titleDim = this.doc
            .setFontSize(14 * this.config.fontScale)
            .setFont(this.config.font, "bold")
            .getTextDimensions(personalTitle);

          this.doc
            .setFontSize(14 * this.config.fontScale)
            .setFont(this.config.font, "bold")
            .text(personalTitle, this.config.marginX, this.posTracker.y + 1);

          this.posTracker.y += titleDim.h;
        }
        break;
      case "right":
        {
          const nameDim = this.doc
            .setFont(this.config.font)
            .setFontSize(18 * this.config.fontScale)
            .getTextDimensions(name);

          this.doc
            .setFont(this.config.font)
            .setFontSize(18 * this.config.fontScale)
            .text(
              name,
              pageWidth - this.config.marginX - nameDim.w,
              this.config.marginY,
            );

          this.posTracker.y += nameDim.h;

          const titleDim = this.doc
            .setFontSize(14 * this.config.fontScale)
            .setFont(this.config.font, "bold")
            .getTextDimensions(personalTitle);

          this.doc
            .setFontSize(14 * this.config.fontScale)
            .setFont(this.config.font, "bold")
            .text(
              personalTitle,
              pageWidth - this.config.marginX - titleDim.w,
              this.posTracker.y + 1,
            );

          this.posTracker.y += titleDim.h;
        }
        break;
      case "center":
        {
          const nameDim = this.doc
            .setFont(this.config.font)
            .setFontSize(18 * this.config.fontScale)
            .getTextDimensions(name);

          this.doc
            .setFont(this.config.font)
            .setFontSize(18 * this.config.fontScale)
            .text(name, (pageWidth - nameDim.w) / 2, this.config.marginY);

          this.posTracker.y += nameDim.h;

          const titleDim = this.doc
            .setFontSize(14 * this.config.fontScale)
            .setFont(this.config.font, "bold")
            .getTextDimensions(personalTitle);

          this.doc
            .setFontSize(14 * this.config.fontScale)
            .setFont(this.config.font, "bold")
            .text(
              personalTitle,
              (pageWidth - titleDim.w) / 2,
              this.posTracker.y + 1,
            );

          this.posTracker.y += titleDim.h;
        }
        break;
    }
  }

  addContactSection(contactDetails: ContactDetails = {}) {
    const pageWidth = this.doc.internal.pageSize.getWidth();

    const { email, webpage, github, phoneNumber, linkedIn } = contactDetails;

    const content = [
      ["Email", email],
      ["Phone", phoneNumber],
      ["Web", webpage],
      ["Github", github],
      ["LinkedIn", linkedIn],
    ].filter((e) => typeof e[1] === "string") as string[][];

    const gap = 2;

    switch (this.config.contactOrientation) {
      case "horizontal":
        {
          const leftPoint = (pageWidth - this.config.marginX * 2) / 4;
          this.posTracker.y += this.config.lineSpacing * 0.6;
          for (let i = 0; i < content.length; i++) {
            const contactData = content[i];
            const textDim = this.doc
              .setFontSize(10 * this.config.fontScale)
              .setFont(this.config.font, "bold")
              .getTextDimensions(contactData[1]);
            if (i % 2 == 0) {
              if (i === content.length - 1) {
                this.doc
                  .setFontSize(10 * this.config.fontScale)
                  .setFont(this.config.font, "bold")
                  .text(
                    contactData[1],
                    this.config.marginX + leftPoint * 2 - textDim.w / 2,
                    this.posTracker.y,
                  );
              } else {
                this.doc
                  .setFontSize(10 * this.config.fontScale)
                  .setFont(this.config.font, "bold")
                  .text(
                    contactData[1],
                    this.config.marginX + leftPoint - textDim.w / 2,
                    this.posTracker.y,
                  );
              }
            } else {
              this.doc
                .setFontSize(10 * this.config.fontScale)
                .setFont(this.config.font, "bold")
                .text(
                  contactData[1],
                  this.config.marginX + 3 * leftPoint - textDim.w / 2,
                  this.posTracker.y,
                );
              this.posTracker.y += this.config.lineSpacing * 0.8;
            }
          }
          if (content.length % 2 === 1) {
            this.posTracker.y += this.config.lineSpacing * 0.5;
          }
        }
        break;
      case "vertical":
        {
          if (this.config.titleLocation === "left") {
            const rightPoint = pageWidth - this.config.marginX;
            const biggestTextWidth = content.reduce(
              (p, c) =>
                Math.max(
                  this.doc
                    .setFontSize(10 * this.config.fontScale)
                    .setFont(this.config.font, "bold")
                    .getTextDimensions(c[1]).w,
                  p,
                ),
              0,
            );
            let possibleHeight = this.config.marginY;
            for (let i = 0; i < content.length; i++) {
              const contactData = content[i];
              if (i % 2 == 0) {
                if (i == content.length - 1) {
                  const textDim = this.doc
                    .setFontSize(10 * this.config.fontScale)
                    .setFont(this.config.font, "bold")
                    .getTextDimensions(contactData[1]);

                  this.doc
                    .setFontSize(10 * this.config.fontScale)
                    .setFont(this.config.font, "bold")
                    .text(
                      contactData[1],
                      rightPoint - biggestTextWidth - textDim.w / 2,
                      possibleHeight,
                    );
                } else {
                  this.doc
                    .setFontSize(10 * this.config.fontScale)
                    .setFont(this.config.font, "bold")
                    .text(
                      contactData[1],
                      rightPoint - biggestTextWidth * 2 - gap,
                      possibleHeight,
                    );
                }
              } else {
                this.doc
                  .setFontSize(10 * this.config.fontScale)
                  .setFont(this.config.font, "bold")
                  .text(
                    contactData[1],
                    rightPoint - biggestTextWidth,
                    possibleHeight,
                  );
                possibleHeight += this.config.lineSpacing * 0.8;
              }
            }
            if (content.length % 2 === 1) {
              possibleHeight += this.config.lineSpacing * 0.8;
            }
            this.posTracker.y = Math.max(this.posTracker.y, possibleHeight);
          } else {
            const leftPoint = this.config.marginX;
            const biggestTextWidth = content.reduce(
              (p, c) =>
                Math.max(
                  this.doc
                    .setFontSize(10 * this.config.fontScale)
                    .setFont(this.config.font, "bold")
                    .getTextDimensions(c[1]).w,
                  p,
                ),
              0,
            );
            let possibleHeight = this.config.marginY;
            for (let i = 0; i < content.length; i++) {
              const contactData = content[i];
              if (i % 2 == 0) {
                if (i == content.length - 1) {
                  const textDim = this.doc
                    .setFontSize(10 * this.config.fontScale)
                    .setFont(this.config.font, "bold")
                    .getTextDimensions(contactData[1]);

                  this.doc
                    .setFontSize(10 * this.config.fontScale)
                    .setFont(this.config.font, "bold")
                    .text(
                      contactData[1],
                      leftPoint + biggestTextWidth - textDim.w / 2,
                      possibleHeight,
                    );
                } else {
                  this.doc
                    .setFontSize(10 * this.config.fontScale)
                    .setFont(this.config.font, "bold")
                    .text(contactData[1], leftPoint, possibleHeight);
                }
              } else {
                this.doc
                  .setFontSize(10 * this.config.fontScale)
                  .setFont(this.config.font, "bold")
                  .text(
                    contactData[1],
                    leftPoint + biggestTextWidth + gap,
                    possibleHeight,
                  );
                possibleHeight += this.config.lineSpacing * 0.8;
              }
            }
            if (content.length % 2 === 1) {
              possibleHeight += this.config.lineSpacing * 0.8;
            }
            this.posTracker.y = Math.max(this.posTracker.y, possibleHeight);
          }
        }
        break;
    }

    return this.posTracker.y;
  }

  addAboutSection(about: string) {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    this.posTracker.y += this.config.lineSpacing * 0.8;
    this.ensurePageSize(3);

    this.doc
      .setFontSize(14 * this.config.fontScale)
      .setFont(this.config.font, "bold")
      .text(aboutTitle, this.config.marginX, this.posTracker.y);

    this.posTracker.y += this.config.lineSpacing * 0.8;

    const textH = this.doc
      .setFontSize(10 * this.config.fontScale)
      .setFont(this.config.font, "normal")
      .getTextDimensions(about, {
        maxWidth: pageWidth - this.config.marginX * 2,
      }).h;
    this.ensurePageSize(textH / this.config.lineSpacing);

    this.doc
      .setFontSize(10 * this.config.fontScale)
      .setFont(this.config.font, "normal")
      .text(about, this.config.marginX, this.posTracker.y, {
        maxWidth: pageWidth - this.config.marginX * 2,
        align: "justify",
      });

    this.posTracker.y += textH;
  }

  addSkillsSection(skills: Record<string, CVSkill[]>) {
    this.posTracker.y += this.config.lineSpacing;
    this.ensurePageSize();

    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(14 * this.config.fontScale)
      .text(skillsTitle, this.config.marginX, this.posTracker.y);

    for (const type in skills) {
      this.addSkillGroup(type, skills[type]);
    }
  }

  addCertificatesSection(certificates: CVCertificate[]) {
    this.posTracker.y += this.config.lineSpacing;
    this.ensurePageSize();

    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(14 * this.config.fontScale)
      .text(certTitle, this.config.marginX, this.posTracker.y);

    for (const certificate of certificates) {
      this.addCertificate(certificate);
    }
  }

  addLanguagesSection(languages: CVLanguage[]) {
    this.posTracker.y += this.config.lineSpacing;
    this.ensurePageSize(2);

    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(14 * this.config.fontScale)
      .text(langTitle, this.config.marginX, this.posTracker.y);

    this.posTracker.x = this.config.marginX;

    for (const language of languages) {
      this.addLanguage(language);
    }

    this.posTracker.x = this.config.marginX;
  }

  addExperiencesSection(experiences: CVExperience[]) {
    this.posTracker.y += this.config.lineSpacing;
    this.ensurePageSize(2);

    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(14 * this.config.fontScale)
      .text(expTitle, this.config.marginX, this.posTracker.y);

    for (const experience of experiences) {
      this.addExperience(experience);
    }
  }

  addProjectsSection(projects: CVProject[]) {
    this.posTracker.y += this.config.lineSpacing;
    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(14 * this.config.fontScale)
      .text(projectsTitle, this.config.marginX, this.posTracker.y);

    for (const project of projects) {
      this.addProject(project);
    }
  }

  addEducationSection(educations: CVEducation[]) {
    this.posTracker.y += this.config.lineSpacing;
    this.ensurePageSize();

    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(14 * this.config.fontScale)
      .text(educationTitle, this.config.marginX, this.posTracker.y);

    for (const education of educations) {
      this.addEducation(education);
    }
  }

  addExperience({ companyName, positions, techStack }: CVExperience) {
    const maxWidth =
      this.doc.internal.pageSize.getWidth() - 2 * this.config.marginX;
    this.ensurePageSize(2);

    this.posTracker.y += this.config.lineSpacing;
    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(12 * this.config.fontScale)
      .text(companyName, this.config.marginX, this.posTracker.y);

    this.posTracker.y += this.config.lineSpacing * 0.4;
    for (const {
      fromDate,
      role,
      description,
      responsibilities,
      toDate,
    } of positions) {
      const roleText = `• ${role}`;
      const roleDim = this.doc
        .setFont(this.config.font, "bold")
        .setFontSize(10 * this.config.fontScale)
        .getTextDimensions(roleText);

      this.posTracker.y += this.config.lineSpacing * 0.3;
      this.ensurePageSize();
      this.doc
        .setFont(this.config.font, "bold")
        .setFontSize(10 * this.config.fontScale)
        .text(roleText, this.config.marginX, this.posTracker.y);

      const gap = 2;
      this.doc
        .setFont(this.config.font, "normal")
        .setFontSize(10 * this.config.fontScale)
        .text(
          `(${moment(fromDate).format("MMM Y")} - ${toDate !== undefined ? moment(toDate).format("MMM Y") : "Current"})`,
          this.config.marginX + roleDim.w + gap,
          this.posTracker.y,
        );

      if (description !== undefined && description.length > 0) {
        this.posTracker.y += this.config.lineSpacing * 0.7;
        const descDim = this.doc.getTextDimensions(description, {
          maxWidth: maxWidth,
          fontSize: 10,
        });
        this.ensurePageSize(descDim.h / this.config.lineSpacing);
        this.doc
          .setFont(this.config.font, "normal")
          .setFontSize(10 * this.config.fontScale)
          .text(description, this.config.marginX, this.posTracker.y, {
            maxWidth: maxWidth,
            align: "justify",
          });
        this.posTracker.y += descDim.h;
      }

      const spacing = 3;
      if (responsibilities !== undefined && responsibilities.length > 0) {
        this.posTracker.y += this.config.lineSpacing * 0.2;
        for (let i = 0; i < responsibilities.length; i++) {
          const responsibility = responsibilities[i];
          const responsibilityText = `- ${responsibility}`;
          const respDim = this.doc.getTextDimensions(responsibilityText, {
            maxWidth: maxWidth - spacing,
            fontSize: 10,
          });
          this.ensurePageSize(respDim.h / this.config.lineSpacing);
          this.doc
            .setFont(this.config.font, "normal")
            .setFontSize(10 * this.config.fontScale)
            .text(
              responsibilityText,
              this.config.marginX + spacing,
              this.posTracker.y,
              {
                maxWidth: maxWidth - spacing,
                align: "justify",
              },
            );

          this.posTracker.y += respDim.h;
        }
      }
    }

    this.posTracker.y -= this.config.lineSpacing * 0.5;

    if (techStack !== undefined && techStack.length > 0) {
      const techTitle = "Tech: ";
      this.posTracker.y += this.config.lineSpacing * 1.2;
      const techTitleDim = this.doc
        .setFont(this.config.font, "bold")
        .setFontSize(10 * this.config.fontScale)
        .getTextDimensions(techTitle);
      this.ensurePageSize();
      this.doc
        .setFont(this.config.font, "bold")
        .setFontSize(10 * this.config.fontScale)
        .text(techTitle, this.config.marginX, this.posTracker.y);

      let wTracker = techTitleDim.w;

      for (let i = 0; i < techStack.length; i++) {
        const techText = `${techStack[i]}${i === techStack.length - 1 ? "" : ", "}`;
        const techTextDim = this.doc
          .setFont(this.config.font, "normal")
          .setFontSize(10 * this.config.fontScale)
          .getTextDimensions(techText);

        while (wTracker + techTextDim.w > maxWidth - 2 * this.config.marginX) {
          this.posTracker.y += this.config.lineSpacing * 0.7;
          this.ensurePageSize();
          wTracker = 0;
        }

        this.doc
          .setFont(this.config.font, "normal")
          .setFontSize(10 * this.config.fontScale)
          .text(techText, this.config.marginX + wTracker, this.posTracker.y);

        wTracker += techTextDim.w;
      }
    }
  }

  addCertificate(certificate: CVCertificate) {
    this.posTracker.y += this.config.lineSpacing;
    this.ensurePageSize(4);

    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(11 * this.config.fontScale)
      .text(certificate.name, this.config.marginX, this.posTracker.y);

    const issuerTitleText = "Issuer:";
    const issuerTitleDim = this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(10 * this.config.fontScale)
      .getTextDimensions(issuerTitleText);

    this.posTracker.y += this.config.lineSpacing * 0.7;
    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(10 * this.config.fontScale)
      .text(issuerTitleText, this.config.marginX, this.posTracker.y);

    this.doc
      .setFont(this.config.font, "normal")
      .setFontSize(10 * this.config.fontScale)
      .text(
        certificate.issuingOrganization,
        this.config.marginX + issuerTitleDim.w,
        this.posTracker.y,
      );

    const earnedText = "Earned:";
    const earnedDim = this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(10 * this.config.fontScale)
      .getTextDimensions(earnedText);

    this.posTracker.y += this.config.lineSpacing * 0.7;
    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(10 * this.config.fontScale)
      .text(earnedText, this.config.marginX, this.posTracker.y);
    this.doc
      .setFont(this.config.font, "normal")
      .setFontSize(10 * this.config.fontScale)
      .text(
        moment(certificate.acquiredWhen).format("MMM Y"),
        this.config.marginX + earnedDim.w,
        this.posTracker.y,
      );

    if (
      certificate.verificationId !== undefined &&
      certificate.verificationId.length > 0
    ) {
      this.posTracker.y += this.config.lineSpacing * 0.7;
      const verificationIdText = "Verification ID: ";
      const verificationIdDim = this.doc
        .setFont(this.config.font, "bold")
        .setFontSize(10 * this.config.fontScale)
        .getTextDimensions(verificationIdText);
      this.doc
        .setFont(this.config.font, "bold")
        .setFontSize(10 * this.config.fontScale)
        .text(verificationIdText, this.config.marginX, this.posTracker.y);
      this.doc
        .setFont(this.config.font, "normal")
        .setFontSize(10 * this.config.fontScale)
        .text(
          certificate.verificationId,
          this.config.marginX + verificationIdDim.w,
          this.posTracker.y,
        );
    }
  }

  addLanguage(language: CVLanguage) {
    const maxWidth = this.doc.internal.pageSize.width - 2 * this.config.marginX;
    this.posTracker.y += this.config.lineSpacing;
    this.ensurePageSize();

    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(10 * this.config.fontScale)
      .text(language.language, this.config.marginX, this.posTracker.y);

    const languageText =
      this.config.languageGrader === "cefr"
        ? language.proficiency.toUpperCase()
        : levelToProficiency(language.proficiency);
    const proficiencyDim = this.doc
      .setFont(this.config.font, "normal")
      .setFontSize(10 * this.config.fontScale)
      .getTextDimensions(languageText);

    this.doc
      .setFont(this.config.font, "normal")
      .setFontSize(10 * this.config.fontScale)
      .text(
        languageText,
        maxWidth + this.config.marginX - proficiencyDim.w,
        this.posTracker.y,
      );
  }

  addProject({ projectName, positions, techStack }: CVProject) {
    const maxWidth =
      this.doc.internal.pageSize.getWidth() - 2 * this.config.marginX;
    this.ensurePageSize(2);

    this.posTracker.y += this.config.lineSpacing;
    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(12 * this.config.fontScale)
      .text(projectName, this.config.marginX, this.posTracker.y);

    this.posTracker.y += this.config.lineSpacing * 0.4;
    for (const {
      fromDate,
      role,
      description,
      responsibilities,
      toDate,
    } of positions) {
      const roleText = `• ${role}`;
      const roleDim = this.doc
        .setFont(this.config.font, "bold")
        .setFontSize(10 * this.config.fontScale)
        .getTextDimensions(roleText);

      this.posTracker.y += this.config.lineSpacing * 0.3;
      this.ensurePageSize();
      this.doc
        .setFont(this.config.font, "bold")
        .setFontSize(10 * this.config.fontScale)
        .text(roleText, this.config.marginX, this.posTracker.y);

      const gap = 2;
      this.doc
        .setFont(this.config.font, "normal")
        .setFontSize(10 * this.config.fontScale)
        .text(
          `(${moment(fromDate).format("MMM Y")} - ${toDate !== undefined ? moment(toDate).format("MMM Y") : "Current"})`,
          this.config.marginX + roleDim.w + gap,
          this.posTracker.y,
        );

      if (description !== undefined && description.length > 0) {
        this.posTracker.y += this.config.lineSpacing * 0.7;
        const descDim = this.doc.getTextDimensions(description, {
          maxWidth: maxWidth,
          fontSize: 10,
        });
        this.ensurePageSize(descDim.h / this.config.lineSpacing);
        this.doc
          .setFont(this.config.font, "normal")
          .setFontSize(10 * this.config.fontScale)
          .text(description, this.config.marginX, this.posTracker.y, {
            maxWidth: maxWidth,
            align: "justify",
          });
        this.posTracker.y += descDim.h;
      }

      const spacing = 3;
      if (responsibilities !== undefined && responsibilities.length > 0) {
        this.posTracker.y += this.config.lineSpacing * 0.2;
        for (let i = 0; i < responsibilities.length; i++) {
          const responsibility = responsibilities[i];
          const responsibilityText = `- ${responsibility}`;
          const respDim = this.doc.getTextDimensions(responsibilityText, {
            maxWidth: maxWidth - spacing,
            fontSize: 10,
          });
          this.ensurePageSize(respDim.h / this.config.lineSpacing);
          this.doc
            .setFont(this.config.font, "normal")
            .setFontSize(10 * this.config.fontScale)
            .text(
              responsibilityText,
              this.config.marginX + spacing,
              this.posTracker.y,
              {
                maxWidth: maxWidth - spacing,
                align: "justify",
              },
            );

          this.posTracker.y += respDim.h;
        }
      }
    }

    this.posTracker.y -= this.config.lineSpacing;

    if (techStack !== undefined && techStack.length > 0) {
      const techTitle = "Tech: ";
      this.posTracker.y += this.config.lineSpacing * 1.2;
      const techTitleDim = this.doc
        .setFont(this.config.font, "bold")
        .setFontSize(10 * this.config.fontScale)
        .getTextDimensions(techTitle);
      this.ensurePageSize();
      this.doc
        .setFont(this.config.font, "bold")
        .setFontSize(10 * this.config.fontScale)
        .text(techTitle, this.config.marginX, this.posTracker.y);

      let wTracker = techTitleDim.w;

      for (let i = 0; i < techStack.length; i++) {
        const techText = `${techStack[i]}${i === techStack.length - 1 ? "" : ", "}`;
        const techTextDim = this.doc
          .setFont(this.config.font, "normal")
          .setFontSize(10 * this.config.fontScale)
          .getTextDimensions(techText);

        while (wTracker + techTextDim.w > maxWidth - 2 * this.config.marginX) {
          this.posTracker.y += this.config.lineSpacing * 0.7;
          this.ensurePageSize();
          wTracker = 0;
        }

        this.doc
          .setFont(this.config.font, "normal")
          .setFontSize(10 * this.config.fontScale)
          .text(techText, this.config.marginX + wTracker, this.posTracker.y);

        wTracker += techTextDim.w;
      }
    }
  }

  addSkillGroup(setName: string, skillSet: CVSkill[]) {
    const maxWidth =
      this.doc.internal.pageSize.getWidth() - 2 * this.config.marginX;

    const skillGroupTitle = `${setName}: `;
    const groupDms = this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(10 * this.config.fontScale)
      .getTextDimensions(skillGroupTitle);
    this.posTracker.y += this.config.lineSpacing * 0.8;

    this.ensurePageSize();
    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(10 * this.config.fontScale)
      .text(skillGroupTitle, this.config.marginX, this.posTracker.y);

    let wTracker = groupDms.w;

    for (let i = 0; i < skillSet.length; i++) {
      const skill = skillSet[i];
      const skillText = `${skill.name}${i === skillSet.length - 1 ? "" : ", "}`;
      const skillDim = this.doc
        .setFont(this.config.font, "normal")
        .setFontSize(10 * this.config.fontScale)
        .getTextDimensions(skillText);

      while (wTracker + skillDim.w > maxWidth) {
        if (this.posTracker.y > 0) {
          this.posTracker.y += this.config.lineSpacing * 0.8;
          wTracker = 0;
        }
        this.ensurePageSize(0.8);
      }

      this.doc
        .setFont(this.config.font, "normal")
        .setFontSize(10 * this.config.fontScale)
        .text(skillText, this.config.marginX + wTracker, this.posTracker.y);
      wTracker += skillDim.w;
    }
  }

  addEducation(education: CVEducation) {
    const maxWidth =
      this.doc.internal.pageSize.getWidth() - 2 * this.config.marginX;

    const locationDim = this.doc.getTextDimensions(education.schoolLocation, {
      maxWidth: maxWidth,
      fontSize: 10,
    });

    this.posTracker.y += this.config.lineSpacing * 0.8;
    this.ensurePageSize(0.8);
    this.doc
      .setFont(this.config.font, "bold")
      .setFontSize(10 * this.config.fontScale)
      .text(education.schoolName, this.config.marginX, this.posTracker.y);

    this.doc
      .setFont(this.config.font, "normal")
      .setFontSize(10 * this.config.fontScale)
      .text(
        education.schoolLocation,
        this.config.marginX + maxWidth - locationDim.w,
        this.posTracker.y,
      );
    this.posTracker.y += this.config.lineSpacing * 0.8;

    const departmentText = `${education.degree} ${education.currentStatus === SchoolStatus.COMPLETED ? `/ GPA: ${education.graduationScore}` : ""}`;
    this.doc
      .setFont(this.config.font, "normal")
      .setFontSize(10 * this.config.fontScale)
      .text(departmentText, this.config.marginX, this.posTracker.y);

    const yearText = `${moment(education.entranceYear).format("MMM Y")} - ${education.currentStatus === SchoolStatus.COMPLETED ? (education.completionYear !== undefined ? moment(education.completionYear).format("MMM Y") : "Graduated") : education.currentStatus === SchoolStatus.CONTINUING ? "Current" : "Dropped"}`;
    const yearsDim = this.doc.getTextDimensions(yearText, { fontSize: 10 });

    this.doc
      .setFont(this.config.font, "normal")
      .setFontSize(10 * this.config.fontScale)
      .text(
        yearText,
        this.config.marginX + maxWidth - yearsDim.w,
        this.posTracker.y,
      );

    this.posTracker.y += this.config.lineSpacing * 0.3;
    for (const note of education.notes ?? []) {
      const noteText = `- ${note}`;
      const notesDms = this.doc.getTextDimensions(noteText, {
        maxWidth: maxWidth,
        fontSize: 10,
      });
      this.doc
        .setFont(this.config.font, "normal")
        .setFontSize(10 * this.config.fontScale)
        .text(
          noteText,
          this.config.marginX,
          this.posTracker.y + this.config.lineSpacing * 0.5,
        );
      this.posTracker.y += notesDms.h;
    }
  }

  generateCV(
    {
      name,
      personalTitle,
      contactInformations,
      about,
      skillDetails,
      experiences,
      projects,
      educations: educationHistory,
      certificates,
      languages,
    }: CVInformations,
    configOverride: CVGeneratorConfig = {},
  ) {
    this.doc = new jsPDF();
    this.posTracker.x = this.config.marginX;
    this.posTracker.y = this.config.marginY;

    /* Dynamic CVConfig */
    const baseConfig = this.config;
    this.config = { ...this.config, ...configOverride };

    /* Correction */
    if (this.config.titleLocation === "center") {
      this.config.contactOrientation = "horizontal";
    }

    /* Adding Fonts */
    for (const font of this.fontTracker) {
      this.doc.addFont(font.url, font.id, font.style);
    }

    /* Title Section */
    this.addTitleSection(name, personalTitle);

    /* Contact Sub-Section */
    this.addContactSection(contactInformations);
    this.addHorizontalLine();

    for (const section of this.config.layout) {
      switch (section) {
        case CVSection.ABOUT:
          /* About Section */
          if (about !== undefined) {
            this.addAboutSection(about);
            this.addHorizontalLine();
          }
          break;
        case CVSection.SKILLS:
          /* Skills Section */
          if (
            skillDetails !== undefined &&
            Object.keys(skillDetails).length > 0
          ) {
            this.addSkillsSection(skillDetails);
            this.posTracker.y += this.config.lineSpacing * 0.7;
            this.addHorizontalLine();
          }
          break;

        case CVSection.EXPERIENCES:
          /* Experiences Section */
          if (experiences !== undefined && experiences.length > 0) {
            this.addExperiencesSection(experiences);
            this.posTracker.y += this.config.lineSpacing * 0.7;
            this.addHorizontalLine();
          }
          break;
        case CVSection.PROJECTS:
          /* Projects Section */
          if (projects !== undefined && projects.length > 0) {
            this.addProjectsSection(projects);
            this.posTracker.y += this.config.lineSpacing * 0.7;
            this.addHorizontalLine();
          }
          break;
        case CVSection.EDUCATION:
          if (educationHistory !== undefined && educationHistory.length > 0) {
            this.addEducationSection(educationHistory);
            this.posTracker.y += this.config.lineSpacing * 0.7;
            this.addHorizontalLine();
          }
          break;
        case CVSection.CERTIFICATES:
          if (certificates !== undefined && certificates.length > 0) {
            this.addCertificatesSection(certificates);
            this.posTracker.y += this.config.lineSpacing * 0.7;
            this.addHorizontalLine();
          }
          break;
        case CVSection.LANGUAGES:
          if (languages !== undefined && languages.length > 0) {
            this.addLanguagesSection(languages);
            this.posTracker.y += this.config.lineSpacing * 0.7;
            this.addHorizontalLine();
          }
          break;
      }
    }

    this.config = baseConfig;

    return this.newpdf();
  }

  newpdf() {
    return this.doc.output("datauristring", { filename: "CV.pdf" });
  }
}
