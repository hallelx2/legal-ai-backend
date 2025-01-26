import { TemplateType } from 'src/agreements/schemas/agreement-templates.types.ts';
import { TemplateCategory } from './template.enum';

export const PREDEFINED_TEMPLATES: TemplateType[] = [
  {
    id: 'nda-template',
    name: 'Non-Disclosure Agreement',
    description: 'Comprehensive NDA for business relationships',
    version: '1.0.0',
    category: TemplateCategory.BUSINESS,
    sections: [
      {
        id: 'parties',
        title: 'Parties Information',
        required: true,
        order: 1,
        aiPrompt: 'Enter the details of both parties involved in the NDA',
        variables: [
          {
            id: 'disclosing_party',
            name: 'Disclosing Party',
            type: 'string',
            required: true,
            description: 'The party sharing confidential information',
          },
          {
            id: 'receiving_party',
            name: 'Receiving Party',
            type: 'string',
            required: true,
            description: 'The party receiving confidential information',
          },
        ],
      },
      {
        id: 'confidential_info',
        title: 'Confidential Information Definition',
        required: true,
        order: 2,
        aiPrompt: 'Define what constitutes confidential information',
        variables: [
          {
            id: 'info_types',
            name: 'Types of Confidential Information',
            type: 'array',
            required: true,
            description: 'List the types of confidential information covered',
          },
        ],
      },
      {
        id: 'term',
        title: 'Agreement Term',
        required: true,
        order: 3,
        aiPrompt: 'Specify the duration of the agreement',
        variables: [
          {
            id: 'start_date',
            name: 'Start Date',
            type: 'date',
            required: true,
            description: 'When the agreement becomes effective',
          },
          {
            id: 'duration',
            name: 'Duration (years)',
            type: 'number',
            required: true,
            description: 'How long the agreement will last',
            validation: {
              min: 1,
              max: 10,
            },
          },
        ],
      },
    ],
    defaultSignatureLocations: [
      {
        role: 'Disclosing Party',
        email: '',
        page: 'last',
        x: 100,
        y: 500,
        required: true,
      },
      {
        role: 'Receiving Party',
        email: '',
        page: 'last',
        x: 400,
        y: 500,
        required: true,
      },
    ],
    metadata: {
      industry: 'Technology',
      jurisdiction: 'United States',
      lastUpdated: new Date().toISOString(),
      isCustom: false,
      tags: ['Confidentiality', 'Business'],
      status: 'published',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'published',
  },
  {
    id: 'employment-contract',
    name: 'Employment Agreement',
    description: 'Standard employment contract template',
    version: '1.0.0',
    category: TemplateCategory.EMPLOYMENT,
    sections: [
      {
        id: 'employee_info',
        title: 'Employee Information',
        required: true,
        order: 1,
        aiPrompt: 'Enter employee details',
        variables: [
          {
            id: 'employee_name',
            name: 'Employee Name',
            type: 'string',
            required: true,
            description: 'Full legal name of the employee',
          },
          {
            id: 'employee_address',
            name: 'Employee Address',
            type: 'string',
            required: true,
            description: 'Current residential address',
          },
        ],
      },
      {
        id: 'position_details',
        title: 'Position Details',
        required: true,
        order: 2,
        aiPrompt: 'Specify job position details',
        variables: [
          {
            id: 'job_title',
            name: 'Job Title',
            type: 'string',
            required: true,
            description: 'Official position title',
          },
          {
            id: 'start_date',
            name: 'Start Date',
            type: 'date',
            required: true,
            description: 'Employment start date',
          },
          {
            id: 'salary',
            name: 'Annual Salary',
            type: 'number',
            required: true,
            description: 'Annual base salary amount',
          },
        ],
      },
      {
        id: 'benefits',
        title: 'Benefits',
        required: false,
        order: 3,
        aiPrompt: 'Detail employee benefits',
        variables: [
          {
            id: 'vacation_days',
            name: 'Vacation Days',
            type: 'number',
            required: true,
            description: 'Annual vacation days',
            validation: {
              min: 0,
              max: 30,
            },
          },
          {
            id: 'health_insurance',
            name: 'Health Insurance',
            type: 'boolean',
            required: true,
            description: 'Include health insurance benefits',
          },
        ],
      },
    ],
    defaultSignatureLocations: [
      {
        role: 'Employer',
        email: '',
        page: 'last',
        x: 100,
        y: 500,
        required: true,
      },
      {
        role: 'Employee',
        email: '',
        page: 'last',
        x: 400,
        y: 500,
        required: true,
      },
    ],
    metadata: {
      industry: 'All',
      jurisdiction: 'United States',
      lastUpdated: new Date().toISOString(),
      isCustom: false,
      tags: ['Employment', 'HR'],
      status: 'published',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'published',
  },
  {
    id: 'lease-agreement',
    name: 'Lease Agreement',
    description: 'Standard lease agreement for renting properties',
    version: '1.0.0',
    category: TemplateCategory.REAL_ESTATE,
    sections: [
      {
        id: 'property_details',
        title: 'Property Details',
        required: true,
        order: 1,
        aiPrompt: 'Provide details of the property being leased',
        variables: [
          {
            id: 'property_address',
            name: 'Property Address',
            type: 'string',
            required: true,
            description: 'Full address of the rental property',
          },
          {
            id: 'property_type',
            name: 'Property Type',
            type: 'string',
            required: true,
            description: 'Type of property (e.g., apartment, house, office)',
          },
        ],
      },
      {
        id: 'lease_terms',
        title: 'Lease Terms',
        required: true,
        order: 2,
        aiPrompt: 'Define the lease terms and conditions',
        variables: [
          {
            id: 'lease_start_date',
            name: 'Lease Start Date',
            type: 'date',
            required: true,
            description: 'Date when the lease begins',
          },
          {
            id: 'lease_duration',
            name: 'Lease Duration',
            type: 'number',
            required: true,
            description: 'Duration of the lease in months',
            validation: {
              min: 1,
              max: 60,
            },
          },
          {
            id: 'monthly_rent',
            name: 'Monthly Rent',
            type: 'number',
            required: true,
            description: 'Amount of rent payable each month',
          },
        ],
      },
    ],
    defaultSignatureLocations: [
      {
        role: 'Landlord',
        email: '',
        page: 'last',
        x: 100,
        y: 500,
        required: true,
      },
      {
        role: 'Tenant',
        email: '',
        page: 'last',
        x: 400,
        y: 500,
        required: true,
      },
    ],
    metadata: {
      industry: 'Real Estate',
      jurisdiction: 'United States',
      lastUpdated: new Date().toISOString(),
      isCustom: false,
      tags: ['Lease', 'Property'],
      status: 'published',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'published',
  },
  {
    id: 'ip-assignment',
    name: 'Intellectual Property Assignment',
    description:
      'Agreement for transferring ownership of intellectual property',
    version: '1.0.0',
    category: TemplateCategory.INTELLECTUAL_PROPERTY,
    sections: [
      {
        id: 'ip_details',
        title: 'Intellectual Property Details',
        required: true,
        order: 1,
        aiPrompt: 'Describe the intellectual property being assigned',
        variables: [
          {
            id: 'ip_type',
            name: 'Type of Intellectual Property',
            type: 'string',
            required: true,
            description: 'Type of IP (e.g., patent, trademark, copyright)',
          },
          {
            id: 'ip_description',
            name: 'Description',
            type: 'string',
            required: true,
            description: 'Detailed description of the intellectual property',
          },
        ],
      },
      {
        id: 'assignment_terms',
        title: 'Assignment Terms',
        required: true,
        order: 2,
        aiPrompt: 'Specify the terms of the assignment',
        variables: [
          {
            id: 'assignment_date',
            name: 'Assignment Date',
            type: 'date',
            required: true,
            description: 'Date when the assignment is effective',
          },
          {
            id: 'consideration',
            name: 'Consideration',
            type: 'number',
            required: true,
            description: 'Amount paid for the assignment (if applicable)',
          },
        ],
      },
    ],
    defaultSignatureLocations: [
      {
        role: 'Assignor',
        email: '',
        page: 'last',
        x: 100,
        y: 500,
        required: true,
      },
      {
        role: 'Assignee',
        email: '',
        page: 'last',
        x: 400,
        y: 500,
        required: true,
      },
    ],
    metadata: {
      industry: 'Intellectual Property',
      jurisdiction: 'United States',
      lastUpdated: new Date().toISOString(),
      isCustom: false,
      tags: ['IP', 'Legal'],
      status: 'published',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'published',
  },
  {
    id: 'comprehensive-employment-contract',
    name: 'Comprehensive Employment Agreement',
    description:
      'Detailed employment contract covering all critical aspects of employment, including compensation, responsibilities, confidentiality, and termination conditions',
    version: '2.0.0',
    category: TemplateCategory.EMPLOYMENT,
    sections: [
      {
        id: 'employee_identification',
        title: 'Employee and Company Identification',
        required: true,
        order: 1,
        aiPrompt:
          'Provide comprehensive details about the employee and employing organization',
        variables: [
          {
            id: 'employee_full_legal_name',
            name: 'Employee Full Legal Name',
            type: 'string',
            required: true,
            description:
              'Complete legal name as it appears on official identification',
            validation: {
              pattern: "^[A-Za-z\\s\\-']{2,50}$",
            },
          },
          {
            id: 'employee_tax_identification',
            name: 'Tax Identification Number',
            type: 'string',
            required: true,
            description:
              'Social Security Number or equivalent tax identification',
            validation: {
              pattern: '^\\d{9}$',
            },
          },
          {
            id: 'company_legal_entity',
            name: 'Employing Legal Entity',
            type: 'string',
            required: true,
            description: 'Full legal name of the employing organization',
          },
          {
            id: 'company_registration_number',
            name: 'Company Registration Number',
            type: 'string',
            required: true,
            description:
              'Official business registration or incorporation number',
          },
        ],
      },
      {
        id: 'employment_terms',
        title: 'Comprehensive Employment Terms',
        required: true,
        order: 2,
        aiPrompt:
          'Define detailed employment parameters including position, compensation, and classification',
        variables: [
          {
            id: 'job_title',
            name: 'Specific Job Title',
            type: 'string',
            required: true,
            description: 'Exact job title with detailed role description',
          },
          {
            id: 'employment_type',
            name: 'Employment Classification',
            type: 'string',
            required: true,
            description: 'Full-time, Part-time, Contract, or Temporary',
            validation: {
              options: ['Full-time', 'Part-time', 'Contract', 'Temporary'],
            },
          },
          {
            id: 'base_compensation',
            name: 'Annual Base Compensation',
            type: 'number',
            required: true,
            description:
              'Total annual salary before bonuses or additional compensation',
            validation: {
              min: 30000,
              max: 1000000,
            },
          },
          {
            id: 'bonus_structure',
            name: 'Performance Bonus Potential',
            type: 'number',
            required: false,
            description:
              'Maximum potential bonus as a percentage of base salary',
            validation: {
              min: 0,
              max: 100,
            },
          },
          {
            id: 'equity_compensation',
            name: 'Equity Compensation',
            type: 'boolean',
            required: true,
            description:
              'Indicates whether stock options or equity grants are part of compensation',
          },
        ],
      },
      {
        id: 'confidentiality_intellectual_property',
        title: 'Confidentiality and Intellectual Property Agreement',
        required: true,
        order: 3,
        aiPrompt:
          'Elaborate on confidentiality expectations and intellectual property assignments',
        variables: [
          {
            id: 'confidentiality_scope',
            name: 'Confidentiality Definition',
            type: 'array',
            required: true,
            description:
              'Comprehensive list of what constitutes confidential information',
          },
          {
            id: 'ip_assignment_scope',
            name: 'Intellectual Property Assignment',
            type: 'array',
            required: true,
            description:
              'Types of intellectual property covered by the agreement',
          },
          {
            id: 'non_compete_duration',
            name: 'Non-Compete Duration (months)',
            type: 'number',
            required: false,
            description:
              'Duration of non-competitive restrictions post-employment',
            validation: {
              min: 0,
              max: 24,
            },
          },
        ],
      },
      {
        id: 'termination_conditions',
        title: 'Termination and Separation Terms',
        required: true,
        order: 4,
        aiPrompt:
          'Define comprehensive termination conditions and separation protocols',
        variables: [
          {
            id: 'notice_period',
            name: 'Termination Notice Period',
            type: 'number',
            required: true,
            description:
              'Weeks of notice required for voluntary or involuntary termination',
            validation: {
              min: 1,
              max: 12,
            },
          },
          {
            id: 'severance_eligibility',
            name: 'Severance Package Eligibility',
            type: 'boolean',
            required: true,
            description: 'Indicates potential severance package availability',
          },
        ],
      },
    ],
    defaultSignatureLocations: [
      {
        role: 'Employee',
        email: '',
        page: 'last',
        x: 100,
        y: 700,
        required: true,
      },
      {
        role: 'Company Representative',
        email: '',
        page: 'last',
        x: 400,
        y: 700,
        required: true,
      },
    ],
    metadata: {
      industry: 'Technology',
      jurisdiction: 'United States - California',
      lastUpdated: new Date().toISOString(),
      isCustom: false,
      tags: [
        'Employment',
        'Comprehensive Contract',
        'Technology Sector',
        'Intellectual Property',
        'Compensation Agreement',
      ],
      status: 'published',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'published',
  },
  {
    id: 'technology-transfer-agreement',
    name: 'Comprehensive Technology Transfer and Licensing Agreement',
    description:
      'Detailed agreement governing the transfer, licensing, and usage rights of technological innovations between organizations',
    version: '2.0.0',
    category: TemplateCategory.INTELLECTUAL_PROPERTY,
    sections: [
      {
        id: 'technology_identification',
        title: 'Technological Asset Identification',
        required: true,
        order: 1,
        aiPrompt:
          'Provide comprehensive details about the technological assets being transferred',
        variables: [
          {
            id: 'technology_name',
            name: 'Official Technology Name',
            type: 'string',
            required: true,
            description:
              'Precise name of the technological asset or innovation',
          },
          {
            id: 'patent_numbers',
            name: 'Associated Patent Identifiers',
            type: 'array',
            required: false,
            description: 'List of patent numbers or application references',
          },
          {
            id: 'technology_readiness_level',
            name: 'Technology Readiness Level',
            type: 'number',
            required: true,
            description: 'Technological maturity scale (1-9)',
            validation: {
              min: 1,
              max: 9,
            },
          },
        ],
      },
      {
        id: 'licensing_terms',
        title: 'Licensing and Usage Rights',
        required: true,
        order: 2,
        aiPrompt: 'Define detailed licensing parameters and usage restrictions',
        variables: [
          {
            id: 'license_type',
            name: 'License Classification',
            type: 'string',
            required: true,
            description: 'Exclusive, Non-Exclusive, or Limited licensing',
            validation: {
              options: ['Exclusive', 'Non-Exclusive', 'Limited'],
            },
          },
          {
            id: 'geographic_scope',
            name: 'Geographic Usage Rights',
            type: 'array',
            required: true,
            description:
              'Regions or countries where technology can be utilized',
          },
          {
            id: 'licensing_fee_structure',
            name: 'Licensing Fee Mechanism',
            type: 'string',
            required: true,
            description: 'Payment structure for technology usage',
            validation: {
              options: ['Upfront', 'Royalty-Based', 'Hybrid'],
            },
          },
          {
            id: 'annual_licensing_fee',
            name: 'Annual Licensing Fee',
            type: 'number',
            required: true,
            description: 'Base annual fee for technology licensing',
            validation: {
              min: 1000,
              max: 1000000,
            },
          },
        ],
      },
      // Additional sections focusing on transfer protocols, confidentiality, etc.
    ],
    defaultSignatureLocations: [
      {
        role: 'Technology Owner',
        email: '',
        page: 'last',
        x: 100,
        y: 700,
        required: true,
      },
      {
        role: 'Technology Recipient',
        email: '',
        page: 'last',
        x: 400,
        y: 700,
        required: true,
      },
    ],
    metadata: {
      industry: 'Technology',
      jurisdiction: 'United States - Delaware',
      lastUpdated: new Date().toISOString(),
      isCustom: false,
      tags: [
        'Intellectual Property',
        'Technology Transfer',
        'Licensing Agreement',
        'Innovation Rights',
      ],
      status: 'published',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'published',
  },

  // Real Estate - Commercial Lease Agreement
  {
    id: 'commercial-lease-agreement',
    name: 'Comprehensive Commercial Property Lease Contract',
    description:
      'Detailed lease agreement for commercial real estate, covering complex tenancy requirements',
    version: '2.0.0',
    category: TemplateCategory.REAL_ESTATE,
    sections: [
      {
        id: 'property_details',
        title: 'Precise Property Identification',
        required: true,
        order: 1,
        aiPrompt:
          'Provide exhaustive details about the commercial property being leased',
        variables: [
          {
            id: 'property_full_address',
            name: 'Complete Property Address',
            type: 'string',
            required: true,
            description:
              'Exact location including street, city, state, zip code',
          },
          {
            id: 'property_classification',
            name: 'Property Type',
            type: 'string',
            required: true,
            description: 'Specific commercial property classification',
            validation: {
              options: [
                'Office',
                'Retail',
                'Industrial',
                'Warehouse',
                'Mixed-Use',
                'Restaurant',
              ],
            },
          },
          {
            id: 'total_square_footage',
            name: 'Leased Area Size',
            type: 'number',
            required: true,
            description: 'Total square footage of leased premises',
            validation: {
              min: 100,
              max: 100000,
            },
          },
        ],
      },
      {
        id: 'financial_terms',
        title: 'Comprehensive Financial Lease Parameters',
        required: true,
        order: 2,
        aiPrompt:
          'Define intricate financial terms governing the commercial lease',
        variables: [
          {
            id: 'base_rent_amount',
            name: 'Monthly Base Rent',
            type: 'number',
            required: true,
            description: 'Fixed monthly rental amount',
            validation: {
              min: 500,
              max: 500000,
            },
          },
          {
            id: 'rent_escalation_clause',
            name: 'Annual Rent Escalation Rate',
            type: 'number',
            required: true,
            description: 'Percentage increase in rent annually',
            validation: {
              min: 0,
              max: 10,
            },
          },
          {
            id: 'additional_expenses',
            name: 'Included Operational Expenses',
            type: 'array',
            required: true,
            description: 'List of expenses covered under lease terms',
          },
        ],
      },
      // More sections can be added covering maintenance, restrictions, etc.
    ],
    defaultSignatureLocations: [
      {
        role: 'Tenant',
        email: '',
        page: 'last',
        x: 100,
        y: 700,
        required: true,
      },
      {
        role: 'Property Owner',
        email: '',
        page: 'last',
        x: 400,
        y: 700,
        required: true,
      },
    ],
    metadata: {
      industry: 'Real Estate',
      jurisdiction: 'United States - New York',
      lastUpdated: new Date().toISOString(),
      isCustom: false,
      tags: [
        'Commercial Lease',
        'Property Rental',
        'Business Tenancy',
        'Real Estate Contract',
      ],
      status: 'published',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'published',
  },
];
