import L from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

export const DefaultIcon = L.icon({
    iconUrl: markerIconPng,
    shadowUrl: markerShadowPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export const MAP_CENTER = [49.2827, -123.1207];
export const DEFAULT_ZOOM = 12; 