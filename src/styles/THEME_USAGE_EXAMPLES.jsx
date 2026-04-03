/**
 * THEME USAGE EXAMPLES
 * 
 * Copy-paste ready examples for using the professional healthcare theme
 */

// ============================================
// BUTTON EXAMPLES
// ============================================

import {
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
  IconButtonWithBg,
} from './styles/styledComponents';
import { Search, MapPin, Heart } from 'lucide-react';

export function ButtonExamples() {
  return (
    <>
      {/* Primary Action - Most prominent CTA */}
      <PrimaryButton onClick={() => console.log('Search')}>
        Search Hospitals
      </PrimaryButton>

      {/* Secondary Action - Alternative action */}
      <SecondaryButton onClick={() => console.log('Book')}>
        Book Appointment
      </SecondaryButton>

      {/* Outline Button - Less prominent alternative */}
      <OutlineButton onClick={() => console.log('Learn')}>
        Learn More
      </OutlineButton>

      {/* Ghost Button - Minimal style */}
      <GhostButton onClick={() => console.log('Cancel')}>
        Cancel
      </GhostButton>

      {/* Icon Button */}
      <IconButtonWithBg>
        <Search size={24} />
      </IconButtonWithBg>
    </>
  );
}

// ============================================
// CARD EXAMPLES
// ============================================

import {
  HealthcareCard,
  FlatCard,
  GradientCard,
  OutlinedCard,
  AlertCard,
  SoftPaper,
} from './styles/styledComponents';
import { CardContent, CardHeader, Typography, Box, Rating } from '@mui/material';
import { MapPin, Star, Stethoscope } from 'lucide-react';

export function CardExamples() {
  return (
    <>
      {/* Healthcare Card - Default professional card */}
      <HealthcareCard>
        <CardHeader title="City Hospital" subheader="Premium Hospital" />
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <MapPin size={18} color="#0066CC" />
            <Typography variant="body2">123 Main Street, City</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Rating value={4.5} readOnly />
            <Typography variant="body2">4.5 (240 reviews)</Typography>
          </Box>
        </CardContent>
      </HealthcareCard>

      {/* Gradient Card - Eye-catching for promotions */}
      <GradientCard>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#0066CC', mb: 1 }}>
            Special Offer
          </Typography>
          <Typography variant="body2">
            Get 20% discount on all tests this month
          </Typography>
        </CardContent>
      </GradientCard>

      {/* Alert Card - Important messages */}
      <AlertCard severity="success">
        <Typography variant="body2">
          Profile updated successfully!
        </Typography>
      </AlertCard>

      <AlertCard severity="warning">
        <Typography variant="body2">
          Please verify your email address
        </Typography>
      </AlertCard>

      {/* Flat Card - Minimal styling */}
      <FlatCard>
        <CardContent>
          <Typography>Minimal content</Typography>
        </CardContent>
      </FlatCard>

      {/* Outlined Card - Secondary content */}
      <OutlinedCard>
        <CardContent>
          <Typography>Important information</Typography>
        </CardContent>
      </OutlinedCard>

      {/* Soft Paper - Simple container */}
      <SoftPaper>
        <Typography variant="h6" mb={2}>
          Section Title
        </Typography>
        <Typography variant="body1">
          Your content here with soft shadow and padding
        </Typography>
      </SoftPaper>
    </>
  );
}

// ============================================
// LAYOUT EXAMPLES
// ============================================

import {
  FlexBox,
  GridContainer,
  SectionWrapper,
  BadgeLabel,
} from './styles/styledComponents';
import { Container } from '@mui/material';

export function LayoutExamples() {
  return (
    <>
      {/* Flex Box - Space between header and button */}
      <FlexBox gap={2}>
        <Typography variant="h5">Hospital List</Typography>
        <PrimaryButton>Add New</PrimaryButton>
      </FlexBox>

      {/* Grid Container - Responsive hospital cards */}
      <GridContainer>
        {/* Cards automatically arrange: 1 col mobile, 2 tablet, 3 desktop, 4 XL */}
        <HealthcareCard>Card 1</HealthcareCard>
        <HealthcareCard>Card 2</HealthcareCard>
        <HealthcareCard>Card 3</HealthcareCard>
      </GridContainer>

      {/* Section Wrapper - Grouped content */}
      <SectionWrapper>
        <Typography variant="h4" mb={2}>
          Featured Hospitals
        </Typography>
        <Typography variant="body1">
          Discover top-rated hospitals in your area
        </Typography>
      </SectionWrapper>

      {/* Badge Label - Status indicators */}
      <Box display="flex" gap={1}>
        <BadgeLabel color="primary">Top Rated</BadgeLabel>
        <BadgeLabel color="secondary">New</BadgeLabel>
        <BadgeLabel color="error">Urgent Care</BadgeLabel>
      </Box>
    </>
  );
}

// ============================================
// FORM EXAMPLES
// ============================================

import { TextField, Box, FormControlLabel, Checkbox } from '@mui/material';

