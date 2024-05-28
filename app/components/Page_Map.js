import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const pinIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapComponent = () => {
  const [positions, setPositions] = useState([
    [54.422, 18.675],
    [54.422, 18.448],
    [54.277, 18.448],
    [54.277, 18.675]
  ]);

  const fixedPointCoordinates = [54.3, 18.5]; // Stałe współrzędne punktu

  const handleSaveArea = () => {
    // Tutaj możesz zaimplementować logikę zapisu obszaru
    console.log("Saved Area:", positions);
  };

  const handleResetArea = () => {
    // Resetowanie obszaru do początkowych wartości
    setPositions([
      [54.422, 18.675],
      [54.422, 18.448],
      [54.277, 18.448],
      [54.277, 18.675]
    ]);
  };

  return (
    <div style={{ height: '80vh', width: '80%', margin: 'auto' }}>
      <MapContainer center={[54.35, 18.55]} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
                newPositions[idx] = [e.target.getLatLng().lat, e.target.getLatLng().lng];
                setPositions(newPositions);
              }
            }}
          >
            <Popup>
              Punkt {idx + 1}
            </Popup>
          </Marker>
        ))}
        <Marker
          position={fixedPointCoordinates} // Stałe współrzędne punktu
          icon={pinIcon}
        >
          <Popup>
            Czas: {new Date().toLocaleString()}<br />
            Współrzędne: {fixedPointCoordinates[0]}, {fixedPointCoordinates[1]}
          </Popup>
        </Marker>
      </MapContainer>
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <button onClick={handleSaveArea} style={{ marginRight: '10px' }}>Save Area</button>
        <button onClick={handleResetArea}>Reset Area</button>
      </div>
    </div>
  );
};

export default MapComponent;
