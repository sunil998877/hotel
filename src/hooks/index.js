import { useEffect, useState } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        let message = '';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = 'Location access is blocked. Please enable it in browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            message = 'GPS signal is weak. Using default location (Delhi).';
            // Fallback to New Delhi coordinates
            setLocation({ latitude: 28.6139, longitude: 77.2169, isFallback: true });
            break;
          case err.TIMEOUT:
            message = 'Location request timed out. Using default location.';
            setLocation({ latitude: 28.6139, longitude: 77.2169, isFallback: true });
            break;
          default:
            message = 'Could not get location. Using default.';
            setLocation({ latitude: 28.6139, longitude: 77.2169, isFallback: true });
        }
        setError(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: false, // Less accurate but more reliable for desktops
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  return { location, error, loading, getCurrentLocation };
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
