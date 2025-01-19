import { useState, useEffect } from 'react';

function DateSliderControl({ onDateChange, onLimitChange, onSliderRelease }) {
  // Date slider states and constants
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (52 * 7));
  const totalWeeks = 52;
  const [currentEndDate, setCurrentEndDate] = useState(endDate);

  // Marker limit slider states and constants
  const maxMarkers = 150;
  const minMarkers = 5;
  const defaultMarkers = 50;
  const step = 5;
  const [currentLimit, setCurrentLimit] = useState(defaultMarkers);

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  useEffect(() => {
    const formattedDate = formatDateForAPI(currentEndDate);
    onDateChange(formattedDate);
  }, [currentEndDate, onDateChange]);

  const handleDateSliderChange = (e) => {
    e.stopPropagation();
    const weeks = parseInt(e.target.value);
    const newEndDate = new Date(endDate.getTime() - ((totalWeeks - weeks) * 7 * 24 * 60 * 60 * 1000));
    setCurrentEndDate(newEndDate);
  };

  const handleLimitSliderChange = (e) => {
    e.stopPropagation();
    const newLimit = parseInt(e.target.value);
    setCurrentLimit(newLimit);
    onLimitChange(newLimit);
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

  const handleDateSliderRelease = () => {
    onSliderRelease();
  };

  const handleLimitSliderRelease = () => {
    onSliderRelease();
  };

  return (
    <div 
      className="leaflet-bottom leaflet-center date-slider-container"
      onMouseDown={preventMapMovement}
      onMouseMove={preventMapMovement}
      onClick={preventMapMovement}
      onTouchStart={preventMapMovement}
      onTouchMove={preventMapMovement}
    >
      <div className="leaflet-control date-slider-inner">
        <div className="sliders-row">
          <div className="slider-column">
            <div className="date-display-container">
              <div className="date-display">
                {formatDate(getStartOfWeek(currentEndDate))} - {formatDate(currentEndDate)}
              </div>
            </div>
            <div className="slider-track">
              <input
                type="range"
                min="0"
                max={totalWeeks}
                defaultValue={totalWeeks}
                className="date-slider"
                onChange={handleDateSliderChange}
                onMouseDown={preventMapMovement}
                onTouchStart={preventMapMovement}
                onMouseUp={handleDateSliderRelease}
                onTouchEnd={handleDateSliderRelease}
              />
            </div>
          </div>

          <div className="slider-column">
            <div className="limit-display-container">
              <div className="limit-display">
                Showing {currentLimit} markers
              </div>
            </div>
            <div className="slider-track">
              <input
                type="range"
                min={minMarkers}
                max={maxMarkers}
                step={step}
                value={currentLimit}
                className="date-slider"
                onChange={handleLimitSliderChange}
                onMouseDown={preventMapMovement}
                onTouchStart={preventMapMovement}
                onMouseUp={handleLimitSliderRelease}
                onTouchEnd={handleLimitSliderRelease}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DateSliderControl; 