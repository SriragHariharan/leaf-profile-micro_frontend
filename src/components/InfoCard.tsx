import React from 'react';


export default function InfoCard({message}: {message: string}) {
  return (
    <div className="bg-white p-4 shadow-md border border-gray-200 max-w-4xl">
      <div className="text-center text-xl text-green-600 max-w-4xl">
        {message}
      </div>
    </div>
  );
}
