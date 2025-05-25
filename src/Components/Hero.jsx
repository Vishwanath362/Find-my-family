import React, { useState, useEffect } from 'react';
import { MapPin, Shield, Zap, Users, ArrowRight, Play } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
const Hero = () => {
    const [user, setUser] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate()

    useEffect(() => {
        // Simulating auth state - replace with your actual Firebase auth
        // const unsubscribe = onAuthStateChanged(auth, (user) => {
        //     setUser(user);
        // });
        // return () => unsubscribe();

        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative min-h-screen bg-black overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-blue-900/20"
                    style={{
                        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`
                    }}
                ></div>
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Floating Dots */}
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 bg-emerald-400 rounded-full opacity-30 animate-pulse"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${3 + Math.random() * 4}s`
                    }}
                ></div>
            ))}

            {/* Main Content */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-screen px-6 lg:px-20 py-20">
                {/* Left Content */}
                <div className="flex-1 max-w-3xl space-y-8">
                    {/* Status Badge */}
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-medium">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span>Live Tracking Active</span>
                    </div>

                    {/* Main Heading */}
                    <div className="space-y-4">
                        <h1 className="text-5xl lg:text-7xl font-light text-white tracking-tight">
                            Stay
                            <span className="block font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                Connected
                            </span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-400 font-light leading-relaxed">
                            Advanced family tracking that respects privacy while keeping everyone safe
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {user ? (
                            <button className="group flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25">
                                <MapPin size={20} className="mr-2" />
                                View Family Map
                                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <>

                                <Link to="/login">
                                    <button className="group flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-100 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                                        Start Tracking
                                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>

                                <button className="group flex items-center justify-center px-8 py-4 border border-white/20 hover:border-white/40 text-white font-medium rounded-lg transition-all duration-300 hover:bg-white/5">
                                    <Play size={16} className="mr-2" />
                                    Watch Demo
                                </button>
                            </>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                        <div>
                            <div className="text-3xl font-bold text-white">99.9%</div>
                            <div className="text-sm text-gray-400">Uptime</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">2M+</div>
                            <div className="text-sm text-gray-400">Families</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">24/7</div>
                            <div className="text-sm text-gray-400">Support</div>
                        </div>
                    </div>
                </div>

                {/* Right Visual */}
                <div className="flex-1 max-w-lg mt-16 lg:mt-0">
                    <div className="relative">
                        {/* Main Device Mockup */}
                        <div className="relative z-10 bg-gradient-to-br from-gray-900 to-black p-1 rounded-3xl shadow-2xl">
                            <div className="bg-black rounded-3xl p-8">
                                <div className="space-y-6">
                                    {/* Map Visualization */}
                                    <div className="h-48 bg-gradient-to-br from-emerald-900/20 to-blue-900/20 rounded-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
                                        {/* Location Pins */}
                                        <div className="absolute top-8 left-8 w-4 h-4 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                                        <div className="absolute top-16 right-12 w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50" style={{ animationDelay: '1s' }}></div>
                                        <div className="absolute bottom-12 left-16 w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50" style={{ animationDelay: '2s' }}></div>
                                        {/* Connection Lines */}
                                        <svg className="absolute inset-0 w-full h-full">
                                            <line x1="15%" y1="20%" x2="80%" y2="35%" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="2" strokeDasharray="5,5">
                                                <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
                                            </line>
                                            <line x1="15%" y1="20%" x2="30%" y2="70%" stroke="rgba(147, 51, 234, 0.3)" strokeWidth="2" strokeDasharray="5,5">
                                                <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite" />
                                            </line>
                                        </svg>
                                    </div>

                                    {/* Family Members List */}
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Sarah', status: 'At Work', color: 'emerald' },
                                            { name: 'Mike', status: 'At School', color: 'blue' },
                                            { name: 'Emma', status: 'At Home', color: 'purple' }
                                        ].map((member, i) => (
                                            <div key={i} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                                                <div className={`w-3 h-3 bg-${member.color}-400 rounded-full`}></div>
                                                <div className="flex-1">
                                                    <div className="text-white font-medium text-sm">{member.name}</div>
                                                    <div className="text-gray-400 text-xs">{member.status}</div>
                                                </div>
                                                <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Cards */}
                        <div className="absolute -top-4 -right-4 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-4 animate-pulse">
                            <Shield size={24} className="text-emerald-400" />
                        </div>
                        <div className="absolute -bottom-4 -left-4 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 animate-pulse" style={{ animationDelay: '1s' }}>
                            <Zap size={24} className="text-blue-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Features */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-20">
                <div className="flex justify-center space-x-12 text-center">
                    {[
                        { icon: Shield, label: 'Secure' },
                        { icon: Zap, label: 'Real-time' },
                        { icon: Users, label: 'Family-first' }
                    ].map((feature, i) => (
                        <div key={i} className="flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
                            <feature.icon size={20} className="text-white" />
                            <span className="text-xs text-white font-medium">{feature.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;