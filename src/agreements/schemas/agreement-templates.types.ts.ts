export interface TemplateSection {
  id: string;
  title: string;
  required: string;
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
    max?: string;
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
