"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import ArrayVisualization from '@/components/visualization/array/ArrayVisualization';

export default function LinearSearchPage() {
  const [array, setArray] = useState([8, 3, 5, 4, 7, 6, 1, 2]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [searchValue, setSearchValue] = useState('');

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const linearSearch = async (target: number) => {
    setFoundIndex(-1);
    
    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      await sleep(500);

      if (array[i] === target) {
        setFoundIndex(i);
        break;
      }
    }

    setCurrentIndex(-1);
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (!isNaN(value)) {
      linearSearch(value);
    }
  };

  const handleRandomize = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1);
    setArray(newArray);
    setCurrentIndex(-1);
    setFoundIndex(-1);
  };

  return (
    <VisualizerLayout
      title="Linear Search Visualization"
      description="Visualize how Linear Search sequentially checks each element until a match is found or the end of array is reached."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={handleRandomize}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Randomize Array
            </button>
            <div className="flex gap-2">
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Enter value"
                className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          <ArrayVisualization
            array={array}
            highlightIndices={foundIndex !== -1 ? [foundIndex] : []}
            currentIndex={currentIndex}
          />

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Linear Search Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Best Case: O(1) - Element found at first position</li>
                <li>Average Case: O(n)</li>
                <li>Worst Case: O(n) - Element not found or at last position</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(1)</p>
              <p><strong>Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Simple and easy to implement</li>
                <li>Works on sorted and unsorted arrays</li>
                <li>No additional memory required</li>
                <li>Good for small arrays</li>
              </ul>
              <p><strong>Best Used When:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Array is small</li>
                <li>Array is unsorted</li>
                <li>Simplicity is preferred over efficiency</li>
                <li>One-time search operation</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
