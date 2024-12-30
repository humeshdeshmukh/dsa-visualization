"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

export default function FibonacciPage() {
  const [n, setN] = useState(5);
  const [dp, setDp] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const calculateFibonacci = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setDp([]);
    setCurrentIndex(-1);

    const newDp = new Array(n + 1).fill(0);
    newDp[0] = 0;
    newDp[1] = 1;
    setDp([...newDp]);
    await sleep(1000);

    for (let i = 2; i <= n; i++) {
      setCurrentIndex(i);
      await sleep(1000);

      newDp[i] = newDp[i - 1] + newDp[i - 2];
      setDp([...newDp]);
      await sleep(1000);
    }

    setCurrentIndex(-1);
    setIsRunning(false);
  };

  return (
    <VisualizerLayout
      title="Fibonacci Dynamic Programming Visualization"
      description="Visualize how Dynamic Programming efficiently calculates Fibonacci numbers by storing previously computed values."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <input
              type="number"
              min="1"
              max="20"
              value={n}
              onChange={(e) => setN(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
              className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={calculateFibonacci}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Calculate Fibonacci
            </button>
          </div>

          <div className="glass-dark border border-white/10 rounded-lg p-6">
            <div className="flex flex-wrap gap-4">
              {dp.map((value, index) => (
                <div
                  key={index}
                  className={`relative p-4 rounded-lg ${
                    index === currentIndex
                      ? 'bg-yellow-500'
                      : index === currentIndex - 1 || index === currentIndex - 2
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                >
                  <div className="text-xs text-white/70 absolute -top-2 left-1/2 -translate-x-1/2">
                    n={index}
                  </div>
                  <div className="text-white font-mono">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Explanation:</h4>
            <div className="space-y-2 text-gray-300">
              <p>
                Current calculation:{' '}
                {currentIndex > 1
                  ? `F(${currentIndex}) = F(${currentIndex - 1}) + F(${
                      currentIndex - 2
                    })`
                  : 'Base cases: F(0) = 0, F(1) = 1'}
              </p>
              {currentIndex > 1 && (
                <p>
                  {`${dp[currentIndex]} = ${dp[currentIndex - 1]} + ${
                    dp[currentIndex - 2]
                  }`}
                </p>
              )}
            </div>
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Dynamic Programming Approach</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong> O(n)</p>
              <p><strong>Space Complexity:</strong> O(n)</p>
              <p><strong>Comparison with Other Approaches:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Recursive: O(2^n) time, O(n) space</li>
                <li>Dynamic Programming: O(n) time, O(n) space</li>
                <li>Space Optimized: O(n) time, O(1) space</li>
              </ul>
              <p><strong>Key Concepts:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Overlapping subproblems</li>
                <li>Optimal substructure</li>
                <li>Memoization</li>
                <li>Bottom-up approach</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
