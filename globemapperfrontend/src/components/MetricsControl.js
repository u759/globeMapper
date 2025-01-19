import { useState } from 'react';

function MetricsControl({ summary }) {
  return (
    <div className="leaflet-left leaflet-middle metrics-container">
      <div className="leaflet-control metrics-panel">
        <h3>AI Summary</h3>
        <div className="metric-summary">
          <p>{summary}</p>
        </div>
      </div>
    </div>
  );
}

export default MetricsControl;
