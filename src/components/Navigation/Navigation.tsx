import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { Build, Visibility, List } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/create', label: 'Create Form', icon: Build },
    { path: '/preview', label: 'Preview', icon: Visibility },
    { path: '/myforms', label: 'My Forms', icon: List },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        borderBottom: '1px solid #333333',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0 } }}>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: '#ffffff',
              fontWeight: 700,
              background: 'linear-gradient(45deg, #ffffff, #b0b0b0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            FormBuilder
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              
              return (
                <Button
                  key={path}
                  component={Link}
                  to={path}
                  startIcon={<Icon />}
                  variant={isActive ? 'contained' : 'text'}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    color: isActive ? 'white' : '#b0b0b0',
                    backgroundColor: isActive ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'transparent',
                    '&:hover': {
                      backgroundColor: isActive ? 'linear-gradient(135deg, #16213e 0%, #0f0f23 100%)' : 'rgba(139, 69, 19, 0.1)',
                    },
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};