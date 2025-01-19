import { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useLocations } from '../hooks/useLocations';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

function MetricsControl() {
  const map = useMap();
  const [visibleMarkers, setVisibleMarkers] = useState(0);
  const [summary, setSummary] = useState('Loading summary...');
  const { locations } = useLocations();
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    const generateSummary = async () => {
      if (!locations || locations.length === 0) {
        setSummary('No events to summarize');
        return;
      }

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const titles = locations
          .filter(location => location && location.name)
          .map(location => location.name);

        if (titles.length === 0) {
          setSummary('No event titles available');
          return;
        }

        const titlesString = titles.join(", ");
        const prompt = `Summarize these events in a couple short sentences: ${titlesString}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        setSummary(text);
      } catch (error) {
        console.error('Error getting summary:', error);
        setSummary('Failed to generate summary');
      }
    };

    generateSummary();
  }, [locations]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`metrics-container ${isOpen ? 'open' : ''}`}>
      <button 
        className="toggle-button"
        onClick={togglePanel}
        aria-label={isOpen ? 'Close summary' : 'Open summary'}
      >
        <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
      </button>
      <div className="metrics-panel">
        <h3>AI Summary</h3>
        <div className="metric-summary">
          <p>{summary}</p>
        </div>
      </div>
    </div>
  );
}

export default MetricsControl;
