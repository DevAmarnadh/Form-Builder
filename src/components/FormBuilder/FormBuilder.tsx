import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Fab,
} from '@mui/material';
import { Save, Visibility, Clear } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { saveForm, clearCurrentForm } from '../../store/formSlice';
import { FieldTypeSelector } from './FieldTypeSelector';
import { FieldConfiguration } from './FieldConfiguration';

export const FormBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentForm = useSelector((state: RootState) => state.form.currentForm);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [formName, setFormName] = useState('');

  const handleSaveForm = () => {
    if (formName.trim() && currentForm.length > 0) {
      dispatch(saveForm(formName.trim()));
      setSaveDialogOpen(false);
      setFormName('');
      // Optionally clear form after saving
      // dispatch(clearCurrentForm());
    }
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  const handleClearForm = () => {
    dispatch(clearCurrentForm());
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #ffffff, #b0b0b0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            mb: 2,
          }}
        >
          Form Builder
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 4 }}
        >
          Create dynamic forms with custom fields, validation rules, and derived logic
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => setSaveDialogOpen(true)}
            disabled={currentForm.length === 0}
            sx={{ borderRadius: 2 }}
          >
            Save Form
          </Button>
          <Button
            variant="outlined"
            startIcon={<Visibility />}
            onClick={handlePreview}
            disabled={currentForm.length === 0}
            sx={{ borderRadius: 2 }}
          >
            Preview
          </Button>
          <Button
            variant="text"
            startIcon={<Clear />}
            onClick={handleClearForm}
            disabled={currentForm.length === 0}
            sx={{ borderRadius: 2, color: '#b0b0b0' }}
          >
            Clear All
          </Button>
        </Box>
      </Box>

      <FieldTypeSelector />

      {currentForm.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '2px dashed #333333',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No fields added yet
          </Typography>
          <Typography color="text.secondary">
            Start building your form by selecting field types above
          </Typography>
        </Paper>
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Form Fields ({currentForm.length})
          </Typography>
          {[...currentForm]
            .sort((a, b) => a.order - b.order)
            .map((field) => (
              <FieldConfiguration key={field.id} field={field} />
            ))}
        </Box>
      )}

      {/* Floating Action Buttons */}
      {currentForm.length > 0 && (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Fab
            color="primary"
            onClick={handlePreview}
            sx={{ boxShadow: 4 }}
          >
            <Visibility />
          </Fab>
          <Fab
            color="secondary"
            onClick={() => setSaveDialogOpen(true)}
            sx={{ boxShadow: 4 }}
          >
            <Save />
          </Fab>
        </Box>
      )}

      {/* Save Form Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          {currentForm.length === 0 ? (
            <Alert severity="warning">
              Add at least one field before saving the form.
            </Alert>
          ) : (
            <Box sx={{ pt: 1 }}>
              <TextField
                autoFocus
                label="Form Name"
                fullWidth
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter a descriptive name for your form"
                variant="outlined"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveForm}
            variant="contained"
            disabled={!formName.trim() || currentForm.length === 0}
          >
            Save Form
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};