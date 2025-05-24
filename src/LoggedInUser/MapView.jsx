import React, { useEffect, useState, useRef } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';

// Fix Leaflet marker icon path issue
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
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupName, setGroupName] = useState("null");

  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!auth.currentUser) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const fetchGroupData = async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          setError("User data not found.");
          setLoading(false);
          return;
        }

        const groupId = userSnap.data().currentGroupId;
        if (!groupId) {
          setError('You are not part of any group.');
          setLoading(false);
          return;
        }

        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);
        if (!groupSnap.exists()) {
          setError('Group data not found.');
          setLoading(false);
          return;
        }

        const groupData = groupSnap.data();
        setGroupName(groupData.name || "Unnamed Group");

        if (groupData?.locations) {
          const groupLocations = groupData.locations.map(location => ({
            name: location.name,
            latitude: location.latitude,
            longitude: location.longitude,
          }));
          setLocations(groupLocations);
        }

        const messagesRef = collection(db, 'groups', groupId, 'messages');
        const q = query(messagesRef, orderBy('timestamp'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          setChatMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (error) => {
          console.error("Snapshot listener error:", error);
          setError("Permission denied or unable to load messages.");
        });

        setLoading(false);
        return () => unsubscribe();
      } catch (err) {
        console.error('Error fetching group data:', err);
        setError('Failed to load location data');
        setLoading(false);
        navigate('/Group');
      }
    };

    fetchGroupData();
  }, []);

  useEffect(scrollToBottom, [chatMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    const groupId = userSnap.data().currentGroupId;

    await addDoc(collection(db, 'groups', groupId, 'messages'), {
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName || "Anonymous",
      message: newMessage.trim(),
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
    <div className='bg-gradient-to-r from-green-50 to-green-100 min-h-screen'>
      <div className="h-12 w-full flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-2xl font-semibold text-green-700">
            Apologies for showing wrong map of India
          </p>
        </div>
      </div>

      <div className='flex flex-wrap md:flex-nowrap'>
        <div className="flex items-center mt-10 ml-10 rounded-md border-green-600 border-2 h-[70vh] w-full md:w-1/2">
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map((location, index) => (
              <Marker key={index} position={[location.latitude, location.longitude]}>
                <Popup>
                  <strong>{location.name}</strong><br />
                  Latitude: {location.latitude}<br />
                  Longitude: {location.longitude}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="mt-10 ml-5 mr-5 w-full md:w-1/2 flex flex-col justify-between">
          <div className="bg-white shadow-md rounded-md p-4 flex flex-col h-[70vh]">
            <div className="text-xl font-bold mb-3 text-green-800">Group Chat - {groupName}</div>
            <div className="flex-1 overflow-y-auto border p-2 rounded bg-gray-50 mb-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="mb-2">
                  <strong className="text-green-700">{msg.senderName}</strong>: {msg.message}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
                className="flex-1 border rounded px-3 py-1 resize-none h-16"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
