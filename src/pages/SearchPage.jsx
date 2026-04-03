import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Stack,
  Chip,
  Rating,
  useTheme,
} from '@mui/material';
import {
  MapPin,
  Navigation,
  Filter,
  DollarSign,
  Users,
  Clock,
  AlertCircle,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import {
  PrimaryButton,
  SecondaryButton,
  HealthcareCard,
  GridContainer,
  SectionWrapper,
  BadgeLabel,
} from '../styles/styledComponents';
import MapView from '../components/MapView';
import { useGeolocation } from '../hooks';
import { calculateDistance, formatCurrency } from '../utils/helpers';
import { hospitalService } from '../services/api';

const SearchPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { location, error: geoError, loading: geoLoading, getCurrentLocation } = useGeolocation();

  const getInitialState = () => {
    try {
      const saved = sessionStorage.getItem('searchPageState');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved state', e);
    }
    return {};
  };

  const initialState = getInitialState();

  const [searchInput, setSearchInput] = useState(initialState.searchInput || '');
  const [diseaseInput, setDiseaseInput] = useState(initialState.diseaseInput || '');
  const [radius, setRadius] = useState(initialState.radius || 10);
  const [hospitals, setHospitals] = useState(initialState.hospitals || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(initialState.hasSearched || false);
  const [isPendingLocationSearch, setIsPendingLocationSearch] = useState(false);
  const [pendingSearchType, setPendingSearchType] = useState(null); // 'text' or 'nearby'
  const [viewMode, setViewMode] = useState(initialState.viewMode || 'list'); // 'list' or 'map'
  const [routingHospital, setRoutingHospital] = useState(null);
  const [sortBy, setSortBy] = useState(initialState.sortBy || 'distance'); // 'distance', 'rating', 'price'
  
  const [formErrors, setFormErrors] = useState({
    disease: '',
    search: '',
    radius: '',
  });

  // Save state on change
  useEffect(() => {
    sessionStorage.setItem('searchPageState', JSON.stringify({
      searchInput,
      diseaseInput,
      radius,
      hospitals,
      hasSearched,
      viewMode,
      sortBy
    }));
  }, [searchInput, diseaseInput, radius, hospitals, hasSearched, viewMode, sortBy]);

  // Sample hospitals data (replace with API call)
  const mockHospitals = [
    {
      _id: '1',
      name: 'City Medical Center',
      location: { coordinates: [77.2169, 28.6139] },
      address: '123 Main Street, New Delhi',
      rating: 4.8,
      totalReviews: 240,
      facilities: ['Emergency', 'ICU', 'Lab', 'Imaging'],
      averageCost: 15000,
      distance: 2.5,
    },
    {
      _id: '2',
      name: 'Apollo Hospital',
      location: { coordinates: [77.2123, 28.6089] },
      address: '456 Park Avenue, New Delhi',
      rating: 4.6,
      totalReviews: 380,
      facilities: ['Emergency', 'ICU', 'Lab', 'Surgery'],
      averageCost: 25000,
      distance: 3.2,
    },
    {
      _id: '3',
      name: 'Max Healthcare',
      location: { coordinates: [77.2145, 28.6156] },
      address: '789 Hospital Road, New Delhi',
      rating: 4.7,
      totalReviews: 310,
      facilities: ['Emergency', 'ICU', 'Lab', 'Cardiology'],
      averageCost: 20000,
      distance: 4.1,
    },
  ];

  // Effect to handle search once location is available
  useEffect(() => {
    if (isPendingLocationSearch && location) {
      setIsPendingLocationSearch(false);
      if (pendingSearchType === 'text') {
        performTextSearch(location);
      } else {
        performLocationSearch();
      }
    }
  }, [location, isPendingLocationSearch, pendingSearchType]);

  const performLocationSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!location) return;
      
      const response = await hospitalService.searchNearby(
        location.latitude,
        location.longitude,
        radius,
        diseaseInput,
        ''
      );
      
      setHospitals(response.data?.hospitals || []);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to search hospitals. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByLocation = async () => {
    const nextErrors = { disease: '', search: '', radius: '' };
    if (!diseaseInput.trim()) nextErrors.disease = 'Disease is required';
    const radiusNum = Number(radius);
    if (!Number.isFinite(radiusNum) || radiusNum <= 0) nextErrors.radius = 'Radius must be greater than 0';
    setFormErrors(nextErrors);
    if (nextErrors.disease || nextErrors.radius) {
      setError('Please fill the required fields.');
      return;
    }

    if (geoError) {
      setError(geoError);
      return;
    }

    if (location) {
      performLocationSearch();
      return;
    }

    // Request location and set pending
    setLoading(true);
    setError(null);
    setPendingSearchType('nearby');
    setIsPendingLocationSearch(true);
    getCurrentLocation();

    // Fallback if it takes too long
    setTimeout(() => {
      setIsPendingLocationSearch((prev) => {
        if (prev) {
          setError('Wait... GPS is taking a bit longer than expected. Please check browser permissions.');
          setLoading(false);
          return false;
        }
        return prev;
      });
    }, 10000);
  };

  // Search by text
  const handleShowDirectionsOnMap = (hospital) => {
    setRoutingHospital(hospital);
    setViewMode('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTextSearch = async () => {
    const nextErrors = { disease: '', search: '', radius: '' };
    if (!diseaseInput.trim()) nextErrors.disease = 'Disease is required';
    if (!searchInput.trim()) nextErrors.search = 'City is required';
    setFormErrors(nextErrors);
    if (nextErrors.disease || nextErrors.search) {
      setError('Please fill the required fields.');
      return;
    }

    if (location || geoError) {
      performTextSearch(location);
    } else {
      setLoading(true);
      setError(null);
      setPendingSearchType('text');
      setIsPendingLocationSearch(true);
      getCurrentLocation();
      
      // Fallback if it takes too long
      setTimeout(() => {
        setIsPendingLocationSearch((prev) => {
          if (prev) {
            performTextSearch(null); // Proceed without location
            return false;
          }
          return prev;
        });
      }, 5000);
    }
  };

  const performTextSearch = async (currentLocation) => {
    setLoading(true);
    setError(null);

    try {
      const response = await hospitalService.searchByLocation(
        searchInput, 
        diseaseInput, 
        '', 
        currentLocation?.latitude, 
        currentLocation?.longitude
      );
      setHospitals(response.data?.hospitals || []);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to search hospitals. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Search Header */}
      <SectionWrapper sx={{ backgroundColor: theme.palette.primary.lighter, mb: 0 }}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              Find Hospitals
            </Typography>
            <Stack direction="row" spacing={1} sx={{ bgcolor: theme.palette.common.white, p: 0.5, borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Button
                size="small"
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'contained' : 'text'}
                sx={{ borderRadius: '10px', textTransform: 'none', px: 2 }}
              >
                List
              </Button>
              <Button
                size="small"
                onClick={() => setViewMode('map')}
                variant={viewMode === 'map' ? 'contained' : 'text'}
                sx={{ borderRadius: '10px', textTransform: 'none', px: 2 }}
              >
                Map
              </Button>
            </Stack>
          </Box>

          {/* Search Options */}
          <Grid container spacing={2}>
            {/* Common Disease Search */}
            <Grid item xs={12}>
              <Card sx={{ p: 0, border: 'none', mb: 1 }}>
                <CardContent sx={{ pb: '16px !important' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Stethoscope size={20} color={theme.palette.primary.main} />
                    What are you looking for? (Bimari ka naam)
                  </Typography>
                  <TextField
                    label="Disease / Illness / Specialty"
                    placeholder="e.g., Heart, Fever, Haddi, Pregnancy, Cancer"
                    value={diseaseInput}
                    onChange={(e) => {
                      setDiseaseInput(e.target.value);
                      setFormErrors((p) => ({ ...p, disease: '' }));
                    }}
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 2 }}
                    required
                    error={Boolean(formErrors.disease)}
                    helperText={formErrors.disease}
                    InputProps={{
                      startAdornment: <HeartPulse size={20} color={theme.palette.text.secondary} style={{ marginRight: '12px' }} />,
                    }}
                  />
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Typography variant="body2" sx={{ alignSelf: 'center', mr: 1, fontWeight: 600, color: 'text.secondary' }}>
                      Quick Search:
                    </Typography>
                    {['Heart', 'Fever', 'Fracture (Haddi)', 'Pregnancy', 'Dental'].map((d) => (
                      <Chip
                        key={d}
                        label={d}
                        onClick={() => {
                          const val = d.split(' ')[0]; // Take first word for cleaner search
                          setDiseaseInput(val);
                          setFormErrors((p) => ({ ...p, disease: '' }));
                        }}
                        variant={diseaseInput.toLowerCase().includes(d.split(' ')[0].toLowerCase()) ? 'contained' : 'outlined'}
                        color="primary"
                        size="small"
                        sx={{ borderRadius: '8px', cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* GPS Search */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 0, border: 'none', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Navigation size={20} color={theme.palette.primary.main} />
                    Search Nearby
                  </Typography>

                  <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'flex-end' }}>
                    <Box flex={1}>
                      <TextField
                        type="number"
                        label="Radius (km)"
                        value={radius}
                        onChange={(e) => {
                          setRadius(Number(e.target.value));
                          setFormErrors((p) => ({ ...p, radius: '' }));
                        }}
                        fullWidth
                        size="small"
                        inputProps={{ min: 1, max: 50 }}
                        required
                        error={Boolean(formErrors.radius)}
                        helperText={formErrors.radius}
                      />
                    </Box>
                    <PrimaryButton
                      onClick={() => getCurrentLocation()}
                      disabled={geoLoading}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {geoLoading ? 'Getting Location...' : 'Get Location'}
                    </PrimaryButton>
                  </Box>

                  {location && (
                    <Box mt={2} p={1.5} bgcolor={theme.palette.secondary.lighter} borderRadius="8px">
                      <Typography variant="body2" sx={{ color: theme.palette.secondary.dark }}>
                        ✓ Location found: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </Typography>
                    </Box>
                  )}

                  <PrimaryButton
                    fullWidth
                    onClick={handleSearchByLocation}
                    disabled={!location || loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Search Nearby'}
                  </PrimaryButton>
                </CardContent>
              </Card>
            </Grid>

            {/* Text Search */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 0, border: 'none', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MapPin size={20} color={theme.palette.primary.main} />
                    Search by City
                  </Typography>

                  <TextField
                    label="City or Area"
                    placeholder="e.g., New Delhi, Mumbai, Bangalore"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      setFormErrors((p) => ({ ...p, search: '' }));
                    }}
                    fullWidth
                    onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                    required
                    error={Boolean(formErrors.search)}
                    helperText={formErrors.search}
                  />

                  <PrimaryButton
                    fullWidth
                    onClick={handleTextSearch}
                    disabled={loading}
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Search City'}
                  </PrimaryButton>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Error Message */}
          {error && (
            <Box
              mt={2}
              p={2}
              bgcolor="#FFEBEE"
              borderRadius="8px"
              display="flex"
              gap={1}
              alignItems="flex-start"
            >
              <AlertCircle size={20} color="#D32F2F" style={{ marginTop: '2px', flexShrink: 0 }} />
              <Typography variant="body2" sx={{ color: '#C62828' }}>
                {error}
              </Typography>
            </Box>
          )}
        </Container>
      </SectionWrapper>

      {/* Results Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {hasSearched && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {hospitals.length > 0 ? `${hospitals.length} Hospitals Found` : 'No hospitals found'}
              </Typography>
              <BadgeLabel color="primary">{hospitals.length} Results</BadgeLabel>
            </Box>

            {hospitals.length > 0 ? (
              <>
                <Box display="flex" gap={1} flexWrap="wrap" alignItems="center" mb={3} p={2} sx={{ bgcolor: theme.palette.grey[50], borderRadius: '12px' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, mr: 1, display: 'flex', alignItems: 'center' }}>
                    <Filter size={16} style={{ marginRight: 4 }} /> Sort By:
                  </Typography>
                  <Chip
                    label="Distance (Nearest)"
                    clickable
                    color={sortBy === 'distance' ? 'secondary' : 'default'}
                    onClick={() => setSortBy('distance')}
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    label="Rating (Highest)"
                    clickable
                    color={sortBy === 'rating' ? 'secondary' : 'default'}
                    onClick={() => setSortBy('rating')}
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    label="Price (Lowest)"
                    clickable
                    color={sortBy === 'price' ? 'secondary' : 'default'}
                    onClick={() => setSortBy('price')}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {viewMode === 'list' ? (
                  <GridContainer>
                    {hospitals
                      .sort((a, b) => {
                        if (sortBy === 'distance') {
                          return (a.distance || 999) - (b.distance || 999);
                        }
                        if (sortBy === 'rating') {
                          return (b.rating?.average || 0) - (a.rating?.average || 0);
                        }
                        if (sortBy === 'price') {
                          const getPrice = (h) => h.diseasePrice ? h.diseasePrice.min : (h.averageCost || 999999);
                          return getPrice(a) - getPrice(b);
                        }
                        return 0;
                      })
                      .map((hospital) => (
                      <HealthcareCard key={hospital._id} className="slide-in-up">
                        <CardContent>
                          {/* Hospital Header */}
                          <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {hospital.name}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <Rating value={hospital.rating?.average || 0} readOnly size="small" precision={0.1} />
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  ({hospital.rating?.totalReviews || 0})
                                </Typography>
                              </Box>
                            </Box>
                            <Chip
                              label={`${hospital.distance} km`}
                              size="small"
                              icon={<MapPin size={16} />}
                              color="primary"
                              variant="outlined"
                            />
                          </Box>

                          {/* Address */}
                          <Box display="flex" gap={1} mb={2}>
                            <MapPin size={18} color={theme.palette.primary.main} style={{ flexShrink: 0 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {hospital.address?.street}, {hospital.address?.city}
                            </Typography>
                          </Box>

                          {/* Facilities */}
                          <Box mb={2}>
                            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                              Facilities
                            </Typography>
                            <Box display="flex" gap={0.5} flexWrap="wrap">
                              {hospital.facilities.map((facility, idx) => (
                                <Chip key={idx} label={facility} size="small" variant="outlined" />
                              ))}
                            </Box>
                          </Box>

                          {/* Disease-Specific Price */}
                          {hospital.diseasePrice ? (
                            <Box
                              p={1.5}
                              bgcolor={theme.palette.secondary.lighter}
                              borderRadius="8px"
                              mb={2}
                              display="flex"
                              alignItems="center"
                              gap={1}
                            >
                              <DollarSign size={18} color={theme.palette.secondary.main} />
                              <Box flex={1}>
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                  {hospital.diseasePrice.label}
                                </Typography>
                                <Box display="flex" alignItems="baseline" gap={0.5}>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 800, color: theme.palette.secondary.main }}
                                  >
                                    {formatCurrency(hospital.diseasePrice.min)}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    — {formatCurrency(hospital.diseasePrice.max)}
                                  </Typography>
                                </Box>
                              </Box>
                              {hospital.diseasePrice.source === 'actual' && (
                                <Chip label="Verified" size="small" color="success" variant="outlined" sx={{ fontSize: '0.65rem', height: '20px' }} />
                              )}
                              {hospital.diseasePrice.source === 'estimated' && (
                                <Chip label="Est." size="small" color="warning" variant="outlined" sx={{ fontSize: '0.65rem', height: '20px' }} />
                              )}
                            </Box>
                          ) : (
                            hospital.averageCost ? (
                              <Box
                                p={1.5}
                                bgcolor={theme.palette.secondary.lighter}
                                borderRadius="8px"
                                mb={2}
                                display="flex"
                                alignItems="center"
                                gap={1}
                              >
                                <DollarSign size={18} color={theme.palette.secondary.main} />
                                <Box>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    Average Cost
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 700, color: theme.palette.secondary.main }}
                                  >
                                    {formatCurrency(hospital.averageCost)}
                                  </Typography>
                                </Box>
                              </Box>
                            ) : null
                          )}

                          {/* Action Buttons */}
                          <Stack direction="row" spacing={1}>
                            <PrimaryButton
                              fullWidth
                              size="small"
                              onClick={() => navigate(`/hospital/${hospital._id}${diseaseInput ? `?disease=${encodeURIComponent(diseaseInput)}` : ''}`)}
                              sx={{ fontSize: '0.75rem', py: 1 }}
                            >
                              Details
                            </PrimaryButton>
                            <SecondaryButton
                              fullWidth
                              size="small"
                              startIcon={<Navigation size={14} />}
                              onClick={() => handleShowDirectionsOnMap(hospital)}
                              sx={{ fontSize: '0.75rem', py: 1 }}
                            >
                              Directions
                            </SecondaryButton>
                          </Stack>
                        </CardContent>
                      </HealthcareCard>
                    ))}
                  </GridContainer>
                ) : (
                  <Box sx={{ height: '600px', width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <MapView
                      hospitals={hospitals}
                      userLocation={location}
                      routingHospital={routingHospital}
                      onHospitalSelect={(h) => navigate(`/hospital/${h._id}${diseaseInput ? `?disease=${encodeURIComponent(diseaseInput)}` : ''}`)}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box textAlign="center" py={6}>
                <AlertCircle size={48} color={theme.palette.warning.main} style={{ marginBottom: '16px' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  No hospitals found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  Try searching with a different location or larger radius.
                </Typography>
                <Button variant="outlined" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </Box>
            )}
          </>
        )}

        {!hasSearched && (
          <Box textAlign="center" py={10}>
            <MapPin size={64} color={theme.palette.primary.main} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
              Search for hospitals to get started
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Use your location or enter a city name to find nearby hospitals
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SearchPage;