export function FormExamples() {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Text Input */}
      <TextField
        label="Hospital Name"
        variant="outlined"
        placeholder="Enter hospital name"
        fullWidth
      />

      {/* Email Input */}
      <TextField
        type="email"
        label="Email Address"
        variant="outlined"
        placeholder="your@email.com"
        fullWidth
      />

      {/* Password Input */}
      <TextField
        type="password"
        label="Password"
        variant="outlined"
        placeholder="••••••••"
        fullWidth
      />

      {/* Text Area */}
      <TextField
        label="Description"
        multiline
        rows={4}
        variant="outlined"
        placeholder="Enter description"
        fullWidth
      />

      {/* Checkbox */}
      <FormControlLabel
        control={<Checkbox />}
        label="I agree to terms and conditions"
      />
    </Box>
  );
}

// ============================================
// RESPONSIVE PAGE LAYOUT
// ============================================

import { Container, Box, Typography, AppBar, Toolbar } from '@mui/material';
import { Activity } from 'lucide-react';

export function ResponsivePageLayout() {
  return (
    <Box>
      {/* Header */}
      <AppBar position="sticky">
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Activity size={28} />
              <Typography variant="h6">Smart Hospital</Typography>
            </Box>
            <PrimaryButton>Search</PrimaryButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Hero Section */}
        <SectionWrapper sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h1" mb={2}>
            Find Hospitals Near You
          </Typography>
          <Typography variant="h5" sx={{ color: 'text.secondary', mb: 3 }}>
            Compare costs, ratings, and facilities
          </Typography>
          <PrimaryButton size="large">Start Searching</PrimaryButton>
        </SectionWrapper>

        {/* Hospital Grid */}
        <Box mb={4}>
          <Typography variant="h3" mb={3}>
            Featured Hospitals
          </Typography>
          <GridContainer>
            {[1, 2, 3].map((id) => (
              <HealthcareCard key={id}>
                <CardContent>
                  <Typography variant="h6" mb={1}>
                    Hospital {id}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <MapPin size={18} color="#0066CC" />
                    <Typography variant="body2">
                      Location {id}
                    </Typography>
                  </Box>
                  <OutlineButton fullWidth>
                    View Details
                  </OutlineButton>
                </CardContent>
              </HealthcareCard>
            ))}
          </GridContainer>
        </Box>
      </Container>
    </Box>
  );
}

// ============================================
// UTILITY CLASS EXAMPLES
// ============================================

export function UtilityClassExamples() {
  return (
    <>
      {/* Text Utilities */}
      <Typography className="text-center">Centered text</Typography>
      <Typography className="text-truncate">
        This text will truncate with ellipsis if too long
      </Typography>
      <Typography className="text-clamp-2">
        This text will clamp to 2 lines with ellipsis
      </Typography>

      {/* Spacing Utilities */}
      <Box className="p-3 gap-2">
        Content with padding and gap
      </Box>

      {/* Flex Utilities */}
      <Box className="flex flex-center gap-2">
        <Typography>Centered flex container</Typography>
      </Box>

      {/* Color Utilities */}
      <Typography className="text-primary">Primary color text</Typography>
      <Box className="bg-primary p-2">White text on primary background</Box>

      {/* Shadow Utilities */}
      <Box className="shadow-lg p-3 rounded">Elevated shadow</Box>

      {/* Responsive Utilities */}
      <Typography className="hide-on-mobile">
        Shown only on desktop
      </Typography>
      <Typography className="show-on-mobile">
        Shown only on mobile
      </Typography>

      {/* Animation Utilities */}
      <Box className="slide-in-up">
        Animated content
      </Box>
    </>
  );
}

// ============================================
// COMPLETE PAGE EXAMPLE
// ============================================

export function CompleteHospitalSearchPage() {
  return (
    <Box>
      {/* Search Header */}
      <SectionWrapper sx={{ mb: 0 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" mb={3}>
            Find Nearby Hospitals
          </Typography>
          <Box display="flex" gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
            <TextField
              label="Search by location"
              variant="outlined"
              fullWidth
              placeholder="City or area"
            />
            <PrimaryButton>Search</PrimaryButton>
          </Box>
        </Container>
      </SectionWrapper>

      {/* Filters */}
      <Container maxWidth="lg" sx={{ my: 3 }}>
        <Typography variant="h6" mb={2}>
          Filters
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <BadgeLabel color="primary">Nearby</BadgeLabel>
          <BadgeLabel color="secondary">Top Rated</BadgeLabel>
          <BadgeLabel color="error">Emergency</BadgeLabel>
        </Box>
      </Container>

      {/* Results Grid */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Typography variant="h4" mb={3}>
          Hospitals Found
        </Typography>
        <GridContainer>
          {[1, 2, 3, 4].map((id) => (
            <HealthcareCard key={id}>
              <CardHeader
                title={`Hospital ${id}`}
                subheader="Premium Hospital Network"
              />
              <CardContent>
                <Box mb={2}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <MapPin size={18} color="#0066CC" />
                    <Typography variant="body2">
                      {id * 2.5} km away
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating value={4 + id * 0.1} readOnly size="small" />
                    <Typography variant="caption">
                      4.{4 + id} (240 reviews)
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" gap={1}>
                  <PrimaryButton size="small" fullWidth>
                    View
                  </PrimaryButton>
                  <SecondaryButton size="small" fullWidth>
                    Save
                  </SecondaryButton>
                </Box>
              </CardContent>
            </HealthcareCard>
          ))}
        </GridContainer>
      </Container>
    </Box>
  );
}
