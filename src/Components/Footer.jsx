import React, { useState, useEffect } from 'react';
import { MapPin, Shield, Heart, Mail, Phone, MessageCircle, Github, Twitter, Linkedin, ArrowUp } from 'lucide-react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20">
        {/* Main Footer Content */}
        <div className={`py-16 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">FindMyFamily</h3>
                  <p className="text-emerald-300 text-sm">Stay Connected, Stay Safe</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Bringing families together with simple, secure location sharing and smart coordination tools.
              </p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Shield, text: 'Secure' },
                  { icon: Heart, text: 'Family First' },
                  { icon: MapPin, text: 'Real-time' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-gray-300 hover:bg-white/10 transition-all duration-300">
                    <item.icon size={14} className="text-emerald-400" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Linkedin, href: 'https://www.linkedin.com/posts/vis1_reactjs-firebase-tailwindcss-activity-7338084357741400065-UBTl?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEf9Lb8B3SG2V3qkyKatjFafVMtaCP37mWI', label: 'LinkedIn' },
                  { icon: Github, href: 'https://github.com/Vishwanath362/Find-my-family', label: 'GitHub' }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="group w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <social.icon size={20} className="text-gray-400 group-hover:text-emerald-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                Quick Links
              </h4>
              <nav className="space-y-3">
                {[
                  'Privacy Policy',
                  'Terms of Service', 
                  'Support Center',
                  'Download App',
                  'About Us'
                ].map((link, i) => (
                  <a
                    key={i}
                    href="#"
                    className="group flex items-center text-gray-300 hover:text-emerald-300 transition-all duration-300"
                  >
                    <div className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 rounded-full mr-0 group-hover:mr-3 transition-all duration-300"></div>
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                Get in Touch
              </h4>
              <div className="space-y-4">
                {[
                  { icon: Mail, text: 'hello@FindMyFamily.com', href: 'mailto:hello@FindMyFamily.com' },
                  { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
                  { icon: MessageCircle, text: 'Live Chat', href: '#' }
                ].map((contact, i) => (
                  <a
                    key={i}
                    href={contact.href}
                    className="group flex items-center space-x-3 text-gray-300 hover:text-cyan-300 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-white/5 group-hover:bg-cyan-500/20 border border-white/10 group-hover:border-cyan-500/30 rounded-lg flex items-center justify-center transition-all duration-300">
                      <contact.icon size={16} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {contact.text}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t border-white/10 py-8 transform transition-all duration-1000 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} FindMyFamily. All rights reserved. Made with 
              <Heart size={14} className="inline mx-1 text-red-400" />
              for families everywhere.
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <span className="flex items-center text-gray-400">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                All systems operational
              </span>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-emerald-300 transition-colors duration-300">
                  Privacy
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-300 transition-colors duration-300">
                  Terms
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-300 transition-colors duration-300">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white rounded-2xl shadow-2xl hover:shadow-emerald-500/25 flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </footer>
  );
};

export default Footer;