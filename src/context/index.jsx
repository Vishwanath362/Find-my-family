import { createContext, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../firebase";
import { doc, getDoc, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, and } from 'firebase/firestore';
import 'leaflet/dist/leaflet.css';

const AuthContext = createContext({});

export const AuthContextProvider = ({children})=>{
    const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupName, setGroupName] = useState("null");
  const [chatMessages, setChatMessages] = useState([]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const location = useLocation();
  const navigate = useNavigate();

  const waitForUserDocument = async (userId, maxRetries = 10, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          console.log(`✅ User document found after ${i + 1} attempt(s)`);
          return userSnap;
        }
        
        console.log(`⏳ User document not found, retrying... (${i + 1}/${maxRetries})`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        console.error(`❌ Error checking user document (attempt ${i + 1}):`, error);
        
        // If it's the last retry, throw the error
        if (i === maxRetries - 1) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // If we've exhausted all retries
    throw new Error(`User document not found after ${maxRetries} attempts`);
  };

    useEffect(() => {
    // Mouse tracking for dynamic background
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
   
    let userCurr = auth.currentUser;
    let messageUnsubscribe = null; // Store the message unsubscribe function

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          localStorage.setItem('authtoken', token);
          userCurr = user;
          
          if (!userCurr) {
            setError("You must be logged in.");
            setLoading(false);
            return;
          }
          
          const fetchGroupData = async () => {
            try {
              console.log("🔍 Waiting for user document...");
              const userSnap = await waitForUserDocument(user.uid);
              
            //   if (!userSnap.exists()) {
            //     setError("User data not found.");
            //     setLoading(false);
            //     return;
            //   }

              const userData = userSnap.data();
              console.log("🔍 User data retrieved:", userData);
              
              const groupId = userData.currentGroupId;
              console.log("🔍 Current group ID:", groupId);
              
              if (!groupId) {
                console.log("❌ No group ID found in user data");
                setError('You are not part of any group.');
                setLoading(false);
                return;
              }

              const groupRef = doc(db, 'groups', groupId);
              const groupSnap = await getDoc(groupRef);
              if (!groupSnap.exists()) {
                setError('Join or Create a Group First.');
                setLoading(false);
                return;
              }

              const groupData = groupSnap.data();
              setGroupName(groupData.name || "Unnamed Group");
              console.log("✅ Group data loaded:", groupData);
              

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
              
              // Clean up previous listener if it exists
              if (messageUnsubscribe) {
                messageUnsubscribe();
              }
              
              messageUnsubscribe = onSnapshot(q, (snapshot) => {
                setChatMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
              }, (error) => {
                console.error("Snapshot listener error:", error);
                setError("Permission denied or unable to load messages.");
              });

              setLoading(false);
            } catch (err) {
              console.error('❌ Error fetching group data:', err);
              setError('Failed to load user data. Please try refreshing the page.');
              setLoading(false);
            }
          };
          
          fetchGroupData();
        } catch (err) {
          console.error('❌ Error in auth state change:', err);
          setError('Authentication error occurred.');
          setLoading(false);
        }
      } else {
        console.log('No user is signed in');
        setError("You must be logged in.");
        setLoading(false);
      }
    });

    // Cleanup function
    return () => {
      unsubscribe();
      if (messageUnsubscribe) {
        messageUnsubscribe();
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [location, navigate]);


  return(
    <AuthContext.Provider value={{locations, loading, error, groupName, chatMessages, mousePosition}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = ()=>{
    return useContext(AuthContext);
}