import React from 'react';
import Mom from "../assets/mom.jpg";

const People = () => {
  return (
    <div>
      <img className="h-48 w-48 rounded-lg object-cover" src={Mom} alt="Mom" />
    </div>
  );
};

export default People;
