/**
 * Resume Parser Service
 *
 * Handles file ingestion, text extraction, integration with the Gemini extraction API,
 * and rule-based heuristic fallback extraction.
 */

export const SAMPLE_RESUMES = [
  {
    id: 'sample-healthcare',
    name: 'Priya Patel',
    role: 'Clinical Healthcare Analytics Specialist',
    industry: 'Healthcare & Life Sciences',
    text: `PRIYA PATEL
Chicago, IL | (312) 555-8921 | priya.patel.healthdata@gmail.com | linkedin.com/in/priyapatel-healthdata

PROFESSIONAL SUMMARY
Dedicated Clinical Data & Health Informatics Specialist with 4+ years of experience leveraging SQL, Python, and Tableau across inpatient health systems and clinical research organizations. Proven track record of optimizing EHR clinical documentation workflows, reducing billing denial rates by 18%, and architecting HIPAA-compliant clinical KPI dashboards for hospital leadership. Seeking a Senior Healthcare Analytics role.

CORE COMPETENCIES & TECHNICAL SKILLS
• Analytics & Querying: SQL (PostgreSQL, MS SQL Server, Snowflake), Python (Pandas, NumPy, SciPy), R Studio
• Clinical Systems & EHR: Epic Systems (Caboodle, Clarity), Cerner Millennium, HL7/FHIR Data Standards
• Compliance & Governance: HIPAA, HITECH, Protected Health Information (PHI) Auditing, CMS Quality Measures
• BI & Visualization: Tableau Desktop & Server, Power BI, Executive Clinical Reporting
• Methods: Statistical Modeling, Hospital Throughput Optimization, Claims EDI 837/835 Analysis

PROFESSIONAL EXPERIENCE

Metro Health Systems — Chicago, IL
Lead Healthcare Data Analyst | Jan 2023 – Present
• Engineered automated SQL pipelines extracting electronic health record (EHR) data for over 45,000 monthly patient admissions, cutting reporting latency from 4 days to real-time.
• Spearheaded hospital throughput dashboard monitoring ED bed wait-times, directly informing clinical staffing reallocation that decreased average wait time by 22 minutes.
• Authored HIPAA-compliant data access policies for research registries and audited clinical billing workflows, recovering $1.2M in previously denied insurance claims.

Informatics Solutions LLC — Evanston, IL
Healthcare Business Intelligence Associate | Jun 2021 – Dec 2022
• Designed and published 15+ operational Tableau dashboards tracking clinical quality metrics (HEDIS, readmission rates, medication reconciliation).
• Cleaned and standardized multi-payer claims datasets comprising 2M+ records using Python and Pandas.
• Partnered closely with clinical department heads to translate complex physician workflow requirements into actionable diagnostic telemetry.

EDUCATION
University of Illinois Chicago — Chicago, IL
Bachelor of Science in Health Information Management (Cum Laude), 2021

CERTIFICATIONS
• Epic Clarity Data Model Certified (2023)
• Certified Health Data Analyst (CHDA) – AHIMA (2022)`
  },
  {
    id: 'sample-tech',
    name: 'Jordan Reed',
    role: 'Senior Cloud & DevOps Engineer',
    industry: 'Technology & Cloud Infrastructure',
    text: `JORDAN REED
Austin, TX | (512) 555-3419 | jordan.reed.devops@outlook.com | github.com/jreed-cloud | linkedin.com/in/jordanreed-devops

PROFESSIONAL SUMMARY
Senior Cloud Infrastructure & DevOps Engineer with 6 years of experience architecting resilient multi-cloud platforms on AWS and GCP. Expert in container orchestration (Kubernetes), Infrastructure as Code (Terraform), and high-throughput CI/CD pipelines. Reduced deployment cycle times by 65% while maintaining 99.99% system availability.

CORE COMPETENCIES & TECHNICAL SKILLS
• Cloud & Platforms: Amazon Web Services (AWS), Google Cloud Platform (GCP), Linux/Unix Administration
• Containers & Orchestration: Docker, Kubernetes (EKS, GKE), Helm, Istio Service Mesh
• Infrastructure as Code: Terraform, Terragrunt, AWS CloudFormation, Ansible
• CI/CD & Automation: GitHub Actions, GitLab CI, ArgoCD, Jenkins
• Programming & Scripting: Python, Go, Bash Shell Scripting, Node.js
• Observability: Datadog, Prometheus, Grafana, OpenTelemetry, ELK Stack

PROFESSIONAL EXPERIENCE

Apex Cloud Solutions — Austin, TX
Lead DevOps Engineer | Mar 2022 – Present
• Architected enterprise-scale multi-region Kubernetes clusters on AWS serving 12M monthly active API requests with zero downtime during blue-green upgrades.
• Migrated legacy monolithic infrastructure to automated Terraform modules, cutting monthly AWS infrastructure cloud spend by $42,000.
• Built automated security vulnerability scanning into GitHub Actions pipelines, ensuring SOC2 Type II compliance across 40+ microservices.

Novus Software Systems — Austin, TX
DevOps & Cloud Engineer | Jul 2019 – Feb 2022
• Maintained CI/CD pipelines deploying containerized microservices to Docker Swarm and Kubernetes clusters.
• Automated database backup and disaster recovery validation using Python and AWS Lambda, reducing recovery time objective (RTO) from 4 hours to 15 minutes.
• Implemented centralized log aggregation and APM tracing using Prometheus and Grafana.

EDUCATION
University of Texas at Austin — Austin, TX
Bachelor of Science in Computer Science, 2019

CERTIFICATIONS
• AWS Certified Solutions Architect – Professional (2023)
• Certified Kubernetes Administrator (CKA) – Linux Foundation (2022)`
  },
  {
    id: 'sample-product',
    name: 'Marcus Vance',
    role: 'Director of Product Strategy & Operations',
    industry: 'Enterprise Software (B2B SaaS)',
    text: `MARCUS VANCE
New York, NY | (212) 555-7812 | marcus.vance.product@gmail.com | linkedin.com/in/marcusvance-product

PROFESSIONAL SUMMARY
Strategic Product Leader with 8+ years guiding cross-functional teams from discovery to scalable product-market fit in enterprise B2B SaaS. Proven expertise in pricing models, product-led growth (PLG), customer retention, and roadmap execution. Spearheaded product expansion that drove $14M in Annual Recurring Revenue (ARR).

CORE COMPETENCIES & TECHNICAL SKILLS
• Product Strategy: Roadmap Planning, Product-Led Growth (PLG), Enterprise B2B SaaS, Go-to-Market (GTM)
• Data & Discovery: Product Analytics (Mixpanel, Amplitude), SQL, User Cohort Retention, A/B Testing
• Agile Leadership: Scrum / Kanban Master, Sprint Planning, Jira, Confluence, PRD Authoring
• Business Operations: Unit Economics, SaaS Pricing Strategy, Customer Churn Mitigation, Executive Reporting

PROFESSIONAL EXPERIENCE

Kinetix Software Corp — New York, NY
Director of Product Strategy | Jan 2022 – Present
• Defined long-term product roadmap for flagship enterprise analytics suite, expanding enterprise contract value (ACV) by 35% across Fortune 500 accounts.
• Led cross-functional squad of 14 engineers, 3 UX researchers, and 4 product managers to launch self-service onboarding flow, improving 30-day user activation by 28%.
• Conducted quarterly customer advisory boards and synthesized client feedback into prioritized feature development cycles.

Beacon Data Systems — New York, NY
Senior Product Manager | Aug 2018 – Dec 2021
• Owned end-to-end lifecycle for B2B workflow collaboration platform from initial alpha prototype through general market availability.
• Collaborated with sales engineering to eliminate customer friction points, decreasing sales cycle duration by 18 days.
• Developed automated cohort analytics dashboards tracking Daily Active Users (DAU) and feature adoption velocity.

EDUCATION
New York University, Stern School of Business — New York, NY
Bachelor of Science in Marketing & Information Systems, 2018

CERTIFICATIONS
• Pragmatic Institute Certified (PMC-III)
• Certified Scrum Product Owner (CSPO)`
  }
];

