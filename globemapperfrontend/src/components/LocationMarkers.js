import { Marker, Popup } from "react-leaflet";
import { useLocations } from "../hooks/useLocations";
import CustomPopup from "./CustomPopup";
import { DefaultIcon } from "../constants/mapConstants";
import L from "leaflet";

function LocationMarkers() {
  const locations = useLocations(); // Get fetched locations

  return (
    <>
      {locations.length === 0 ? (
        console.log("⚠️ No locations loaded yet")
      ) : (
        locations.map((location, index) => {
          console.log(`📍 Rendering marker ${index + 1}:`, location); // Debugging
          return (
            <Marker
              key={index}
              position={location.position}
              icon={location.icon || DefaultIcon}
              eventHandlers={{
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup(),
              }}
            >
              <Popup>
                <CustomPopup location={location} />
              </Popup>
            </Marker>
          );
        })
      )}
    </>
  );
}

export default LocationMarkers;
