import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete,
  DragHandle,
  ExpandMore,
  Add,
  Settings,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, deleteField } from '../../store/formSlice';
import { FormField, ValidationRule } from '../../types/form';
import { RootState } from '../../store/store';

interface FieldConfigurationProps {
  field: FormField;
}

export const FieldConfiguration: React.FC<FieldConfigurationProps> = ({ field }) => {
  const dispatch = useDispatch();
  const currentForm = useSelector((state: RootState) => state.form.currentForm);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [derivedDialogOpen, setDerivedDialogOpen] = useState(false);

  const handleUpdateField = (updates: Partial<FormField>) => {
    dispatch(updateField({ id: field.id, updates }));
  };

  const handleDeleteField = () => {
    dispatch(deleteField(field.id));
  };

  const handleAddValidation = (rule: ValidationRule) => {
    const newValidation = [...(field.validation || []), rule];
    handleUpdateField({ validation: newValidation });
    setValidationDialogOpen(false);
  };

  const handleRemoveValidation = (index: number) => {
    const newValidation = field.validation.filter((_, i) => i !== index);
    handleUpdateField({ validation: newValidation });
  };

  const handleOptionsChange = (options: string[]) => {
    handleUpdateField({ options });
  };

  const getFieldTypeColor = (type: string) => {
    const colors = {
      text: '#1976d2',
      number: '#388e3c',
      textarea: '#f57c00',
      select: '#7b1fa2',
      radio: '#d32f2f',
      checkbox: '#0288d1',
      date: '#5d4037',
    };
    return colors[type as keyof typeof colors] || '#757575';
  };

  return (
    <>
      <Card
        sx={{
          mb: 2,
          border: `2px solid ${getFieldTypeColor(field.type)}20`,
          borderRadius: 2,
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <DragHandle sx={{ color: '#757575', mr: 1, cursor: 'move' }} />
            <Chip
              label={field.type.toUpperCase()}
              size="small"
              sx={{
                backgroundColor: getFieldTypeColor(field.type),
                color: 'white',
                fontWeight: 600,
                mr: 2,
              }}
            />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>
              {field.label}
            </Typography>
            <IconButton
              onClick={handleDeleteField}
              sx={{
                color: '#d32f2f',
                '&:hover': { backgroundColor: '#d32f2f10' },
              }}
            >
              <Delete />
            </IconButton>
          </Box>

          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <TextField
              label="Field Label"
              value={field.label}
              onChange={(e) => handleUpdateField({ label: e.target.value })}
              fullWidth
              variant="outlined"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={field.required}
                  onChange={(e) => handleUpdateField({ required: e.target.checked })}
                  color="primary"
                />
              }
              label="Required Field"
            />

            {!field.isDerived && (
              <TextField
                label="Default Value"
                value={field.defaultValue || ''}
                onChange={(e) => handleUpdateField({ defaultValue: e.target.value })}
                fullWidth
                variant="outlined"
              />
            )}

            {(field.type === 'select' || field.type === 'radio') && (
              <TextField
                label="Options (comma separated)"
                value={field.options?.join(', ') || ''}
                onChange={(e) => handleOptionsChange(e.target.value.split(',').map(opt => opt.trim()))}
                fullWidth
                variant="outlined"
                placeholder="Option 1, Option 2, Option 3"
              />
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Settings />}
              onClick={() => setValidationDialogOpen(true)}
              disabled={field.isDerived}
            >
              Add Validation
            </Button>
            
            <Button
              variant="outlined"
              size="small"
              startIcon={<Add />}
              onClick={() => setDerivedDialogOpen(true)}
              color={field.isDerived ? 'success' : 'primary'}
            >
              {field.isDerived ? 'Edit Derived' : 'Make Derived'}
            </Button>
          </Box>

          {field.validation.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Validation Rules:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {field.validation.map((rule, index) => (
                  <Chip
                    key={index}
                    label={`${rule.type}: ${rule.message}`}
                    onDelete={() => handleRemoveValidation(index)}
                    size="small"
                    color="secondary"
                  />
                ))}
              </Box>
            </Box>
          )}

          {field.isDerived && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="success.main" gutterBottom>
                Derived Field Configuration
              </Typography>
              <Typography variant="body2">
                Parent Fields: {field.parentFields?.join(', ') || 'None'}
              </Typography>
              <Typography variant="body2">
                Logic: {field.derivedLogic || 'None'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <ValidationDialog
        open={validationDialogOpen}
        onClose={() => setValidationDialogOpen(false)}
        onAdd={handleAddValidation}
        fieldType={field.type}
      />

      <DerivedFieldDialog
        open={derivedDialogOpen}
        onClose={() => setDerivedDialogOpen(false)}
        field={field}
        availableFields={currentForm.filter(f => f.id !== field.id)}
        onUpdate={handleUpdateField}
      />
    </>
  );
};

// Validation Dialog Component
interface ValidationDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (rule: ValidationRule) => void;
  fieldType: string;
}

const ValidationDialog: React.FC<ValidationDialogProps> = ({ open, onClose, onAdd, fieldType }) => {
  const [ruleType, setRuleType] = useState<ValidationRule['type']>('notEmpty');
  const [value, setValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const validationTypes = [
    { value: 'notEmpty', label: 'Not Empty', needsValue: false },
    { value: 'minLength', label: 'Minimum Length', needsValue: true },
    { value: 'maxLength', label: 'Maximum Length', needsValue: true },
    { value: 'email', label: 'Email Format', needsValue: false },
    { value: 'password', label: 'Password Rules', needsValue: false },
  ];

  const handleAdd = () => {
    if (!message.trim()) return;

    const rule: ValidationRule = {
      type: ruleType,
      value: validationTypes.find(v => v.value === ruleType)?.needsValue ? parseInt(value) : undefined,
      message: message.trim(),
    };

    onAdd(rule);
    setValue('');
    setMessage('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Validation Rule</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Validation Type</InputLabel>
            <Select
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value as ValidationRule['type'])}
              label="Validation Type"
            >
              {validationTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {validationTypes.find(v => v.value === ruleType)?.needsValue && (
            <TextField
              label="Value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              fullWidth
            />
          )}

          <TextField
            label="Error Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            rows={2}
            placeholder="Enter the error message to display"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained" disabled={!message.trim()}>
          Add Rule
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Derived Field Dialog Component
interface DerivedFieldDialogProps {
  open: boolean;
  onClose: () => void;
  field: FormField;
  availableFields: FormField[];
  onUpdate: (updates: Partial<FormField>) => void;
}

const DerivedFieldDialog: React.FC<DerivedFieldDialogProps> = ({
  open,
  onClose,
  field,
  availableFields,
  onUpdate,
}) => {
  const [parentFields, setParentFields] = useState<string[]>(field.parentFields || []);
  const [derivedLogic, setDerivedLogic] = useState<string>(field.derivedLogic || '');

  const handleSave = () => {
    onUpdate({
      isDerived: true,
      parentFields,
      derivedLogic,
      defaultValue: '', // Clear default value for derived fields
    });
    onClose();
  };

  const handleRemoveDerived = () => {
    onUpdate({
      isDerived: false,
      parentFields: undefined,
      derivedLogic: undefined,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Configure Derived Field</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Parent Fields</InputLabel>
            <Select
              multiple
              value={parentFields}
              onChange={(e) => setParentFields(e.target.value as string[])}
              label="Parent Fields"
            >
              {availableFields.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.label} ({f.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Derived Logic"
            value={derivedLogic}
            onChange={(e) => setDerivedLogic(e.target.value)}
            fullWidth
            multiline
            rows={3}
            placeholder="Enter logic (e.g., 'age', 'sum', 'concat')"
            helperText="Use 'age' for date calculations, 'sum' for numeric addition, 'concat' for text concatenation"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        {field.isDerived && (
          <Button onClick={handleRemoveDerived} color="warning">
            Remove Derived
          </Button>
        )}
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={parentFields.length === 0 || !derivedLogic.trim()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};