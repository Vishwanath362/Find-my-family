import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import {
  CheckCircle,
  AlertCircle,
  X,
  Users,
  Lock,
  LogIn,
  PlusCircle,
} from 'lucide-react';

const GroupPage = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [groupName, setGroupName] = useState('');
  const [groupPassword, setGroupPassword] = useState('');
  const [joinGroupName, setJoinGroupName] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect if user not logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login');
      }
    });
    return unsubscribe; // cleanup listener
  }, [navigate]);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleCreateGroup = async () => {
    const trimmedName = groupName.trim();
    const trimmedPassword = groupPassword.trim();

    if (!trimmedName || !trimmedPassword) {
      showMessage('Please provide both group name and password.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      // Check if group exists
      const groupQuery = query(
        collection(db, 'groups'),
        where('name', '==', trimmedName)
      );
      const snapshot = await getDocs(groupQuery);

      if (!snapshot.empty) {
        showMessage('Group name already exists. Try a different one.', 'error');
        setIsLoading(false);
        return;
      }

      // Create group doc
      const docRef = await addDoc(collection(db, 'groups'), {
        name: trimmedName,
        password: trimmedPassword, // WARNING: Plain text storage is insecure for production!
        createdBy: auth.currentUser.email,
        members: [auth.currentUser.email],
        createdAt: serverTimestamp(),
      });

      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, { currentGroupId: docRef.id });
      } else {
        await setDoc(userRef, { currentGroupId: docRef.id });
      }

      showMessage(`Group "${trimmedName}" created successfully!`, 'success');
      setGroupName('');
      setGroupPassword('');
      setTimeout(() => {
        navigate('/shareLocation');
      }, 1000);
    } catch (error) {
      console.error('Error creating group:', error);
      showMessage('Failed to create group. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    const trimmedName = joinGroupName.trim();
    const trimmedPass = joinPassword.trim();

    if (!trimmedName || !trimmedPass) {
      showMessage('Please provide both group name and password to join.', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const groupQuery = query(
        collection(db, 'groups'),
        where('name', '==', trimmedName),
        where('password', '==', trimmedPass)
      );
      const snapshot = await getDocs(groupQuery);

      if (snapshot.empty) {
        showMessage('Group not found or incorrect password.', 'error');
        setIsLoading(false);
        return;
      }

      const groupDoc = snapshot.docs[0];
      const groupData = groupDoc.data();

      if (!groupData.members.includes(auth.currentUser.email)) {
        await updateDoc(groupDoc.ref, {
          members: [...groupData.members, auth.currentUser.email],
        });
      }

      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, { currentGroupId: groupDoc.id });
      } else {
        await setDoc(userRef, { currentGroupId: groupDoc.id });
      }

      showMessage(`Successfully joined group "${trimmedName}"!`, 'success');
      setJoinGroupName('');
      setJoinPassword('');
      setTimeout(() => {
        navigate('/shareLocation');
      }, 1000);
    } catch (error) {
      console.error('Error joining group:', error);
      showMessage('Failed to join group. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'info':
        return <AlertCircle className="text-blue-500" size={20} />;
      default:
        return null;
    }
  };

  const getMessageColor = () => {
    switch (messageType) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-600 mb-4">GroupConnect</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create or join private groups to share locations with your team.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          {/* Tabs */}
          <div className="flex border-b">
            {['create', 'join'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-4 px-6 font-medium text-lg text-center ${
                  activeTab === tab
                    ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
                    : 'text-gray-500 hover:text-green-500 hover:bg-green-50'
                }`}
                onClick={() => setActiveTab(tab)}
                disabled={isLoading}
              >
                <div className="flex items-center justify-center">
                  {tab === 'create' ? (
                    <PlusCircle className="mr-2" size={20} />
                  ) : (
                    <LogIn className="mr-2" size={20} />
                  )}
                  {tab === 'create' ? 'Create Group' : 'Join Group'}
                </div>
              </button>
            ))}
          </div>

          {/* Create Form */}
          {activeTab === 'create' && (
            <div className="p-8 space-y-6">
              <div>
                <label htmlFor="create-group-name" className="block text-gray-700 font-medium mb-2">
                  Group Name
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="create-group-name"
                    type="text"
                    placeholder="Unique group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="create-group-password" className="block text-gray-700 font-medium mb-2">
                  Group Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="create-group-password"
                    type="password"
                    placeholder="Set a password"
                    value={groupPassword}
                    onChange={(e) => setGroupPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <button
                onClick={handleCreateGroup}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5 mr-2"></span>
                ) : (
                  <PlusCircle className="mr-2" size={20} />
                )}
                Create Group
              </button>
            </div>
          )}

          {/* Join Form */}
          {activeTab === 'join' && (
            <div className="p-8 space-y-6">
              <div>
                <label htmlFor="join-group-name" className="block text-gray-700 font-medium mb-2">
                  Group Name
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="join-group-name"
                    type="text"
                    placeholder="Group name"
                    value={joinGroupName}
                    onChange={(e) => setJoinGroupName(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="join-group-password" className="block text-gray-700 font-medium mb-2">
                  Group Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    id="join-group-password"
                    type="password"
                    placeholder="Password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <button
                onClick={handleJoinGroup}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5 mr-2"></span>
                ) : (
                  <LogIn className="mr-2" size={20} />
                )}
                Join Group
              </button>
            </div>
          )}
        </div>

        {message && (
          <div
            className={`mb-6 border-l-4 p-4 flex items-center space-x-3 ${getMessageColor()}`}
            role="alert"
          >
            {getMessageIcon()}
            <p className="text-sm font-semibold">{message}</p>
            <button
              onClick={() => setMessage('')}
              aria-label="Close alert"
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
