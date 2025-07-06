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
import ViewLocations from './LoggedInUser/ViewLocations'; 
import Group from './LoggedInUser/Group';
import AboutUs from './Components/AboutUs';
function App() {
  return (
    <div className="font-sans"> {/* Apply font-sans (Inter, if added via Tailwind config) */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shareLocation" element={<ShareLocation />} />
          <Route path="/Group" element={<Group />} />
          <Route path="/MapView" element={<MapView />} />
          <Route path="/viewLocations" element={<ViewLocations />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/" element={<><Hero /><Features /><Testimonials /></>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
