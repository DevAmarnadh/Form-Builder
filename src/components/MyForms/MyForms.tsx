import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Visibility,
  Edit,
  DateRange,
  ListAlt,
  Add,
  Delete,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { RootState } from '../../store/store';
import { loadForm, clearCurrentForm, deleteForm } from '../../store/formSlice';

export const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const savedForms = useSelector((state: RootState) => state.form.savedForms);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<{ id: string; name: string } | null>(null);

  const handlePreviewForm = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/preview');
  };

  const handleEditForm = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/create');
  };

  const handleCreateNew = () => {
    dispatch(clearCurrentForm());
    navigate('/create');
  };

  const handleDeleteForm = (formId: string, formName: string) => {
    setFormToDelete({ id: formId, name: formName });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (formToDelete) {
      dispatch(deleteForm(formToDelete.id));
      setDeleteDialogOpen(false);
      setFormToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setFormToDelete(null);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
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

  if (savedForms.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
          My Forms
        </Typography>

        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
            border: '2px dashed #333333',
            borderRadius: 3,
            mt: 4,
          }}
        >
          <ListAlt sx={{ fontSize: 64, color: '#666666', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="text.secondary">
            No Forms Created Yet
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Start building your first form to see it listed here
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={handleCreateNew}
            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
          >
            Create Your First Form
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
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
              mb: 1,
            }}
          >
            My Forms
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {savedForms.length} form{savedForms.length !== 1 ? 's' : ''} saved
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateNew}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Create New Form
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {savedForms.map((form) => {
          const fieldTypeCounts = form.fields.reduce((acc, field) => {
            acc[field.type] = (acc[field.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          return (
            <Box key={form.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: '1px solid #333333',
                  transition: 'all 0.2s ease-in-out',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    borderColor: '#8b4513',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <ListAlt sx={{ color: '#8b4513', mr: 1, mt: 0.5 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          color: '#ffffff',
                        }}
                      >
                        {form.name}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => handleDeleteForm(form.id, form.name)}
                      sx={{
                        color: '#d32f2f',
                        '&:hover': { backgroundColor: '#d32f2f10' },
                      }}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#b0b0b0' }}>
                    <DateRange sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      Created {formatDate(form.createdAt)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {Object.entries(fieldTypeCounts).map(([type, count]) => (
                      <Chip
                        key={type}
                        label={`${type} (${count})`}
                        size="small"
                        sx={{
                          backgroundColor: `${getFieldTypeColor(type)}20`,
                          color: getFieldTypeColor(type),
                          fontSize: '0.7rem',
                          height: 22,
                          border: '1px solid #333333',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handlePreviewForm(form.id)}
                    sx={{ mr: 1, borderRadius: 1.5 }}
                  >
                    Preview
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleEditForm(form.id)}
                    variant="outlined"
                    sx={{ borderRadius: 1.5 }}
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Box>
          );
        })}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. The form will be permanently deleted.
          </Alert>
          <Typography>
            Are you sure you want to delete <strong>"{formToDelete?.name}"</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            startIcon={<Delete />}
          >
            Delete Form
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};