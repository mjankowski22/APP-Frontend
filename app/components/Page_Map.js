import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = new Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const pinIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapComponent = () => {
  const [positions, setPositions] = useState([]);
  const [fixedPointCoordinates, setFixedPointCooridnates] = useState([
    54.3, 18.5,
  ]);

  useEffect(() => {
    fetch("http://153.19.55.87:5000/get_coordinates")
      .then((response) => response.json())
      .then((data) => setPositions(data))
      .catch((error) => console.error("Error fetching coordinates:", error));
  }, []);

  useEffect(() => {
    fetch("http://153.19.55.87:5000/get_position")
      .then((response) => response.json())
      .then((data) => setFixedPointCooridnates(data))
      .catch((error) => console.error("Error fetching position:", error));
  }, []);

  // Stałe współrzędne punktu

  const handleSaveArea = () => {
    console.log("Saved Area:", positions);
    fetch("http://153.19.55.87:5000/set_coordinates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ coordinates: positions }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          console.log("Coordinates saved successfully");
        } else {
          console.error("Error saving coordinates:", data.message);
        }
      })
      .catch((error) => console.error("Error saving coordinates:", error));
  };

  const handleResetArea = () => {
    fetch("http://153.19.55.87:5000//get_coordinates")
      .then((response) => response.json())
      .then((data) => setPositions(data))
      .catch((error) => console.error("Error fetching coordinates:", error));
  };

  return (
    <div style={{ height: "80vh", width: "80%", margin: "0"}}>
      <MapContainer
        center={[54.35, 18.55]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {positions.length === 4 && <Polygon positions={positions} />}
        {positions.map((position, idx) => (
          <Marker
            key={idx}
            position={position}
            icon={customIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const newPositions = [...positions];
                newPositions[idx] = [
                  e.target.getLatLng().lat,
                  e.target.getLatLng().lng,
                ];
                setPositions(newPositions);
              },
            }}
          >
            <Popup>Punkt {idx + 1}</Popup>
          </Marker>
        ))}
        <Marker
          position={fixedPointCoordinates} // Stałe współrzędne punktu
          icon={pinIcon}
        >
          <Popup>
            Czas: {new Date().toLocaleString()}
            <br />
            Współrzędne: {fixedPointCoordinates[0]}, {fixedPointCoordinates[1]}
          </Popup>
        </Marker>
      </MapContainer>
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <button onClick={handleSaveArea} style={{ marginRight: "10px" }}>
          Save Area
        </button>
        <button onClick={handleResetArea}>Reset Area</button>
      </div>
    </div>
  );
};

export default MapComponent;
