import { MapContainer, TileLayer } from 'react-leaflet';
import MapLayers from './MapLayers';
import LocationMarkers from './LocationMarkers';
import { MAP_CENTER, DEFAULT_ZOOM } from '../constants/mapConstants';
import 'leaflet/dist/leaflet.css';

function Map() {
  // Define bounds for the map (roughly the whole world)
  const bounds = [
    [-90, -180], // Southwest coordinates
    [90, 180]    // Northeast coordinates
  ];

  return (
    <MapContainer
      center={[20, 0]}  // Center of the map
      zoom={2}          // Initial zoom level
      style={{ height: "100vh", width: "100%" }}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}  // Makes the bounds "sticky"
      minZoom={2}               // Prevent zooming out too far
      worldCopyJump={false}     // Prevents the world from repeating
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap={true}  // Prevents the tiles from repeating
        bounds={bounds}
      />
      <MapLayers />
      <LocationMarkers />
    </MapContainer>
  );
}

export default Map; 