import { MapContainer, ZoomControl } from 'react-leaflet';
import LocationMarkers from './LocationMarkers';
import MapLayers from './MapLayers';
import DateSliderControl from './DateSliderControl';
import { useState } from 'react';
import { useLocations } from '../hooks/useLocations';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';

function Map() {
  const [currentDate, setCurrentDate] = useState(null);
  const [markerLimit, setMarkerLimit] = useState(500);
  const { locations, isLoading } = useLocations(currentDate, markerLimit);

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
        {!isLoading && <LocationMarkers locations={locations} />}
        <DateSliderControl 
          onDateChange={handleDateChange}
          onLimitChange={handleLimitChange}
          isLoading={isLoading}
        />
      </MapContainer>
    </div>
  );
}

export default Map; 