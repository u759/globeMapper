import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import MapLayers from './MapLayers';
import LocationMarkers from './LocationMarkers';
import { MAP_CENTER, DEFAULT_ZOOM } from '../constants/mapConstants';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { useMap } from 'react-leaflet';

function DateSliderControl() {
  // Calculate start date (1 year ago from today)
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  
  // End date is today
  const endDate = new Date();
  
  // Calculate total days between dates
  const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  const [selectedDate, setSelectedDate] = useState(startDate);

  const handleSliderChange = (e) => {
    e.stopPropagation();
    const days = parseInt(e.target.value);
    const newDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
    setSelectedDate(newDate);
  };

  const preventMapMovement = (e) => {
    e.stopPropagation();
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
        <div className="date-display">
          {selectedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <input
          type="range"
          min="0"
          max={totalDays}
          defaultValue="0"
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