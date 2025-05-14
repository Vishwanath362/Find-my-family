import { Users, MapPin, CheckSquare, AlertTriangle, Heart } from 'lucide-react';


export default function AboutUs() {
  return (
    
    <div className="bg-gradient-to-b from-emerald-50 to-white px-4 py-12 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-6">About Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building a simpler way for families and friends to stay connected in the real world.
          </p>
        </div>
        
        {/* Content Sections */}
        <div className="grid gap-12">
          {/* Our Story Section */}
          <section id="story" className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-2 bg-emerald-600 text-white p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-emerald-500 rounded-full p-4 inline-flex mb-4">
                    <Users size={32} />
                  </div>
                  <h2 className="text-2xl font-bold">Our Story</h2>
                </div>
              </div>
              <div className="md:col-span-3 p-8">
                <p className="text-gray-700 mb-4">
                   MyFamilyApp was born from a simple, real-life frustration.
                </p>
                <p className="text-gray-700 mb-4">
                  As a university student, I often faced confusion when my father came to pick me up after college—network issues delayed calls, and timing mismatches led to unnecessary stress.
                </p>
                <p className="text-gray-700">
                  I realized I wasn't alone. That's when I decided to build a solution—not just for me, but for families and friends everywhere.
                </p>
              </div>
            </div>
          </section>

          {/* What We Do Section */}
          <section id="what-we-do" className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-3 p-8 order-2 md:order-1">
                <h3 className="text-2xl font-bold text-emerald-600 mb-6">What We Do</h3>
                <p className="text-gray-700 mb-6"> MyFamilyApp helps you:</p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="mr-3 text-emerald-500 mt-1"><CheckSquare size={18} /></span>
                    <span>Create groups of family or friends.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-emerald-500 mt-1"><CheckSquare size={18} /></span>
                    <span>See real-time locations of group members.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-emerald-500 mt-1"><CheckSquare size={18} /></span>
                    <span>Assign tasks like "Pick up sister" or "Bring groceries."</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-emerald-500 mt-1"><CheckSquare size={18} /></span>
                    <span>Send SOS alerts in emergencies.</span>
                  </li>
                </ul>
                <p className="mt-6 text-gray-700">All in one simple, privacy-respecting app.</p>
              </div>
              <div className="md:col-span-2 bg-emerald-500 text-white p-8 flex items-center justify-center order-1 md:order-2">
                <div className="text-center">
                  <div className="bg-emerald-400 rounded-full p-4 inline-flex mb-4">
                    <CheckSquare size={32} />
                  </div>
                  <h2 className="text-2xl font-bold">Features</h2>
                </div>
              </div>
            </div>
          </section>

          {/* Why It Matters Section */}
          <section id="why-it-matters" className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-2 bg-emerald-600 text-white p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-emerald-500 rounded-full p-4 inline-flex mb-4">
                    <Heart size={32} />
                  </div>
                  <h2 className="text-2xl font-bold">Why It Matters</h2>
                </div>
              </div>
              <div className="md:col-span-3 p-8">
                <p className="text-gray-700 mb-4">Big apps are built for everyone.</p>
                <p className="text-gray-700 mb-4">We built  MyFamilyApp for real relationships—not control.</p>
                <p className="text-gray-700 mb-4">No forced parental monitoring. No complicated setup.</p>
                <p className="text-gray-700">Just simple, one-click location sharing with the people who matter.</p>
              </div>
            </div>
          </section>

          {/* Our Mission Section */}
          <section id="mission" className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-3 p-8 order-2 md:order-1">
                <h3 className="text-2xl font-bold text-emerald-600 mb-6">Our Mission</h3>
                <p className="text-gray-700">
                  To bring peace of mind, connection, and clarity to people in everyday life—whether you're finding a friend in the canteen, coordinating with family, or making sure your loved ones are safe.
                </p>
                <div className="mt-8 flex justify-center">
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-lg transition">
                    Join Our Journey
                  </button>
                </div>
              </div>
              <div className="md:col-span-2 bg-emerald-600 text-white p-8 flex items-center justify-center order-1 md:order-2">
                <div className="text-center">
                  <div className="bg-emerald-500 rounded-full p-4 inline-flex mb-4">
                    <MapPin size={32} />
                  </div>
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* FAQ Section */}
        <section className="mt-16 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full mr-3">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="font-bold text-lg text-emerald-600">Is my location data secure?</h3>
              </div>
              <p className="text-gray-700">
                Absolutely. We use end-to-end encryption and only share your location with the people you explicitly choose to share with.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full mr-3">
                  <Users size={20} />
                </div>
                <h3 className="font-bold text-lg text-emerald-600">Can I control when I share my location?</h3>
              </div>
              <p className="text-gray-700">
                Yes! You can turn location sharing on or off anytime, and set it to automatically turn off after specific periods.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full mr-3">
                  <MapPin size={20} />
                </div>
                <h3 className="font-bold text-lg text-emerald-600">How is  MyFamilyApp different from other location apps?</h3>
              </div>
              <p className="text-gray-700">
                We focus on simple, respectful sharing between trusted connections rather than constant tracking. Our task assignment feature also makes coordination easier.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center mb-16 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to stay connected?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Download  MyFamilyApp today and make everyday coordination with your loved ones seamless and stress-free.
          </p>
          <div className="flex flex-col md:flex-row justify-center md:space-x-4 space-y-4 md:space-y-0">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-3 rounded-lg transition flex items-center justify-center">
              Download Now
            </button>
            <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium px-8 py-3 rounded-lg transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}