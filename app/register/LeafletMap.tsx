'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  latLng: { lat: number; lng: number } | null;
  setLatLng: (pos: { lat: number; lng: number }) => void;
}

function LocationMarker({ setLatLng }: { setLatLng: (latlng: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LeafletMap({ latLng, setLatLng }: Props) {
  const center = latLng || { lat: 13.7563, lng: 100.5018 };

  return (
    <MapContainer center={center} zoom={latLng ? 16 : 6} style={{ height: 300, width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {latLng && <Marker position={[latLng.lat, latLng.lng]} icon={DefaultIcon} />}
      <LocationMarker setLatLng={setLatLng} />
    </MapContainer>
  );
}
