import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import logo from './logo.svg';
import './App.css';

function App() {
  // Sample locations - replace with your actual data
  const locations = [
    {
      position: [51.505, -0.09],
      name: "London",
      description: "Capital of England"
    },
    {
      position: [40.7128, -74.0060],
      name: "New York",
      description: "The Big Apple"
    }
  ];

  return (
    <div className="App">
      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={13} 
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location, index) => (
          <Marker key={index} position={location.position}>
            <Popup>
              <h3>{location.name}</h3>
              <p>{location.description}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
