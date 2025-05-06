import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import Features from './Components/Features';
import Footer from './Components/Footer';
import Testimonials from './Components/Testimonials';
import Login from './Authentication/Login';
import Signup from './Authentication/Signup';
import ShareLocation from './LoggedInUser/ShareLocation';
import MapView from './LoggedInUser/MapView';
import ViewLocations from './LoggedInUser/ViewLocations';  // Import the new component
import Group from './LoggedInUser/Group';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shareLocation" element={<ShareLocation />} />
        <Route path="/Group" element={<Group />} />
        <Route path="/MapView" element={<MapView />} />
        <Route path="/viewLocations" element={<ViewLocations />} /> {/* Add this route */}
        <Route path="/" element={<><Hero /><Features /><Testimonials /></>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
