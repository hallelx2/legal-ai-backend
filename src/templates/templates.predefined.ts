import { TemplateCategory } from './template.enum';

export const PREDEFINED_TEMPLATES = [
  // Business Templates
  {
    id: 'service-agreement',
    name: 'Professional Services Agreement',
    description: 'Standard agreement for professional services',
    category: TemplateCategory.BUSINESS,
    metadata: {
      industry: 'Professional Services',
      jurisdiction: 'General',
      tags: ['services', 'professional', 'contract'],
    },
  },
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    description: 'Confidentiality agreement to protect sensitive information',
    category: TemplateCategory.BUSINESS,
    metadata: {
      industry: 'All',
      jurisdiction: 'General',
      tags: ['confidential', 'legal', 'protection'],
    },
  },
  {
    id: 'partnership-agreement',
    name: 'Business Partnership Agreement',
    description: 'Comprehensive agreement for business partnerships',
    category: TemplateCategory.BUSINESS,
    metadata: {
      industry: 'Business',
      jurisdiction: 'General',
      tags: ['partnership', 'business', 'collaboration'],
    },
  },
  {
    id: 'vendor-contract',
    name: 'Vendor Supply Agreement',
    description: 'Contract for goods or services between a business and vendor',
    category: TemplateCategory.BUSINESS,
    metadata: {
      industry: 'Procurement',
      jurisdiction: 'General',
      tags: ['vendor', 'supply', 'procurement'],
    },
  },

  // Employment Templates
  {
    id: 'employment-contract',
    name: 'Full-Time Employment Agreement',
    description: 'Comprehensive employment contract for full-time employees',
    category: TemplateCategory.EMPLOYMENT,
    metadata: {
      industry: 'Human Resources',
      jurisdiction: 'General',
      tags: ['employment', 'full-time', 'hiring'],
    },
  },
  {
    id: 'contractor-agreement',
    name: 'Independent Contractor Agreement',
    description: 'Contract for engaging independent contractors',
    category: TemplateCategory.EMPLOYMENT,
    metadata: {
      industry: 'Freelance',
      jurisdiction: 'General',
      tags: ['contractor', 'freelance', 'temporary'],
    },
  },
  {
    id: 'internship-agreement',
    name: 'Internship Agreement',
    description: 'Contract for internship positions',
    category: TemplateCategory.EMPLOYMENT,
    metadata: {
      industry: 'Education',
      jurisdiction: 'General',
      tags: ['internship', 'training', 'learning'],
    },
  },

  // Real Estate Templates
  {
    id: 'lease-agreement',
    name: 'Commercial Lease Agreement',
    description: 'Lease contract for commercial property',
    category: TemplateCategory.REAL_ESTATE,
    metadata: {
      industry: 'Real Estate',
      jurisdiction: 'General',
      tags: ['lease', 'commercial', 'property'],
    },
  },
  {
    id: 'residential-lease',
    name: 'Residential Lease Agreement',
    description: 'Standard lease agreement for residential properties',
    category: TemplateCategory.REAL_ESTATE,
    metadata: {
      industry: 'Real Estate',
      jurisdiction: 'General',
      tags: ['lease', 'residential', 'housing'],
    },
  },

  // Intellectual Property Templates
  {
    id: 'licensing-agreement',
    name: 'Intellectual Property Licensing Agreement',
    description: 'Agreement for licensing intellectual property',
    category: TemplateCategory.INTELLECTUAL_PROPERTY,
    metadata: {
      industry: 'Intellectual Property',
      jurisdiction: 'General',
      tags: ['licensing', 'ip', 'copyright'],
    },
  },
  {
    id: 'trademark-assignment',
    name: 'Trademark Assignment Agreement',
    description: 'Agreement for transferring trademark ownership',
    category: TemplateCategory.INTELLECTUAL_PROPERTY,
    metadata: {
      industry: 'Intellectual Property',
      jurisdiction: 'General',
      tags: ['trademark', 'ip', 'transfer'],
    },
  },

  // Financial Templates
  {
    id: 'loan-agreement',
    name: 'Loan Agreement',
    description: 'Comprehensive loan contract',
    category: TemplateCategory.FINANCIAL,
    metadata: {
      industry: 'Finance',
      jurisdiction: 'General',
      tags: ['loan', 'finance', 'credit'],
    },
  },
  {
    id: 'investment-contract',
    name: 'Investment Agreement',
    description: 'Contract for investment terms and conditions',
    category: TemplateCategory.FINANCIAL,
    metadata: {
      industry: 'Finance',
      jurisdiction: 'General',
      tags: ['investment', 'finance', 'capital'],
    },
  },
  {
    id: 'patient-consent',
    name: 'Patient Consent Form',
    description: 'Medical consent and treatment authorization',
    category: TemplateCategory.HEALTHCARE,
    metadata: {
      industry: 'Healthcare',
      jurisdiction: 'General',
      tags: ['medical', 'consent', 'treatment'],
    },
  },
  {
    id: 'telemedicine-agreement',
    name: 'Telemedicine Service Agreement',
    description: 'Contract for remote medical consultation services',
    category: TemplateCategory.HEALTHCARE,
    metadata: {
      industry: 'Telehealth',
      jurisdiction: 'General',
      tags: ['telemedicine', 'remote', 'healthcare'],
    },
  },

  // Technology Templates
  {
    id: 'software-development-contract',
    name: 'Software Development Agreement',
    description: 'Contract for custom software development services',
    category: TemplateCategory.TECHNOLOGY,
    metadata: {
      industry: 'Technology',
      jurisdiction: 'General',
      tags: ['software', 'development', 'tech'],
    },
  },
  {
    id: 'saas-terms-of-service',
    name: 'SaaS Terms of Service',
    description: 'Standard terms for Software as a Service platforms',
    category: TemplateCategory.TECHNOLOGY,
    metadata: {
      industry: 'Technology',
      jurisdiction: 'General',
      tags: ['saas', 'software', 'service'],
    },
  },

  // Research and Academic Templates
  {
    id: 'research-collaboration-agreement',
    name: 'Research Collaboration Agreement',
    description: 'Contract for joint research initiatives',
    category: TemplateCategory.ACADEMIC,
    metadata: {
      industry: 'Academia',
      jurisdiction: 'General',
      tags: ['research', 'collaboration', 'academic'],
    },
  },
  {
    id: 'publication-rights-agreement',
    name: 'Academic Publication Rights Agreement',
    description: 'Terms for publishing research and academic work',
    category: TemplateCategory.ACADEMIC,
    metadata: {
      industry: 'Academia',
      jurisdiction: 'General',
      tags: ['publication', 'research', 'rights'],
    },
  },

  // Event and Media Templates
  {
    id: 'event-sponsorship-agreement',
    name: 'Event Sponsorship Agreement',
    description: 'Contract for event sponsorship and marketing',
    category: TemplateCategory.MEDIA,
    metadata: {
      industry: 'Events',
      jurisdiction: 'General',
      tags: ['sponsorship', 'event', 'marketing'],
    },
  },
  {
    id: 'media-production-contract',
    name: 'Media Production Agreement',
    description: 'Contract for film, video, or media production',
    category: TemplateCategory.MEDIA,
    metadata: {
      industry: 'Media',
      jurisdiction: 'General',
      tags: ['production', 'media', 'creative'],
    },
  },
];
