import { styled } from '@mui/material/styles';
import { Card, Button, Paper, Box } from '@mui/material';

// ============================================
// REUSABLE CARD COMPONENTS
// ============================================

/**
 * Enhanced Card with healthcare styling
 * Includes smooth shadows, rounded corners, hover effect
 * Usage: <HealthcareCard>Content here</HealthcareCard>
 */
export const HealthcareCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-4px)',
    borderColor: theme.palette.primary.main,
  },
}));

/**
 * Flat Card - Minimal styling, borderless
 */
export const FlatCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  backgroundColor: theme.palette.background.paper,
  border: 'none',
  boxShadow: 'none',
  borderBottom: `2px solid ${theme.palette.divider}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
}));

/**
 * Gradient Card - Eye-catching card with gradient background
 */
export const GradientCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.secondary.lighter} 100%)`,
  border: 'none',
  boxShadow: '0 4px 12px rgba(0, 102, 204, 0.15)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 20px rgba(0, 102, 204, 0.25)',
    transform: 'translateY(-2px)',
  },
}));

/**
 * Outlined Card - For secondary content
 */
export const OutlinedCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  backgroundColor: 'transparent',
  border: `2px solid ${theme.palette.primary.main}`,
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.lighter,
  },
}));

/**
 * Alert Card - For important messages
 */
export const AlertCard = styled(Card)(({ severity, theme }) => {
  const colors = {
    error: { bg: '#FFEBEE', border: '#EF5350', text: '#C62828' },
    warning: { bg: '#FFF3E0', border: '#FFB74D', text: '#E65100' },
    success: { bg: '#E6F9F2', border: '#4DCCAA', text: '#006B44' },
    info: { bg: '#E6F2FF', border: '#4D99FF', text: '#004A99' },
  };
  const color = colors[severity] || colors.info;

  return {
    borderRadius: '12px',
    backgroundColor: color.bg,
    border: `1px solid ${color.border}`,
    boxShadow: 'none',
    padding: theme.spacing(2),
  };
});

// ============================================
// REUSABLE BUTTON COMPONENTS
// ============================================

/**
 * Primary Action Button
 */
export const PrimaryButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: '#ffffff',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9375rem',
  borderRadius: '12px',
  padding: '12px 28px',
  boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: 'none',
  '&:hover': {
    boxShadow: `0 8px 20px ${theme.palette.primary.main}60`,
    transform: 'translateY(-2px)',
    backgroundColor: theme.palette.primary.dark,
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&:disabled': {
    background: '#CBD5E0',
    color: '#A0AEC0',
    boxShadow: 'none',
  },
}));

/**
 * Secondary Action Button (Healing Green)
 */
export const SecondaryButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  color: '#ffffff',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9375rem',
  borderRadius: '12px',
  padding: '12px 28px',
  boxShadow: `0 4px 12px ${theme.palette.secondary.main}40`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: 'none',
  '&:hover': {
    boxShadow: `0 8px 20px ${theme.palette.secondary.main}60`,
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

/**
 * Outline Button - Secondary style
 */
export const OutlineButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  border: `2px solid ${theme.palette.primary.main}`,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9375rem',
  borderRadius: '12px',
  padding: '10px 24px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.lighter,
    color: theme.palette.primary.dark,
  },
}));

/**
 * Ghost Button - Minimal style for secondary actions
 */
export const GhostButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  border: 'none',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9375rem',
  borderRadius: '12px',
  padding: '10px 16px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.lighter,
  },
}));

/**
 * Icon Button with background
 */
export const IconButtonWithBg = styled(Button)(({ theme }) => ({
  minWidth: 'auto',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  padding: '0',
  backgroundColor: theme.palette.primary.lighter,
  color: theme.palette.primary.main,
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: '#ffffff',
  },
}));

// ============================================
// REUSABLE LAYOUT COMPONENTS
// ============================================

/**
 * Paper with soft shadow and padding
 */
export const SoftPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
  },
}));

/**
 * Flex container for layout
 */
export const FlexBox = styled(Box)(({ gap = 2 }) => ({
  display: 'flex',
  gap: `${gap * 8}px`,
  alignItems: 'center',
}));

/**
 * Grid container for hospital cards
 */
export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: theme.spacing(3),
  '@media (min-width:600px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (min-width:960px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  '@media (min-width:1280px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
}));

/**
 * Section wrapper with background
 */
export const SectionWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.light,
  borderRadius: '16px',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  '@media (max-width:599px)': {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

/**
 * Badge-like label
 */
export const BadgeLabel = styled(Box)(({ theme, color = 'primary' }) => ({
  backgroundColor: theme.palette[color].lighter,
  color: theme.palette[color].main,
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'inline-block',
}));
