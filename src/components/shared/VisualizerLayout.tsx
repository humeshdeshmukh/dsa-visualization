"use client";

import { ReactNode } from 'react';

interface VisualizerLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

const VisualizerLayout = ({ title, description, children }: VisualizerLayoutProps) => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 gradient-text">{title}</h1>
          <p className="text-gray-400 mb-8">{description}</p>
          
          <div className="glass-dark border border-white/10 rounded-lg p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizerLayout;
