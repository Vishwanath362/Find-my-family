import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Shield, Zap, AlertCircle, CheckCircle, Navigation } from 'lucide-react';
const ShareLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [groupId, setGroupId] = useState(location.state?.groupId || null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

    // Check if the browser supports permissions API
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          setPermissionStatus(result.state);

          // Listen for permission changes
          result.onchange = () => {
            setPermissionStatus(result.state);
          };
        })
        .catch(err => {
          console.log("Permissions API not fully supported");
        });
    }
  }, [groupId]);

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

    // Get name in advance to avoid iOS permission issues
    const name = prompt("Please enter your name:");
    if (!name) {
      setError("Name is required to share your location.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // For iOS, it's crucial to use a short timeout
    const geolocationOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    try {
      // Wrap geolocation in a promise for better error handling
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, geolocationOptions);
      });

      const { latitude, longitude } = position.coords;

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

      setIsLoading(false);
      alert("📍 Location shared to your group!");
      window.location.href = ("/MapView");
    } catch (error) {
      setIsLoading(false);
      console.error("Error sharing location:", error);

      // Handle specific iOS and other errors
      if (error.code === 1) { // PERMISSION_DENIED
        setError("Location permission denied. Please enable location access in your device settings for this website.");
      } else if (error.code === 2) { // POSITION_UNAVAILABLE
        setError("Location information is unavailable. Please check your device's location services.");
      } else if (error.code === 3) { // TIMEOUT
        setError("Location request timed out. Please try again with better signal.");
      } else {
        setError("Error occurred while sharing location. Please try again.");
      }
    }
  };

  const getPermissionHelp = () => {
    if (permissionStatus === 'denied') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      return (
        <div className="mt-6 p-6 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-yellow-300 mb-2">
                {isIOS ? 'iOS Location Permission Help' : 'Location Permission Help'}
              </h3>
              {isIOS ? (
                <ol className="text-sm text-yellow-200 space-y-1">
                  <li>1. Open your device <strong>Settings</strong></li>
                  <li>2. Scroll down and tap <strong>Safari</strong> (or your browser)</li>
                  <li>3. Tap <strong>Settings for Websites</strong> &gt; <strong>Location</strong></li>
                  <li>4. Find this website and set permission to <strong>Allow</strong></li>
                  <li>5. Return to this app and try again</li>
                </ol>
              ) : (
                <p className="text-sm text-yellow-200">
                  Please click the location icon in your browser's address bar and allow access, then try again.
                </p>
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
                <p className="text-red-300 text-sm text-left">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-xl flex items-center justify-center space-x-3">
                <CheckCircle className="text-emerald-400" size={20} />
                <p className="text-emerald-300 text-sm">Taking you to family map...</p>
              </div>
            )}

            {/* Action Button */}
            <div className="mb-8">
              <button
                onClick={handleShare}
                disabled={isLoading || permissionStatus === 'denied' || success}
                className={`group w-full max-w-sm px-8 py-4 font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg ${isLoading || permissionStatus === 'denied' || success
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black hover:shadow-emerald-500/25'
                  }`}
              >
                {isLoading ? (
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
                    <span>Share My Location</span>
                  </div>
                )}
              </button>
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