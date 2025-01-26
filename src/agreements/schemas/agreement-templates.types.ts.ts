import { TemplateCategory } from 'src/templates/template.enum';

export interface TemplateSection {
  id: string;
  title: string;
  required: boolean;
  order: number;
  aiPrompt: string;
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array';
  required: boolean;
  description: string;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    options?: string[];
  };
}

export interface SignatureLocation {
  role: string;
  email: string;
  page: string;
  x: number;
  y: number;
  required: boolean;
}

export interface TemplateMetadata {
  industry: string;
  jurisdiction: string;
  lastUpdated: Date | string; // Use ISO string or Date
  isCustom: boolean;
  tags: string[];
  status: 'published' | 'draft';
}

export interface TemplateType {
  id: string;
  name: string;
  description: string;
  version: string;
  category: TemplateCategory;
  sections: TemplateSection[];
  defaultSignatureLocations: SignatureLocation[];
  metadata: TemplateMetadata;
  createdAt: Date | string; // Use ISO string or Date
  updatedAt: Date | string; // Use ISO string or Date
  status: 'published' | 'draft';
}
