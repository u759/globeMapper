import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function App() {
  const markers = [
    { position: [40.7128, -74.0060], name: "New York" },
    { position: [40.7614, -73.9776], name: "Empire State Building" },
    { position: [40.7527, -73.9772], name: "Times Square" },
    { position: [40.7484, -73.9857], name: "Penn Station" },
    { position: [40.7527, -74.0049], name: "Chelsea Market" }
  ];

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer 
        center={[40.7128, -74.0060]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup>
              {marker.name}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
