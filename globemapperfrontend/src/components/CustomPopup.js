function CustomPopup({ location }) {
  const handleClick = () => {
    if (location.sourceUrl) {
      window.open(location.sourceUrl, '_blank');
    }
  };

  return (
    <div 
      className="popup-content" 
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Show the image if it exists */}
      {location.imageUrl && (
        <img 
          src={location.imageUrl} 
          alt={location.name}
          style={{ 
            width: '200px',
            height: 'auto',
            marginBottom: '10px'
          }}
        />
      )}

      <h3>{location.name}</h3>
      <p>{location.description}</p>
    </div>
  );
}

export default CustomPopup;
