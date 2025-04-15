# CV-Gen: ATS-Compatible CV Generation Tool

CV-Gen is an open-source, ATS-compatible CV generation tool designed to help you create professional resumes effortlessly. The project consists of two main components: a TypeScript library for programmatic CV generation and a user-friendly Next.js web interface for visual CV creation.

> **Disclaimer:** The core CV generation library was implemented by the author, while the website interface was developed with the assistance of AI tools.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Using the Library](#using-the-library)
  - [Running the Web Interface](#running-the-web-interface)
- [Usage](#usage)
  - [Library Usage](#library-usage)
  - [Web Interface Usage](#web-interface-usage)
- [CV Data Structure](#cv-data-structure)
- [Configuration Options](#configuration-options)
- [Contributing](#contributing)
- [License](#license)

## Overview

CV-Gen aims to simplify the process of creating professional, ATS-compatible resumes. The project provides two ways to generate CVs:

1. **TypeScript Library**: For developers who want to integrate CV generation into their applications or automate CV creation programmatically.
2. **Web Interface**: A user-friendly GUI built with Next.js that allows anyone to create and customize their CV without writing code.

The generated CVs are designed to be compatible with Applicant Tracking Systems (ATS), increasing your chances of getting past automated resume screening processes used by many employers.

## Features

- **ATS Compatibility**: Produces clean, structured PDFs that are optimized for Applicant Tracking Systems.
- **Dual-Mode Operation**: Use either the TypeScript library or the web interface based on your needs.
- **Customizable Templates**: Control layout, spacing, fonts, and other visual aspects of your CV.
- **Comprehensive CV Sections**: Support for all standard CV sections including:
  - Personal details and contact information
  - Professional summary
  - Skills with experience levels
  - Work experience with detailed positions and responsibilities
  - Projects with descriptions and technologies used
  - Education history
  - Certificates and qualifications
  - Languages with proficiency levels
- **Real-time Preview**: The web interface provides immediate visual feedback as you build your CV.
- **Responsive Design**: The web interface works well on both desktop and mobile devices.
- **Open Source**: Free to use, modify, and extend under the MIT license.

## Project Structure

The project is organized into two main parts:

```
cv-gen/
├── src/
│   ├── lib/            # Core TypeScript library for CV generation
│   │   ├── CVGenerator.ts  # Main CV generation logic
│   │   ├── enum.ts     # Enums for CV data (SchoolStatus, LanguageProficiency, etc.)
│   │   ├── types.ts    # TypeScript types for CV data structure
│   │   └── index.ts    # Library entry point
│   │
│   └── website/        # Next.js web interface
│       ├── app/        # Next.js app directory
│       ├── components/ # React components for the UI
│       │   ├── PDFBuilder.tsx  # Form for building CV data
│       │   └── PDFViewer.tsx   # Component for displaying the generated PDF
│       └── helper/     # Utility functions for the website
├── package.json        # Project dependencies and scripts
└── README.md          # Project documentation
```

## Installation

### Using the Library

To use the CV-Gen library in your project, install it via npm or yarn:

```bash
npm install cv-gen
# or
yarn add cv-gen
```

### Running the Web Interface

To run the web interface locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cv-gen.git
   cd cv-gen
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Library Usage

Here's a basic example of how to use the CV-Gen library programmatically:

```typescript
import { CVGenerator, CVSection, SchoolStatus, LanguageProficiency } from 'cv-gen';

// Create a new CV generator instance
const generator = new CVGenerator();

// Define your CV data
const myCV = {
  name: "Alexandra Johnson",
  personalTitle: "Senior Software Engineer",
  contactInformations: {
    email: "alexandra.johnson@example.com",
    phoneNumber: "+1 555 123 4567",
    webpage: "https://alexandrajohnson.dev",
    github: "https://github.com/alexjohnson",
    linkedIn: "https://linkedin.com/in/alexandra-johnson"
  },
  about: "Experienced software engineer with 8+ years specializing in web development and cloud architecture.",
  skillDetails: {
    "Programming Languages": [
      { name: "JavaScript", experience: 8, featured: true },
      { name: "TypeScript", experience: 5, featured: true },
      { name: "Python", experience: 4, featured: false }
    ],
    "Frameworks": [
      { name: "React", experience: 6, featured: true },
      { name: "Node.js", experience: 7, featured: true }
    ]
  },
  experiences: [
    {
      companyName: "Tech Solutions Inc.",
      positions: [
        {
          role: "Senior Software Engineer",
          fromDate: new Date("2020-01-01"),
          description: "Lead developer for enterprise applications",
          responsibilities: [
            "Architected and implemented scalable backend services",
            "Mentored junior developers"
          ]
        }
      ],
      techStack: ["React", "Node.js", "AWS"]
    }
  ],
  // Add other sections as needed
};

// Configure the CV generation (optional)
const config = {
  font: "Helvetica",
  fontScale: 1,
  titleLocation: "left",
  contactOrientation: "horizontal",
  layout: [
    CVSection.ABOUT,
    CVSection.SKILLS,
    CVSection.EXPERIENCES,
    CVSection.PROJECTS,
    CVSection.EDUCATION
  ]
};

// Generate the CV
const pdfDataUri = generator.generateCV(myCV, config);

// Use the PDF data URI as needed (e.g., display in an iframe, download, etc.)
console.log(pdfDataUri);
```

### Web Interface Usage

The web interface provides an intuitive form-based approach to creating your CV:

1. Fill in your personal details and contact information
2. Add your professional summary in the About section
3. Create skill groups and add skills with experience levels
4. Add your work experiences with detailed positions and responsibilities
5. Include projects you've worked on with descriptions and technologies used
6. Add your education history
7. Include certificates and qualifications
8. Add languages you speak with proficiency levels
9. Preview your CV in real-time on the right side of the screen
10. The CV is automatically generated as a PDF that you can download or print

## CV Data Structure

The CV data structure follows this TypeScript interface:

```typescript
interface CVInformations {
  name: string;
  personalTitle: string;
  contactInformations: {
    email?: string;
    phoneNumber?: string;
    webpage?: string;
    github?: string;
    linkedIn?: string;
  };
  about?: string;
  skillDetails: Record<string, {
    name: string;
    experience?: number;
    featured?: boolean;
  }[]>;
  experiences?: {
    companyName: string;
    positions: {
      role: string;
      fromDate: Date;
      toDate?: Date;
      description?: string;
      responsibilities?: string[];
    }[];
    techStack?: string[];
  }[];
  projects?: {
    projectName: string;
    positions: {
      role: string;
      fromDate: Date;
      toDate?: Date;
      description?: string;
      responsibilities?: string[];
    }[];
    techStack?: string[];
    type: string;
  }[];
  educations?: {
    schoolName: string;
    schoolLocation: string;
    degree: string;
    entranceYear: Date;
    completionYear?: Date;
    currentStatus: SchoolStatus; // COMPLETED, CONTINUING, or DROPPED
    graduationScore?: number;
    notes?: string[];
  }[];
  certificates?: {
    name: string;
    issuingOrganization: string;
    acquiredWhen: Date;
    endsWhen?: Date;
    verificationId?: string;
  }[];
  languages?: {
    language: string;
    proficiency: LanguageProficiency; // A1, A2, B1, B2, C1, C2, or NATIVE
  }[];
}
```

## Configuration Options

You can customize the appearance and layout of your CV with these configuration options:

```typescript
interface CVGeneratorConfig {
  layout?: CVSection[]; // Order of sections in the CV
  marginX?: number; // Horizontal margin in mm
  marginY?: number; // Vertical margin in mm
  lineSpacing?: number; // Space between lines in mm
  font?: string; // Font family
  fontScale?: number; // Scale factor for font sizes
  contactOrientation?: "horizontal" | "vertical"; // Layout of contact information
  languageGrader?: "common" | "cefr"; // Format for language proficiency display
  titleLocation?: "left" | "center" | "right"; // Alignment of the name and title
}
```

## Contributing

Contributions are welcome! If you'd like to improve CV-Gen, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes and commit them (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style guidelines and includes appropriate tests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
