import { useState, useEffect } from "react";

export function useLocations() {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/events/all")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("✅ Loaded locations:", data);

                // Keep track of seen coordinates
                const seenCoordinates = new Set();
                
                // Convert JSON into Leaflet-compatible format and filter unique coordinates
                const formattedLocations = data
                    .map(event => {
                        if (!event.latitude || !event.longitude) {
                            console.warn(`⚠ Missing coordinates for: ${event.title}`);
                            return null;
                        }

                        // Create coordinate key
                        const coordKey = `${event.latitude},${event.longitude}`;
                        
                        // Skip if we've seen these coordinates before
                        if (seenCoordinates.has(coordKey)) {
                            return null;
                        }
                        
                        // Add coordinates to seen set
                        seenCoordinates.add(coordKey);

                        return {
                            id: event.id,
                            name: event.title,
                            description: event.description,
                            sourceUrl: event.source,
                            date: event.date,
                            imageUrl: null,
                            position: [event.latitude, event.longitude],
                        };
                    })
                    .filter(event => event !== null)
                    .slice(0, 20); // Get only first 20 locations

                setLocations(formattedLocations);
            })
            .catch((error) => console.error("❌ Error fetching locations:", error));
    }, []);

    return locations;
}
