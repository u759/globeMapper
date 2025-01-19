function CustomPopup({ location }) {
  return (
    <div className="popup-content">
      <h3>{location.name}</h3>
      {location.imageUrl && (
        <img 
          src={location.imageUrl} 
          alt={location.name}
          style={{ 
            width: '200px',
            height: 'auto',
            marginBottom: '10px',
            borderRadius: '4px'
          }}
        />
      )}
      <p>{location.description}</p>
    </div>
  );
}

export default CustomPopup; 