export async function parseResume(resumeText, fileData = null, mimeType = null) {
  // 1. Try server-side Gemini API extraction route first
  try {
    const response = await fetch('/api/extract-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeText,
        fileData,
        mimeType,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data && result.data.name) {
        return sanitizeExtractedData(result.data, resumeText);
      }
    }
  } catch (err) {
    console.warn('Server-side Gemini extraction unavailable, utilizing client heuristic extractor', err);
  }

  // 2. Fallback to client-side heuristic parser
  return heuristicParse(resumeText);
}

function sanitizeExtractedData(data, rawText = '') {
  return {
    name: data.name || 'Candidate',
    email: data.email || extractEmail(rawText) || '',
    phone: data.phone || extractPhone(rawText) || '',
    location: data.location || 'United States',
    headline: data.headline || data.currentRole || 'Career Professional',
    currentRole: data.currentRole || 'Professional',
    targetRole: data.targetRole || data.currentRole || 'Target Specialist',
    targetIndustry: data.targetIndustry || 'Professional Services',
    experienceYears: data.experienceYears || '3+ Years',
    targetSalary: data.targetSalary || '$90,000 - $115,000 / year',
    bio: data.bio || '',
    skills: Array.isArray(data.skills) && data.skills.length > 0 ? data.skills : extractSkills(rawText),
    experienceHistory: Array.isArray(data.experienceHistory) && data.experienceHistory.length > 0
      ? data.experienceHistory.map((exp, i) => ({
          id: exp.id || `exp-${i + 1}`,
          title: exp.title || 'Role Title',
          company: exp.company || 'Organization',
          period: exp.period || 'Recent',
          location: exp.location || '',
          description: exp.description || '',
        }))
      : extractExperience(rawText),
    education: Array.isArray(data.education) ? data.education : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    cpiEstimate: data.cpiEstimate || {
      overallScore: Math.min(94, Math.max(70, 72 + Math.min((Array.isArray(data.skills) ? data.skills.length : 4) * 1.2, 10))),
      marketFit: 82,
      intent: 85,
      communication: 80,
      problemSolving: 82,
      reliability: 85,
    },
    hasUploadedResume: true,
  };
}

