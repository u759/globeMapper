import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import LocationMarkers from './LocationMarkers';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';
import { useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { useLocations } from '../hooks/useLocations';

function MetricsControl() {
  const map = useMap();
  const [visibleMarkers, setVisibleMarkers] = useState(0);
  const locations = useLocations();  // Add this import at the top

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
      </div>
    </div>
  );
}

function DateSliderControl() {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (52 * 7));
  
  const totalWeeks = 52;
  
  const [currentEndDate, setCurrentEndDate] = useState(endDate);

  const handleSliderChange = (e) => {
    e.stopPropagation();
    const weeks = parseInt(e.target.value);
    const newEndDate = new Date(endDate.getTime() - ((totalWeeks - weeks) * 7 * 24 * 60 * 60 * 1000));
    setCurrentEndDate(newEndDate);
  };

  const preventMapMovement = (e) => {
    e.stopPropagation();
  };

  const getStartOfWeek = (date) => {
    const result = new Date(date);
    result.setDate(date.getDate() - 6); // Go back 6 days to get start of week
    return result;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div 
      className="date-slider-container"
      onMouseDown={preventMapMovement}
      onMouseMove={preventMapMovement}
      onClick={preventMapMovement}
      onTouchStart={preventMapMovement}
      onTouchMove={preventMapMovement}
    >
      <div className="date-display">
        {formatDate(getStartOfWeek(currentEndDate))} - {formatDate(currentEndDate)}
      </div>
      <div className="slider-track">
        <input
          type="range"
          min="0"
          max={totalWeeks}
          defaultValue={totalWeeks}
          className="date-slider"
          onChange={handleSliderChange}
          onMouseDown={preventMapMovement}
          onTouchStart={preventMapMovement}
        />
      </div>
    </div>
  );
}

function Map() {
  const maxBounds = [
    [-90, -180], // Southwest coordinates
    [90, 180]    // Northeast coordinates
  ];

  return (
    <div className="map-container">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        scrollWheelZoom={true}
        zoomControl={false}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <LocationMarkers />
        <DateSliderControl />
        <MetricsControl />
      </MapContainer>
    </div>
  );
}

export default Map; 