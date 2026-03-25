import React from 'react'
import Spinner from './Spinner'

const LoadingOverlay: React.FC = () => {
  return (
    <div className='fixed inset-0 flex flex-col justify-center items-center z-[100]'>
        <Spinner/>
        <p className="mt-4 text-lg text-gray-700 font-semibold animate-pulse ">Loading</p>
    </div>
  );
};

export default LoadingOverlay