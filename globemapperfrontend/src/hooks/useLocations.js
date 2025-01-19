export function useLocations() {
  // You could fetch this from an API or database in the future
  return [
    {
      position: [49.2488, -122.9805],
      name: "Burnaby City Hall",
      description: "City in British Columbia, home to SFU and BCIT",
      imageUrl: "https://www.burnaby.ca/sites/default/files/acquiadam/2021-06/Burnaby-Mountain-19201211.jpg"
    }
    // Add more locations as needed
  ];
} 