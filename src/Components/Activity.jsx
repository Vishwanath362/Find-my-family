import React from 'react';
import People from './People';

const Activity = () => {
  return (
    <div>
      <div className='text-2xl p-4'>Recent Activity</div>

      <div className='bg-slate-500 px-4 py-6'>
        <div className='flex flex-wrap justify-evenly gap-6'>
          <People />
          <People />
          <People />
          <People />
        </div>
      </div>
    </div>
  );
};

export default Activity;
