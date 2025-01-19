import { useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DefaultIcon } from "../constants/mapConstants";
import CustomPopup from './CustomPopup';

function LocationMarkers({ locations }) {
    const map = useMap();

    // Center map on markers when locations change
    useEffect(() => {
        if (locations && locations.length > 0) {
            const bounds = L.latLngBounds(locations.map(loc => loc.position));
            map.fitBounds(bounds);
        }
    }, [locations, map]);

    return (
        <>
            {locations.length === 0 ? console.log("🚨 No locations loaded yet!") : null}
            {locations.map((location, index) => {
                //console.log(`📍 Rendering marker ${index + 1}:`, location);

                return (
                    <Marker
                        key={`${location.id}-${location.position[0]}-${location.position[1]}`}
                        position={location.position}
                        icon={DefaultIcon}
                        eventHandlers={{
                            mouseover: (e) => e.target.openPopup(),
                            
                            click: (e) => e.target.openPopup()
                        }}
                    >
                        <Popup>
                            <CustomPopup location={location} />
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}

export default LocationMarkers;
