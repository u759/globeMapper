import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import './App.css';

// Fix the default icon issue
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events from the public directory
    fetch('/events.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  return (
    <div className="App">
      <MapContainer 
        center={[49.2827, -123.1207]}
        zoom={12}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {events.map((event) => (
          <Marker 
            key={event.id} 
            position={[event.latitude, event.longitude]}
          >
            <Popup>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Source:</strong> {event.source}</p>
              <p><strong>Date:</strong> {event.date}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;