import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('authToken', user.accessToken);
      navigate('/');
    } catch (error) {
      setErrorMessage('Something went wrong');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      navigate('/');
    } catch (error) {
      setErrorMessage(error.message || 'Google sign-up failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-green-500 mb-6">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Google Sign Up Button */}
        <button
          onClick={handleGoogleSignup}
          type="button"
          className="w-full py-2 mt-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-200"
        >
          Continue with Google
        </button>

        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to= "/login">
            <button href="/login" className="text-green-500 hover:underline">
              Login
            </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
