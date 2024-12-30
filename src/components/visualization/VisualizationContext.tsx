"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface VisualizationState {
  speed: number;
  isPlaying: boolean;
  isPaused: boolean;
  currentStep: number;
}

interface VisualizationContextType extends VisualizationState {
  setSpeed: (speed: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  nextStep: () => void;
  previousStep: () => void;
}

const VisualizationContext = createContext<VisualizationContextType | undefined>(undefined);

export function VisualizationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VisualizationState>({
    speed: 1,
    isPlaying: false,
    isPaused: false,
    currentStep: 0,
  });

  const setSpeed = (speed: number) => {
    setState(prev => ({ ...prev, speed }));
  };

  const play = () => {
    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
  };

  const pause = () => {
    setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
  };

  const reset = () => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentStep: 0,
    }));
  };

  const nextStep = () => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const previousStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  };

  return (
    <VisualizationContext.Provider
      value={{
        ...state,
        setSpeed,
        play,
        pause,
        reset,
        nextStep,
        previousStep,
      }}
    >
      {children}
    </VisualizationContext.Provider>
  );
}

export function useVisualization() {
  const context = useContext(VisualizationContext);
  if (context === undefined) {
    throw new Error('useVisualization must be used within a VisualizationProvider');
  }
  return context;
}
