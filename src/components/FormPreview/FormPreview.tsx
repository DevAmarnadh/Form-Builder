import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ArrowBack, Send } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { RootState } from '../../store/store';
import { FormField } from '../../types/form';
import { validateField, calculateDerivedValue } from '../../utils/validation';

export const FormPreview: React.FC = () => {
  const navigate = useNavigate();
  const currentForm = useSelector((state: RootState) => state.form.currentForm);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Initialize form data with default values
  useEffect(() => {
    const initialData: Record<string, any> = {};
    
    currentForm.forEach(field => {
      if (!field.isDerived) {
        if (field.type === 'checkbox') {
          initialData[field.id] = field.defaultValue === 'true' || field.defaultValue === true;
        } else if (field.type === 'date' && field.defaultValue) {
          initialData[field.id] = dayjs(field.defaultValue);
        } else {
          initialData[field.id] = field.defaultValue || '';
        }
      }
    });

    setFormData(initialData);
  }, [currentForm]);

  // Calculate derived fields
  useEffect(() => {
    const derivedFields = currentForm.filter(field => field.isDerived);
    const newFormData = { ...formData };

    derivedFields.forEach(field => {
      if (field.parentFields && field.derivedLogic) {
        const parentValues: Record<string, any> = {};
        
        field.parentFields.forEach(parentId => {
          const parentField = currentForm.find(f => f.id === parentId);
          if (parentField) {
            // Use the field label as key for better readability in calculations
            parentValues[parentField.label.toLowerCase().replace(/\s+/g, '')] = formData[parentId];
            parentValues.dob = formData[parentId]; // Special case for date of birth
          }
        });

        const calculatedValue = calculateDerivedValue(field.derivedLogic, parentValues);
        newFormData[field.id] = calculatedValue;
      }
    });

    if (JSON.stringify(newFormData) !== JSON.stringify(formData)) {
      setFormData(newFormData);
    }
  }, [formData, currentForm]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear errors for this field
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: [],
      }));
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string[]> = {};
    let hasErrors = false;

    currentForm.forEach(field => {
      if (!field.isDerived) {
        const fieldErrors = validateField(formData[field.id], field.validation);
        
        // Check required fields
        if (field.required && (!formData[field.id] || formData[field.id] === '')) {
          fieldErrors.push(`${field.label} is required`);
        }

        if (fieldErrors.length > 0) {
          newErrors[field.id] = fieldErrors;
          hasErrors = true;
        }
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      alert('Form submitted successfully!\n\n' + JSON.stringify(formData, null, 2));
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const fieldErrors = errors[field.id] || [];
    const hasError = fieldErrors.length > 0;

    const commonProps = {
      fullWidth: true,
      error: hasError,
      helperText: hasError ? fieldErrors[0] : undefined,
      disabled: field.isDerived,
    };

    switch (field.type) {
      case 'text':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            placeholder={field.isDerived ? 'Auto-calculated' : `Enter ${field.label.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            placeholder={field.isDerived ? 'Auto-calculated' : `Enter ${field.label.toLowerCase()}`}
          />
        );

      case 'textarea':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            multiline
            rows={4}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            placeholder={field.isDerived ? 'Auto-calculated' : `Enter ${field.label.toLowerCase()}`}
          />
        );

      case 'select':
        return (
          <FormControl {...commonProps}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              label={field.label}
              required={field.required}
            >
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" error={hasError} fullWidth>
            <FormLabel component="legend" required={field.required}>
              {field.label}
            </FormLabel>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {hasError && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {fieldErrors[0]}
              </Typography>
            )}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(value)}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                color={hasError ? 'error' : 'primary'}
              />
            }
            label={
              <Box>
                {field.label}
                {field.required && <span style={{ color: '#d32f2f' }}> *</span>}
                {hasError && (
                  <Typography variant="caption" color="error" display="block">
                    {fieldErrors[0]}
                  </Typography>
                )}
              </Box>
            }
          />
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={field.label}
              value={value ? dayjs(value) : null}
              onChange={(newValue) => handleFieldChange(field.id, newValue)}
              disabled={field.isDerived}
              slotProps={{
                textField: {
                  ...commonProps,
                  required: field.required,
                },
              }}
            />
          </LocalizationProvider>
        );

      default:
        return null;
    }
  };

  if (currentForm.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333333' }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>
            No Form to Preview
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Create a form in the form builder to see the preview.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/create')}
          >
            Go to Form Builder
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/create')}
            sx={{ mr: 2 }}
          >
            Back to Builder
          </Button>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              color: '#ffffff',
              flexGrow: 1,
            }}
          >
            Form Preview
          </Typography>
        </Box>
        <Typography color="text.secondary">
          This is how your form will appear to end users
        </Typography>
      </Box>

      <Card sx={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', borderRadius: 3, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333333' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            {[...currentForm]
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <Box key={field.id}>
                  {field.isDerived && (
                    <Alert
                      severity="info"
                      sx={{ mb: 2 }}
                      variant="outlined"
                    >
                      This field is auto-calculated based on other form values
                    </Alert>
                  )}
                  {renderField(field)}
                </Box>
              ))}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Send />}
                onClick={handleSubmit}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Submit Form
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Debug Panel (can be removed in production) */}
      <Paper sx={{ mt: 4, p: 2, background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)', border: '1px solid #333333' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
          Debug: Form Data
        </Typography>
        <pre style={{ fontSize: '12px', overflow: 'auto', color: '#b0b0b0' }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </Paper>
    </Container>
  );
};