import { ValidationRule } from '../types/form';

export const validateField = (value: any, rules: ValidationRule[]): string[] => {
  const errors: string[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case 'notEmpty':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(rule.message);
        }
        break;
      
      case 'minLength':
        if (typeof value === 'string' && value.length < (rule.value as number)) {
          errors.push(rule.message);
        }
        break;
      
      case 'maxLength':
        if (typeof value === 'string' && value.length > (rule.value as number)) {
          errors.push(rule.message);
        }
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof value === 'string' && !emailRegex.test(value)) {
          errors.push(rule.message);
        }
        break;
      
      case 'password':
        if (typeof value === 'string') {
          if (value.length < 8) {
            errors.push('Password must be at least 8 characters long');
          }
          if (!/\d/.test(value)) {
            errors.push('Password must contain at least one number');
          }
        }
        break;
    }
  }

  return errors;
};

export const calculateDerivedValue = (logic: string, parentValues: Record<string, any>): any => {
  try {
    // Simple age calculation from date of birth
    if (logic.includes('age') && parentValues.dob) {
      const birthDate = new Date(parentValues.dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1;
      }
      return age;
    }
    
    // Simple sum calculation
    if (logic.includes('sum')) {
      return Object.values(parentValues).reduce((sum, val) => {
        const num = parseFloat(val) || 0;
        return sum + num;
      }, 0);
    }
    
    // Concatenation
    if (logic.includes('concat')) {
      return Object.values(parentValues).join(' ');
    }
    
    return '';
  } catch (error) {
    return '';
  }
};