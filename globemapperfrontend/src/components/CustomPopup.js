function CustomPopup({ location }) {
  const handleClick = () => {
    if (location.sourceUrl) {
      window.open(location.sourceUrl, '_blank');
    }
  };

  return (
    <div 
      className="material-popup" 
      onClick={handleClick}
    >
      {location.imageUrl && (
        <div className="popup-image-container">
          <img 
            src={location.imageUrl} 
            alt={location.name}
          />
        </div>
      )}
      <div className="popup-content">
        <h3>{location.name}</h3>
        <p>{location.description}</p>
        <p>{location.date}</p>
        {location.sourceUrl && (
          <div className="popup-footer">
            <span className="read-more">Read more</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomPopup;
