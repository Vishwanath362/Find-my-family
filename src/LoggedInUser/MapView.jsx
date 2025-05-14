import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase'; // Assuming you have auth initialized in firebase
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = () => {
  const [locations, setLocations] = useState([]);  // State to hold group members' locations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        // Get the current user
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        const groupId = userSnap.data().currentGroupId;
  
        if (!groupId) {
          setError('You are not part of any group.');
          setLoading(false);
          return;
        }
  
        // Get the group data using the group ID
        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);
        const groupData = groupSnap.data();
  
        if (groupData && groupData.locations) {
          // Locations are already stored in the group document
          const groupLocations = groupData.locations.map(location => ({
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
          }));
          setLocations(groupLocations);
        }
      } catch (err) {
        console.error('Error fetching group data:', err);
        setError('Failed to load location data');
        navigate('/Group');
      } finally {
        setLoading(false);
      }
    };
  
    fetchGroupData();
  }, []);
  



  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading map...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-gray-600">{error}</div>;
  }

  if (locations.length === 0) {
    return <div className="text-center mt-10 text-gray-600">No location data available for group members</div>;
  }

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[20.5937, 78.9629]} // Default center of India
        zoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location, index) => (
          <Marker key={index} position={[location.latitude, location.longitude]}>
            <Popup>
              <strong>{location.name}</strong> <br />
              Latitude: {location.latitude} <br />
              Longitude: {location.longitude}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
