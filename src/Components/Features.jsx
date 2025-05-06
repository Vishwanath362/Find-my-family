import React from 'react';
import {
  FaMapMarkerAlt,
  FaBell,
  FaUsers,
  FaShieldAlt,
  FaHeartbeat,
  FaRoute,
  FaHandsHelping,
  FaMobileAlt,
} from 'react-icons/fa';

const Features = () => {
  const featureList = [
    { icon: <FaMapMarkerAlt />, title: "Real-time Location", desc: "Track your loved ones live on the map." },
    { icon: <FaBell />, title: "Instant Alerts", desc: "Get notified when someone enters or leaves a zone." },
    { icon: <FaUsers />, title: "Family Groups", desc: "Keep everyone in the loop within one group." },
    { icon: <FaShieldAlt />, title: "Privacy First", desc: "Your data stays secure with end-to-end encryption." },
    { icon: <FaHeartbeat />, title: "Health Monitoring", desc: "Keep tabs on heart rate and steps (if available)." },
    { icon: <FaRoute />, title: "Location History", desc: "Review past movements with a timeline view." },
    { icon: <FaHandsHelping />, title: "Emergency Assistance", desc: "Send help alerts with one tap." },
    { icon: <FaMobileAlt />, title: "Mobile Friendly", desc: "Fully optimized for any device, anytime." },
  ];

  return (
    <div className="bg-white py-20 px-4 md:px-12">
      <h2 className="text-4xl font-bold text-center mb-16">Key Features</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-10 max-w-6xl mx-auto">
        {featureList.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center space-y-3">
            <div className="text-4xl text-green-500">{feature.icon}</div>
            <h3 className="font-semibold text-lg">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
