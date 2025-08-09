import React from 'react';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
} from '@mui/material';
import {
  TextFields,
  Numbers,
  Subject,
  ArrowDropDown,
  RadioButtonChecked,
  CheckBox,
  DateRange,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addField } from '../../store/formSlice';
import { FormField } from '../../types/form';

const fieldTypes = [
  { type: 'text', label: 'Text', icon: TextFields, color: '#4fc3f7' },
  { type: 'number', label: 'Number', icon: Numbers, color: '#66bb6a' },
  { type: 'textarea', label: 'Textarea', icon: Subject, color: '#ffa726' },
  { type: 'select', label: 'Select', icon: ArrowDropDown, color: '#ab47bc' },
  { type: 'radio', label: 'Radio', icon: RadioButtonChecked, color: '#ef5350' },
  { type: 'checkbox', label: 'Checkbox', icon: CheckBox, color: '#42a5f5' },
  { type: 'date', label: 'Date', icon: DateRange, color: '#8d6e63' },
] as const;

export const FieldTypeSelector: React.FC = () => {
  const dispatch = useDispatch();

  const handleAddField = (type: FormField['type']) => {
    const newField = {
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      defaultValue: '',
      validation: [],
      options: ['select', 'radio'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
    };
    
    dispatch(addField(newField));
  };

  return (
    <Card sx={{ 
      mb: 3, 
      border: '2px solid #333333', 
      borderRadius: 3, 
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a2e 100%)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(139, 69, 19, 0.1)',
      '&:hover': {
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 6px 20px rgba(139, 69, 19, 0.15)',
      },
      transition: 'all 0.3s ease-in-out',
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ 
          color: '#ffffff', 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #ffffff, #b0b0b0)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          mb: 3,
        }}>
          Add Form Fields
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          {fieldTypes.map(({ type, label, icon: Icon, color }) => (
            <Box key={type}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleAddField(type)}
                sx={{
                  height: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  border: `2px solid #333333`,
                  borderRadius: 2,
                  color: '#ffffff',
                  background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
                  '&:hover': {
                    border: `2px solid ${color}`,
                    background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${color}40`,
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <Icon sx={{ color, fontSize: 28, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                  {label}
                </Typography>
              </Button>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};