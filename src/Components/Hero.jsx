import React, { useState, useEffect } from 'react';
import heroImage from '../assets/hero1.jpg';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
const Hero = () => {

    const [user, setUser] = useState(null); // Track the user state

    useEffect(() => {
        // Listen for changes in the authentication state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user); // Set the user state when auth state changes
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);

    return (
        <div
            className="relative h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${heroImage})` }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-4 space-y-6">
                <h1 className="text-5xl font-extrabold text-white text-center max-w-3xl mx-auto drop-shadow-md">
                    No Need to Worry Where Your Loved Ones Are...
                </h1>
                <p className="text-lg text-white text-center max-w-xl mx-auto mt-4 drop-shadow-sm">
                    Our advanced tracking and alert system ensures you're always connected. Whether it's your family, friends, or loved ones, peace of mind is just a tap away.
                </p>

                {user ? (
                    
                    <div>
                        <Link to="/MapView">
                            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
                                Track Your Family
                            </button>
                        </Link>
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
                            Track Your Family
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Hero;
