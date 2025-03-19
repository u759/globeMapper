import { MapContainer, ZoomControl } from 'react-leaflet';
import LocationMarkers from './LocationMarkers';
import MapLayers from './MapLayers';
import DateSliderControl from './DateSliderControl';
import SearchControl from './SearchControl'; // Import the new component
import { useState, useEffect } from 'react';
import { useLocations } from '../hooks/useLocations';
import 'leaflet/dist/leaflet.css';
import '../styles/App.css';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

let count = 0;

function Map() {
  const [currentDate, setCurrentDate] = useState(null);
  const [markerLimit, setMarkerLimit] = useState(50);
  const [searchQuery, setSearchQuery] = useState(''); // Add state for search query
  const { locations, isLoading } = useLocations(currentDate, markerLimit, searchQuery); // Pass search query to hook

  useEffect(() => {
    if (!isLoading && locations.length > 0 && count === 0) {
      handleSliderRelease();
      count++;
    }
  }, [locations, isLoading]);

  const maxBounds = [
    [-90, -180], // Southwest coordinates
    [90, 180]    // Northeast coordinates
  ];

  const handleDateChange = (formattedDate) => {
    setCurrentDate(formattedDate);
  };

  const handleLimitChange = (newLimit) => {
    setMarkerLimit(newLimit);
  };
  
  // Add handler for search changes
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleSliderRelease = async () => {
    if (!Array.isArray(locations) || locations.length === 0) return;
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        scrollWheelZoom={true}
        zoomControl={false}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        minZoom={2.4}
        worldCopyJump={false}
      >
        <MapLayers />
        <ZoomControl position="bottomright" />
        <LocationMarkers locations={locations} />
        <SearchControl 
          locations={locations} 
          onSearchChange={handleSearchChange} 
        />
        <DateSliderControl 
          onDateChange={handleDateChange} 
          onLimitChange={handleLimitChange}
          onSliderRelease={handleSliderRelease}
        />
      </MapContainer>
    </div>
  );
}

export default Map;