import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
  const [locations, setLocations] = useState([]);  // State to hold all locations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Change the collection to 'group' instead of 'users'
        const querySnapshot = await getDocs(collection(db, 'groups'));  // Fetch all groups from Firestore
        const locationsArray = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.locations && data.locations.length > 0) {
            // Push all location data from the 'group' collection
            data.locations.forEach(location => {
              locationsArray.push({
                name: data.name,  // Assuming name is stored in the group document
                latitude: location.latitude,
                longitude: location.longitude,
              });
            });
          }
        });

        setLocations(locationsArray);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load location data');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading map...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-gray-600">{error}</div>;
  }

  if (locations.length === 0) {
    return <div className="text-center mt-10 text-gray-600">No location data available</div>;
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
