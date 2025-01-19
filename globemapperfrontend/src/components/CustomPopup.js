function CustomPopup({ location }) {
    return (
      <div className="popup-content" style={{ textAlign: "center" }}>
        <h3>{location.name}</h3>

        {/* Show the image if it exists */}
        {location.imageUrl ? (
          <img
            src={location.imageUrl}
            alt={location.name}
            style={{
              display: "block",
              margin: "10px auto",
              width: "200px",
              height: "auto",
              borderRadius: "4px",
            }}
          />
        ) : (
          <p>Loading image...</p>  // ✅ Show text if image is still loading
        )}

        <p>{location.description}</p>
      </div>
    );
}

export default CustomPopup;
