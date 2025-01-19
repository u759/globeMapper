import { Marker, Popup } from "react-leaflet";
import { useLocations } from "../hooks/useLocations";
import CustomPopup from "./CustomPopup";
import { DefaultIcon } from "../constants/mapConstants";
import { useState } from "react";  // ✅ Needed to store the fetched image URL

function LocationMarkers() {
    const locations = useLocations();
    const [locationImages, setLocationImages] = useState({});  // ✅ Store dynamically fetched images

    return (
        <>
            {locations.length === 0 ? console.log(" No locations loaded yet!") : null}
            {locations.map((location, index) => {
                console.log(`📍 Rendering marker ${index + 1}:`, location);

                return (
                    <Marker
                        key={index}
                        position={location.position}
                        icon={DefaultIcon}
                        eventHandlers={{
                            mouseover: async (e) => {
                                e.target.openPopup();

                                // ✅ Fetch image only if it's not already cached
                                if (!locationImages[location.id]) {
                                    try {
                                        const response = await fetch(
                                            `http://localhost:8080/get-image?url=${encodeURIComponent(location.sourceUrl)}`
                                        );
                                        const data = await response.json();
                                        console.log(`🖼️ Image for ${location.name}:`, data.imageUrl);

                                        setLocationImages(prevImages => ({
                                            ...prevImages,
                                            [location.id]: data.imageUrl  // ✅ Save fetched image
                                        }));
                                    } catch (error) {
                                        console.error("❌ Failed to fetch image:", error);
                                    }
                                }
                            },
                            mouseout: (e) => e.target.closePopup(),
                            click: () => {
                                if (location.sourceUrl) {
                                    window.open(location.sourceUrl, '_blank');
                                }
                            }
                        }}
                    >
                        <Popup closeButton={false}>
                            <CustomPopup location={{ ...location, imageUrl: locationImages[location.id] }} />
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}

export default LocationMarkers;
