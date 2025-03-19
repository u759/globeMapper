import { useEffect, useRef, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DefaultIcon, createCustomIcon } from "../constants/mapConstants";
import CustomPopup from './CustomPopup';

//TODO: make unclickable markers on mobile for ux

function LocationMarkers({ locations }) {
    const map = useMap();
    const popupRefs = useRef({});
    const closeTimersRef = useRef({});
    
    // Only fit bounds on initial load
    useEffect(() => {
        if (locations && locations.length > 0 && !map.hasInitialFit) {
            const bounds = L.latLngBounds(locations.map(loc => loc.position));
            map.fitBounds(bounds);
            map.hasInitialFit = true;  // Set a flag to prevent future fits
        }
    }, [locations, map]);

    // Clean up any timers when component unmounts
    useEffect(() => {
        return () => {
            Object.values(closeTimersRef.current).forEach(timerId => {
                if (timerId) clearTimeout(timerId);
            });
        };
    }, []);

    // Set up map-level event handler to close popups when clicking elsewhere
    useEffect(() => {
        const handleMapClick = (e) => {
            // Close all popups when clicking on the map (but not on markers/popups)
            if (!e.originalEvent.popupHandled) {
                Object.values(popupRefs.current).forEach(marker => {
                    if (marker && marker._popup && marker._popup.isOpen()) {
                        marker.closePopup();
                    }
                });
            }
        };

        map.on('click', handleMapClick);
        return () => {
            map.off('click', handleMapClick);
        };
    }, [map]);

    const handleMarkerMouseOut = (e, locationId) => {
        // Only close if mouse isn't over the popup
        const popup = e.target.getPopup();
        const popupElement = popup.getElement();
        
        // Clear any existing timer for this marker
        if (closeTimersRef.current[locationId]) {
            clearTimeout(closeTimersRef.current[locationId]);
        }

        // Set a new timer
        closeTimersRef.current[locationId] = setTimeout(() => {
            if (popupElement && !popupElement.matches(':hover')) {
                e.target.closePopup();
            }
            closeTimersRef.current[locationId] = null;
        }, 500); // 500ms delay
    };

    const handlePopupMouseOut = (e, locationId) => {
        // Clear any existing timer
        if (closeTimersRef.current[locationId]) {
            clearTimeout(closeTimersRef.current[locationId]);
        }

        // Set a new timer
        closeTimersRef.current[locationId] = setTimeout(() => {
            // Get the marker element to check if mouse is over it
            const marker = popupRefs.current[locationId];
            if (marker) {
                const markerElement = marker._icon;
                // Only close if mouse isn't over the marker
                if (markerElement && !markerElement.matches(':hover')) {
                    e.target._source.closePopup();
                }
            } else {
                e.target._source.closePopup();
            }
            closeTimersRef.current[locationId] = null;
        }, 500); // 500ms delay
    };

    const handleMouseOver = (e, locationId) => {
        // Clear any close timer when mouse moves back over element
        if (closeTimersRef.current[locationId]) {
            clearTimeout(closeTimersRef.current[locationId]);
            closeTimersRef.current[locationId] = null;
        }
        e.target.openPopup();
    };

    const handleMarkerClick = (e, location) => {
        e.originalEvent.popupHandled = true;
        
        // Open the popup
        e.target.openPopup();
        
        // Navigate to the news article URL if available
        if (location.sourceUrl) {
            window.open(location.sourceUrl, '_blank');
        }
    };

    return (
        <>
            {locations.length === 0 ? console.log("🚨 No locations loaded yet!") : null}
            {locations.map((location, index) => {
                const icon = location.imageUrl ? createCustomIcon(location.imageUrl) : DefaultIcon;

                return (
                    <Marker
                        key={`${location.id}-${location.position[0]}-${location.position[1]}`}
                        position={location.position}
                        icon={icon}
                        ref={(markerRef) => {
                            if (markerRef) {
                                popupRefs.current[location.id] = markerRef;
                            }
                        }}
                        eventHandlers={{
                            mouseover: (e) => handleMouseOver(e, location.id),
                            mouseout: (e) => handleMarkerMouseOut(e, location.id),
                            click: (e) => handleMarkerClick(e, location)
                        }}
                    >
                        <Popup 
                            autoPan={false}
                            eventHandlers={{
                                mouseover: (e) => handleMouseOver(e, location.id),
                                mouseout: (e) => handlePopupMouseOut(e, location.id)
                            }}
                        >
                            <CustomPopup location={location} />
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
}

export default LocationMarkers;