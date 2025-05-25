import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Bell, 
  Users, 
  Shield, 
  Heart, 
  Route, 
  HelpCircle, 
  Smartphone,
  Zap,
  ArrowRight 
} from 'lucide-react';

const Features = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const featureList = [
    { 
      icon: MapPin, 
      title: "Real-time Location", 
      desc: "Track your loved ones live on the map with precise GPS accuracy and instant updates.",
      color: "emerald",
      delay: "0s"
    },
    { 
      icon: Bell, 
      title: "Instant Alerts", 
      desc: "Get notified when someone enters or leaves designated safe zones with customizable notifications.",
      color: "blue",
      delay: "0.1s"
    },
    { 
      icon: Users, 
      title: "Family Groups", 
      desc: "Keep everyone connected within secure family circles with easy member management.",
      color: "purple",
      delay: "0.2s"
    },
    { 
      icon: Shield, 
      title: "Privacy First", 
      desc: "Your data stays completely secure with military-grade end-to-end encryption technology.",
      color: "cyan",
      delay: "0.3s"
    },
    { 
      icon: Heart, 
      title: "Health Monitoring", 
      desc: "Track wellness metrics like heart rate and daily steps when wearable devices are connected.",
      color: "pink",
      delay: "0.4s"
    },
    { 
      icon: Route, 
      title: "Location History", 
      desc: "Review detailed movement patterns and location history with interactive timeline views.",
      color: "orange",
      delay: "0.5s"
    },
    { 
      icon: HelpCircle, 
      title: "Emergency Assistance", 
      desc: "Send instant help alerts to emergency contacts and authorities with one-tap SOS functionality.",
      color: "red",
      delay: "0.6s"
    },
    { 
      icon: Smartphone, 
      title: "Mobile Optimized", 
      desc: "Fully responsive design works flawlessly across all devices, tablets, and desktop platforms.",
      color: "indigo",
      delay: "0.7s"
    },
  ];

  const colorVariants = {
    emerald: "from-emerald-400 to-emerald-600",
    blue: "from-blue-400 to-blue-600",
    purple: "from-purple-400 to-purple-600",
    cyan: "from-cyan-400 to-cyan-600",
    pink: "from-pink-400 to-pink-600",
    orange: "from-orange-400 to-orange-600",
    red: "from-red-400 to-red-600",
    indigo: "from-indigo-400 to-indigo-600"
  };

  return (
    <div className="relative bg-black py-20 overflow-hidden">
      {/* Animated background similar to hero */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)`
          }}
        ></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="features-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#features-grid)" />
        </svg>
      </div>

      {/* Floating dots */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-20 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        ></div>
      ))}

      <div className="relative z-10 px-6 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-medium mb-6">
            <Zap size={16} />
            <span>Powerful Features</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-light text-white mb-6 tracking-tight">
            Everything You
            <span className="block font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Need & More
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
            Advanced family tracking features designed with privacy, security, and ease of use at the forefront
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {featureList.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 cursor-pointer"
                style={{ animationDelay: feature.delay }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Icon with gradient background */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${colorVariants[feature.color]} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent size={28} className="text-black" />
                  </div>
                  
                  {/* Floating glow effect */}
                  <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${colorVariants[feature.color]} rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`}></div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white group-hover:text-emerald-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.desc}
                  </p>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <button className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25">
            Get Started Today
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Feature Stats */}
        <div className="pt-16 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">8</div>
              <div className="text-sm text-gray-400 font-medium">Core Features</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">99.9%</div>
              <div className="text-sm text-gray-400 font-medium">Accuracy</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">Real-time</div>
              <div className="text-sm text-gray-400 font-medium">Updates</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">Secure</div>
              <div className="text-sm text-gray-400 font-medium">Encryption</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;