import { MapContainer, ZoomControl } from 'react-leaflet';
import LocationMarkers from './LocationMarkers';
import MapLayers from './MapLayers';
import DateSliderControl from './DateSliderControl';
import MetricsControl from './MetricsControl';
import { useState, useEffect } from 'react';
import { useLocations } from '../hooks/useLocations';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';
import { useMap } from 'react-leaflet';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

let count = 0;

function Map() {
  const [currentDate, setCurrentDate] = useState(null);
  const [markerLimit, setMarkerLimit] = useState(50);
  const [summary, setSummary] = useState('Loading summary...');
  const { locations, isLoading } = useLocations(currentDate, markerLimit);

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

  const handleSliderRelease = async () => {
    if (!Array.isArray(locations) || locations.length === 0) return;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const titles = locations
        .filter(location => location && location.name)
        .map(location => location.name);
      if (titles.length === 0) {
        setSummary('No event titles available');
        return;
      }
      const titlesString = titles.join(", ");
      console.log("Sending titles to Gemini:", titlesString);
      const prompt = `Summarize these events in a couple short sentences: ${titlesString}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setSummary(text);
      
    } catch (error) {
      console.error('Error getting summary:', error);
      setSummary('Failed to generate summary');
    }
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
        <DateSliderControl 
          onDateChange={handleDateChange} 
          onLimitChange={handleLimitChange}
          onSliderRelease={handleSliderRelease}
        />
        <MetricsControl summary={summary} />
      </MapContainer>
    </div>
  );
}

export default Map; 