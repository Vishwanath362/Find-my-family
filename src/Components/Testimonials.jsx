import React, { useState, useEffect } from 'react';
import { Quote, Star, Users, ArrowLeft, ArrowRight } from 'lucide-react';

const Testimonials = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const testimonials = [
    {
      quote: "This app gave me complete peace of mind when my daughter started college. I always know she's safe and can reach her instantly if needed.",
      name: "Priya Sharma",
      location: "Mumbai",
      role: "Mother of 2",
      rating: 5,
      avatar: "P",
      color: "emerald"
    },
    {
      quote: "We use it for our elderly parents — the location alerts and emergency features are incredibly helpful for our family's safety.",
      name: "Arjun Patel",
      location: "Bangalore",
      role: "Family Caregiver",
      rating: 5,
      avatar: "A",
      color: "blue"
    },
    {
      quote: "Best family tracker out there. Super easy to use, very reliable, and the privacy features make me feel secure about our data.",
      name: "Sneha Reddy",
      location: "Pune",
      role: "Tech Professional",
      rating: 5,
      avatar: "S",
      color: "purple"
    },
    {
      quote: "Helped us coordinate during family vacations and made sure everyone stayed connected. The real-time updates are amazing!",
      name: "Rahul Kumar",
      location: "Delhi",
      role: "Father of 3",
      rating: 5,
      avatar: "R",
      color: "cyan"
    },
    {
      quote: "The emergency alerts saved us during a medical situation with my mom. This app is a lifesaver for families like ours.",
      name: "Meera Singh",
      location: "Chennai",
      role: "Healthcare Worker",
      rating: 5,
      avatar: "M",
      color: "pink"
    },
    {
      quote: "Simple, intuitive, and powerful. My teenage kids actually like using it because it's not invasive but keeps us all connected.",
      name: "Vikram Joshi",
      location: "Hyderabad",
      role: "Parent & Educator",
      rating: 5,
      avatar: "V",
      color: "orange"
    }
  ];

  const colorVariants = {
    emerald: "from-emerald-400 to-emerald-600",
    blue: "from-blue-400 to-blue-600",
    purple: "from-purple-400 to-purple-600",
    cyan: "from-cyan-400 to-cyan-600",
    pink: "from-pink-400 to-pink-600",
    orange: "from-orange-400 to-orange-600"
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(testimonials.length / 2)) % Math.ceil(testimonials.length / 2));
  };

  return (
    <div className="relative bg-black py-20 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.06) 0%, transparent 50%)`
          }}
        ></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="testimonials-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testimonials-grid)" />
        </svg>
      </div>

      {/* Floating dots */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-15 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        ></div>
      ))}

      <div className="relative z-10 px-6 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-medium mb-6">
            <Users size={16} />
            <span>Happy Families</span>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-light text-white mb-6 tracking-tight">
            What People
            <span className="block font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Are Saying
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
            Real stories from families who trust us to keep their loved ones safe and connected
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.slice(currentSlide * 2, currentSlide * 2 + 2).map((testimonial, index) => (
              <div
                key={currentSlide * 2 + index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 backdrop-blur-sm border border-emerald-500/30 rounded-full flex items-center justify-center">
                  <Quote size={20} className="text-emerald-400" />
                </div>

                {/* Content */}
                <div className="space-y-6">
                  {/* Stars */}
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-300 text-lg leading-relaxed italic group-hover:text-white transition-colors duration-300">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                    <div className={`w-12 h-12 bg-gradient-to-br ${colorVariants[testimonial.color]} rounded-full flex items-center justify-center text-black font-bold text-lg`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role} • {testimonial.location}</div>
                    </div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center space-x-6 mb-16">
          <button
            onClick={prevSlide}
            className="group w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-emerald-500/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft size={20} className="text-gray-400 group-hover:text-emerald-400 transition-colors" />
          </button>
          
          {/* Dots */}
          <div className="flex space-x-2">
            {[...Array(Math.ceil(testimonials.length / 2))].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'bg-emerald-400 w-8' : 'bg-white/30 hover:bg-white/50'
                }`}
              ></button>
            ))}
          </div>
          
          <button
            onClick={nextSlide}
            className="group w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-emerald-500/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          >
            <ArrowRight size={20} className="text-gray-400 group-hover:text-emerald-400 transition-colors" />
          </button>
        </div>

        {/* Trust Stats */}
        <div className="pt-16 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">2M+</div>
              <div className="text-sm text-gray-400 font-medium">Happy Families</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">4.9★</div>
              <div className="text-sm text-gray-400 font-medium">App Store Rating</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">50K+</div>
              <div className="text-sm text-gray-400 font-medium">5-Star Reviews</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">99%</div>
              <div className="text-sm text-gray-400 font-medium">Would Recommend</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;