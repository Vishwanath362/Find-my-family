import React, { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('authToken', token);
      navigate('/group');  // make sure your route is lowercase `/group`
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Invalid email or password');
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      navigate('/group');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrorMessage(error.message || 'Google sign-in failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-green-500 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg font-semibold text-white ${
              isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            } transition duration-200`}
          >
            {isLoading ? (
              <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5 mx-auto"></span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={`w-full py-2 mt-3 rounded-lg font-semibold text-white ${
            isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
          } transition duration-200`}
        >
          {isLoading ? (
            <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5 mx-auto"></span>
          ) : (
            'Continue with Google'
          )}
        </button>

        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
