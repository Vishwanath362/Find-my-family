import React from 'react'

const Testimonials = () => {
    return (
      <div className="bg-gray-100 py-20 px-4 md:px-12">
        <h2 className="text-4xl font-bold text-center mb-16">What People Say</h2>
  
        <div className="max-w-5xl mx-auto grid gap-12 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 italic">
              "This app gave me peace of mind when my daughter started college. I always know she's safe."
            </p>
            <div className="mt-4 font-semibold">— Priya, Mumbai</div>
          </div>
  
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 italic">
              "We use it for our elderly parents — the alerts are incredibly helpful."
            </p>
            <div className="mt-4 font-semibold">— Arjun, Bangalore</div>
          </div>
  
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 italic">
              "Best family tracker out there. Super easy to use and very reliable."
            </p>
            <div className="mt-4 font-semibold">— Sneha, Pune</div>
          </div>
  
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 italic">
              "Helped us coordinate during vacations and made sure everyone was safe."
            </p>
            <div className="mt-4 font-semibold">— Rahul, Delhi</div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Testimonials;
