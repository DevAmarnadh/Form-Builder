export interface ValidationRule {
  type: 'notEmpty' | 'minLength' | 'maxLength' | 'email' | 'password';
  value?: number | string;
  message: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  required: boolean;
  defaultValue?: any;
  validation: ValidationRule[];
  isDerived?: boolean;
  parentFields?: string[];
  derivedLogic?: string;
  options?: string[]; // for select/radio
  order: number;
}

export interface Form {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
}

export interface FormBuilderState {
  currentForm: FormField[];
  savedForms: Form[];
  previewMode: boolean;
}