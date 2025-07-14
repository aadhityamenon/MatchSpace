import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack, // Replaces VStack and HStack
  Link,
  Divider, // MUI's Divider is equivalent to Chakra's Separator
} from '@mui/material';

// Import specific icons from Material Icons
// You'll need to install @mui/icons-material
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.default', // Uses theme's background.default, define in ThemeProvider
        color: 'primary.main', // Uses theme's primary.main, define in ThemeProvider (e.g., white)
        py: 8, // py={8}
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4 } }}> {/* px={4} with responsive */}
        <Grid container spacing={8}> {/* Grid container with spacing */}
          <Grid item xs={12} md={3}> {/* Full width on small, 1/4 on medium+ */}
            <Stack spacing={2} alignItems="flex-start"> {/* VStack equivalent */}
              <Typography variant="h3" component="h3" sx={{ fontWeight: 'bold' }}>
                TutorMatch
              </Typography>
              <Typography variant="body1" sx={{ color: 'secondary.main' }}>
                Connecting students with the perfect tutors for their educational journey.
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="h4" component="h4" sx={{ fontWeight: 'semibold' }}>
                Quick Links
              </Typography>
              <Stack spacing={1} alignItems="flex-start"> {/* Smaller spacing for links */}
                <Link
                  component={RouterLink}
                  to="/"
                  color="secondary.main" // Use theme color
                  underline="hover" // Default underline on hover
                  sx={{ '&:hover': { color: 'primary.main' } }} // White on hover
                >
                  Home
                </Link>
                <Link
                  component={RouterLink}
                  to="/search"
                  color="secondary.main"
                  underline="hover"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Find Tutors
                </Link>
                <Link
                  component={RouterLink}
                  to="/apply"
                  color="secondary.main"
                  underline="hover"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Become a Tutor
                </Link>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="h4" component="h4" sx={{ fontWeight: 'semibold' }}>
                Resources
              </Typography>
              <Stack spacing={1} alignItems="flex-start">
                <Link
                  component={RouterLink}
                  to="/blog"
                  color="secondary.main"
                  underline="hover"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Blog
                </Link>
                <Link
                  component={RouterLink}
                  to="/faq"
                  color="secondary.main"
                  underline="hover"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  FAQ
                </Link>
                <Link
                  component={RouterLink}
                  to="/support"
                  color="secondary.main"
                  underline="hover"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Support
                </Link>
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="h4" component="h4" sx={{ fontWeight: 'semibold' }}>
                Contact
              </Typography>
            <Stack spacing={1} alignItems="flex-start">
                <Typography variant="body1" sx={{ color: 'secondary.main' }}>
                  Email: info@tutormatch.com
                </Typography>
                <Typography variant="body1" sx={{ color: 'secondary.main' }}>
                  Phone: (555) 123-4567
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}> {/* HStack equivalent, mt={4} converted to sx */}
                  <Link href="#" color="secondary.main" sx={{ '&:hover': { color: 'primary.main' } }} aria-label="Facebook">
                    <FacebookIcon sx={{ fontSize: '1.25rem' }} /> {/* boxSize={5} is approx 20px */}
                  </Link>
                  <Link href="#" color="secondary.main" sx={{ '&:hover': { color: 'primary.main' } }} aria-label="Twitter">
                    <TwitterIcon sx={{ fontSize: '1.25rem' }} />
                  </Link>
                  <Link href="#" color="secondary.main" sx={{ '&:hover': { color: 'primary.main' } }} aria-label="Instagram">
                    <InstagramIcon sx={{ fontSize: '1.25rem' }} />
                  </Link>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: 8, pt: 6 }}>
          <Divider sx={{ borderColor: 'grey.700', mb: 3 }} /> {/* mb={6} approx mb={3} in MUI spacing */}
          <Typography variant="body2" textAlign="center" sx={{ color: 'secondary.main' }}>
            &copy; {new Date().getFullYear()} TutorMatch. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;