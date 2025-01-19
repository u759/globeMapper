import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import LocationMarkers from './LocationMarkers';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';
import { useState } from 'react';

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
        minZoom={2}
        maxZoom={6}
        doubleClickZoom={false}
        bounceAtZoomLimits={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />
        <ZoomControl position="bottomright" />
        <LocationMarkers />
        <DateSliderControl />
      </MapContainer>
    </div>
  );
}

export default Map; 