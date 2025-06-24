// LeafletMap.tsx
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const LeafletMap = ({ latLng, setLatLng }: {
  latLng: { lat: number; lng: number };
  setLatLng: (latlng: { lat: number; lng: number }) => void;
}) => {
  const position = latLng || { lat: 13.736717, lng: 100.523186 };

  function LocationPicker() {
    useMapEvents({
      click(e) {
        setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  }

  return (
    <MapContainer center={position} zoom={16} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} />
      <LocationPicker />
    </MapContainer>
  );
};

export default LeafletMap;