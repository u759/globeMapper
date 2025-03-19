import { useState, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

function SearchControl({ locations, onSearchChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef(null);
  const map = useMap();

  // Filter locations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      onSearchChange('');
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = locations.filter(
      location => 
        (location.name && location.name.toLowerCase().includes(query)) ||
        (location.description && location.description.toLowerCase().includes(query))
    );
    
    setSearchResults(results);
    onSearchChange(searchQuery);
  }, [searchQuery, locations, onSearchChange]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (!isExpanded && e.target.value) {
      setIsExpanded(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsExpanded(false);
    onSearchChange('');
  };

  const handleResultClick = (location) => {
    map.flyTo(location.position, 10, {
      animate: true,
      duration: 1.5
    });
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  };

  // This is the crucial function to prevent scroll events from reaching the map
  const handleWheel = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    // Add wheel event listener to prevent map zooming when scrolling results
    const searchResultsElement = searchResultsRef.current;
    
    if (searchResultsElement) {
      const preventMapZoom = (e) => {
        e.stopPropagation();
      };
      
      searchResultsElement.addEventListener('wheel', preventMapZoom, { passive: false });
      
      return () => {
        searchResultsElement.removeEventListener('wheel', preventMapZoom);
      };
    }
  }, [isExpanded, searchResults]);

  return (
    <div className={`search-container ${isOpen ? 'open' : ''}`}>
      <button 
        className="search-toggle-button"
        onClick={togglePanel}
        aria-label={isOpen ? 'Close search' : 'Open search'}
      >
        <span className="search-icon-toggle">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </span>
      </button>
      <div className="search-panel">
        <div className="search-header">
          <h3>Search Events</h3>
          <div className="search-input-container">
            <span className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search events..."
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-button" onClick={clearSearch}>
                ✕
              </button>
            )}
          </div>
        </div>
        
        {isExpanded && searchResults.length > 0 && (
          <div 
            className="search-results" 
            ref={searchResultsRef}
            onWheel={handleWheel}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="results-header">
              <span>{searchResults.length} results found</span>
              <button 
                className="collapse-button"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "▲" : "▼"}
              </button>
            </div>
            <ul className="results-list">
              {searchResults.map((location) => (
                <li 
                  key={location.id} 
                  onClick={() => handleResultClick(location)}
                  className="result-item"
                >
                  {location.imageUrl && (
                    <div className="result-image">
                      <img src={location.imageUrl} alt="" />
                    </div>
                  )}
                  <div className="result-content">
                    <h4>{location.name}</h4>
                    <p>{location.description?.substring(0, 80)}...</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {isExpanded && searchQuery && searchResults.length === 0 && (
          <div className="no-results">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchControl;