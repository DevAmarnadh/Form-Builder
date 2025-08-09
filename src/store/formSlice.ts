import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormField, Form, FormBuilderState } from '../types/form';

const loadSavedForms = (): Form[] => {
  const saved = localStorage.getItem('formBuilderForms');
  return saved ? JSON.parse(saved) : [];
};

const saveForms = (forms: Form[]) => {
  localStorage.setItem('formBuilderForms', JSON.stringify(forms));
};

const initialState: FormBuilderState = {
  currentForm: [],
  savedForms: loadSavedForms(),
  previewMode: false,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<Omit<FormField, 'id' | 'order'>>) => {
      const newField: FormField = {
        ...action.payload,
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: state.currentForm.length,
      };
      state.currentForm.push(newField);
    },
    updateField: (state, action: PayloadAction<{ id: string; updates: Partial<FormField> }>) => {
      const { id, updates } = action.payload;
      const fieldIndex = state.currentForm.findIndex(field => field.id === id);
      if (fieldIndex !== -1) {
        state.currentForm[fieldIndex] = { ...state.currentForm[fieldIndex], ...updates };
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm = state.currentForm.filter(field => field.id !== action.payload);
      // Reorder remaining fields
      state.currentForm.forEach((field, index) => {
        field.order = index;
      });
    },
    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [removed] = state.currentForm.splice(fromIndex, 1);
      state.currentForm.splice(toIndex, 0, removed);
      // Update order values
      state.currentForm.forEach((field, index) => {
        field.order = index;
      });
    },
    saveForm: (state, action: PayloadAction<string>) => {
      const formName = action.payload;
      const newForm: Form = {
        id: `form_${Date.now()}`,
        name: formName,
        createdAt: new Date().toISOString(),
        fields: [...state.currentForm],
      };
      state.savedForms.push(newForm);
      saveForms(state.savedForms);
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload);
      if (form) {
        state.currentForm = [...form.fields];
      }
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(form => form.id !== action.payload);
      saveForms(state.savedForms);
    },
    clearCurrentForm: (state) => {
      state.currentForm = [];
    },
    setPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.previewMode = action.payload;
    },
  },
});

export const {
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  loadForm,
  deleteForm,
  clearCurrentForm,
  setPreviewMode,
} = formSlice.actions;

export default formSlice.reducer;