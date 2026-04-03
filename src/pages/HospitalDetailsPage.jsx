import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  MapPin,
  Phone,
  Clock,
  Heart,
  Share2,
  DollarSign,
  Stethoscope,
  TestTube,
  ArrowLeft,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Activity,
} from 'lucide-react';
import {
  PrimaryButton,
  SecondaryButton,
  HealthcareCard,
  SectionWrapper,
  BadgeLabel,
} from '../styles/styledComponents';
import { formatCurrency } from '../utils/helpers';
import { mockHospitalDetails } from '../data/mockHospitals';
import { hospitalService } from '../services/api';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const HospitalDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const disease = searchParams.get('disease') || '';

  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diseasePrice, setDiseasePrice] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleCallNow = () => {
    if (hospital?.phone) {
      window.location.href = `tel:${hospital.phone}`;
    } else {
       alert(t('loading'));
    }
  };

  const handleSaveHospital = () => {
    setIsSaved(!isSaved);
    // You can also add notification here
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hospital?.name || 'Smart Hospital',
          text: `Check out ${hospital?.name} in ${hospital?.address?.city || 'this area'}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        setLoading(true);
        const response = await hospitalService.getHospitalDetails(id, disease);
        const dbHospital = response.data?.hospital || response.hospital;

        // Extract disease pricing from response
        const priceData = response.data?.diseasePrice || response.diseasePrice || null;
        setDiseasePrice(priceData);
        const recentReviews = response.data?.recentReviews || response.recentReviews || [];

        const mergedHospital = {
          ...mockHospitalDetails, // Use as base for any missing rich UI data (tests, etc)
          _id: dbHospital._id,
          name: dbHospital.name,
          address: dbHospital.address ? `${dbHospital.address.street}, ${dbHospital.address.city}` : mockHospitalDetails.address,
          phone: dbHospital.phone || mockHospitalDetails.phone,
          email: dbHospital.email || mockHospitalDetails.email,
          website: dbHospital.website || mockHospitalDetails.website,
          rating: dbHospital.rating?.average || dbHospital.rating || 0,
          totalReviews: dbHospital.rating?.totalReviews || 0,
          accreditation: dbHospital.accreditations?.length ? dbHospital.accreditations.map(a => a.name) : mockHospitalDetails.accreditation,
          facilities: dbHospital.facilities?.length > 0 ? dbHospital.facilities : mockHospitalDetails.facilities,
          doctors: dbHospital.staffCount?.doctors || mockHospitalDetails.doctors,
          beds: (dbHospital.bedCount?.general || 0) + (dbHospital.bedCount?.icu || 0) || mockHospitalDetails.beds,
          openingTime: dbHospital.operatingHours?.monday?.open || mockHospitalDetails.openingTime,
          closingTime: dbHospital.operatingHours?.monday?.close || mockHospitalDetails.closingTime,
          reviews: recentReviews.length > 0 ? recentReviews.map(r => ({
            author: r.user?.name || 'Anonymous',
            rating: r.rating,
            text: r.comment,
            date: new Date(r.createdAt).toLocaleDateString()
          })) : mockHospitalDetails.reviews
        };

        setHospital(mergedHospital);
      } catch (err) {
        console.error('Error fetching hospital details:', err);
        const status = err?.response?.status;
        if (status === 404 && id) {
          // If a dynamic (OSM/Google) hospital ID can't be resolved, still render
          // the page using mock data instead of blocking the user.
          setHospital({
            ...mockHospitalDetails,
            _id: id,
            name: 'Medical Center / Clinic',
            isDynamic: id.startsWith('google-') || id.startsWith('osm-'),
          });
          setError(null);
        } else {
          setError('Failed to load hospital details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHospital();
    }
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !hospital) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="error">{error || 'Hospital not found.'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with back button */}
      <Box sx={{ backgroundColor: theme.palette.primary.lighter, py: 2 }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate(-1)}
            sx={{ color: theme.palette.primary.main, mb: 2 }}
          >
            Back
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hospital Header */}
        <HealthcareCard sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                  {hospital.name}
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Rating value={hospital.rating || 0} readOnly precision={0.1} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {hospital.rating || 0} ({hospital.totalReviews || 0} reviews)
                  </Typography>
                </Box>

                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                  {hospital.accreditation.map((cert, idx) => (
                    <BadgeLabel key={idx} color="primary">
                      {cert}
                    </BadgeLabel>
                  ))}
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <MapPin size={18} color={theme.palette.primary.main} />
                  <Typography variant="body2">
                    {hospital.address?.street ? `${hospital.address.street}, ${hospital.address.city}` : hospital.address}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                  <Phone size={18} color={theme.palette.primary.main} />
                  <Typography variant="body2">{hospital.phone}</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Clock size={18} color={theme.palette.primary.main} />
                  <Typography variant="body2">
                    {hospital.openingTime} - {hospital.closingTime}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack gap={2}>
                  <PrimaryButton fullWidth onClick={handleCallNow}>
                    {t('call_now')}
                  </PrimaryButton>
                  <SecondaryButton 
                    fullWidth 
                    onClick={handleSaveHospital}
                  >
                    <Heart 
                      size={18} 
                      style={{ marginRight: '8px' }} 
                      fill={isSaved ? 'white' : 'none'} 
                    />
                    {isSaved ? 'Hospital Saved' : t('save_hospital')}
                  </SecondaryButton>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Share2 size={18} />}
                    onClick={handleShare}
                  >
                    {t('share')}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </HealthcareCard>

        {/* Disease-Specific Pricing Section */}
        {diseasePrice && (
          <Card
            sx={{
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.secondary.lighter} 0%, ${theme.palette.primary.lighter} 100%)`,
              border: `2px solid ${theme.palette.secondary.light}`,
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <IndianRupee size={24} color={theme.palette.secondary.main} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.secondary.dark }}>
                  Price for {diseasePrice.label || diseasePrice.disease}
                </Typography>
                {diseasePrice.source === 'actual' ? (
                  <Chip label="Verified Price" size="small" color="success" sx={{ ml: 1, fontWeight: 600 }} />
                ) : (
                  <Chip label="Estimated" size="small" color="warning" variant="outlined" sx={{ ml: 1, fontWeight: 600 }} />
                )}
              </Box>

              <Grid container spacing={2} mb={2}>
                <Grid item xs={4}>
                  <Box textAlign="center" p={2} bgcolor="rgba(255,255,255,0.7)" borderRadius="12px">
                    <TrendingDown size={20} color={theme.palette.success.main} style={{ marginBottom: '4px' }} />
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Starts From
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.success.main }}>
                      {formatCurrency(diseasePrice.min)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center" p={2} bgcolor="rgba(255,255,255,0.7)" borderRadius="12px">
                    <Activity size={20} color={theme.palette.primary.main} style={{ marginBottom: '4px' }} />
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Average
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                      {formatCurrency(diseasePrice.avg)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center" p={2} bgcolor="rgba(255,255,255,0.7)" borderRadius="12px">
                    <TrendingUp size={20} color={theme.palette.warning.main} style={{ marginBottom: '4px' }} />
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      Up To
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: theme.palette.warning.main }}>
                      {formatCurrency(diseasePrice.max)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Show actual services if available */}
              {diseasePrice.services && diseasePrice.services.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                    Available Services for {diseasePrice.disease}:
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {diseasePrice.services.map((svc, idx) => (
                      <Chip
                        key={idx}
                        label={`${svc.name} — ${formatCurrency(svc.finalPrice)}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: '8px' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {diseasePrice.source === 'estimated' && (
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1.5, fontStyle: 'italic' }}>
                  * Prices are estimated based on industry averages. Actual costs may vary.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'Total Beds', value: hospital.beds, icon: Stethoscope },
            { label: 'Doctors', value: hospital.doctors, icon: Phone },
            { label: 'Established', value: hospital.established, icon: Clock },
            { label: 'Facilities', value: hospital.facilities.length, icon: Heart },
          ].map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <Grid item xs={6} sm={3} key={idx}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <CardContent>
                    <StatIcon size={24} color={theme.palette.primary.main} style={{ marginBottom: '8px' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Facilities */}
        <SectionWrapper sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            Facilities & Services
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {hospital.facilities.map((facility, idx) => (
              <Chip key={idx} label={facility} color="primary" variant="outlined" />
            ))}
          </Box>
        </SectionWrapper>

        {/* Test Costs */}
        <SectionWrapper sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TestTube size={24} color={theme.palette.primary.main} />
            Tests & Diagnostics
          </Typography>

          <TableContainer component={Card}>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.lighter }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Test Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Cost
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hospital.tests.map((test, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{test.name}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      {formatCurrency(test.cost)}
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="outlined" color="primary">
                        Book
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionWrapper>

        {/* Treatment Costs */}
        <SectionWrapper sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Stethoscope size={24} color={theme.palette.primary.main} />
            Treatments & Procedures
          </Typography>

          <TableContainer component={Card}>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.secondary.lighter }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Procedure</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Cost
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hospital.treatments.map((treatment, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{treatment.name}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                      {treatment.cost === 0 ? 'Free' : formatCurrency(treatment.cost)}
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="outlined" color="secondary">
                        Schedule
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionWrapper>

        {/* Reviews */}
        <SectionWrapper>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            Patient Reviews
          </Typography>

          <Stack gap={2}>
            {hospital.reviews.map((review, idx) => (
              <Card key={idx}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {review.author}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {review.date}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {review.text}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </SectionWrapper>
      </Container>
    </Box>
  );
};

export default HospitalDetailsPage;
