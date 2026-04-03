import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
  useTheme,
  Avatar,
  Tooltip,
  Drawer,
  IconButton as MuiIconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,

} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User, LogOut, Search, Home, LayoutDashboard, HelpCircle, Menu as MenuIcon, X, Zap, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: t('home'), path: '/', icon: <Home size={18} /> },
    { name: t('hiw'), path: '/#how-it-works', icon: <HelpCircle size={18} /> },
    { name: t('find_hospitals'), path: '/login', icon: <Search size={18} />, guestOnly: true },
    { name: t('dashboard'), path: '/dashboard', icon: <LayoutDashboard size={18} />, auth: true },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        top: 16,
        left: '50%',
        right: 'auto',
        width: { xs: 'calc(100% - 32px)', md: '90%', lg: '80%' },
        transform: 'translateX(-50%)',
        borderRadius: '15px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        zIndex: 1200,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 2 } }}>
        <Toolbar disableGutters sx={{ height: 60, justifyContent: 'space-between', minHeight: '0 !important' }}>
          {/* Logo Section */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: theme.palette.text.primary,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <Box
              sx={{
                p: 0.5,
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                display: 'flex',
                color: 'white',
                border: 'none',
              }}
            >
              <Stethoscope size={20} />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  color: theme.palette.text.primary,
                  display: { xs: 'none', sm: 'block' },
                  lineHeight: 1.2,
                  fontSize: '1.05rem',
                }}
              >
                Smart<span style={{ color: theme.palette.primary.main }}>Hospital</span>
              </Typography>
            </Box>
          </Box>

          {/* Navigation Links - Center */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
            {navLinks.map((link) => {
              if (link.auth && !user) return null;
              if (link.guestOnly && user) return null;
              return (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    px: 2,
                    py: 0.8,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '100px',
                    fontSize: '0.88rem',
                    color: isActive(link.path) ? theme.palette.primary.main : theme.palette.text.secondary,
                    backgroundColor: isActive(link.path) ? `${theme.palette.primary.main}10` : 'transparent',
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}08`,
                      color: theme.palette.primary.main,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {link.name}
                </Button>
              );
            })}
          </Box>

          {/* Right Section - CTA & User */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Language Toggle */}
            <Button
              onClick={toggleLanguage}
              startIcon={<Globe size={16} />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                color: theme.palette.text.secondary,
                borderRadius: '100px',
                px: 1.5,
                minWidth: 'auto',
                display: { xs: 'none', sm: 'inline-flex' },
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}10`,
                  color: theme.palette.primary.main,
                },
              }}
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </Button>

            {/* Emergency CTA Button */}
            <Button
              variant="contained"
              onClick={() => {
                navigate('/dashboard');
                setMobileOpen(false);
              }}
              startIcon={<Zap size={16} />}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                bgcolor: '#ef4444',
                color: 'white',
                textTransform: 'none',
                fontWeight: 700,
                px: 2.5,
                py: 0.8,
                borderRadius: '12px',
                whiteSpace: 'nowrap',
                fontSize: '0.85rem',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.35)',
                border: 'none',
                '&:hover': {
                  bgcolor: '#dc2626',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(239, 68, 68, 0.45)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {t('emergency')}
            </Button>

            {/* User Avatar / Login */}
            {user ? (
              <>
                <Tooltip title="Account Settings">
                  <MuiIconButton
                    onClick={handleMenu}
                    sx={{
                      p: 0.5,
                      border: `2px solid ${theme.palette.primary.lighter}`,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: theme.palette.primary.main,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'white',
                      }}
                    >
                      {user.firstName?.charAt(0)}
                    </Avatar>
                  </MuiIconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                      p: 1,
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleClose}
                    sx={{ gap: 1.5, py: 1.5, borderRadius: '10px' }}
                  >
                    <User size={18} /> Profile
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{ gap: 1.5, py: 1.5, borderRadius: '10px', color: 'error.main' }}
                  >
                    <LogOut size={18} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2.5,
                  py: 0.7,
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  color: theme.palette.primary.main,
                  border: `1.5px solid ${theme.palette.primary.main}`,
                  display: { xs: 'none', sm: 'inline-flex' },
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    bgcolor: `${theme.palette.primary.main}10`,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Login
              </Button>
            )}

            {/* Mobile Menu Icon */}
            <MuiIconButton
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                display: { md: 'none' },
                ml: 0,
                color: theme.palette.text.primary,
              }}
            >
              <MenuIcon />
            </MuiIconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Sidebar (Drawer) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, borderRadius: '0 20px 20px 0' },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  display: 'flex',
                  color: 'white'
                }}
              >
                <Stethoscope size={20} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Smart<span style={{ color: theme.palette.primary.main }}>Hospital</span>
              </Typography>
            </Box>
            <MuiIconButton onClick={handleDrawerToggle}>
              <X size={24} />
            </MuiIconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              navigate('/dashboard');
              setMobileOpen(false);
            }}
            startIcon={<Zap size={18} />}
            sx={{
              mb: 2,
              bgcolor: '#ef4444',
              color: 'white',
              py: 1.5,
              fontWeight: 800,
              borderRadius: '12px',
              '&:hover': { bgcolor: '#dc2626' }
            }}
          >
            EMERGENCY: FIND NOW
          </Button>

          <List sx={{ px: 0 }}>
            {navLinks.map((link) => {
              if (link.auth && !user) return null;
              if (link.guestOnly && user) return null;
              return (
                <ListItem key={link.path} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component={Link}
                    to={link.path}
                    onClick={handleDrawerToggle}
                    sx={{
                      borderRadius: '10px',
                      backgroundColor: isActive(link.path) ? `${theme.palette.primary.main}10` : 'transparent',
                      color: isActive(link.path) ? theme.palette.primary.main : theme.palette.text.secondary,
                      '&:hover': { backgroundColor: `${theme.palette.primary.main}10` },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive(link.path) ? theme.palette.primary.main : theme.palette.text.secondary,
                        minWidth: 40,
                      }}
                    >
                      {link.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={link.name}
                      primaryTypographyProps={{ fontWeight: isActive(link.path) ? 700 : 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {!user && (
            <Box sx={{ mt: 'auto', pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Button
                component={Link}
                to="/login"
                variant="contained"
                fullWidth
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: '10px',
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  bgcolor: theme.palette.primary.main
                }}
              >
                Login
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