/**
 * Robust rule-based heuristic parser for resumes when AI is offline
 */
export function heuristicParse(text) {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Name detection (usually first prominent line)
  let name = '';
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    if (
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('www.') &&
      !line.match(/\d{3}/) &&
      !line.toLowerCase().startsWith('resume') &&
      !line.toLowerCase().startsWith('curriculum') &&
      line.length >= 3 &&
      line.length <= 40
    ) {
      name = line.replace(/[^a-zA-Z\s.-]/g, '').trim();
      break;
    }
  }
  if (!name) name = 'Candidate Profile';

  // 2. Email & Phone
  const email = extractEmail(text);
  const phone = extractPhone(text);

  // 3. Location detection
  let location = 'United States';
  const locationMatch = text.match(/([A-Z][a-zA-Z\s]+),\s*([A-Z]{2})\b/);
  if (locationMatch) {
    location = `${locationMatch[1].trim()}, ${locationMatch[2]}`;
  }

  // 4. Skills extraction
  const skills = extractSkills(text);

  // 5. Experience history
  const experienceHistory = extractExperience(text);

  // 6. Experience years
  const experienceYears = estimateYears(experienceHistory, text);

  // 7. Roles & Industry detection
  const roles = inferRoles(experienceHistory, text);

  // 8. Summary / Bio
  let bio = '';
  const summaryIdx = lines.findIndex((l) =>
    /^(professional summary|summary|executive summary|about me|profile)/i.test(l)
  );
  if (summaryIdx !== -1 && summaryIdx + 1 < lines.length) {
    const bioLines = [];
    for (let j = summaryIdx + 1; j < Math.min(summaryIdx + 6, lines.length); j++) {
      if (/^[A-Z\s]{4,}:?$/.test(lines[j]) || lines[j].includes('EXPERIENCE') || lines[j].includes('SKILLS')) {
        break;
      }
      bioLines.push(lines[j]);
    }
    bio = bioLines.join(' ').slice(0, 320);
  }
  if (!bio) {
    bio = `Experienced ${roles.currentRole} with proven expertise in ${skills.slice(0, 3).join(', ')}. Actively seeking ${roles.targetRole} opportunities in ${roles.targetIndustry}.`;
  }

  // Calculate estimated baseline CPI
  const overallScore = Math.min(94, Math.max(72, 70 + Math.min(skills.length * 1.2, 12) + (experienceHistory.length * 2.5)));

  return {
    name,
    email,
    phone,
    location,
    headline: roles.currentRole,
    currentRole: roles.currentRole,
    targetRole: roles.targetRole,
    targetIndustry: roles.targetIndustry,
    experienceYears,
    targetSalary: roles.targetSalary,
    bio,
    skills,
    experienceHistory,
    education: extractEducation(text),
    certifications: extractCertifications(text),
    cpiEstimate: {
      overallScore: Math.round(overallScore),
      marketFit: Math.round(overallScore + 2),
      intent: 90,
      communication: 80,
      problemSolving: Math.round(overallScore + 1),
      reliability: 88,
    },
    hasUploadedResume: true,
  };
}

