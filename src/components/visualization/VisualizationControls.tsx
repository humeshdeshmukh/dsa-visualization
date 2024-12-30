"use client";

import { useVisualization } from './VisualizationContext';

const VisualizationControls = () => {
  const { 
    speed, 
    isPlaying, 
    isPaused,
    setSpeed, 
    play, 
    pause, 
    reset,
    nextStep,
    previousStep 
  } = useVisualization();

  return (
    <div className="flex flex-col gap-4 p-4 glass-dark border border-white/10 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={previousStep}
            className="p-2 text-gray-300 hover:text-white transition-colors"
            disabled={isPlaying}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {isPlaying ? (
            <button
              onClick={pause}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6" />
              </svg>
            </button>
          ) : (
            <button
              onClick={play}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <button
            onClick={nextStep}
            className="p-2 text-gray-300 hover:text-white transition-colors"
            disabled={isPlaying}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={reset}
            className="p-2 text-gray-300 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Speed:</span>
          <input
            type="range"
            min="0.25"
            max="2"
            step="0.25"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-32 accent-blue-500"
          />
          <span className="text-sm text-gray-400">{speed}x</span>
        </div>
      </div>
    </div>
  );
};

export default VisualizationControls;
