"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import SortingVisualization from '@/components/visualization/sorting/SortingVisualization';

export default function InsertionSortPage() {
  const [array, setArray] = useState([8, 3, 5, 4, 7, 6, 1, 2]);
  const [comparingIndices, setComparingIndices] = useState<[number, number]>([-1, -1]);
  const [swappingIndices, setSwappingIndices] = useState<[number, number]>([-1, -1]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const insertionSort = async () => {
    const n = array.length;
    setSortedIndices([0]);

    for (let i = 1; i < n; i++) {
      const key = array[i];
      let j = i - 1;

      while (j >= 0) {
        setComparingIndices([j, j + 1]);
        await sleep(500);

        if (array[j] > key) {
          setSwappingIndices([j, j + 1]);
          await sleep(500);

          array[j + 1] = array[j];
          setArray([...array]);
          j--;
        } else {
          break;
        }
      }

      array[j + 1] = key;
      setArray([...array]);
      setSortedIndices([...Array(i + 1).keys()]);
      
      setComparingIndices([-1, -1]);
      setSwappingIndices([-1, -1]);
      await sleep(500);
    }
  };

  const handleRandomize = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1);
    setArray(newArray);
    setSortedIndices([]);
    setComparingIndices([-1, -1]);
    setSwappingIndices([-1, -1]);
  };

  return (
    <VisualizerLayout
      title="Insertion Sort Visualization"
      description="Visualize how Insertion Sort builds the sorted array one item at a time by repeatedly inserting a new element into the sorted portion."
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
            <button
              onClick={() => insertionSort()}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Start Insertion Sort
            </button>
          </div>

          <SortingVisualization
            array={array}
            type="insertion"
            comparingIndices={comparingIndices}
            swappingIndices={swappingIndices}
            sortedIndices={sortedIndices}
          />

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Insertion Sort Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Best Case: O(n) - Already sorted</li>
                <li>Average Case: O(n²)</li>
                <li>Worst Case: O(n²) - Reverse sorted</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(1)</p>
              <p><strong>Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>In-place sorting algorithm</li>
                <li>Stable sort</li>
                <li>Adaptive - Performance improves with partially sorted arrays</li>
                <li>Online - Can sort a list as it receives it</li>
              </ul>
              <p><strong>Best Used When:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Array is small</li>
                <li>Array is nearly sorted</li>
                <li>Online sorting is needed</li>
                <li>Memory space is limited</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
