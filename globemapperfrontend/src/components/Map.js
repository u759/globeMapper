import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import MapLayers from './MapLayers';
import LocationMarkers from './LocationMarkers';
import { MAP_CENTER, DEFAULT_ZOOM } from '../constants/mapConstants';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { useMap } from 'react-leaflet';

function DateSliderControl() {
  // Calculate end date (today)
  const endDate = new Date();
  // Calculate start date (52 weeks ago)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (52 * 7)); // Go back 52 weeks
  
  const totalWeeks = 52; // Fixed number of weeks
  
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
    result.setDate(date.getDate() - 6); // Go back 6 days
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
      className="leaflet-bottom leaflet-center date-slider-container"
      onMouseDown={preventMapMovement}
      onMouseMove={preventMapMovement}
      onClick={preventMapMovement}
      onTouchStart={preventMapMovement}
      onTouchMove={preventMapMovement}
    >
      <div className="leaflet-control date-slider-inner">
        <div className="date-display-container">
          <div className="date-display">
            {formatDate(getStartOfWeek(currentEndDate))} - {formatDate(currentEndDate)}
          </div>
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
    </div>
  );
}

function Map() {
  // Define bounds for the map (roughly the whole world)
  const bounds = [
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
        style={{ height: "100vh", width: "100%" }}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}  // Makes the bounds "sticky"
        minZoom={2}               // Prevent zooming out too far
        worldCopyJump={false}     // Prevents the world from repeating
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}  // Prevents the tiles from repeating
          bounds={bounds}
        />
        <ZoomControl position="bottomright" />
        <MapLayers />
        <LocationMarkers />
        <DateSliderControl />
      </MapContainer>
    </div>
  );
}

export default Map; 