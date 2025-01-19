import { MapContainer } from 'react-leaflet';
import MapLayers from './MapLayers';
import LocationMarkers from './LocationMarkers';
import { MAP_CENTER, DEFAULT_ZOOM } from '../constants/mapConstants';
import 'leaflet/dist/leaflet.css';

function Map() {
  return (
    <MapContainer 
      center={MAP_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: "100vh", width: "100%" }}
    >
      <MapLayers />
      <LocationMarkers />
    </MapContainer>
  );
}

export default Map; 