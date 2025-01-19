import { useState, useEffect } from "react";

export function useLocations() {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        fetch("/events.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("✅ Loaded locations:", data);

                // Convert JSON into Leaflet-compatible format
                const formattedLocations = data.map(event => {
                    if (!event.latitude || !event.longitude) {
                        console.warn(`⚠ Missing coordinates for: ${event.title}`);
                        return null; // Skip invalid locations
                    }

                    return {
                        id: event.id,
                        name: event.title,  // Use `title` for name
                        description: event.description,
                        sourceUrl: event.source,  // ✅ Store website URL (to fetch image later)
                        date: event.date,
                        imageUrl: null,  // ✅ Initially null, will be fetched dynamically
                        position: [event.latitude, event.longitude],
                    };
                }).filter(event => event !== null);

                setLocations(formattedLocations);
            })
            .catch((error) => console.error("❌ Error fetching locations:", error));
    }, []);

    return locations;
}
