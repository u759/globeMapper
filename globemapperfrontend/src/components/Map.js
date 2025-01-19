import { MapContainer, ZoomControl } from 'react-leaflet';
import LocationMarkers from './LocationMarkers';
import MapLayers from './MapLayers';
import DateSliderControl from './DateSliderControl';
import { useState, useEffect } from 'react';
import { useLocations } from '../hooks/useLocations';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';
import { useMap } from 'react-leaflet';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

function MetricsControl() {
  const map = useMap();
  const [visibleMarkers, setVisibleMarkers] = useState(0);
  const [summary, setSummary] = useState('Loading summary...');
  const locations = useLocations();

  useEffect(() => {
    const updateMetrics = () => {
      const bounds = map.getBounds();
      const visible = locations.filter(location => 
        bounds.contains(location.position)
      ).length;
      setVisibleMarkers(visible);
    };

    // Update metrics when map moves or zooms
    map.on('moveend', updateMetrics);
    map.on('zoomend', updateMetrics);
    
    // Initial calculation
    updateMetrics();

    // Cleanup
    return () => {
      map.off('moveend', updateMetrics);
      map.off('zoomend', updateMetrics);
    };
  }, [map, locations]);

  useEffect(() => {
    const generateSummary = async () => {
      // Skip if locations array is empty (still loading)
      if (locations.length === 0) {
        setSummary('Loading summary...');
        return;
      }

      // Check if this is the final locations update
      const titles = locations.map(location => location.name).filter(Boolean);
      if (titles.length === 0) {
        setSummary('No event titles available');
        return;
      }

      // Add a small delay to ensure we have all locations
      const timeoutId = setTimeout(async () => {
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-pro" });
          const titlesString = titles.join(", ");
          console.log("Sending titles to Gemini:", titlesString);
          const prompt = `Summarize these events in a few short sentences: ${titlesString}`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();
          setSummary(text);
        } catch (error) {
          console.error('Error getting summary:', error);
          setSummary('Failed to generate summary');
        }
      }, 1000); // 1 second delay

      // Cleanup timeout if component unmounts or locations changes again
      return () => clearTimeout(timeoutId);
    };

    generateSummary();
  }, [locations]);

  return (
    <div className="leaflet-left leaflet-middle metrics-container">
      <div className="leaflet-control metrics-panel">
        <h3>Map Metrics</h3>
        <div className="metric-item">
          <span>Visible Markers:</span>
          <span>{visibleMarkers}</span>
        </div>
        <div className="metric-item">
          <span>Total Markers:</span>
          <span>{locations.length}</span>
        </div>
        <div className="metric-summary">
          <h4>AI Summary</h4>
          <p>{summary}</p>
        </div>
      </div>
    </div>
  );
}

function Map() {
  const [events, setEvents] = useState([]);

  const maxBounds = [
    [-90, -180], // Southwest coordinates
    [90, 180]    // Northeast coordinates
  ];

  const handleEventsUpdate = (newEvents) => {
    setEvents(newEvents);
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
        minZoom={2}
        worldCopyJump={false}
      >
        <MapLayers />
        <ZoomControl position="bottomright" />
        <LocationMarkers events={events} />
        <DateSliderControl onEventsUpdate={handleEventsUpdate} />
        <MetricsControl />
      </MapContainer>
    </div>
  );
}

export default Map; 