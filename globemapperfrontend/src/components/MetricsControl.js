import { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useLocations } from '../hooks/useLocations';

function MetricsControl() {
  const map = useMap();
  const [visibleMarkers, setVisibleMarkers] = useState(0);
  const [summary, setSummary] = useState('Loading summary...');
  const { locations } = useLocations();

  useEffect(() => {
    if (!locations) return;

    const updateMetrics = () => {
      const bounds = map.getBounds();
      const visible = locations.filter(location => 
        bounds.contains(location.position)
      ).length;
      setVisibleMarkers(visible);
    };

    map.on('moveend', updateMetrics);
    map.on('zoomend', updateMetrics);
    
    updateMetrics();

    return () => {
      map.off('moveend', updateMetrics);
      map.off('zoomend', updateMetrics);
    };
  }, [map, locations]);

  return (
    <div className="leaflet-left leaflet-middle metrics-container">
      <div className="leaflet-control metrics-panel">
        <h3>Map Metrics</h3>
        <div className="metric-item">
          <span>Visible Markers:</span>
          <span>{visibleMarkers}</span>
        </div>
        <div className="metric-item">
          <span>Total Markers:</span>
          <span>{locations?.length || 0}</span>
        </div>
        <div className="metric-summary">
          <h4>AI Summary</h4>
          <p>{summary}</p>
        </div>
      </div>
    </div>
  );
}

export default MetricsControl;
