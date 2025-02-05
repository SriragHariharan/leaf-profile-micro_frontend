import React from 'react';


export default function InfoCard({message}: {message: string}) {
  return (
    <div className="bg-white p-4 shadow-md border border-gray-200 w-[768px]">
      <div className="text-center text-xl text-green-600">
        {message}
      </div>
    </div>
  );
}
