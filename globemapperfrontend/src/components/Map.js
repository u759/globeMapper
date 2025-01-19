import { MapContainer, ZoomControl } from 'react-leaflet';
import LocationMarkers from './LocationMarkers';
import MapLayers from './MapLayers';
import DateSliderControl from './DateSliderControl';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';

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
      </MapContainer>
    </div>
  );
}

export default Map; 