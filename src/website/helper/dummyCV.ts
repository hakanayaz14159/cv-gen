import { SchoolStatus, LanguageProficiency } from "cv-gen";
import { CVInformations } from "../../lib/types";

export const softwareEngineerCV: CVInformations = {
  name: "Alexandra Johnson",
  personalTitle: "Senior Software Engineer",
  contactInformations: {
    email: "alexandra.johnson@example.com",
    phoneNumber: "+1 (555) 123-4567",
    webpage: "https://alexandrajohnson.dev",
    github: "https://github.com/alexjohnson",
    linkedIn: "https://linkedin.com/in/alexandra-johnson",
  },
  about:
    "Experienced software engineer with 8+ years of expertise in building scalable web applications and cloud solutions. Passionate about clean code, performance optimization, and mentoring junior developers. Recognized for delivering high-quality software that meets business objectives on time and within budget.",
  skillDetails: {
    "Programming Languages": [
      { name: "JavaScript", experience: 8, featured: true },
      { name: "TypeScript", experience: 6, featured: true },
      { name: "Python", experience: 5 },
      { name: "Java", experience: 4 },
      { name: "C#", experience: 3 },
    ],
    Frontend: [
      { name: "React", experience: 6, featured: true },
      { name: "Angular", experience: 4 },
      { name: "Vue.js", experience: 3 },
      { name: "HTML/CSS", experience: 8 },
    ],
    Backend: [
      { name: "Node.js", experience: 7, featured: true },
      { name: "Express", experience: 6 },
      { name: "Django", experience: 4 },
      { name: "Spring Boot", experience: 3 },
    ],
    Database: [
      { name: "MongoDB", experience: 5 },
      { name: "PostgreSQL", experience: 6, featured: true },
      { name: "MySQL", experience: 4 },
      { name: "Redis", experience: 3 },
    ],
    DevOps: [
      { name: "Docker", experience: 5, featured: true },
      { name: "Kubernetes", experience: 3 },
      { name: "AWS", experience: 5, featured: true },
      { name: "CI/CD", experience: 4 },
    ],
  },
  experiences: [
    {
      companyName: "TechCorp Solutions",
      positions: [
        {
          role: "Senior Software Engineer",
          fromDate: new Date("2021-03-01"),
          toDate: undefined, // Current position
          description:
            "Leading the development of enterprise-grade web applications and microservices architecture.",
          responsibilities: [
            "Architected and implemented a scalable microservices infrastructure that improved system performance by 40%",
            "Led a team of 5 developers in designing and building a client portal that reduced customer service inquiries by 30%",
            "Implemented automated testing and CI/CD pipelines that reduced deployment time by 60%",
            "Mentored junior developers and conducted code reviews to ensure code quality and best practices",
          ],
        },
      ],
      techStack: [
        "TypeScript",
        "React",
        "Node.js",
        "PostgreSQL",
        "Docker",
        "AWS",
        "Jest",
      ],
    },
    {
      companyName: "Digital Innovations Inc.",
      positions: [
        {
          role: "Software Engineer Team Lead",
          fromDate: new Date("2020-01-15"),
          toDate: new Date("2021-02-28"),
          description:
            "Led a team of developers working on financial technology solutions.",
          responsibilities: [
            "Managed a team of 4 developers, overseeing code quality and project timelines",
            "Designed system architecture for a new payment processing platform handling $10M+ in monthly transactions",
            "Implemented agile methodologies that improved team velocity by 35%",
            "Facilitated communication between technical teams and business stakeholders",
          ],
        },
        {
          role: "Software Engineer",
          fromDate: new Date("2018-06-15"),
          toDate: new Date("2020-01-14"),
          description:
            "Developed and maintained full-stack web applications for clients in finance and healthcare sectors.",
          responsibilities: [
            "Built RESTful APIs and microservices for data processing that handled over 500,000 daily transactions",
            "Designed and implemented responsive user interfaces with React and Angular",
            "Optimized database queries that improved application response time by 35%",
            "Collaborated with cross-functional teams to deliver features that aligned with business requirements",
          ],
        },
      ],
      techStack: [
        "JavaScript",
        "TypeScript",
        "Angular",
        "Node.js",
        "MongoDB",
        "AWS",
        "Docker",
      ],
    },
    {
      companyName: "StartUp Tech",
      positions: [
        {
          role: "Junior Developer",
          fromDate: new Date("2016-09-01"),
          toDate: new Date("2018-06-01"),
          description:
            "Contributed to the development of a SaaS platform for small businesses.",
          responsibilities: [
            "Developed front-end components using HTML, CSS, and JavaScript",
            "Created and maintained RESTful APIs using Node.js and Express",
            "Fixed bugs and implemented new features based on user feedback",
            "Participated in daily stand-ups and sprint planning meetings",
          ],
        },
        {
          role: "QA Engineering Intern",
          fromDate: new Date("2016-05-01"),
          toDate: new Date("2016-08-31"),
          description:
            "Supported quality assurance efforts for web applications.",
          responsibilities: [
            "Developed automated test scripts using Selenium and JavaScript",
            "Performed manual testing and documented bugs in tracking system",
            "Assisted in creating test plans and test cases for new features",
            "Participated in code reviews to ensure quality standards were met",
          ],
        },
      ],
      techStack: [
        "JavaScript",
        "HTML/CSS",
        "Node.js",
        "Express",
        "MySQL",
        "Selenium",
      ],
    },
  ],
  projects: [
    {
      projectName: "Enterprise Resource Planning System",
      positions: [
        {
          role: "Lead Developer",
          fromDate: new Date("2022-01-15"),
          toDate: new Date("2022-11-30"),
          description:
            "Designed and developed a comprehensive ERP system for a manufacturing client that integrated inventory, sales, and HR modules.",
          responsibilities: [
            "Architected the overall system design and database schema",
            "Implemented role-based access control and security features",
            "Designed RESTful APIs for mobile and web client integration",
            "Led a team of 3 developers throughout the development lifecycle",
          ],
        },
      ],
      techStack: [
        "TypeScript",
        "React",
        "Node.js",
        "PostgreSQL",
        "Redis",
        "Docker",
        "AWS",
      ],
      type: "Client Project",
    },
    {
      projectName: "Open Source Data Visualization Library",
      positions: [
        {
          role: "Creator & Maintainer",
          fromDate: new Date("2020-05-01"),
          toDate: undefined, // Ongoing
          description:
            "Created and maintain an open-source data visualization library with over 2,000 GitHub stars and 500+ weekly downloads.",
          responsibilities: [
            "Designed a flexible API for creating interactive data visualizations",
            "Implemented performance optimizations for rendering large datasets",
            "Review and merge pull requests from community contributors",
            "Write comprehensive documentation and examples",
          ],
        },
      ],
      techStack: ["TypeScript", "D3.js", "React", "Jest", "Webpack"],
      type: "Open Source",
    },
    {
      projectName: "Health Monitoring Mobile App",
      positions: [
        {
          role: "Full Stack Developer",
          fromDate: new Date("2019-03-01"),
          toDate: new Date("2019-09-30"),
          description:
            "Developed a mobile application for health monitoring that integrates with wearable devices.",
          responsibilities: [
            "Built the backend API using Node.js and Express",
            "Implemented real-time data synchronization with wearable devices",
            "Designed data visualizations for health metrics",
            "Created user authentication and data privacy features",
          ],
        },
        {
          role: "UX Consultant",
          fromDate: new Date("2019-01-15"),
          toDate: new Date("2019-02-28"),
          description:
            "Provided UX design consultation for the initial planning phase.",
          responsibilities: [
            "Conducted user research and created user personas",
            "Designed wireframes and user flows for the application",
            "Performed usability testing and gathered feedback",
            "Provided recommendations for improving user experience",
          ],
        },
      ],
      techStack: [
        "JavaScript",
        "React Native",
        "Node.js",
        "MongoDB",
        "Socket.io",
      ],
      type: "Professional",
    },
  ],
  educations: [
    {
      schoolName: "University of Technology",
      schoolLocation: "Boston, MA",
      degree: "Master of Science in Computer Science",
      entranceYear: new Date("2014-09-01"),
      completionYear: new Date("2016-05-31"),
      currentStatus: SchoolStatus.COMPLETED,
      graduationScore: 3.85,
      notes: [
        "Specialized in Distributed Systems and Cloud Computing",
        "Thesis: 'Performance Optimization Techniques for Distributed Database Systems'",
        "Teaching Assistant for Advanced Algorithms course",
      ],
    },
    {
      schoolName: "State University",
      schoolLocation: "Portland, OR",
      degree: "Bachelor of Science in Software Engineering",
      entranceYear: new Date("2010-09-01"),
      completionYear: new Date("2014-05-31"),
      currentStatus: SchoolStatus.COMPLETED,
      graduationScore: 3.7,
      notes: [
        "Dean's List all semesters",
        "Capstone Project: 'Smart Home Automation System'",
        "Vice President of Computer Science Club",
      ],
    },
  ],
  certificates: [
    {
      name: "AWS Certified Solutions Architect - Professional",
      issuingOrganization: "Amazon Web Services",
      acquiredWhen: new Date("2022-07-15"),
      endsWhen: new Date("2025-07-15"),
      verificationId: "AWS-PSA-123456",
    },
    {
      name: "Certified Kubernetes Administrator",
      issuingOrganization: "Cloud Native Computing Foundation",
      acquiredWhen: new Date("2021-11-10"),
      endsWhen: new Date("2024-11-10"),
      verificationId: "CKA-1234-5678-90",
    },
    {
      name: "MongoDB Certified Developer Associate",
      issuingOrganization: "MongoDB, Inc.",
      acquiredWhen: new Date("2020-03-22"),
      verificationId: "MCD-12345-67890",
    },
  ],
  languages: [
    {
      language: "English",
      proficiency: LanguageProficiency.NATIVE,
    },
    {
      language: "Spanish",
      proficiency: LanguageProficiency.B2,
    },
    {
      language: "German",
      proficiency: LanguageProficiency.A2,
    },
  ],
};