function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : '';
}

function extractPhone(text) {
  const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0] : '';
}

const COMMON_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'PostgreSQL',
  'MySQL', 'MongoDB', 'Snowflake', 'AWS', 'Google Cloud (GCP)', 'Azure',
  'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Git', 'Linux', 'REST APIs',
  'GraphQL', 'Tableau', 'Power BI', 'Excel', 'Pandas', 'NumPy', 'Machine Learning',
  'Agile', 'Scrum', 'Jira', 'Product Management', 'Go-to-Market', 'Data Analysis',
  'Data Warehousing', 'ETL Pipelines', 'HIPAA', 'HL7 / FHIR', 'Epic Systems',
  'Cerner', 'Clinical Informatics', 'Healthcare Analytics', 'Cross-functional Collaboration',
  'Problem Solving', 'Strategic Planning', 'Executive Communication'
];

function extractSkills(text) {
  const found = new Set();
  const lower = text.toLowerCase();

  // Keyword check
  COMMON_SKILLS.forEach((skill) => {
    const sLower = skill.toLowerCase();
    if (lower.includes(sLower)) {
      found.add(skill);
    }
  });

  // Check section lines under "SKILLS"
  const lines = text.split('\n');
  const skillsIdx = lines.findIndex((l) =>
    /^(skills|technical skills|core competencies|skills & competencies)/i.test(l.trim())
  );
  if (skillsIdx !== -1) {
    for (let i = skillsIdx + 1; i < Math.min(skillsIdx + 7, lines.length); i++) {
      const line = lines[i].trim();
      if (/^[A-Z\s]{4,}:?$/.test(line) || line.includes('EXPERIENCE') || line.includes('EDUCATION')) break;
      const tokens = line.split(/[•·,|;]/).map((t) => t.trim()).filter((t) => t.length > 1 && t.length < 35);
      tokens.forEach((t) => {
        // Strip out leading labels like "Languages:"
        const cleaned = t.replace(/^[a-zA-Z\s&]+:\s*/, '').trim();
        if (cleaned && cleaned.length > 1 && cleaned.length < 35) {
          found.add(cleaned);
        }
      });
    }
  }

  return Array.from(found).slice(0, 15);
}

function extractExperience(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const expIdx = lines.findIndex((l) =>
    /^(professional experience|work experience|experience|employment history)/i.test(l)
  );

  const results = [];
  if (expIdx !== -1) {
    let currentRole = null;

    for (let i = expIdx + 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^(education|certifications|awards|projects|skills)/i.test(line)) {
        break;
      }

      // Date match pattern like "2022 – Present", "Jan 2021 - Dec 2023", "2019 - 2022"
      const dateMatch = line.match(/\b(19\d\d|20\d\d)\b.*(present|\b(19\d\d|20\d\d)\b)/i);
      if (dateMatch) {
        if (currentRole) {
          results.push(currentRole);
        }
        const parts = line.split(/[|•–—-]/).map((s) => s.trim());
        const previousLine = i > 0 ? lines[i - 1] : '';

        currentRole = {
          id: `exp-${results.length + 1}`,
          title: previousLine && previousLine.length < 50 ? previousLine : (parts[0] || 'Specialist'),
          company: parts[1] || 'Enterprise Organization',
          period: dateMatch[0],
          location: parts[2] || '',
          description: '',
        };
      } else if (currentRole && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
        currentRole.description += (currentRole.description ? ' ' : '') + line.replace(/^[•\-*]\s*/, '');
      }
    }
    if (currentRole) results.push(currentRole);
  }

  if (results.length === 0) {
    results.push({
      id: 'exp-1',
      title: 'Senior Specialist',
      company: 'Enterprise Organization',
      period: '2022 - Present',
      location: 'Hybrid / Remote',
      description: 'Directed core deliverables, managed key operational stakeholders, and drove process optimizations.',
    });
  }

  return results;
}

