import { createTheme } from '@mui/material/styles';

// Healthcare-focused professional theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0066CC', // Medical Blue - Trust, Professionalism
      light: '#4D99FF',
      lighter: '#E6F2FF',
      dark: '#004A99',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00AA66', // Healing Green - Health, Growth
      light: '#4DCCAA',
      lighter: '#E6F9F2',
      dark: '#006B44',
      contrastText: '#ffffff',
    },
    success: {
      main: '#00AA66',
      light: '#4DCCAA',
      dark: '#006B44',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    info: {
      main: '#0066CC',
      light: '#4D99FF',
      dark: '#004A99',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
      light: '#F0F5FA',
    },
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
      disabled: '#A0AEC0',
    },
    divider: '#E2E8F0',
  },

  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    // Mobile-first: base sizes work on mobile
    h1: {
      fontSize: '1.875rem', // 30px on mobile
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.5px',
      '@media (min-width:600px)': {
        fontSize: '2.5rem', // 40px on tablet+
      },
      '@media (min-width:960px)': {
        fontSize: '3rem', // 48px on desktop
      },
    },
    h2: {
      fontSize: '1.5rem', // 24px on mobile
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.3px',
      '@media (min-width:600px)': {
        fontSize: '2rem', // 32px on tablet+
      },
      '@media (min-width:960px)': {
        fontSize: '2.5rem', // 40px on desktop
      },
    },
    h3: {
      fontSize: '1.25rem', // 20px on mobile
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (min-width:600px)': {
        fontSize: '1.75rem', // 28px on tablet+
      },
    },
    h4: {
      fontSize: '1.125rem', // 18px on mobile
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (min-width:600px)': {
        fontSize: '1.5rem', // 24px on tablet+
      },
    },
    h5: {
      fontSize: '1rem', // 16px
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '0.875rem', // 14px
      fontWeight: 600,
      lineHeight: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    body1: {
      fontSize: '0.95rem', // 15.2px - Highly readable
      lineHeight: 1.6,
      letterSpacing: '0.2px',
      '@media (min-width:600px)': {
        fontSize: '1rem', // 16px on tablet+
      },
    },
    body2: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.57,
      letterSpacing: '0.2px',
    },
    button: {
      fontSize: '0.9375rem', // 15px
      fontWeight: 600,
      lineHeight: 1.5,
      textTransform: 'none',
      letterSpacing: '0.3px',
    },
    caption: {
      fontSize: '0.8125rem', // 13px
      lineHeight: 1.5,
      letterSpacing: '0.2px',
    },
    overline: {
      fontSize: '0.75rem', // 12px
      fontWeight: 700,
      lineHeight: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  },

  components: {
    // Button Component
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '12px',
          padding: '12px 28px',
          fontSize: '0.9375rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
          '&:focus': {
            outline: 'none',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0066CC 0%, #004A99 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 102, 204, 0.25)',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0, 102, 204, 0.35)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&:disabled': {
            background: '#CBD5E0',
            color: '#A0AEC0',
            boxShadow: 'none',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #00AA66 0%, #006B44 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 170, 102, 0.25)',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0, 170, 102, 0.35)',
            transform: 'translateY(-2px)',
          },
        },
        outlinedPrimary: {
          borderColor: '#0066CC',
          color: '#0066CC',
          '&:hover': {
            backgroundColor: '#E6F2FF',
            borderColor: '#004A99',
          },
        },
        textPrimary: {
          color: '#0066CC',
          '&:hover': {
            backgroundColor: 'rgba(0, 102, 204, 0.08)',
          },
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.875rem',
        },
        sizeMedium: {
          padding: '12px 24px',
          fontSize: '0.9375rem',
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '1.0625rem',
        },
      },
    },

    // Card Component
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)',
            borderColor: '#0066CC',
          },
        },
      },
    },

    // TextField Component
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#0066CC',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(0, 102, 204, 0.1)',
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E2E8F0',
            borderWidth: '1px',
          },
        },
      },
    },

    // Input Base
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.95rem',
        },
      },
    },

    // AppBar
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #0066CC 0%, #004A99 100%)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
          backdropFilter: 'blur(10px)',
        },
      },
    },

    // Paper (elevated surfaces)
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation0: {
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        elevation4: {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
        },
      },
    },

    // Chip Component
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          fontWeight: 500,
          fontSize: '0.875rem',
          transition: 'all 0.2s ease',
        },
        colorPrimary: {
          backgroundColor: '#E6F2FF',
          color: '#0066CC',
          '&:hover': {
            backgroundColor: '#CCE5FF',
          },
        },
        colorSecondary: {
          backgroundColor: '#E6F9F2',
          color: '#00AA66',
          '&:hover': {
            backgroundColor: '#CCF3E5',
          },
        },
      },
    },

    // Badge Component
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: '#D32F2F',
          color: '#FFFFFF',
          fontWeight: 600,
        },
      },
    },

    // Rating Component
    MuiRating: {
      styleOverrides: {
        root: {
          color: '#00AA66',
        },
      },
    },

    // Dialog
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        },
      },
    },

    // Menu
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          marginTop: '8px',
        },
      },
    },

    // Drawer
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
        },
      },
    },

    // Alert
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: 'none',
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: '#E6F9F2',
          color: '#006B44',
        },
        standardError: {
          backgroundColor: '#FFEBEE',
          color: '#C62828',
        },
        standardWarning: {
          backgroundColor: '#FFF3E0',
          color: '#E65100',
        },
        standardInfo: {
          backgroundColor: '#E6F2FF',
          color: '#004A99',
        },
      },
    },

    // Container
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width:599px)': {
            paddingLeft: '16px',
            paddingRight: '16px',
          },
          '@media (min-width:600px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
        },
      },
    },

    // CircularProgress
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#0066CC',
        },
      },
    },

    // LinearProgress
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          height: '6px',
          backgroundColor: '#E2E8F0',
        },
        bar: {
          borderRadius: '4px',
          background: 'linear-gradient(90deg, #0066CC 0%, #00AA66 100%)',
        },
      },
    },
  },

  shape: {
    borderRadius: 12,
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },

  spacing: 8, // Base unit: 8px
});

export default theme;