export const salesManagerCV: CVInformations = {
  name: "Michael Reynolds",
  personalTitle: "Senior Sales Manager",
  contactInformations: {
    email: "michael.reynolds@example.com",
    phoneNumber: "+1 (555) 867-5309",
    webpage: "https://michaelreynolds.pro",
    linkedIn: "https://linkedin.com/in/michael-reynolds-sales",
  },
  about:
    "Results-driven Sales Manager with 10+ years of experience in B2B technology sales. Proven track record of building and leading high-performing sales teams, exceeding revenue targets, and implementing successful sales strategies. Skilled in relationship management, sales forecasting, and market analysis with a passion for developing talent and driving sustainable growth.",
  skillDetails: {
    Sales: [
      { name: "Sales Strategy", experience: 10, featured: true },
      { name: "Team Leadership", experience: 8, featured: true },
      { name: "Client Relationship Management", experience: 12 },
      { name: "Sales Forecasting", experience: 9, featured: true },
      { name: "Contract Negotiation", experience: 10 },
    ],
    "Business Development": [
      { name: "Market Research", experience: 7 },
      { name: "Strategic Partnerships", experience: 6 },
      { name: "Competitive Analysis", experience: 8 },
      { name: "Territory Management", experience: 9, featured: true },
    ],
    Management: [
      { name: "Performance Management", experience: 8 },
      { name: "Coaching & Mentoring", experience: 7, featured: true },
      { name: "Budget Administration", experience: 6 },
      { name: "Project Management", experience: 5 },
    ],
    Technology: [
      { name: "Salesforce CRM", experience: 9, featured: true },
      { name: "HubSpot", experience: 5 },
      { name: "Microsoft Office Suite", experience: 12 },
      { name: "Power BI", experience: 4 },
    ],
  },
  experiences: [
    {
      companyName: "TechSolutions Inc.",
      positions: [
        {
          role: "Senior Sales Manager",
          fromDate: new Date("2019-04-01"),
          toDate: undefined, // Current position
          description:
            "Leading a team of 12 sales professionals in B2B enterprise software sales across North America.",
          responsibilities: [
            "Developed and executed sales strategies that increased regional revenue by 35% within two years",
            "Built and managed a high-performing sales team, reducing turnover by 25% through improved coaching and incentive programs",
            "Implemented a new account management system that improved client retention rates by 20%",
            "Negotiated enterprise-level contracts worth $2M+ with Fortune 500 companies",
            "Collaborated with product teams to align sales strategies with new product launches",
          ],
        },
      ],
    },
    {
      companyName: "Global Software Services",
      positions: [
        {
          role: "Regional Sales Manager",
          fromDate: new Date("2018-01-15"),
          toDate: new Date("2019-03-15"),
          description:
            "Managed sales operations and team performance for the Western region.",
          responsibilities: [
            "Led a team of 8 sales representatives, consistently achieving 115% of quarterly targets",
            "Established strategic partnerships with key industry players that generated $1.5M in new business",
            "Redesigned the sales training program resulting in 40% faster onboarding of new team members",
            "Conducted market analysis to identify new business opportunities and expand into untapped segments",
          ],
        },
        {
          role: "Senior Account Executive",
          fromDate: new Date("2016-01-15"),
          toDate: new Date("2018-01-14"),
          description:
            "Managed and grew strategic enterprise accounts in the technology sector.",
          responsibilities: [
            "Managed a portfolio of 25 enterprise clients with combined annual revenue of $4.5M",
            "Developed and implemented account growth strategies that increased average deal size by 30%",
            "Collaborated with solution architects to design custom software solutions for enterprise clients",
            "Exceeded annual sales targets by an average of 18% for three consecutive years",
          ],
        },
      ],
    },
    {
      companyName: "Innovative Tech Corp",
      positions: [
        {
          role: "Senior Sales Representative",
          fromDate: new Date("2014-06-01"),
          toDate: new Date("2015-12-31"),
          description:
            "Top-performing sales representative for enterprise SaaS solutions.",
          responsibilities: [
            "Exceeded sales quotas by an average of 25% for 10 consecutive quarters",
            "Developed and maintained a portfolio of 45+ enterprise clients with 95% retention rate",
            "Pioneered a consultative sales approach that increased average deal size by 30%",
            "Created and delivered compelling sales presentations and product demonstrations",
          ],
        },
        {
          role: "Sales Representative",
          fromDate: new Date("2013-06-01"),
          toDate: new Date("2014-05-31"),
          description:
            "Responsible for new business development and account management.",
          responsibilities: [
            "Generated over $1.2M in new business within the first year",
            "Built a pipeline of qualified leads through cold calling, networking, and referrals",
            "Achieved 120% of first-year sales quota, earning Rookie of the Year recognition",
            "Developed deep product knowledge to effectively communicate value propositions to prospects",
          ],
        },
        {
          role: "Sales Development Representative",
          fromDate: new Date("2012-09-01"),
          toDate: new Date("2013-05-31"),
          description:
            "Supported senior sales team by qualifying leads and scheduling demonstrations.",
          responsibilities: [
            "Generated 50+ qualified leads per month for the sales team",
            "Conducted initial discovery calls to understand prospect needs and qualification criteria",
            "Maintained accurate records in CRM system to facilitate effective follow-up",
            "Collaborated with marketing to refine lead generation strategies",
          ],
        },
      ],
    },
  ],
  projects: [
    {
      projectName: "Sales Team Restructuring Initiative",
      positions: [
        {
          role: "Project Lead",
          fromDate: new Date("2020-09-01"),
          toDate: new Date("2021-03-31"),
          description:
            "Led a comprehensive restructuring of the sales organization to better align with market segments and improve efficiency.",
          responsibilities: [
            "Analyzed team performance data and market trends to design an optimal structure",
            "Developed new territory assignments and compensation plans to drive performance",
            "Implemented a mentorship program pairing senior and junior sales staff",
            "Created new KPIs and reporting dashboards to track performance metrics",
            "Conducted training sessions on the new structure and expectations",
          ],
        },
      ],
      type: "Organizational",
    },
    {
      projectName: "CRM Migration and Optimization",
      positions: [
        {
          role: "Project Manager",
          fromDate: new Date("2019-06-01"),
          toDate: new Date("2019-11-30"),
          description:
            "Managed the migration from legacy CRM to Salesforce and optimized sales processes.",
          responsibilities: [
            "Led cross-functional team to ensure seamless data migration and minimal disruption",
            "Customized Salesforce implementation to support specific sales workflows and reporting needs",
            "Developed and delivered training program for 50+ sales staff",
            "Created automated reporting systems that reduced administrative work by 15 hours per week",
            "Integrated marketing automation tools with CRM to improve lead management",
          ],
        },
        {
          role: "Requirements Analyst",
          fromDate: new Date("2019-04-15"),
          toDate: new Date("2019-05-31"),
          description:
            "Conducted initial analysis of sales team requirements for CRM migration.",
          responsibilities: [
            "Interviewed sales team members across departments to gather system requirements",
            "Documented current workflows and identified pain points in existing system",
            "Created detailed requirements specifications for the new CRM implementation",
            "Evaluated vendor proposals against team requirements and business objectives",
          ],
        },
      ],
      techStack: [
        "Salesforce",
        "HubSpot",
        "Data Migration Tools",
        "Process Mapping",
      ],
      type: "Technical",
    },
    {
      projectName: "Enterprise Client Acquisition Campaign",
      positions: [
        {
          role: "Campaign Director",
          fromDate: new Date("2017-03-01"),
          toDate: new Date("2017-12-15"),
          description:
            "Designed and executed a strategic campaign targeting Fortune 1000 companies in the financial services sector.",
          responsibilities: [
            "Developed comprehensive targeting strategy and value proposition",
            "Coordinated with marketing to create specialized collateral and digital assets",
            "Led a specialized team of 5 senior sales representatives focused on enterprise accounts",
            "Established relationships with C-level executives through networking events and direct outreach",
            "Generated $3.5M in new business and established 7 strategic accounts",
          ],
        },
      ],
      type: "Strategic",
    },
  ],
  educations: [
    {
      schoolName: "Northwestern University",
      schoolLocation: "Evanston, IL",
      degree: "Master of Business Administration",
      entranceYear: new Date("2010-09-01"),
      completionYear: new Date("2012-05-31"),
      currentStatus: SchoolStatus.COMPLETED,
      graduationScore: 3.8,
      notes: [
        "Concentration in Marketing and Sales Leadership",
        "Graduate Business Association Vice President",
        "Finalist in National Sales Competition",
      ],
    },
    {
      schoolName: "University of Michigan",
      schoolLocation: "Ann Arbor, MI",
      degree: "Bachelor of Science in Business Administration",
      entranceYear: new Date("2006-09-01"),
      completionYear: new Date("2010-05-31"),
      currentStatus: SchoolStatus.COMPLETED,
      graduationScore: 3.7,
      notes: [
        "Minor in Psychology",
        "Dean's List for 6 semesters",
        "Captain of debate team",
      ],
    },
  ],
  certificates: [
    {
      name: "Certified Sales Leadership Professional",
      issuingOrganization: "Sales Management Association",
      acquiredWhen: new Date("2020-02-15"),
      endsWhen: new Date("2023-02-15"),
      verificationId: "CSLP-78932",
    },
    {
      name: "Strategic Negotiation Certification",
      issuingOrganization: "Harvard Business School Online",
      acquiredWhen: new Date("2018-07-30"),
      verificationId: "HBS-NEG-291845",
    },
    {
      name: "Salesforce Certified Administrator",
      issuingOrganization: "Salesforce",
      acquiredWhen: new Date("2019-05-12"),
      endsWhen: new Date("2023-05-12"),
      verificationId: "SCA-09283746",
    },
  ],
  languages: [
    {
      language: "English",
      proficiency: LanguageProficiency.NATIVE,
    },
    {
      language: "Spanish",
      proficiency: LanguageProficiency.B1,
    },
    {
      language: "French",
      proficiency: LanguageProficiency.A1,
    },
  ],
};
