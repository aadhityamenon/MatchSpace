import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Assuming this context exists

// Material UI Imports
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider, // MUI's Divider is for horizontal rules (like Chakra's Separator)
  Badge,
  Container,
  Collapse,
  Stack,
  Slide, // For mobile menu animation
  Tooltip,
  useMediaQuery, // Replaces useBreakpointValue for responsive
  useScrollTrigger, // To detect scroll for sticky header
  useTheme, // For theme access, like color modes
  styled, // For custom styled components
} from '@mui/material';
import MuiLink from '@mui/material/Link'; // Alias to avoid conflict with react-router-dom Link
import { Link as RouterLink } from 'react-router-dom';

// Material Icons (equivalent to Lucide React icons)
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import BookIcon from '@mui/icons-material/Book'; // For 'BookOpen'
import GroupIcon from '@mui/icons-material/Group'; // For 'Users'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // For 'Award'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // For 'ChevronDown'

// Custom Styled Components for gradients and animations
// This replaces Chakra's `bgGradient` and direct CSS `animation` properties
const GradientBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  // You might need to add specific box-shadow, borderRadius etc. here if they are always tied to this gradient
}));

const LogoGradientText = styled(Typography)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.info.main})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

// Keyframes for pulse animation (if needed for the small orange dot)
const pulseAnimation = styled('span')`
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme(); // Access the current theme for breakpoints and palette

  // Detect scroll for sticky header effects
  const scrolled = useScrollTrigger({
    disableHysteresis: true, // Prevents trigger from firing on slight reverse scroll
    threshold: 20, // Fire when scrolled more than 20px
  });

  // Responsive breakpoints (MUI uses down/up for media queries)
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // Define colors based on scroll and location
  // MUI's palette should ideally handle these for consistency
  const appBarBg = scrolled || location.pathname !== '/'
    ? 'rgba(255, 255, 255, 0.9)' // Light mode scrolled
    : 'transparent';

  const appBarBgDark = scrolled || location.pathname !== '/'
    ? 'rgba(26, 32, 44, 0.9)' // Dark mode scrolled
    : 'transparent';

  const textColor = scrolled || location.pathname !== '/'
    ? theme.palette.text.primary // General text color
    : '#fff'; // White for transparent background

  const hoverBg = theme.palette.action.hover; // MUI default hover background
  const borderColor = theme.palette.divider; // MUI default border color

  // Handlers
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    setMobileMenuOpen(false); // Close mobile menu on route change
  }, [location]);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
  };

  // NavItem component for desktop navigation
  const NavItem = ({ to, icon: Icon, children, isActive, ...props }) => (
    <Button
      component={RouterLink}
      to={to}
      variant={isActive ? 'contained' : 'text'} // 'contained' for solid, 'text' for ghost
      sx={{
        background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.1)', // whiteAlpha.100
        color: isActive ? 'white' : textColor,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${borderColor}`,
        borderRadius: '16px', // xl
        fontWeight: 'bold', // semibold
        fontSize: '0.875rem', // sm
        px: 2, // px={4} is 16px, MUI's default button padding is often 8px or 16px
        py: 1.25, // py={2.5}
        transition: 'all 0.3s ease',
        '&:hover': {
          background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : hoverBg,
          color: isActive ? 'white' : theme.palette.primary.main, // purple.600
          transform: 'translateY(-1px)',
          boxShadow: 'none', // Remove default contained shadow on hover
        },
        display: 'flex', // Ensure icon and text align
        alignItems: 'center',
      }}
      startIcon={Icon && <Icon sx={{ fontSize: 16 }} />} // Icon size in MUI is usually fontSize
      {...props}
    >
      {children}
    </Button>
  );

  // Mobile Nav Item component
  const MobileNavItem = ({ to, icon: Icon, title, subtitle, isActive }) => (
    <MuiLink
      component={RouterLink}
      to={to}
      sx={{
        display: 'block',
        p: 2, // p={5} is 20px, MUI spacing 8 means p:2 is 16px, p:2.5 is 20px
        background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
        color: isActive ? 'white' : theme.palette.text.primary, // gray.700
        borderRadius: '16px', // 2xl (Chakra's 2xl is 16px)
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        '&:hover': {
          background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : theme.palette.action.hover, // purple.50
          color: isActive ? 'white' : theme.palette.primary.main, // purple.700
          textDecoration: 'none',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> {/* HStack spacing={4} */}
        <Box
          sx={{
            width: 40, // 10 * 4 = 40px
            height: 40,
            background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(128, 90, 213, 0.1)', // whiteAlpha.200 : purple.100
            borderRadius: '12px', // xl
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ fontSize: 20 }} />
        </Box>
        <Box> {/* VStack equivalent */}
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{title}</Typography> {/* md */}
          <Typography variant="body2" sx={{ opacity: 0.75 }}>{subtitle}</Typography> {/* sm */}
        </Box>
      </Box>
    </MuiLink>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={scrolled || location.pathname !== '/' ? 4 : 0} // boxShadow="2xl"
        sx={{
          backgroundColor: scrolled || location.pathname !== '/' ? appBarBg : 'transparent',
          backdropFilter: scrolled || location.pathname !== '/' ? 'blur(20px)' : 'none',
          borderBottom: `1px solid ${scrolled || location.pathname !== '/' ? borderColor : 'transparent'}`,
          transition: 'all 0.5s ease',
          zIndex: theme.zIndex.appBar, // Ensures it's on top
          height: { xs: '72px', lg: '80px' }, // navHeight
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 } }}> {/* px={6} */}
          <Toolbar disableGutters sx={{ minHeight: { xs: '72px', lg: '80px' }, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Enhanced Logo */}
            <MuiLink
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5, // spacing={3}
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <GradientBox
                  sx={{
                    p: 1.5, // p={3}
                    borderRadius: '16px', // 2xl
                    boxShadow: theme.shadows[3], // lg
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: theme.shadows[6], // xl
                    },
                  }}
                >
                  <BookIcon sx={{ fontSize: 28, color: 'white' }} />
                </GradientBox>
                <Box
                  component={pulseAnimation} // Use the styled component for animation
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 12, // w={3}
                    height: 12, // h={3}
                    background: 'linear-gradient(45deg, #FED7AA, #FB923C)',
                    borderRadius: '50%', // full
                    animation: 'pulse 2s infinite',
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', ml: 1.5 }}>
                <LogoGradientText
                  variant="h5" // 2xl
                  component="span"
                  sx={{
                    fontWeight: '900', // black
                  }}
                >
                  TutorMatch
                </LogoGradientText>
                <Typography
                  variant="caption" // xs
                  sx={{
                    fontWeight: 'medium',
                    color: scrolled || location.pathname !== '/' ? 'primary.light' : 'purple.200', // adjust this color in theme
                    mt: '-4px', // mt="-1"
                    transition: 'color 0.3s ease',
                  }}
                >
                  Learn • Teach • Grow
                </Typography>
              </Box>
            </MuiLink>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> {/* HStack spacing={2} */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.1)', // whiteAlpha.100
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px', // 2xl
                    p: 0.5, // p={1}
                    border: `1px solid ${borderColor}`,
                    gap: 0,
                  }}
                >
                  <NavItem
                    to="/search"
                    icon={SearchIcon}
                    isActive={isActiveLink('/search')}
                  >
                    Find Tutors
                  </NavItem>
                  <NavItem
                    to="/apply"
                    icon={GroupIcon}
                    isActive={isActiveLink('/apply')}
                  >
                    Become Tutor
                  </NavItem>
                </Box>

                {currentUser ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, ml: 3 }}> {/* HStack spacing={3}, ml={4} */}
                    {/* Dashboard Link */}
                    <NavItem
                      to={currentUser.role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard'}
                      icon={BookIcon}
                      isActive={isActiveLink('/tutor-dashboard') || isActiveLink('/student-dashboard')}
                    >
                      Dashboard
                    </NavItem>

                    {/* Notifications */}
                    <Tooltip title="You have 3 new notifications" placement="bottom">
                      <IconButton
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)', // whiteAlpha.100
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${borderColor}`,
                          borderRadius: '16px', // xl
                          color: textColor,
                          '&:hover': {
                            background: hoverBg,
                            color: theme.palette.primary.main, // purple.600
                            transform: 'translateY(-1px)',
                          },
                          position: 'relative',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <NotificationsIcon sx={{ fontSize: 20 }} />
                        <Badge
                          color="error" // MUI has default colors like 'error' for red
                          overlap="circular"
                          badgeContent="3"
                          sx={{
                            '& .MuiBadge-badge': {
                              background: 'linear-gradient(45deg, #EF4444, #EC4899)', // Custom gradient for badge
                              color: 'white',
                              fontSize: '0.75rem', // xs
                              minWidth: '16px', // minW={4}
                              height: '16px', // h={4}
                              borderRadius: '50%', // full
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              top: -4,
                              right: -4,
                              // No direct MUI prop for animation; might need styled-components or global CSS
                              animation: 'pulse 1s infinite', // Re-apply if you define @keyframes pulse globally
                            },
                          }}
                        />
                      </IconButton>
                    </Tooltip>

                    {/* Profile Dropdown */}
                    <Menu
                      sx={{ '& .MuiPaper-root': { borderRadius: '24px' } }} // Customize MenuList border radius
                    >
                      <Button
                        aria-controls="profile-menu"
                        aria-haspopup="true"
                        onClick={(event) => setAnchorEl(event.currentTarget)}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${borderColor}`,
                          borderRadius: '16px',
                          color: textColor,
                          '&:hover': {
                            background: hoverBg,
                            color: theme.palette.primary.main,
                          },
                          '&:active': {
                            background: hoverBg,
                          },
                          px: 2,
                          py: 1.25,
                          transition: 'all 0.3s ease',
                        }}
                        endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}> {/* HStack spacing={3} */}
                          <Box sx={{ position: 'relative' }}>
                            <Avatar
                              sx={{
                                width: 32, // sm
                                height: 32,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontWeight: 'bold',
                              }}
                              alt={currentUser.name || 'User'}
                              src={currentUser.avatarUrl || ''} // Add src if you have avatar image URLs
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: -2,
                                right: -2,
                                width: 12,
                                height: 12,
                                bgcolor: 'success.main', // green.400
                                borderRadius: '50%',
                                border: '2px solid white',
                              }}
                            />
                          </Box>
                          <Box sx={{ display: { xs: 'none', xl: 'flex' }, flexDirection: 'column', alignItems: 'flex-start' }}> {/* VStack */}
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}> {/* semibold */}
                              {currentUser.name?.split(' ')[0] || 'User'}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.75, textTransform: 'capitalize' }}>
                              {currentUser.role}
                            </Typography>
                          </Box>
                        </Box>
                      </Button>
                      <Menu
                        id="profile-menu"
                        anchorEl={anchorEl} // State for anchorEl needed for MUI Menu
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        MenuListProps={{
                          sx: {
                            bgcolor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px', // 3xl
                            boxShadow: theme.shadows[8], // 2xl
                            border: `1px solid ${borderColor}`,
                            py: 1.5, // py={3}
                            minWidth: '288px',
                          },
                        }}
                      >
                        {/* Profile Header */}
                        <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${borderColor}` }}> {/* px={6}, py={4} */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> {/* HStack spacing={4} */}
                            <Avatar
                              sx={{
                                width: 48, // md
                                height: 48,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontWeight: 'bold',
                              }}
                              alt={currentUser.name || 'User'}
                              src={currentUser.avatarUrl || ''}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}> {/* gray.900 */}
                                {currentUser.name || 'User'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}> {/* gray.600 */}
                                {currentUser.email}
                              </Typography>
                              <Badge
                                sx={{
                                  mt: 0.5, // mt={1}
                                  bgcolor: currentUser.role === 'tutor' ? 'secondary.light' : 'success.light', // purple.100 : green.100
                                  color: currentUser.role === 'tutor' ? 'secondary.dark' : 'success.dark', // purple.700 : green.700
                                  fontSize: '0.75rem', // xs
                                  fontWeight: 'bold', // semibold
                                  px: 1, // px={2}
                                  py: 0.5, // py={1}
                                  borderRadius: '16px', // full
                                }}
                              >
                                {currentUser.role === 'tutor' ? '👨‍🏫 Tutor' : '👨‍🎓 Student'}
                              </Badge>
                            </Box>
                          </Box>
                        </Box>

                        {/* Menu Items */}
                        <Box sx={{ py: 1 }}> {/* py={2} */}
                          <MenuItem
                            component={RouterLink}
                            to="/profile"
                            onClick={() => setAnchorEl(null)} // Close menu on click
                            sx={{
                              px: 3, // px={6}
                              py: 1.5, // py={3}
                              '&:hover': { bgcolor: 'action.hover', color: theme.palette.primary.main }, // purple.50, purple.700
                              transition: 'all 0.2s ease',
                              gap: 2, // HStack spacing={4}
                            }}
                          >
                            <Box
                              sx={{
                                width: 32, // w={8}
                                height: 32,
                                bgcolor: 'secondary.light', // purple.100
                                borderRadius: '12px', // xl
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <PersonIcon sx={{ fontSize: 16, color: 'secondary.main' }} /> {/* #7C3AED */}
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>My Profile</Typography>
                          </MenuItem>
                          <MenuItem
                            component={RouterLink}
                            to="/settings"
                            onClick={() => setAnchorEl(null)}
                            sx={{
                              px: 3,
                              py: 1.5,
                              '&:hover': { bgcolor: 'action.hover', color: theme.palette.primary.main },
                              transition: 'all 0.2s ease',
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'secondary.light',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <SettingsIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Settings</Typography>
                          </MenuItem>
                          {currentUser.role === 'tutor' && (
                            <MenuItem
                              component={RouterLink}
                              to="/earnings"
                              onClick={() => setAnchorEl(null)}
                              sx={{
                                px: 3,
                                py: 1.5,
                                '&:hover': { bgcolor: 'warning.light', color: 'warning.dark' }, // orange.50, orange.700
                                transition: 'all 0.2s ease',
                                gap: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: 'warning.light', // orange.100
                                  borderRadius: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <EmojiEventsIcon sx={{ fontSize: 16, color: 'warning.dark' }} /> {/* #EA580C */}
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Earnings</Typography>
                            </MenuItem>
                          )}
                        </Box>

                        <Divider sx={{ my: 1 }} /> {/* MenuDivider */}

                        <MenuItem
                          onClick={() => { handleLogout(); setAnchorEl(null); }}
                          sx={{
                            px: 3,
                            py: 1.5,
                            color: 'error.main', // red.600
                            '&:hover': { bgcolor: 'error.light' }, // red.50
                            transition: 'all 0.2s ease',
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: 'error.light', // red.100
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <LogoutIcon sx={{ fontSize: 16, color: 'error.main' }} /> {/* #DC2626 */}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Sign Out</Typography>
                        </MenuItem>
                      </Menu>
                    </Menu>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, ml: 3 }}> {/* HStack spacing={3}, ml={4} */}
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant={isActiveLink('/login') ? 'contained' : 'text'}
                      sx={{
                        background: isActiveLink('/login') ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255, 255, 255, 0.1)',
                        color: isActiveLink('/login') ? 'white' : textColor,
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${borderColor}`,
                        borderRadius: '16px',
                        fontWeight: 'bold', // semibold
                        fontSize: '0.875rem', // sm
                        px: 3, // px={5}
                        py: 1.25, // py={2.5}
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: isActiveLink('/login') ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : hoverBg,
                          color: isActiveLink('/login') ? 'white' : theme.palette.primary.main, // purple.600
                        },
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          transform: 'translateY(-2px) scale(1.05)',
                        },
                        borderRadius: '16px',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        px: 3, // px={6}
                        py: 1.25, // py={2.5}
                        boxShadow: theme.shadows[3], // xl
                        '&:active': {
                          transform: 'translateY(-1px) scale(1.02)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Get Started Free
                    </Button>
                  </Box>
                )}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '16px',
                  color: textColor,
                  '&:hover': {
                    background: hoverBg,
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <CloseIcon sx={{ fontSize: 24 }} /> : <MenuIcon sx={{ fontSize: 24 }} />}
              </IconButton>
            )}
          </Toolbar>
        </Container>

        {/* Mobile Menu */}
        <Slide direction="down" in={isMobileMenuOpen} mountOnEnter unmountOnExit>
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderTop: `1px solid ${borderColor}`,
              position: 'absolute', // Position absolute within AppBar
              width: '100%',
              top: { xs: '72px', lg: '80px' }, // Position right below the toolbar
              left: 0,
              zIndex: theme.zIndex.appBar - 1, // Slightly lower than AppBar
              boxShadow: theme.shadows[4],
            }}
          >
            <Container maxWidth="xl" sx={{ px: { xs: 2, md: 3 }, py: 3 }}> {/* px={6}, py={6} */}
              <Stack spacing={1.5} sx={{ alignItems: 'stretch' }}> {/* VStack spacing={3} */}
                <MobileNavItem
                  to="/search"
                  icon={SearchIcon}
                  title="Find Tutors"
                  subtitle="Discover expert tutors"
                  isActive={isActiveLink('/search')}
                />
                <MobileNavItem
                  to="/apply"
                  icon={GroupIcon}
                  title="Become a Tutor"
                  subtitle="Start teaching today"
                  isActive={isActiveLink('/apply')}
                />

                {currentUser ? (
                  <>
                    <MobileNavItem
                      to={currentUser.role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard'}
                      icon={BookIcon}
                      title="Dashboard"
                      subtitle="Your control center"
                      isActive={isActiveLink('/tutor-dashboard') || isActiveLink('/student-dashboard')}
                    />

                    <Divider sx={{ my: 1 }} /> {/* Separator */}

                    {/* User Profile Section */}
                    <Box sx={{ p: 2, bgcolor: 'secondary.light', borderRadius: '16px' }}> {/* p={5}, purple.50, 2xl */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}> {/* HStack spacing={4} */}
                        <Avatar
                          sx={{
                            width: 48, // lg
                            height: 48,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                          alt={currentUser.name || 'User'}
                          src={currentUser.avatarUrl || ''}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            {currentUser.name || 'User'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                            {currentUser.role}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Stack spacing={1} sx={{ alignItems: 'stretch' }}> {/* VStack spacing={2} */}
                      <Button
                        component={RouterLink}
                        to="/profile"
                        variant="text"
                        startIcon={<PersonIcon sx={{ fontSize: 20 }} />}
                        sx={{
                          justifyContent: 'flex-start',
                          color: 'text.primary',
                          '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
                          borderRadius: '12px', // xl
                          py: 1.5, // py={3}
                          px: 2, // px={5}
                          fontWeight: 'medium',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Profile
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/settings"
                        variant="text"
                        startIcon={<SettingsIcon sx={{ fontSize: 20 }} />}
                        sx={{
                          justifyContent: 'flex-start',
                          color: 'text.primary',
                          '&:hover': { bgcolor: 'action.hover', color: 'primary.main' },
                          borderRadius: '12px',
                          py: 1.5,
                          px: 2,
                          fontWeight: 'medium',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Settings
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="text"
                        startIcon={<LogoutIcon sx={{ fontSize: 20 }} />}
                        sx={{
                          justifyContent: 'flex-start',
                          color: 'error.main',
                          '&:hover': { bgcolor: 'error.light' },
                          borderRadius: '12px',
                          py: 1.5,
                          px: 2,
                          fontWeight: 'medium',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Sign Out
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <Stack spacing={1.5} sx={{ alignItems: 'stretch' }}> {/* VStack spacing={3} */}
                    <Divider sx={{ my: 1 }} /> {/* Separator */}
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant={isActiveLink('/login') ? 'contained' : 'outlined'}
                      sx={{
                        background: isActiveLink('/login') ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'secondary.light', // purple.50
                        color: isActiveLink('/login') ? 'white' : 'primary.main', // purple.700
                        '&:hover': {
                          background: isActiveLink('/login') ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'secondary.main', // purple.100
                        },
                        borderRadius: '16px', // 2xl
                        fontWeight: 'bold',
                        py: 2, // py={4}
                        px: 2.5, // px={5}
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          transform: 'translateY(-2px)',
                        },
                        borderRadius: '16px', // 2xl
                        fontWeight: 'bold',
                        py: 2, // py={4}
                        px: 2.5, // px={5}
                        boxShadow: theme.shadows[3], // xl
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Get Started Free
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Container>
          </Box>
        </Slide>
      </AppBar>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <Toolbar sx={{ height: { xs: '72px', lg: '80px' } }} /> {/* This creates a div with height of toolbar */}
    </>
  );
};

export default Navbar;