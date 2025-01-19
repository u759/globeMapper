import { useState, useEffect, useMemo, useCallback } from "react";

export function useLocations(date, limit = 50) {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Memoize the processLocations function
    const processLocations = useCallback((data, limit) => {
        console.log("✅ Processing locations:", data.length);
        
        const seenCoordinates = new Set();
        
        return data
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(event => {
                if (!event.latitude || !event.longitude) {
                    console.warn(`⚠ Missing coordinates for: ${event.title}`);
                    return null;
                }

                const coordKey = `${event.latitude},${event.longitude}`;
                
                if (seenCoordinates.has(coordKey)) {
                    return null;
                }
                
                seenCoordinates.add(coordKey);

                return {
                    id: event.id,
                    name: event.title,
                    description: event.description,
                    sourceUrl: event.source,
                    date: event.date,
                    imageUrl: event.img,
                    position: [event.latitude, event.longitude],
                };
            })
            .filter(event => event !== null)
            .slice(0, limit);
    }, []);

    useEffect(() => {
        let timeoutId;
        setIsLoading(true);

        const fetchLocations = async () => {
            try {
                if (date) {
                    const dateResponse = await fetch(
                        `http://localhost:8080/api/events/within-week?date=${date}`
                    );
                    if (!dateResponse.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const dateData = await dateResponse.json();
                    
                    if (!dateData || dateData.length === 0) {
                        console.log("⚠ No events found for date, falling back to all events");
                        const allResponse = await fetch("http://localhost:8080/api/events/all");
                        if (!allResponse.ok) {
                            throw new Error("Network response was not ok");
                        }
                        const allData = await allResponse.json();
                        const processed = processLocations(allData, limit);
                        setLocations(processed);
                    } else {
                        const processed = processLocations(dateData, limit);
                        setLocations(processed);
                    }
                } else {
                    const response = await fetch("http://localhost:8080/api/events/all");
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    const processed = processLocations(data, limit);
                    setLocations(processed);
                }
            } catch (error) {
                console.error("Error fetching locations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce the fetch operation
        timeoutId = setTimeout(() => {
            fetchLocations();
        }, 300); // 300ms delay

        return () => {
            clearTimeout(timeoutId);
            setIsLoading(false);
        };
    }, [date, limit, processLocations]);

    return { locations, isLoading };
}
