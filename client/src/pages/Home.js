// client/src/pages/Home.js
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Material UI Imports
import {
  Box,
  Typography, // Replaces Heading and Text
  Button,
  Stack,      // Replaces VStack and HStack
  Container,
  Grid,       // Replaces SimpleGrid and Flex for grid layouts
  // Card, CardContent, CardMedia, // Optional: if you want more structured cards
  // Paper, // Optional: for elevation/backgrounds
  Link as MuiLink, // Alias for MUI's Link to avoid conflict with RouterLink
  useTheme, // To access your custom theme colors and spacing
  useMediaQuery, // For responsive hooks if needed beyond sx prop
} from '@mui/material';

// Material UI Icon imports (e.g., from @mui/icons-material if you were to switch)
// import SearchIcon from '@mui/icons-material/Search';
// import StarIcon from '@mui/icons-material/Star';
// import GroupIcon from '@mui/icons-material/Group';
// import BookIcon from '@mui/icons-material/Book';
// import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
// import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
// import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // For Sparkles
// import AdjustIcon from '@mui/icons-material/Adjust'; // For Target
// import FlashOnIcon from '@mui/icons-material/FlashOn'; // For Zap
// import SecurityIcon from '@mui/icons-material/Security'; // For Shield

// Import Lucide Icons directly and wrap them for consistent sizing if desired
import { Search, Star, Users, BookOpen, Trophy, ArrowRight, Sparkles, Target, Zap, Shield } from 'lucide-react';

// Helper to wrap Lucide icons with MUI sx for consistent sizing/color if needed
const LucideIcon = ({ icon: IconComponent, sx, ...props }) => (
  <IconComponent size={24} {...props} style={{ display: 'flex', ...sx }} />
);


