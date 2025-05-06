import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';

const ShareLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [groupId, setGroupId] = useState(location.state?.groupId || null);

  useEffect(() => {
    // Fallback: fetch groupId from user's profile
    const fetchGroupId = async () => {
      if (!groupId && auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.currentGroupId) {
            setGroupId(data.currentGroupId);
          }
        }
      }
    };

    fetchGroupId();
  }, [groupId]);

  const handleShare = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to share your location.");
      return;
    }

    if (!groupId) {
      alert("Group ID not found. Please try again from the group join page.");
      navigate("/Group");
      return;
    }

    const name = prompt("Please enter your name:");
    if (!name) {
      alert("Name is required to share your location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
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

          alert("📍 Location shared to your group!");
          navigate("/MapView");
        } catch (error) {
          console.error("Error sharing location:", error);
          alert("❌ Error occurred while sharing location.");
        }
      },
      () => {
        alert("❌ Permission denied or unable to fetch location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ...rest of your JSX remains the same


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-white text-center p-6">
      <img
        src="https://img.icons8.com/fluency/96/000000/worldwide-location.png"
        alt="location-icon"
        className="mb-6"
      />
      <h2 className="text-3xl font-bold text-green-600 mb-2">Share Your Live Location</h2>
      <p className="text-gray-700 max-w-xl mb-6">
        Your location will be visible to group members only.
      </p>
      <button
        onClick={handleShare}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg transition"
      >
        📍 Share My Location
      </button>
    </div>
  );
};

export default ShareLocation;
