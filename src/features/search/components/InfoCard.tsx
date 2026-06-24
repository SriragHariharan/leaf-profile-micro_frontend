import React from 'react';
import { designRecipes } from "@srirag/leaf-design-system"


export default function InfoCard({message}: {message: string}) {
  return (
    <div className={`${designRecipes.panel} p-4 max-w-4xl`}>
      <div className="text-center text-xl text-ds-brand-600 max-w-4xl">
        {message}
      </div>
    </div>
  );
}
