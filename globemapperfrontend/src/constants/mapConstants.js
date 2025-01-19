import L from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

export const createCustomIcon = (imageUrl) => {
    const iconSize = 32;  // Size of the circular marker
    
    return L.divIcon({
        html: `
            <div class="custom-marker">
                <div class="marker-image" style="background-image: url('${imageUrl || markerIconPng}')"></div>
            </div>
        `,
        className: 'custom-marker-container',
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize/2, iconSize/2],
        popupAnchor: [0, -iconSize/2]
    });
};

// Keep DefaultIcon as fallback
export const DefaultIcon = createCustomIcon(markerIconPng);

export const MAP_CENTER = [49.2827, -123.1207];
export const DEFAULT_ZOOM = 12; 