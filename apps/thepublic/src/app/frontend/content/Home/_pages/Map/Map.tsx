import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.scss';

// Dummy data for demonstration
const exampleHeatmapData = [
  { lat: 37.7749, lng: -122.4194, intensity: 100 },
  { lat: 34.0522, lng: -118.2437, intensity: 80 },
  // more data points
];

const exampleFriends = [
  { lat: 40.7128, lng: -74.0060, name: 'Friend 1' },
  { lat: 41.8781, lng: -87.6298, name: 'Friend 2' },
];

const exampleSavedNetworks = [
  { lat: 29.7604, lng: -95.3698, name: 'Network 1' },
  { lat: 32.7767, lng: -96.7970, name: 'Network 2' },
];

const Map: React.FC = () => {
  return (
    <div className={styles.mapContainer}>
      <h1>Network Map</h1>
      <MapContainer center={[37.7749, -122.4194]} zoom={5} className={styles.leafletMap}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Heatmap Layer */}
        <HeatmapLayer
          points={exampleHeatmapData}
          longitudeExtractor={m => m.lng}
          latitudeExtractor={m => m.lat}
          intensityExtractor={m => m.intensity}
          max={100}
        />

        {/* Friends Markers */}
        {exampleFriends.map((friend, idx) => (
          <Marker key={`friend-${idx}`} position={[friend.lat, friend.lng]}>
            <Popup>{friend.name}</Popup>
          </Marker>
        ))}

        {/* Saved Networks */}
        {exampleSavedNetworks.map((network, idx) => (
          <Circle
            key={`network-${idx}`}
            center={[network.lat, network.lng]}
            radius={5000}
            fillColor="blue"
            color="blue"
          >
            <Popup>{network.name}</Popup>
          </Circle>
        ))}
      </MapContainer>

      {/* Option Buttons */}
      <div className={styles.options}>
        <button>View Friends</button>
        <button>Saved Networks</button>
        <button>Activity Hotspots</button>
      </div>
    </div>
  );
};

export default Map;