function estimateYears(experienceHistory, text) {
  if (experienceHistory.length >= 3) return '5+ Years';
  if (experienceHistory.length === 2) return '3 - 4 Years';
  if (text.includes('6 years') || text.includes('6+ years')) return '6+ Years';
  if (text.includes('5 years') || text.includes('5+ years')) return '5+ Years';
  if (text.includes('4 years') || text.includes('4+ years')) return '4+ Years';
  if (text.includes('3 years') || text.includes('3+ years')) return '3+ Years';
  return '2 - 3 Years';
}

function inferRoles(experienceHistory, text) {
  const firstRole = experienceHistory[0]?.title || '';
  const lower = text.toLowerCase();

  let currentRole = firstRole || 'Technology Specialist';
  let targetRole = 'Senior Specialist';
  let targetIndustry = 'Technology & Cloud';
  let targetSalary = '$95,000 - $120,000 / year';

  if (lower.includes('health') || lower.includes('clinical') || lower.includes('ehr') || lower.includes('hipaa')) {
    targetIndustry = 'Healthcare & Life Sciences';
    currentRole = firstRole || 'Healthcare Data Analyst';
    targetRole = 'Senior Healthcare Analytics Specialist';
    targetSalary = '$100,000 - $125,000 / year';
  } else if (lower.includes('devops') || lower.includes('cloud') || lower.includes('kubernetes') || lower.includes('aws')) {
    targetIndustry = 'Cloud Infrastructure & DevOps';
    currentRole = firstRole || 'Cloud & DevOps Engineer';
    targetRole = 'Lead DevOps / Site Reliability Engineer';
    targetSalary = '$135,000 - $160,000 / year';
  } else if (lower.includes('product') || lower.includes('saas') || lower.includes('b2b') || lower.includes('roadmap')) {
    targetIndustry = 'Enterprise Software (B2B SaaS)';
    currentRole = firstRole || 'Product Manager';
    targetRole = 'Director of Product Strategy';
    targetSalary = '$140,000 - $175,000 / year';
  }

  return { currentRole, targetRole, targetIndustry, targetSalary };
}

function extractEducation(text) {
  const matches = [];
  const lines = text.split('\n');
  const eduIdx = lines.findIndex((l) => /^(education|academic background)/i.test(l.trim()));
  if (eduIdx !== -1) {
    for (let i = eduIdx + 1; i < Math.min(eduIdx + 5, lines.length); i++) {
      const line = lines[i].trim();
      if (/^[A-Z\s]{4,}:?$/.test(line)) break;
      if (line.length > 5) {
        matches.push({
          degree: line,
          institution: lines[i + 1] ? lines[i + 1].trim() : 'Accredited University',
          year: 'Completed',
        });
        i++;
      }
    }
  }
  return matches;
}

function extractCertifications(text) {
  const list = [];
  const lines = text.split('\n');
  const certIdx = lines.findIndex((l) => /^(certifications|licenses|credentials)/i.test(l.trim()));
  if (certIdx !== -1) {
    for (let i = certIdx + 1; i < Math.min(certIdx + 6, lines.length); i++) {
      const line = lines[i].trim();
      if (/^[A-Z\s]{4,}:?$/.test(line)) break;
      if (line.length > 3) {
        list.push(line.replace(/^[•\-*]\s*/, ''));
      }
    }
  }
  return list;
}
