import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Shield, Zap, AlertCircle, CheckCircle, Navigation } from 'lucide-react';
import { useAuthContext } from '../context';

const ShareLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [groupId, setGroupId] = useState(location.state?.groupId || null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [watchId, setWatchId] = useState(null);
  const [realtimeStatus, setRealtimeStatus] = useState(null);

  const {isRealtime,handleRealTimeLocationStatus} = useAuthContext();
  useEffect(() => {
    // Fallback: fetch groupId from user's profile
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const fetchGroupId = async () => {
      if (!groupId && auth.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.currentGroupId) {
              setGroupId(data.currentGroupId);
            }
          }
        } catch (err) {
          console.error("Error fetching group ID:", err);
          setError("Failed to fetch your group information. Please try again.");
        }
      }
    };

    fetchGroupId();
    setPermissionStatus('prompt'); // Default to prompt state
    setError(null); // Clear any stale errors when page loads
  }, [groupId]);

    // Cleanup watcher on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        window.__realtimeWatchId = null;
        console.log("🛑 Real-time location tracking stopped (unmount)");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time location sharing
  const handleRealtimeToggle = async () => {
    if (isRealtime) {
      // Stop watching
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
        window.__realtimeWatchId = null;
        console.log("⏸️ Real-time location tracking stopped");
      }
      handleRealTimeLocationStatus(false);
      setRealtimeStatus(null);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to share your location.");
      return;
    }

    if (!groupId) {
      setError("Group ID not found. Please try again from the group join page.");
      window.location.href = "/Group";
      return;
    }

    const name = user.displayName || user.email?.split('@')[0];
    if (!name) {
      setError("Please update your profile name in settings.");
      return;
    }
    console.log("📝 Using display name:", name);

    setIsLoading(true);
    setError(null);

    // Verify user is in the group
    try {
      const groupRef = doc(db, "groups", groupId);
      const groupSnap = await getDoc(groupRef);
      
      if (!groupSnap.exists()) {
        throw new Error("Group not found");
      }

      const groupData = groupSnap.data();
      console.log("🔍 Group members array:", groupData.members);
      console.log("🔍 Current user email:", user.email);
      
      const userEmail = user.email?.toLowerCase().trim();
      const isMember = groupData.members?.some(email => 
        email.toLowerCase().trim() === userEmail
      );
      
      if (!isMember) {
        setIsLoading(false);
        console.warn("❌ User not in members array. Members:", groupData.members);
        setError(`Email (${user.email}) not found in group members. Try leaving and rejoining the group.`);
        return;
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Verification error:", err);
      setError(`Failed to verify group membership: ${err.message}`);
      return;
    }

    const geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 45000,
      maximumAge: 30000
    };

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const groupRef = doc(db, "groups", groupId);
          // Check if location already exists and update, or add new
          const groupSnap = await getDoc(groupRef);
          const groupData = groupSnap.data();
          const existingLocIndex = groupData.locations?.findIndex(loc => loc.email === user.email && loc.name === name) ?? -1;
          
          if (existingLocIndex >= 0) {
            // Update existing location - replace the entire locations array
            const updatedLocations = [...groupData.locations];
            updatedLocations[existingLocIndex] = {
              name,
              email: user.email,
              latitude,
              longitude,
              timestamp: new Date().toISOString(),
            };
            await updateDoc(groupRef, { locations: updatedLocations });
          } else {
            // Add new location
            await updateDoc(groupRef, {
              locations: arrayUnion({
                name,
                email: user.email,
                latitude,
                longitude,
                timestamp: new Date().toISOString(),
              }),
            });
          }
          
          setRealtimeStatus(`📍 Location updated: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          setIsLoading(false);
          handleRealTimeLocationStatus(true);
        } catch (err) {
          console.error("❌ Error updating location:", err);
          setRealtimeStatus(`⚠️ Update failed: ${err.message}`);
        }
      },
      (err) => {
        setIsLoading(false);
        if (err.code === 1) {
          setPermissionStatus('denied');
          setError("Location permission denied.");
          handleRealTimeLocationStatus(false);
        } else if (err.code === 2) {
          setError("Location unavailable. Check your device's location services.");
        } else if (err.code === 3) {
          setError("📍 Location request timed out. Move to an open area with better GPS signal and try again.");
        } else {
          setError(`Error: ${err.message}`);
        }
      },
      geolocationOptions
    );

    setWatchId(id);
    handleRealTimeLocationStatus(true);
    setIsLoading(false);
    
    // Store watchId globally so it can be stopped from MapView
    window.__realtimeWatchId = id;
    
    console.log("🚀 Real-time location tracking started");
    
    setTimeout(() => {
      navigate('/MapView');
    }, 1500);
  };

  const handleShare = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to share your location.");
      return;
    }

    if (!groupId) {
      setError("Group ID not found. Please try again from the group join page.");
      window.location.href = "/Group";
      return;
    }

    // Use display name from user profile
    const name = user.displayName || user.email?.split('@')[0];
    if (!name) {
      setError("Please update your profile name in settings.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPermissionStatus('prompt');

    // Log authentication info for debugging
    console.log("👤 Current user:", user.email);
    console.log("👥 Group ID:", groupId);

    // Verify user is in the group before attempting to share
    try {
      const groupRef = doc(db, "groups", groupId);
      const groupSnap = await getDoc(groupRef);
      
      if (!groupSnap.exists()) {
        throw new Error("Group not found");
      }

      const groupData = groupSnap.data();
      console.log("📋 Group members:", groupData.members);

      const userEmail = user.email?.toLowerCase().trim();
      const isMember = groupData.members?.some(email => 
        email.toLowerCase().trim() === userEmail
      );

      if (!isMember) {
        setIsLoading(false);
        console.warn("❌ User not in members: ", groupData.members);
        setError(`Your email (${user.email}) is not a member of this group. Please rejoin the group first.`);
        return;
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Error verifying group membership:", err);
      setError(`Failed to verify group membership: ${err.message}`);
      return;
    }

    // Increased timeout for better GPS acquisition
    const geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 45000,
      maximumAge: 30000
    };

    try {
      // Wrap geolocation in a promise for better error handling
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, geolocationOptions);
      });

      console.log("✅ Location obtained:", position.coords);
      const { latitude, longitude } = position.coords;

      console.log("📤 Updating Firestore with location...");
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
        locations: arrayUnion({
          name,
          email: user.email,
          latitude,
          longitude,
          timestamp: new Date().toISOString(),
        }),
      });

      console.log("✅ Location successfully shared!");
      setIsLoading(false);
      setPermissionStatus('granted');
      alert("📍 Location shared to your group!");
      window.location.href = ("/MapView");
    } catch (error) {
      setIsLoading(false);
      console.error("❌ Full error object:", error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error code:", error.code);

      // Handle geolocation-specific errors
      if (error.code === 1) { // PERMISSION_DENIED
        setPermissionStatus('denied');
        setError("Location permission denied. Please enable location access in your device settings for this website.");
      } else if (error.code === 2) { // POSITION_UNAVAILABLE
        setError("Location information is unavailable. Please check your device's location services.");
      } else if (error.code === 3) { // TIMEOUT
        setError("📍 Location request timed out. This usually means GPS signal is weak.\nSuggestions:\n• Move to an open area (away from buildings)\n• Check that location services are enabled\n• Wait a moment and try again");
      } else if (error.code) {
        // Other geolocation error
        setError(`Geolocation error (${error.code}): ${error.message}`);
      } else if (error.message?.includes("Permission denied")) {
        setError("Firebase error: You don't have permission to update this group. Make sure you're a member of the group.");
      } else if (error.message?.includes("not found")) {
        setError("Group not found. Please rejoin the group and try again.");
      } else if (error.message?.includes("network")) {
        setError("Network error: Please check your internet connection and try again.");
      } else {
        // Generic error
        setError(`Error: ${error.message || "Unable to share location. Please try again."}`);
      }
    }
  };

  const getPermissionHelp = () => {
    if (permissionStatus === 'denied') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      const isFirefox = /Firefox/.test(navigator.userAgent);

      return (
        <div className="mt-6 p-6 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-yellow-300 mb-3">
                📍 How to Enable Location Access
              </h3>
              {isIOS ? (
                <ol className="text-sm text-yellow-200 space-y-2">
                  <li><strong>Option 1 - Through Settings:</strong></li>
                  <li className="ml-4">1. Go to Settings → Safari (or your browser)</li>
                  <li className="ml-4">2. Scroll to "Settings for Websites" → Location</li>
                  <li className="ml-4">3. Find this website and select "Allow"</li>
                  <li className="ml-4">4. Return and try again</li>
                  <li className="mt-2"><strong>Option 2 - Quick Access:</strong></li>
                  <li className="ml-4">1. Reload this page</li>
                  <li className="ml-4">2. When prompted, tap "Allow" immediately</li>
                </ol>
              ) : isChrome ? (
                <ol className="text-sm text-yellow-200 space-y-2">
                  <li><strong>Chrome:</strong></li>
                  <li className="ml-4">1. Click the lock icon 🔒 left of the URL</li>
                  <li className="ml-4">2. Find "Location" and change to "Allow"</li>
                  <li className="ml-4">3. Click "Reset" if it was previously blocked</li>
                  <li className="ml-4">4. Refresh the page and try again</li>
                </ol>
              ) : isFirefox ? (
                <ol className="text-sm text-yellow-200 space-y-2">
                  <li><strong>Firefox:</strong></li>
                  <li className="ml-4">1. Click the lock icon 🔒 left of the URL</li>
                  <li className="ml-4">2. Click the arrow next to Permissions</li>
                  <li className="ml-4">3. Find Location and set to "Allow"</li>
                  <li className="ml-4">4. Refresh and try again</li>
                </ol>
              ) : (
                <ol className="text-sm text-yellow-200 space-y-2">
                  <li>1. Click the lock 🔒 or info icon in your address bar</li>
                  <li>2. Find "Location" or "Permissions" settings</li>
                  <li>3. Change location permission from "Block" to "Allow"</li>
                  <li>4. Close settings and refresh the page</li>
                  <li className="mt-2"><strong>Also check:</strong></li>
                  <li className="ml-4">• Device location services are enabled</li>
                  <li className="ml-4">• Browser has location permission in OS settings</li>
                </ol>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
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

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-20">
        <div className="max-w-2xl w-full space-y-8">
          {/* Status Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-medium">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Location Sharing Ready</span>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 lg:p-12 text-center shadow-2xl">
            {/* Icon */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full animate-pulse"></div>
                {success ? (
                  <CheckCircle size={64} className="text-emerald-400 relative z-10" />
                ) : (
                  <MapPin size={64} className="text-emerald-400 relative z-10" />
                )}

                {/* Floating indicators */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full flex items-center justify-center animate-pulse">
                  <Shield size={12} className="text-emerald-400" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
                  <Zap size={12} className="text-blue-400" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-4 mb-8">
              <h1 className="text-4xl lg:text-5xl font-light text-white tracking-tight">
                {success ? (
                  <>
                    Location
                    <span className="block font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      Shared!
                    </span>
                  </>
                ) : (
                  <>
                    Share Your
                    <span className="block font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      Location
                    </span>
                  </>
                )}
              </h1>
              <p className="text-lg text-gray-400 font-light leading-relaxed">
                {success
                  ? "Your location has been shared with your group members securely"
                  : "Your location will be visible to group members only and kept completely secure"
                }
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl flex items-start space-x-3">
                <AlertCircle className="text-red-400 mt-1 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-red-300 text-sm text-left">{error}</p>
                  <p className="text-red-400 text-xs mt-2 flex items-center space-x-1">
                    <span>💡 Tip: Press F12 or Ctrl+Shift+I to open Developer Console for detailed error info</span>
                  </p>
                  {error && (
                    <button
                      onClick={() => setError(null)}
                      className="mt-2 px-3 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded transition-colors"
                    >
                      Clear Error & Retry
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-xl flex items-center justify-center space-x-3">
                <CheckCircle className="text-emerald-400" size={20} />
                <p className="text-emerald-300 text-sm">Taking you to family map...</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mb-8 flex flex-col gap-4">
              <button
                onClick={handleShare}
                disabled={isLoading || success || isRealtime}
                className={`group w-full max-w-sm px-8 py-4 font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg mx-auto ${isLoading || success || isRealtime
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black hover:shadow-emerald-500/25'
                  }`}
              >
                {isLoading && !isRealtime ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : success ? (
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle size={20} />
                    <span>Location Shared</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Navigation size={20} />
                    <span>Share My Location (Once)</span>
                  </div>
                )}
              </button>

              <button
                onClick={handleRealtimeToggle}
                disabled={isLoading}
                className={`group w-full max-w-sm px-8 py-4 font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg mx-auto ${
                  isLoading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-400 text-white hover:shadow-blue-500/25'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Zap size={20} />
                  <span>Start Real-Time Sharing 🚀</span>
                </div>
              </button>

              {realtimeStatus && (
                <div className="text-center space-y-3">
                  <div className="text-sm text-blue-300 animate-pulse font-semibold">
                    🚀 Real-Time Sharing Active
                  </div>
                  <div className="text-xs text-blue-200">
                    {realtimeStatus}
                  </div>
                  <p className="text-xs text-gray-400">Redirecting to map...</p>
                </div>
              )}
            </div>

            {/* Permission Help */}
            {getPermissionHelp()}

            {/* Permission Status */}
            {permissionStatus === 'prompt' && !error && (
              <p className="text-sm text-gray-400 mt-4">
                You'll need to allow location access when prompted by your browser
              </p>
            )}

            {/* Security Features */}
            <div className="flex justify-center space-x-8 pt-6 border-t border-white/10 mt-8">
              {[
                { icon: Shield, label: 'Encrypted' },
                { icon: Zap, label: 'Real-time' },
                { icon: MapPin, label: 'Precise' }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
                  <feature.icon size={18} className="text-white" />
                  <span className="text-xs text-white font-medium">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ShareLocation;