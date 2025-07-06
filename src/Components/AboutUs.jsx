import React, { useState, useEffect } from 'react';
import { Users, MapPin, CheckSquare, Shield, Zap, Sparkles } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
export default function AboutUs() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, async (user) => {
//     if (user) {
//       const token = await user.getIdToken();
//       localStorage.setItem('authtoken', token);
//       console.log('User is signed in:', user.email);
//     } else {
//       console.log('No user is signed in');
//     }
//   });

//   return () => unsubscribe();
// }, []);

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

  const AnimatedSection = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return (
      <div
        className={`transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-cyan-900/10 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)`
          }}
        />
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <AnimatedSection delay={0}>
            <div className="text-center mb-24">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-8">
                <Sparkles size={16} className="mr-2" />
                Building the Future of Family Connection
              </div>
              <h1 className="text-6xl lg:text-8xl font-light text-white mb-8 tracking-tight">
                About
                <span className="block font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  MyFamilyApp
                </span>
              </h1>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
                We're building a simpler way for families and friends to stay connected in the real world.
              </p>
            </div>
          </AnimatedSection>

          {/* Story Section */}
          <AnimatedSection delay={200}>
            <section className="mb-24">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                      <Users size={28} className="text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-white">Our Story</h2>
                  </div>
                  <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                    <p className="text-emerald-300 font-semibold">
                      MyFamilyApp was born from a simple, real-life frustration.
                    </p>
                    <p>
                      As a university student, I often faced confusion when my father came to pick me up after college—network issues delayed calls, and timing mismatches led to unnecessary stress.
                    </p>
                    <p>
                      I realized I wasn't alone. That's when I decided to build a solution—not just for me, but for families and friends everywhere.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-2xl"></div>
                    <div className="relative space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-white font-medium">Real Problem</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <span className="text-white font-medium">Simple Solution</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                        <span className="text-white font-medium">Global Impact</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Features Section */}
          <AnimatedSection delay={400}>
            <section className="mb-24">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: Users, title: 'Create Groups', desc: 'Family & friends' },
                      { icon: MapPin, title: 'Real-time Locations', desc: 'Always connected' },
                      { icon: CheckSquare, title: 'Assign Tasks', desc: 'Easy coordination' },
                      { icon: Shield, title: 'SOS Alerts', desc: 'Emergency safety' }
                    ].map((feature, i) => (
                      <div key={i} className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <feature.icon size={24} className="text-emerald-400" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="order-1 lg:order-2 space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <Zap size={28} className="text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-white">What We Do</h2>
                  </div>
                  <p className="text-xl text-emerald-300 font-semibold">MyFamilyApp helps you:</p>
                  <div className="space-y-4">
                    {[
                      'Create groups of family or friends.',
                      'See real-time locations of group members.',
                      'Assign tasks like "Pick up sister" or "Bring groceries."',
                      'Send SOS alerts in emergencies.'
                    ].map((item, i) => (
                      <div key={i} className="flex items-start space-x-3 group">
                        <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center mt-1 group-hover:bg-emerald-500/30 transition-colors">
                          <CheckSquare size={14} className="text-emerald-400" />
                        </div>
                        <span className="text-gray-300 group-hover:text-white transition-colors">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-lg text-gray-300 italic">All in one simple, privacy-respecting app.</p>
                </div>
              </div>
            </section>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
