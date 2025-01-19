import { useState, useEffect } from 'react';

function DateSliderControl({ onEventsUpdate }) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (52 * 7));
  
  const totalWeeks = 52;
  
  const [currentEndDate, setCurrentEndDate] = useState(endDate);

  useEffect(() => {
    const formatDateForAPI = (date) => {
      return date.toISOString().slice(0, 10).replace(/-/g, '');
    };

    const fetchEvents = async () => {
      try {
        const formattedDate = formatDateForAPI(currentEndDate);
        const response = await fetch(
          `http://localhost:8080/api/events/within-week?date=${formattedDate}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        onEventsUpdate(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [currentEndDate, onEventsUpdate]);

  const handleSliderChange = (e) => {
    e.stopPropagation();
    const weeks = parseInt(e.target.value);
    const newEndDate = new Date(endDate.getTime() - ((totalWeeks - weeks) * 7 * 24 * 60 * 60 * 1000));
    setCurrentEndDate(newEndDate);
  };

  const preventMapMovement = (e) => {
    e.stopPropagation();
  };

  const getStartOfWeek = (date) => {
    const result = new Date(date);
    result.setDate(date.getDate() - 6);
    return result;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div 
      className="date-slider-container"
      onMouseDown={preventMapMovement}
      onMouseMove={preventMapMovement}
      onClick={preventMapMovement}
      onTouchStart={preventMapMovement}
      onTouchMove={preventMapMovement}
    >
      <div className="date-display">
        {formatDate(getStartOfWeek(currentEndDate))} - {formatDate(currentEndDate)}
      </div>
      <div className="slider-track">
        <input
          type="range"
          min="0"
          max={totalWeeks}
          defaultValue={totalWeeks}
          className="date-slider"
          onChange={handleSliderChange}
          onMouseDown={preventMapMovement}
          onTouchStart={preventMapMovement}
        />
      </div>
    </div>
  );
}

export default DateSliderControl; 