import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const extractUsernameSingleLine = (email) => email.includes('@') ? email.substring(0, email.indexOf('@')) : email;

  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      setMobileMenuOpen(false);
    } catch (error) {
      console.log('Error during sign out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-green-100 shadow-lg ">
      <nav className="container mx-auto px-4 py-4">
        {/* Top bar with logo and burger menu */}
        <div className="flex justify-between items-center">
          <Link to="/">
            <h3 className="text-2xl font-bold text-green-500">
              My Family App
            </h3>
          </Link>

          {/* Mobile menu button */}
          <button
            className="block sm:hidden text-gray-800 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-8">
            <ul className="flex space-x-8 text-blue-900 font-semibold text-lg">
              <li className="cursor-pointer">
                {user ? (
                  <Link to="/MapView" className="hover:text-green-500">
                    Family
                  </Link>
                ) : (
                  <span onClick={() => navigate("/login")} className="hover:text-green-500">
                    Family
                  </span>
                )}
              </li>
              <li className="cursor-pointer hover:text-green-500">Friends</li>
              <li className="cursor-pointer">
                <Link to="/AboutUs" className="hover:text-green-500">
                  About Us
                </Link>
              </li>

            </ul>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="font-semibold">{user.displayName || (user.email && extractUsernameSingleLine(user.email))}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login">
                  <button className="bg-green-500 hover:bg-green-600 text-black font-bold px-4 py-2 rounded-full">
                    Login/Signup
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pb-2 border-t border-gray-300">
            <ul className="pt-4 space-y-4 text-blue-900 font-semibold text-lg">
              <li className="cursor-pointer">
                {user ? (
                  <Link to="/MapView" className="block hover:text-green-500" onClick={() => setMobileMenuOpen(false)}>
                    Family
                  </Link>
                ) : (
                  <span
                    className="block hover:text-green-500"
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Family
                  </span>
                )}
              </li>
              <li className="cursor-pointer">
                <span className="block hover:text-green-500" onClick={() => setMobileMenuOpen(false)}>
                  Friends
                </span>
              </li>
              <li className="cursor-pointer">
                <Link to="/AboutUs">
                  <span className="block hover:text-green-500" onClick={() => setMobileMenuOpen(false)}>
                    About Us
                  </span>
                </Link>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-gray-300">
              {user ? (
                <div className="space-y-3">
                  <div className="font-semibold">{user.displayName || (user.email && extractUsernameSingleLine(user.email))}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-black font-bold px-4 py-2 rounded-full">
                    Login/Signup
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;