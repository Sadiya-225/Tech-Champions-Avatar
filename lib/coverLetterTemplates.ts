/**
 * Professional Cover Letter Templates
 * Based on job type and role requirements
 */

export interface CoverLetterContext {
  name: string;
  email: string;
  phone?: string;
  role: string;
  companyName: string;
  companyAddress?: string;
  jobDescription: string;
  experience: string;
  skills: string;
  bio: string;
}

const getCurrentDate = () => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date().toLocaleDateString('en-US', options);
};

/**
 * Standard Professional Cover Letter Template
 * Works for most roles and industries
 */
export function generateStandardCoverLetter(context: CoverLetterContext): string {
  const date = getCurrentDate();

  return `${date}

${context.companyName}
${context.companyAddress || "[Company Address]"}

Dear Hiring Manager,

I am writing to express my strong interest in the ${context.role} position at ${context.companyName}. With ${context.experience} in this field and a proven track record of success, I am confident that my qualifications, skills, and passion for this role make me an excellent fit for your team.

Throughout my career, I have developed deep expertise in ${context.skills}. I have consistently demonstrated the ability to deliver high-quality work, collaborate effectively with cross-functional teams, and drive measurable results. My background in ${context.bio} has equipped me with the skills and mindset necessary to excel in this position.

What particularly attracts me to this opportunity at ${context.companyName} is the chance to contribute to your mission and make a meaningful impact. I am excited about the prospect of bringing my skills and experience to your organization and contributing to your continued success.

I am confident that my qualifications align well with the requirements outlined in the job description. I would welcome the opportunity to discuss how my experience and skills can contribute to your team's success. Thank you for considering my application.

Sincerely,

${context.name}

${context.email}

${context.phone || "[Phone Number]"}`;
}

/**
 * Technical Role Cover Letter Template
 * Emphasizes technical skills and projects
 */
export function generateTechnicalCoverLetter(context: CoverLetterContext): string {
  const date = getCurrentDate();

  return `${date}

${context.companyName}
${context.companyAddress || "[Company Address]"}

Dear Hiring Manager,

I am writing to apply for the ${context.role} position at ${context.companyName}. With ${context.experience} in software development and a strong foundation in ${context.skills}, I am excited about the opportunity to contribute to your engineering team and help build innovative solutions.

In my current role, I have successfully developed and maintained complex technical systems, optimized performance, and led cross-team collaborations. My technical expertise includes ${context.skills}, and I have a proven ability to write clean, maintainable code and design scalable architectures. My background in ${context.bio} has given me a comprehensive understanding of best practices in software engineering.

I am particularly drawn to ${context.companyName} because of your commitment to innovation and excellence. I am confident that my technical skills, problem-solving abilities, and passion for software development will enable me to make significant contributions to your team.

I would greatly appreciate the opportunity to discuss how my technical expertise and experience can add value to your organization. Thank you for considering my application.

Sincerely,

${context.name}

${context.email}

${context.phone || "[Phone Number]"}`;
}

/**
 * Management/Leadership Cover Letter Template
 * Emphasizes leadership and strategic impact
 */
export function generateLeadershipCoverLetter(context: CoverLetterContext): string {
  const date = getCurrentDate();

  return `${date}

${context.companyName}
${context.companyAddress || "[Company Address]"}

Dear Hiring Manager,

I am writing to express my strong interest in the ${context.role} position at ${context.companyName}. With ${context.experience} in leadership roles and a proven track record of driving organizational success, I am confident that I can make significant contributions to your team.

Throughout my career, I have demonstrated exceptional leadership abilities in building high-performing teams, developing strategic initiatives, and delivering measurable business results. My expertise in ${context.skills} combined with my background in ${context.bio} has equipped me with a comprehensive understanding of best practices in management and organizational development.

What excites me most about this opportunity at ${context.companyName} is the prospect of leading your talented team toward achieving ambitious goals. I am committed to fostering a collaborative culture, developing talent, and driving innovation within the organization.

I would welcome the opportunity to discuss how my leadership experience and strategic vision can contribute to ${context.companyName}'s continued growth and success. Thank you for your consideration.

Sincerely,

${context.name}

${context.email}

${context.phone || "[Phone Number]"}`;
}

/**
 * Sales/Business Development Cover Letter Template
 * Emphasizes achievement and client relationships
 */
export function generateSalesCoverLetter(context: CoverLetterContext): string {
  const date = getCurrentDate();

  return `${date}

${context.companyName}
${context.companyAddress || "[Company Address]"}

Dear Hiring Manager,

I am writing to express my enthusiasm for the ${context.role} position at ${context.companyName}. With ${context.experience} in sales and business development, combined with a strong background in ${context.skills}, I am excited about the opportunity to drive revenue growth and build lasting client relationships for your organization.

My career has been defined by consistently exceeding targets, developing strong client relationships, and identifying new business opportunities. I bring a strategic mindset, excellent communication skills, and a passion for understanding customer needs. My experience in ${context.bio} has taught me the importance of building trust and delivering value.

I am particularly interested in ${context.companyName} because of your market position and reputation for excellence. I am confident that my sales expertise and client-focused approach will enable me to contribute meaningfully to your business objectives.

I would welcome the chance to discuss how my experience in driving business growth can benefit your organization. Thank you for considering my application.

Sincerely,

${context.name}

${context.email}

${context.phone || "[Phone Number]"}`;
}

/**
 * Select appropriate template based on role keywords
 */
export function selectCoverLetterTemplate(
  roleTitle: string
): (context: CoverLetterContext) => string {
  const role = roleTitle.toLowerCase();

  if (
    role.includes("engineer") ||
    role.includes("developer") ||
    role.includes("programmer") ||
    role.includes("architect")
  ) {
    return generateTechnicalCoverLetter;
  }

  if (
    role.includes("manager") ||
    role.includes("director") ||
    role.includes("lead") ||
    role.includes("head") ||
    role.includes("vp")
  ) {
    return generateLeadershipCoverLetter;
  }

  if (
    role.includes("sales") ||
    role.includes("business") ||
    role.includes("account") ||
    role.includes("representative")
  ) {
    return generateSalesCoverLetter;
  }

  // Default to standard template
  return generateStandardCoverLetter;
}
