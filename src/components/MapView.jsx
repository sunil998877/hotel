import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Chip,
  useTheme,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  X,
  Navigation,
  AlertTriangle,
  MapPin,
  Star,
  DollarSign,
} from 'lucide-react';

// Leaflet Imports
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { PrimaryButton } from '../styles/styledComponents';
import { formatCurrency } from '../utils/helpers';

// Helper component to update map view (center/zoom)
const MapUpdater = ({ center, zoom, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    try {
      if (bounds && bounds.isValid() && bounds.getNorthEast()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } else if (center && Array.isArray(center) && center[0] && center[1]) {
        map.setView(center, zoom || 13);
      }
    } catch (err) {
      console.warn('MapUpdater handled an update error:', err);
    }
  }, [center, zoom, bounds, map]);
  return null;
};

// Custom Marker Icons
const createCustomIcon = (type, theme) => {
  const color = type === 'emergency' ? '#dc2626' : theme.palette.primary.main;
  const iconHtml = `
    <div style="
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
    ">
      ${type === 'emergency' ? 'E' : '🏥'}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-hospital-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const createUserIcon = (theme) => {
  const color = theme.palette.primary.main;
  const iconHtml = `
    <div style="
      width: 22px;
      height: 22px;
      background: ${color};
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 10px rgba(0,0,0,0.4);
    "></div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'user-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

const MapView = ({ hospitals = [], userLocation = null, routingHospital = null, onHospitalSelect = null }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isRouting, setIsRouting] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [localLocation, setLocalLocation] = useState(null);

  const activeLocation = userLocation || localLocation;

  const requestLocationAndRoute = (hospital) => {
    setIsRouting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setLocalLocation(coords);
          fetchRoute(hospital, coords);
        },
        (err) => {
          setIsRouting(false);
          alert("We need your location to show directions. Please enable GPS and allow location access.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setIsRouting(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Sync selectedHospital with routingHospital prop and active routing on mount/re-mount
  useEffect(() => {
    if (routingHospital) {
      setSelectedHospital(routingHospital);
      if (activeLocation && activeLocation.latitude) {
        fetchRoute(routingHospital, activeLocation);
      } else if (!isRouting) {
        requestLocationAndRoute(routingHospital);
      }
    }
  }, [routingHospital, activeLocation?.latitude, activeLocation?.longitude]);

  // Fetch route using OSRM API (Free)
  const fetchRoute = async (hospital, startLoc = activeLocation) => {
    if (!startLoc || !startLoc.latitude || !hospital?.location?.coordinates) {
        console.warn('Cannot fetch route: missing location data');
        setIsRouting(false);
        return;
    }

    const start = [startLoc.longitude, startLoc.latitude];
    const end = hospital.location.coordinates;
    
    setIsRouting(true);
    setRouteInfo(null);
    
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        if (route.geometry && route.geometry.coordinates) {
          const coords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRouteCoordinates(coords);
          setRouteInfo({
            distance: (route.distance / 1000).toFixed(1),
            duration: Math.floor(route.duration / 60)
          });
        }
      } else {
          console.error('OSRM API Error:', data.code);
          alert("Could not find a driving route to this location.");
      }
    } catch (err) {
      console.error('Network error fetching route:', err);
    } finally {
      setIsRouting(false);
    }
  };

  const handleMarkerClick = (hospital) => {
    setSelectedHospital(hospital);
    setRouteCoordinates([]);
    setRouteInfo(null);
    if (onHospitalSelect) onHospitalSelect(hospital);
  };

  const handleDirections = () => {
    if (selectedHospital) {
      if (!activeLocation) {
        requestLocationAndRoute(selectedHospital);
      } else {
        fetchRoute(selectedHospital, activeLocation);
      }
    }
  };

  // Calculate Bounds to fit all hospitals and user
  const mapBounds = useMemo(() => {
    if (routeCoordinates.length > 0) {
      try {
          return L.latLngBounds(routeCoordinates);
      } catch (e) { return null; }
    }
    
    const bounds = L.latLngBounds([]);
    let hasPoints = false;

    if (activeLocation && activeLocation.latitude && activeLocation.longitude) {
      bounds.extend([activeLocation.latitude, activeLocation.longitude]);
      hasPoints = true;
    }
    
    hospitals.forEach(h => {
      if (h.location?.coordinates && h.location.coordinates.length >= 2) {
        bounds.extend([h.location.coordinates[1], h.location.coordinates[0]]);
        hasPoints = true;
      }
    });

    return (hasPoints && bounds.isValid() && bounds.getNorthEast()) ? bounds : null;
  }, [hospitals, activeLocation, routeCoordinates]);

  // Icons
  const emergencyIcon = useMemo(() => createCustomIcon('emergency', theme), [theme]);
  const regularIcon = useMemo(() => createCustomIcon('regular', theme), [theme]);
  const userIcon = useMemo(() => createUserIcon(theme), [theme]);

  const defaultCenter = [30.6864, 76.7028]; 

  return (
    <Box sx={{ position: 'relative', height: '100%', minHeight: '600px', borderRadius: 2, overflow: 'hidden', bgcolor: '#f0f0f0' }}>
      <MapContainer 
        center={activeLocation && activeLocation.latitude ? [activeLocation.latitude, activeLocation.longitude] : defaultCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater bounds={mapBounds} />

        {activeLocation && activeLocation.latitude && (
          <Marker position={[activeLocation.latitude, activeLocation.longitude]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {hospitals.map((hospital) => {
          if (!hospital.location?.coordinates || hospital.location.coordinates.length < 2) return null;
          const position = [hospital.location.coordinates[1], hospital.location.coordinates[0]];
          const isEmergency = hospital.facilities?.includes('Emergency') || hospital.isEmergency;

          return (
            <Marker 
              key={hospital._id} 
              position={position} 
              icon={isEmergency ? emergencyIcon : regularIcon}
              eventHandlers={{
                click: () => handleMarkerClick(hospital)
              }}
            />
          );
        })}

        {routeCoordinates.length > 0 && (
          <Polyline 
            positions={routeCoordinates} 
            color="#2563eb" // Original Blue for clear roadway
            weight={7} 
            opacity={0.8} 
          />
        )}
      </MapContainer>

      {selectedHospital && (
        <Paper
          sx={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: { xs: 20, sm: 'auto' },
            width: { xs: 'auto', sm: 340 },
            p: 2,
            zIndex: 1000,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}
        >
          <IconButton
            size="small"
            onClick={() => {
              setSelectedHospital(null);
            }}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <X size={18} />
          </IconButton>

          <Typography variant="subtitle1" fontWeight={700} sx={{ pr: 4 }}>
            {selectedHospital.name}
          </Typography>
          
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
            {selectedHospital.address?.street}, {selectedHospital.address?.city}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2, pb: 1, borderBottom: '1px solid #eee' }}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Star size={14} fill="#FFB400" color="#FFB400" />
              <Typography variant="caption" fontWeight={600}>{selectedHospital.rating?.average || 0}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <MapPin size={14} color="#2563eb" />
              <Typography variant="caption" fontWeight={600}>{selectedHospital.distance || '?'} km</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <DollarSign size={14} color="#059669" />
              <Typography variant="caption" fontWeight={600}>
                {selectedHospital.diseasePrice 
                  ? `${formatCurrency(selectedHospital.diseasePrice.min)} - ${formatCurrency(selectedHospital.diseasePrice.max)}`
                  : formatCurrency(selectedHospital.averageCost || 0)}
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={1}>
            <PrimaryButton
              fullWidth
              size="small"
              startIcon={isRouting ? <CircularProgress size={16} color="inherit"/> : <Navigation size={16}/>}
              onClick={handleDirections}
              disabled={isRouting}
            >
              {isRouting ? 'Drawing Route...' : 'Get Directions'}
            </PrimaryButton>

            {routeInfo && (
              <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: 1, border: '1px dashed #2563eb' }}>
                <Typography variant="caption" fontWeight={700} color="primary" display="block">IN-APP ROUTE</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {routeInfo.distance} km • {routeInfo.duration} mins
                </Typography>
              </Box>
            )}

            <Stack direction="row" spacing={1}>
              <Button 
                fullWidth 
                variant="outlined" 
                size="small" 
                onClick={() => onHospitalSelect ? onHospitalSelect(selectedHospital) : navigate(`/hospital/${selectedHospital._id}`)}
              >
                View Details
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default MapView;
