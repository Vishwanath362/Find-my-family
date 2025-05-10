import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';

const ShareLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [groupId, setGroupId] = useState(location.state?.groupId || null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fallback: fetch groupId from user's profile
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
      navigate("/Group");
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
      navigate("/MapView");
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
      // Detect iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      
      if (isIOS) {
        return (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-bold text-yellow-700">iOS Location Permission Help</h3>
            <ol className="text-left text-sm mt-2 space-y-1">
              <li>1. Open your device <strong>Settings</strong></li>
              <li>2. Scroll down and tap <strong>Safari</strong> (or your browser)</li>
              <li>3. Tap <strong>Settings for Websites</strong> &gt; <strong>Location</strong></li>
              <li>4. Find this website and set permission to <strong>Allow</strong></li>
              <li>5. Return to this app and try again</li>
            </ol>
          </div>
        );
      } else {
        return (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-bold text-yellow-700">Location Permission Help</h3>
            <p className="text-sm mt-2">
              Please click the location icon in your browser's address bar and allow access, 
              then try again.
            </p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-white text-center p-6">
      <div className="mb-6 text-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="10" r="3" />
          <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-green-600 mb-2">Share Your Live Location</h2>
      <p className="text-gray-700 max-w-xl mb-6">
        Your location will be visible to group members only.
      </p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-md">
          {error}
        </div>
      )}

      <button
        onClick={handleShare}
        disabled={isLoading || permissionStatus === 'denied'}
        className={`px-6 py-3 rounded-full shadow-lg transition ${
          isLoading || permissionStatus === 'denied' 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {isLoading ? (
          <span>Processing...</span>
        ) : (
          <span>📍 Share My Location</span>
        )}
      </button>
      
      {getPermissionHelp()}
      
      {permissionStatus === 'prompt' && (
        <p className="text-sm text-gray-600 mt-4">
          You'll need to allow location access when prompted.
        </p>
      )}
    </div>
  );
};

export default ShareLocation;