import { Marker, Popup } from "react-leaflet";
import { useLocations } from "../hooks/useLocations";
import CustomPopup from "./CustomPopup";
import { DefaultIcon } from "../constants/mapConstants";

function LocationMarkers() {
    const locations = useLocations();

    return (
        <>
            {locations.length === 0 ? console.log("🚨 No locations loaded yet!") : null}
            {locations.map((location, index) => {
                console.log(`📍 Rendering marker ${index + 1}:`, location);

                return (
                    <Marker
                        key={index}
                        position={location.position}
                        icon={DefaultIcon}
                        eventHandlers={{
                            mouseover: (e) => e.target.openPopup(),
                            mouseout: (e) => e.target.closePopup(),
                            click: () => {
                                if (location.sourceUrl) {
                                    window.open(location.sourceUrl, '_blank');
                                }
                            }
                        }}
                    >
                        <Popup closeButton={false}>
                            <CustomPopup location={location} />
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}

export default LocationMarkers;