const Home = () => {
  const theme = useTheme(); // Access the custom theme

  // Data for sections (keeping your existing data structure)
  const subjectAreas = [
    { name: 'Mathematics', icon: '📊', color: theme.palette.info.main, students: '2.3k+', tutors: '450+' }, // Using MUI theme colors
    { name: 'Science', icon: '🧬', color: theme.palette.success.main, students: '1.8k+', tutors: '320+' },
    { name: 'Languages', icon: '🌍', color: theme.palette.primary.main, students: '3.1k+', tutors: '580+' },
    { name: 'Humanities', icon: '📜', color: theme.palette.warning.main, students: '1.5k+', tutors: '290+' },
    { name: 'Test Prep', icon: '🎯', color: theme.palette.error.main, students: '2.7k+', tutors: '410+' },
    { name: 'Arts', icon: '🎨', color: theme.palette.info.dark, students: '1.2k+', tutors: '180+' }
  ];

  const features = [
    {
      icon: <LucideIcon icon={Target} sx={{ width: 28, height: 28 }} />, // Set size directly
      title: 'AI-Powered Matching',
      desc: 'Advanced algorithm finds your perfect tutor based on learning style, goals, and preferences',
      color: theme.palette.primary.main // Using theme color
    },
    {
      icon: <LucideIcon icon={Zap} sx={{ width: 28, height: 28 }} />,
      title: 'Instant Booking',
      desc: 'Schedule sessions in seconds with real-time availability and flexible timing options',
      color: theme.palette.info.main
    },
    {
      icon: <LucideIcon icon={Shield} sx={{ width: 28, height: 28 }} />,
      title: 'Verified Experts',
      desc: 'All tutors undergo rigorous background checks, certification, and skill assessments',
      color: theme.palette.success.main
    },
    {
      icon: <LucideIcon icon={Star} sx={{ width: 28, height: 28 }} />,
      title: '5-Star Experience',
      desc: 'Consistently rated excellent by 98% of students with personalized learning paths',
      color: theme.palette.warning.main // Changed to warning for yellow in palette
    }
  ];

  const stats = [
    { number: '15K+', label: 'Active Students', icon: <LucideIcon icon={Users} sx={{ width: 24, height: 24 }} /> },
    { number: '3K+', label: 'Expert Tutors', icon: <LucideIcon icon={BookOpen} sx={{ width: 24, height: 24 }} /> },
    { number: '250K+', label: 'Sessions Completed', icon: <LucideIcon icon={Trophy} sx={{ width: 24, height: 24 }} /> },
    { number: '4.9', label: 'Average Rating', icon: <LucideIcon icon={Star} sx={{ width: 24, height: 24 }} /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "High School Student",
      image: "SJ",
      content: "TutorMatch transformed my calculus grades from C's to A's! The personalized approach and instant feedback helped me understand complex concepts that seemed impossible before.",
      rating: 5,
      subject: "Mathematics",
      improvement: "+2 Grade Levels"
    },
    {
      name: "James Wilson",
      role: "Parent of Maria",
      image: "JW",
      content: "Finding a quality Spanish tutor was challenging until we discovered TutorMatch. Maria's confidence and fluency have skyrocketed in just 3 months!",
      rating: 5,
      subject: "Spanish",
      improvement: "98% Session Attendance"
    },
    {
      name: "Dr. Michael Chen",
      role: "Computer Science Tutor",
      image: "MC",
      content: "The platform's matching system is incredible. I'm paired with students who genuinely benefit from my teaching style, making every session rewarding and effective.",
      rating: 5,
      subject: "Computer Science",
      improvement: "500+ Hours Taught"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Search & Filter",
      desc: "Use our smart filters to find tutors by subject, experience level, availability, and teaching style preference.",
      icon: <LucideIcon icon={Search} sx={{ width: 32, height: 32 }} />,
      color: theme.palette.primary.main
    },
    {
      step: "02",
      title: "Connect & Book",
      desc: "Browse detailed profiles, read reviews, and book your first session with instant confirmation and calendar sync.",
      icon: <LucideIcon icon={Users} sx={{ width: 32, height: 32 }} />,
      color: theme.palette.info.main
    },
    {
      step: "03",
      title: "Learn & Grow",
      desc: "Attend personalized sessions, track your progress with detailed analytics, and achieve your learning goals faster.",
      icon: <LucideIcon icon={Trophy} sx={{ width: 32, height: 32 }} />,
      color: theme.palette.success.main
    }
  ];

  // Helper for responsive font sizes (example for hero heading) using MUI breakpoints
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const heroHeadingVariant = isMdUp ? 'h1' : 'h3'; // h1 for md+, h3 for base
  const heroTextVariant = isMdUp ? 'h6' : 'body1'; // h6 for md+, body1 for base

  return (
    <Box>
      {/* Hero Section */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: { xs: 'auto', md: '80vh' },
          py: { xs: 5, md: 10 }, // py={10, 20}
          px: { xs: 2, md: 4 },  // px={4, 8}
          background: `linear-gradient(to bottom right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`, // Equivalent to brand.600, brand.800
          color: 'white',
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Stack
          spacing={3} // VStack spacing={6}
          alignItems={{ xs: 'center', md: 'flex-start' }}
          maxWidth="600px" // maxW="xl" - adjust as needed, 'xl' is 1200px typically, 'md' is 768px in Chakra
          sx={{ mr: { md: 5 } }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)', // whiteAlpha.200
              backdropFilter: 'blur(5px)',
              borderRadius: '9999px', // rounded="full"
              px: 2, py: 1, // px={4}, py={2}
            }}
          >
            <LucideIcon icon={Sparkles} sx={{ width: 20, height: 20, color: theme.palette.warning.light }} /> {/* yellow.300 */}
            <Typography variant="caption" fontWeight="medium" color="blue.100"> {/* fontSize="sm" fontWeight="semibold" */}
              Trusted by 15,000+ students worldwide
            </Typography>
          </Stack>

          <Typography variant={heroHeadingVariant} component="h1" lineHeight="1.2" sx={{
            '& span': {
              background: `linear-gradient(to right, ${theme.palette.warning.light}, ${theme.palette.warning.dark})`, // yellow.300, orange.400
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }
          }}>
            Find Your{' '}
            <span>
              Perfect Tutor
            </span>
          </Typography>

          <Typography variant={heroTextVariant} color="blue.100" maxWidth="600px"> {/* maxW="lg" */}
            Connect with world-class tutors and unlock your full potential with personalized, AI-matched learning experiences.
          </Typography>

          <Stack direction="row" spacing={2} mt={3} flexWrap="wrap" justifyContent={{ xs: 'center', md: 'flex-start' }}> {/* HStack spacing={4} mt={6} */}
            <Button
              component={RouterLink}
              to="/search"
              variant="contained"
              color="warning" // colorScheme="yellow"
              size="large" // size="lg"
              sx={{
                px: 4, // px={8}
                py: 1.5, // rounded="full"
                borderRadius: '9999px',
                boxShadow: theme.shadows[2], // shadow="md"
                '&:hover': {
                  boxShadow: theme.shadows[4], // shadow="lg"
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease-in-out',
                display: 'flex', // Ensures icon and text are aligned
                alignItems: 'center',
              }}
            >
              <LucideIcon icon={Search} sx={{ mr: 1 }} />
              Find a Tutor
            </Button>

            <Button
              component={RouterLink}
              to="/apply"
              variant="outlined"
              color="inherit" // colorScheme="whiteAlpha"
              size="large"
              sx={{
                px: 4, // px={8}
                py: 1.5, // rounded="full"
                borderRadius: '9999px',
                boxShadow: theme.shadows[2], // shadow="md"
                borderColor: 'white', // Explicitly set border color for outlined variant
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)', // bg="whiteAlpha.200"
                  boxShadow: theme.shadows[4], // shadow="lg"
                  transform: 'translateY(-2px)',
                  borderColor: 'white', // Keep border color on hover
                },
                transition: 'all 0.3s ease-in-out',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LucideIcon icon={Users} sx={{ mr: 1 }} />
              Become a Tutor
            </Button>
          </Stack>
        </Stack>

        <Box sx={{
          mt: { xs: 4, md: 0 }, // mt={{ base: 8, md: 0 }}
          ml: { md: 5 },       // ml={{ md: 10 }}
          maxWidth: { xs: '300px', md: '400px' }, // maxW={{ base: "sm", md: "md" }}
          width: '100%', // Ensure it takes full width up to maxWidth
        }}>
          {/* Replace with your actual hero image path */}
          <img
            src="https://via.placeholder.com/400x300/7C3AED/FFFFFF?text=Hero+Image" // Use primary color for placeholder
            alt="Students learning with a tutor"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: theme.shape.borderRadius * 2, // rounded="lg"
              boxShadow: theme.shadows[8], // shadow="xl"
            }}
            // You might need a more robust fallback system if using actual images
            // For now, a simple placeholder or a conditional render can work
          />
        </Box>
      </Stack>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}> {/* maxW="container.xl" py={12} */}
        <Grid container spacing={3}> {/* SimpleGrid columns={{ base: 2, md: 4 }} spacing={8} */}
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}> {/* xs=6 means 2 columns on small screens, md=3 means 4 columns on medium screens */}
              <Stack
                spacing={1}
                alignItems="center"
                textAlign="center"
                sx={{
                  p: 2, // p={4}
                  bgcolor: 'background.paper', // bg="white"
                  borderRadius: theme.shape.borderRadius, // rounded="lg"
                  boxShadow: theme.shadows[1], // shadow="sm"
                }}
              >
                {/* Icons are now directly rendered without Chakra Icon wrapper */}
                <Box sx={{ color: theme.palette.primary.main, mb: 1 }}>{stat.icon}</Box>
                <Typography variant="h5" fontWeight="bold" color="text.primary">{stat.number}</Typography> {/* fontSize={{ base: "2xl", md: "3xl" }} fontWeight="black" color="gray.800" */}
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography> {/* fontSize="sm" color="gray.600" */}
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.default', py: 10 }}> {/* bg="gray.50" py={20} */}
        <Container maxWidth="lg"> {/* maxW="container.lg" */}
          <Stack spacing={2} textAlign="center" mb={6}> {/* VStack spacing={4} textAlign="center" mb={12} */}
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{
                background: `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.info.dark})`, // purple.600, blue.600
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
              }}
            >
              Why Choose TutorMatch?
            </Typography>
            <Typography variant="h4" component="h2"> {/* Heading as="h2" size="xl" */}
              Revolutionary{' '}
              <Typography component="span" variant="inherit" sx={{
                background: `linear-gradient(to right, ${theme.palette.info.dark}, ${theme.palette.primary.dark})`, // blue.600, purple.600
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Learning Platform
              </Typography>
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth="600px" mx="auto"> {/* fontSize="lg" color="gray.600" maxW="3xl" */}
              We've transformed online tutoring with cutting-edge AI technology and a curated network of exceptional educators.
            </Typography>
          </Stack>

          <Grid container spacing={3}> {/* SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} */}
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Stack
                  spacing={2}
                  alignItems="flex-start"
                  sx={{
                    p: 3, // p={6}
                    bgcolor: 'background.paper', // bg="white"
                    borderRadius: theme.shape.borderRadius * 2, // rounded="xl"
                    boxShadow: theme.shadows[2], // shadow="md"
                    border: `1px solid ${theme.palette.divider}`, // borderWidth="1px" borderColor="gray.100"
                    '&:hover': {
                      boxShadow: theme.shadows[4], // shadow="xl"
                      transform: 'translateY(-5px)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <Box
                    sx={{
                      width: 64, // w={16}
                      height: 64, // h={16}
                      background: `linear-gradient(to right, ${feature.color}, ${feature.color}A0)`, // Example gradient, 70% opacity
                      borderRadius: theme.shape.borderRadius * 2, // rounded="xl"
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: theme.shadows[4], // shadow="lg"
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" fontWeight="bold">{feature.title}</Typography> {/* Heading as="h3" size="md" */}
                  <Typography variant="body2" color="text.secondary">{feature.desc}</Typography> {/* Text color="gray.600" */}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: theme.palette.secondary.light, py: 10 }}> {/* bg="brand.50" py={20} */}
        <Container maxWidth="lg">
          <Stack spacing={2} textAlign="center" mb={6}> {/* VStack spacing={4} textAlign="center" mb={12} */}
            <Typography variant="h4" component="h2">{`How It Works`}</Typography> {/* Heading as="h2" size="xl" */}
            <Typography variant="body1" color="text.secondary" maxWidth="400px" mx="auto"> {/* fontSize="lg" color="gray.600" maxW="2xl" */}
              Three simple steps to transform your learning experience
            </Typography>
          </Stack>

          <Grid container spacing={3}> {/* SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} */}
            {howItWorks.map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Stack
                  spacing={2}
                  alignItems="flex-start"
                  sx={{
                    p: 4, // p={8}
                    bgcolor: 'background.paper', // bg="white"
                    borderRadius: theme.shape.borderRadius * 2, // rounded="xl"
                    boxShadow: theme.shadows[2], // shadow="md"
                    border: `1px solid ${theme.palette.divider}`, // borderWidth="1px" borderColor="gray.100"
                    '&:hover': {
                      boxShadow: theme.shadows[4], // shadow="xl"
                      transform: 'translateY(-5px)',
                    },
                    transition: 'all 0.3s ease-in-out',
                    position: 'relative',
                    overflow: 'hidden', // Hide overflow for the absolute step number
                  }}
                >
                  <Box
                    sx={{
                      width: 64, // w={16}
                      height: 64, // h={16}
                      background: `linear-gradient(to right, ${item.color}, ${item.color}A0)`,
                      borderRadius: theme.shape.borderRadius * 2, // rounded="xl"
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: theme.shadows[4], // shadow="lg"
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="h2" // For very large font
                    fontWeight="bold"
                    color="rgba(128,128,128,0.1)" // gray.100 with opacity for background effect
                    sx={{
                      position: 'absolute',
                      top: theme.spacing(1), // top={4}
                      right: theme.spacing(1), // right={4}
                      lineHeight: 1, // Prevent extra line height from pushing text
                      zIndex: 0,
                    }}
                  >
                    {item.step}
                  </Typography>
                  <Typography variant="h5" component="h3" fontWeight="bold" sx={{ mt: 1 }}>{item.title}</Typography> {/* Heading as="h3" size="lg" mt={2} */}
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography> {/* Text color="gray.600" */}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Subject Areas Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 10 }}> {/* bg="white" py={20} */}
        <Container maxWidth="lg">
          <Stack spacing={2} textAlign="center" mb={6}> {/* VStack spacing={4} textAlign="center" mb={12} */}
            <Typography variant="h4" component="h2">{`Explore Subject Areas`}</Typography> {/* Heading as="h2" size="xl" */}
            <Typography variant="body1" color="text.secondary" maxWidth="400px" mx="auto"> {/* fontSize="lg" color="gray.600" maxW="2xl" */}
              Expert tutors across every field of study
            </Typography>
          </Stack>

          <Grid container spacing={3}> {/* SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} */}
            {subjectAreas.map((subject, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <MuiLink
                  component={RouterLink}
                  to={`/search?subject=${subject.name}`}
                  sx={{
                    p: 4, // p={8}
                    bgcolor: 'background.paper',
                    border: `1px solid ${theme.palette.divider}`, // borderWidth="1px" borderColor="gray.200"
                    borderRadius: theme.shape.borderRadius * 2, // rounded="xl"
                    boxShadow: theme.shadows[2], // shadow="md"
                    display: 'flex', // Important for Stack behavior
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textDecoration: 'none', // Remove default link underline
                    color: 'inherit', // Inherit text color
                    '&:hover': {
                      boxShadow: theme.shadows[4], // shadow="xl"
                      transform: 'translateY(-5px)',
                      borderColor: theme.palette.primary.light, // borderColor="brand.300"
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <Box
                    sx={{
                      width: 64, // w={16}
                      height: 64, // h={16}
                      bgcolor: subject.color, // Use plain color for background
                      borderRadius: theme.shape.borderRadius, // rounded="lg"
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem', // fontSize="4xl" for emoji icons
                      mb: 2, // mb={4}
                    }}
                  >
                    {subject.icon}
                  </Box>
                  <Typography variant="h5" component="h3" fontWeight="bold" sx={{ mb: 1 }}>{subject.name}</Typography> {/* Heading as="h3" size="lg" mb={3} */}
                  <Stack spacing={0.5} width="100%" sx={{ mb: 2 }}> {/* VStack spacing={1} align="flex-start" mb={4} */}
                    <Stack direction="row" justifyContent="space-between" width="100%">
                      <Typography variant="body1" color="text.secondary">Active Students:</Typography> {/* Text fontSize="md" color="gray.600" */}
                      <Typography variant="body1" fontWeight="bold" color="text.primary">{subject.students}</Typography> {/* Text fontSize="md" fontWeight="bold" color="gray.800" */}
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" width="100%">
                      <Typography variant="body1" color="text.secondary">Available Tutors:</Typography>
                      <Typography variant="body1" fontWeight="bold" color="text.primary">{subject.tutors}</Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    variant="body1"
                    color="primary.main" // brand.500
                    fontWeight="semibold"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    Explore Tutors <LucideIcon icon={ArrowRight} sx={{ ml: 1, width: 20, height: 20 }} />
                  </Typography>
                </MuiLink>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ bgcolor: theme.palette.secondary.light, py: 10 }}> {/* bg="brand.50" py={20} */}
        <Container maxWidth="lg">
          <Stack spacing={2} textAlign="center" mb={6}> {/* VStack spacing={4} textAlign="center" mb={12} */}
            <Typography variant="h4" component="h2">{`Success Stories`}</Typography> {/* Heading as="h2" size="xl" */}
            <Typography variant="body1" color="text.secondary" maxWidth="400px" mx="auto"> {/* fontSize="lg" color="gray.600" maxW="2xl" */}
              Real results from our thriving learning community
            </Typography>
          </Stack>

          <Grid container spacing={3}> {/* SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} */}
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    p: 4, // p={8}
                    bgcolor: 'background.paper', // bg="white"
                    borderRadius: theme.shape.borderRadius * 2, // rounded="xl"
                    boxShadow: theme.shadows[2], // shadow="md"
                    border: `1px solid ${theme.palette.divider}`, // borderWidth="1px" borderColor="gray.100"
                    '&:hover': {
                      boxShadow: theme.shadows[4], // shadow="xl"
                      transform: 'translateY(-5px)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}> {/* Flex alignItems="center" mb={6} */}
                    <Box
                      sx={{
                        width: 64, // w={16}
                        height: 64, // h={16}
                        bgcolor: theme.palette.primary.main, // brand.500
                        borderRadius: '50%', // rounded="full"
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.25rem', // fontSize="xl"
                        fontWeight: 'bold',
                        mr: 1, // mr={4}
                      }}
                    >
                      {testimonial.image}
                    </Box>
                    <Stack alignItems="flex-start" spacing={0}> {/* VStack align="flex-start" spacing={0} */}
                      <Typography variant="h6" component="h4" fontWeight="bold">{testimonial.name}</Typography> {/* Heading as="h4" size="md" */}
                      <Typography variant="body2" color="text.secondary">{testimonial.role}</Typography> {/* Text fontSize="sm" color="gray.600" */}
                      <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}> {/* HStack mt={1} spacing={2} */}
                        <Typography
                          variant="caption"
                          sx={{
                            bgcolor: theme.palette.info.light, // blue.100
                            color: theme.palette.info.dark, // blue.700
                            px: 1, py: 0.5, // px={2} py={1}
                            borderRadius: '9999px', // rounded="full"
                            fontWeight: 'medium',
                          }}
                        >
                          {testimonial.subject}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            bgcolor: theme.palette.success.light, // green.100
                            color: theme.palette.success.dark, // green.700
                            px: 1, py: 0.5, // px={2} py={1}
                            borderRadius: '9999px', // rounded="full"
                            fontWeight: 'medium',
                          }}
                        >
                          {testimonial.improvement}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}> {/* Render star icons based on rating */}
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <LucideIcon key={i} icon={Star} sx={{width: 20,height: 20,color: theme.palette.warning.dark,fill: theme.palette.warning.dark,}}/>
                    ))}
                  </Stack>


                  <Typography variant="body1" fontStyle="italic" color="text.primary">"{testimonial.content}"</Typography> {/* Text fontStyle="italic" color="gray.700" */}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: '400px',
          py: 10, // py={20}
          px: { xs: 2, md: 4 }, // px={{ base: 4, md: 8 }}
          background: `linear-gradient(to bottom right, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`, // brand.700, brand.900
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Stack spacing={3} maxWidth="700px"> {/* VStack spacing={6} maxW="4xl" */}
          <Typography variant="h4" component="h2" lineHeight="1.2" sx={{
            '& span': {
              background: `linear-gradient(to right, ${theme.palette.warning.light}, ${theme.palette.warning.dark})`, // yellow.300, orange.400
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }
          }}>
            Ready to Transform Your{' '}
            <span>
              Learning Journey?
            </span>
          </Typography>
          <Typography variant="body1" color="blue.100"> {/* fontSize="lg" color="blue.100" */}
            Join thousands of successful learners and start your personalized education experience today.
          </Typography>

          <Stack direction="row" spacing={2} mt={3} flexWrap="wrap" justifyContent="center"> {/* HStack spacing={4} mt={6} wrap="wrap" justifyContent="center" */}
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="warning" // colorScheme="yellow"
              size="large" // size="lg"
              sx={{
                px: 5, // px={10}
                py: 1.5, // py={3}
                borderRadius: '9999px', // rounded="full"
                boxShadow: theme.shadows[2], // shadow="md"
                '&:hover': {
                  boxShadow: theme.shadows[4], // shadow="lg"
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease-in-out',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Get Started Free
              <LucideIcon icon={ArrowRight} sx={{ ml: 1, width: 20, height: 20 }} />
            </Button>

            <Button
              component={RouterLink}
              to="/search"
              variant="outlined"
              color="inherit" // colorScheme="whiteAlpha"
              size="large"
              sx={{
                px: 5, // px={10}
                py: 1.5, // py={3}
                borderRadius: '9999px', // rounded="full"
                boxShadow: theme.shadows[2], // shadow="md"
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.2)', // bg="whiteAlpha.200"
                  boxShadow: theme.shadows[4], // shadow="lg"
                  transform: 'translateY(-2px)',
                  borderColor: 'white',
                },
                transition: 'all 0.3s ease-in-out',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LucideIcon icon={Search} sx={{ mr: 1, width: 20, height: 20 }} />
              Find Tutors Now
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Home;