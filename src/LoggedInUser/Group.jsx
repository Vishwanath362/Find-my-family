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
  Shield,
  Zap,
  ArrowRight
} from 'react-feather';

const GroupPage = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [groupName, setGroupName] = useState('');
  const [groupPassword, setGroupPassword] = useState('');
  const [joinGroupName, setJoinGroupName] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  // const window.location.href = usewindow.location.href()
  const navigate = useNavigate();
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      const groupQuery = query(collection(db, 'groups'), where('name', '==', trimmedName));
      const snapshot = await getDocs(groupQuery);

      if (!snapshot.empty) {
        showMessage('Group name already exists. Try a different one.', 'error');
        setIsLoading(false);
        return;
      }


      const hashedPassword = trimmedPassword; 

      // Create group doc
      const docRef = await addDoc(collection(db, 'groups'), {
        name: trimmedName,
        password: hashedPassword,
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
      // Find group by name only (password is hashed)
      const groupQuery = query(
        collection(db, 'groups'),
        where('name', '==', trimmedName)
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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12 space-y-6">
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-medium">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Secure Group Access</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-light text-white tracking-tight">
                Group
                <span className="block font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Connect
                </span>
              </h1>
              <p className="text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto">
                Create or join private groups to share locations with your team
              </p>
            </div>
          </div>

          {/* Main Card */}
          <div className="relative">
            {/* Floating Security Cards */}
            <div className="absolute -top-6 -right-6 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 animate-pulse">
              <Shield size={24} className="text-emerald-400" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 animate-pulse" style={{ animationDelay: '1s' }}>
              <Zap size={24} className="text-blue-400" />
            </div>

            <div className="bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-white/10">
                {['create', 'join'].map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 py-6 px-8 font-medium text-lg text-center transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500'
                        : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/5'
                    }`}
                    onClick={() => setActiveTab(tab)}
                    disabled={isLoading}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      {tab === 'create' ? (
                        <PlusCircle size={20} />
                      ) : (
                        <LogIn size={20} />
                      )}
                      <span>{tab === 'create' ? 'Create Group' : 'Join Group'}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Create Form */}
              {activeTab === 'create' && (
                <div className="p-8 space-y-8">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="create-group-name" className="block text-white font-medium mb-3 text-lg">
                        Group Name
                      </label>
                      <div className="relative group">
                        <Users className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-400 transition-colors" size={20} />
                        <input
                          id="create-group-name"
                          type="text"
                          placeholder="Enter unique group name"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="create-group-password" className="block text-white font-medium mb-3 text-lg">
                        Group Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-400 transition-colors" size={20} />
                        <input
                          id="create-group-password"
                          type="password"
                          placeholder="Set a secure password"
                          value={groupPassword}
                          onChange={(e) => setGroupPassword(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateGroup}
                    disabled={isLoading}
                    className="group w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin border-2 border-black border-t-transparent rounded-full h-5 w-5 mr-3"></div>
                        Creating Group...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-3" size={20} />
                        Create Group
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Join Form */}
              {activeTab === 'join' && (
                <div className="p-8 space-y-8">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="join-group-name" className="block text-white font-medium mb-3 text-lg">
                        Group Name
                      </label>
                      <div className="relative group">
                        <Users className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-400 transition-colors" size={20} />
                        <input
                          id="join-group-name"
                          type="text"
                          placeholder="Enter group name"
                          value={joinGroupName}
                          onChange={(e) => setJoinGroupName(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="join-group-password" className="block text-white font-medium mb-3 text-lg">
                        Group Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-400 transition-colors" size={20} />
                        <input
                          id="join-group-password"
                          type="password"
                          placeholder="Enter password"
                          value={joinPassword}
                          onChange={(e) => setJoinPassword(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleJoinGroup}
                    disabled={isLoading}
                    className="group w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin border-2 border-black border-t-transparent rounded-full h-5 w-5 mr-3"></div>
                        Joining Group...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-3" size={20} />
                        Join Group
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <div className="mt-8">
              <div
                className={`border rounded-xl p-4 flex items-center space-x-3 backdrop-blur-sm ${getMessageColor()}`}
                role="alert"
              >
                {getMessageIcon()}
                <p className="font-medium flex-1">{message}</p>
                <button
                  onClick={() => setMessage('')}
                  aria-label="Close alert"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Features */}
          <div className="mt-16 flex justify-center space-x-12 text-center">
            {[
              { icon: Shield, label: 'End-to-End Encrypted' },
              { icon: Users, label: 'Private Groups' },
              { icon: Zap, label: 'Instant Access' }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
                <feature.icon size={24} className="text-emerald-400" />
                <span className="text-sm text-white font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
