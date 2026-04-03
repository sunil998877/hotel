import { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, Button, Stack, useTheme, CircularProgress, Alert, TextField, InputAdornment } from '@mui/material';
import { List, Map as MapIcon, RefreshCcw, Search } from 'lucide-react';
import MapView from '../components/MapView';
import { useGeolocation } from '../hooks';
import { PrimaryButton } from '../styles/styledComponents';
import { hospitalService } from '../services/api';

const MapPage = () => {
  const theme = useTheme();
  const { location, loading: locationLoading, error: locationError, getCurrentLocation } = useGeolocation();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch hospitals from API based on location
  const fetchNearbyHospitals = useCallback(async (lat, lng) => {
    setLoading(true);
    setError(null);
    try {
      const response = await hospitalService.searchNearby(lat, lng, 15);
      if (response.status === 'success') {
        setHospitals(response.data.hospitals || []);
      } else {
        setError(response.message || 'Failed to fetch hospitals');
      }
    } catch (err) {
      setError('Technical error: Could not connect to hospital service.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Search by Text (City/Area)
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await hospitalService.searchByLocation(searchQuery);
      if (response.status === 'success') {
        setHospitals(response.data.hospitals || []);
        if (response.data.hospitals.length === 0) {
          setError(`No hospitals found in "${searchQuery}".`);
        }
      }
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial location request
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Fetch hospitals when location is available
  useEffect(() => {
    if (location && location.latitude && location.longitude && !searchQuery) {
      fetchNearbyHospitals(location.latitude, location.longitude);
    }
  }, [location, fetchNearbyHospitals, searchQuery]);

  const handleRefresh = () => {
    setSearchQuery('');
    if (location) {
      fetchNearbyHospitals(location.latitude, location.longitude);
    } else {
      getCurrentLocation();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.secondary.lighter} 100%)` }}>
      {/* Sticky Header */}
      <Box
        sx={{
          background: 'white',
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Hospital Map
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {loading ? 'Searching...' : `${hospitals.length} hospitals found`}
              </Typography>
            </Box>

            {/* Search Input */}
            <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, mx: { md: 4 }, width: '100%' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search city (e.g. Pune, Delhi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} color="#666" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: '#f8fafc' }
                }}
              />
            </Box>

            <Stack direction="row" gap={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleRefresh}
                disabled={loading || locationLoading}
                startIcon={<RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />}
              >
                Reset
              </Button>
              <Button
                variant={viewMode === 'map' ? 'contained' : 'outlined'}
                startIcon={<MapIcon size={18} />}
                onClick={() => setViewMode('map')}
                sx={{
                  background: viewMode === 'map' ? theme.palette.primary.main : 'transparent',
                  color: viewMode === 'map' ? 'white' : theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  '&:hover': {
                    background: viewMode === 'map' ? theme.palette.primary.dark : `${theme.palette.primary.main}10`,
                  },
                }}
              >
                Map
              </Button>
              <Button
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                startIcon={<List size={18} />}
                onClick={() => setViewMode('list')}
                sx={{
                  background: viewMode === 'list' ? theme.palette.primary.main : 'transparent',
                  color: viewMode === 'list' ? 'white' : theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  '&:hover': {
                    background: viewMode === 'list' ? theme.palette.primary.dark : `${theme.palette.primary.main}10`,
                  },
                }}
              >
                List
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Error & Loading States */}
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        {locationError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {locationError}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Container>

      {/* Map View */}
      {viewMode === 'map' && (
        <Container maxWidth="lg" sx={{ py: 3, position: 'relative' }}>
          {loading && !hospitals.length && (
            <Box sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              zIndex: 100,
              textAlign: 'center',
              bgcolor: 'rgba(255,255,255,0.8)',
              p: 3,
              borderRadius: 2
            }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body1" fontWeight={600}>Finding nearby hospitals...</Typography>
            </Box>
          )}
          
          <MapView 
            hospitals={hospitals} 
            userLocation={
              location
                ? { latitude: location.latitude, longitude: location.longitude }
                : null
            }
          />
        </Container>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {loading && (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          )}
          
          {!loading && hospitals.length === 0 && (
            <Box textAlign="center" py={8} bgcolor="white" borderRadius={2} border="1px dashed #ccc">
              <Typography variant="h6" color="text.secondary">No hospitals found in this area.</Typography>
              <Typography variant="body2" color="text.secondary">Try refreshing or increasing the search radius.</Typography>
            </Box>
          )}

          <Stack gap={2}>
            {hospitals
              .sort((a, b) => (a.distance || 0) - (b.distance || 0))
              .map((hospital) => (
                <Box
                  key={hospital._id}
                  sx={{
                    background: 'white',
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {hospital.name}
                      </Typography>
                      {(hospital.isEmergency || (hospital.facilities && hospital.facilities.includes('Emergency'))) && (
                        <Box
                          sx={{
                            background: '#fecaca',
                            color: '#991b1b',
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          Emergency
                        </Box>
                      )}
                      {hospital.isDynamic && (
                        <Box
                          sx={{
                            background: '#dcfce7',
                            color: '#166534',
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          Live
                        </Box>
                      )}
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {hospital.address?.street ? `${hospital.address.street}, ${hospital.address.city}` : hospital.address || 'Address not available'}
                    </Typography>
                    <Stack direction="row" gap={2}>
                      <Typography variant="caption">
                        ⭐ {hospital.rating?.average || hospital.rating || 'N/A'} ({hospital.rating?.totalReviews || hospital.totalReviews || 0} reviews)
                      </Typography>
                      <Typography variant="caption">
                        📍 {hospital.distance || '?'} km away
                      </Typography>
                      <Typography variant="caption">
                        💰 {hospital.diseasePrice ? `₹${hospital.diseasePrice.avg / 1000}k` : `₹${(hospital.averageCost || 0) / 1000}k`} avg
                      </Typography>
                    </Stack>
                  </Box>
                  <PrimaryButton size="small" sx={{ ml: 2 }} onClick={() => window.location.href = `/hospital/${hospital._id}`}>
                    View
                  </PrimaryButton>
                </Box>
              ))}
          </Stack>
        </Container>
      )}
    </Box>
  );
};

export default MapPage;
