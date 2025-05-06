import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useLocation } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const ViewLocations = () => {
  const [locations, setLocations] = useState([]);
  const location = useLocation();
  const groupId = location.state?.groupId;

  useEffect(() => {
    const fetchGroupLocations = async () => {
      if (!groupId) {
        alert('Group ID is missing. Please return from a valid group page.');
        return;
      }

      try {
        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (groupSnap.exists()) {
          const data = groupSnap.data();
          const locs = data.locations || [];

          // Sort by name or timestamp if needed
          locs.sort((a, b) => a.name.localeCompare(b.name));
          setLocations(locs);
        } else {
          alert('Group not found.');
        }
      } catch (err) {
        console.error('Error fetching group locations:', err);
      }
    };

    fetchGroupLocations();
  }, [groupId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-white text-center p-6">
      <h2 className="text-3xl font-bold text-orange-600 mb-2">
        Apologies, For Showing Wrong Map Of India
      </h2>
      <h2 className="text-3xl font-bold text-green-600 mb-2">
        Group Members&apos; Locations
      </h2>
      <p className="text-gray-700 max-w-xl mb-6">
        See live locations shared by members of your group.
      </p>

      <div className="w-full" style={{ height: '500px' }}>
        <MapContainer center={[20.5937, 78.9629]} zoom={4} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {locations.map((loc, index) => (
            <Marker
              key={index}
              position={[loc.latitude, loc.longitude]}
              icon={customIcon}
            >
              <Popup>
                <strong>{loc.name}</strong><br />
                {loc.email}<br />
                Lat: {loc.latitude.toFixed(4)}<br />
                Lon: {loc.longitude.toFixed(4)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ViewLocations;
