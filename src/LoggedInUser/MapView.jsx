import React, { useEffect, useState, useRef } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, and } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MapPin, MessageCircle, Users, Signal, Send, MoreVertical, Shield, Zap } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
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
 // const [user, setUser] = useState(null); // testing
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupName, setGroupName] = useState("null");
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [localMembers, setLocalMembers] = useState([]);
  // const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  //  useEffect(() => {
  //   const checkAuth = async () => {
  //     // Give Firebase time to restore the session
  //     await new Promise((res) => setTimeout(res, 200));

  //     const user = auth.currentUser;

  //     if (user) {
  //       const token = await user.getIdToken();
  //       localStorage.setItem('authtoken', token);
  //       setLoading(false); // User is valid
  //     } else {
  //       //navigate('/login'); // Not logged in
         
  //     }
  //   };

  //   checkAuth();
  // }, []);

  useEffect(() => {
    // Mouse tracking for dynamic background
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
   

    if (!auth.currentUser  ) {
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
        // navigate('/Group');
      }
    };

    fetchGroupData();

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(scrollToBottom, [chatMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    const groupId = userSnap.data().currentGroupId;
    const extractUsernameSingleLine = (email) =>
      email.includes('@') ? email.substring(0, email.indexOf('@')) : email;

    await addDoc(collection(db, 'groups', groupId, 'messages'), {
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName || extractUsernameSingleLine(auth.currentUser.email),
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
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-blue-900/20"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`
            }}
          ></div>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Dots */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}

        <div className="relative z-10 text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-cyan-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
          </div>
          <div className="text-2xl font-light text-white mb-2">Connecting with your family...</div>
          <div className="text-emerald-400 text-sm font-medium">Syncing locations and messages</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-pink-900/20"></div>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 bg-white/5 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-red-500/20 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-300 text-lg font-medium mb-4">{error}</p>
            <Link to ="/Group">
            <button
              onClick={() => { navigate('/Group')  }}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium rounded-lg transition-all duration-300 border border-red-500/30"
            >
              Go Back
            </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
        {/* Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-orange-900/20"></div>
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 bg-white/5 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-amber-500/20 max-w-md mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
              <MapPin className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-amber-300 text-lg font-medium">No location data available for group members</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-black overflow-hidden relative'>
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-blue-900/20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`
          }}
        ></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Dots */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400 rounded-full opacity-30 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        ></div>
      ))}

      {/* Header */}
      <div className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {groupName}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-400 text-sm">Live Tracking Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300">Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-300">Real-time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300">{locations.length} Members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='relative z-10 max-w-7xl mx-auto px-6 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Map Section */}
          <div className="flex-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/10">
              <div className="h-16 bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-white" />
                  <h2 className="text-white font-semibold text-lg">Family Locations</h2>
                  <div className="flex items-center space-x-2 ml-4">
                    <Signal className="w-4 h-4 text-emerald-300" />
                    <span className="text-emerald-300 text-sm font-medium">Live</span>
                  </div>
                </div>
              </div>
              <div className="h-[70vh] relative">
                <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {locations.map((location, index) => (
                    <Marker key={index} position={[location.latitude, location.longitude]}>
                      <Popup>
                        <div className="p-3 bg-gray-900 text-white rounded-lg border border-emerald-500/20">
                          <div className="font-semibold text-emerald-400 mb-2 text-lg">{location.name}</div>
                          <div className="text-sm text-gray-300 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400">Lat:</span>
                              <span>{location.latitude}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400">Lng:</span>
                              <span>{location.longitude}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-700">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-emerald-400 font-medium">Active Now</span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/10 h-[calc(70vh+5rem)]">
              {/* Chat Header */}
              <div className="h-20 bg-gradient-to-r from-teal-600 to-cyan-600 flex items-center justify-between px-6 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl tracking-wide">{groupName}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-white/90 text-sm font-medium">Group Chat</span>
                      <span className="text-white/60 text-xs">•</span>
                      <span className="text-white/80 text-xs">{chatMessages.length} messages</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm border border-white/20">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                    <span className="text-white/90 text-sm font-medium">Live</span>
                  </div>
                  <button className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20">
                    <MoreVertical className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ height: 'calc(70vh - 9rem)' }}>
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="group hover:bg-white/5 rounded-xl p-4 transition-all duration-200 border border-transparent hover:border-white/10">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white text-sm font-bold">
                          {msg.senderName ? msg.senderName.charAt(0).toUpperCase() : 'A'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-emerald-400">{msg.senderName}</span>
                          <span className="text-xs text-gray-500">{msg.timestamp ? msg.timestamp.toDate().toLocaleString() : 'No time'}</span>
                        </div>
                        <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                          <p className="text-gray-200 leading-relaxed break-words">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-6 border-t border-white/10 bg-black/20 h-24">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                      className="w-full border-2 border-white/20 bg-white/5 backdrop-blur-sm rounded-2xl px-4 py-3 pr-12 resize-none h-16 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 text-white placeholder-gray-400"
                      rows="2"
                    />
                    <div className="absolute right-3 bottom-3 text-xs text-gray-500">
                      {newMessage.length > 0 && `${newMessage.length} chars`}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={sendMessage}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-5 h-5" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;