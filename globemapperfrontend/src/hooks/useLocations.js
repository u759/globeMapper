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
        console.log("✅ Loaded locations:", data); // Debugging log
        setLocations(
          data.map((event) => ({
            position: [event.latitude, event.longitude],
            name: event.title,
            description: event.description,
            imageUrl: event.imageUrl || "",
          }))
        );
      })
      .catch((error) => console.error("❌ Error fetching locations:", error));
  }, []);

  return locations;
}
