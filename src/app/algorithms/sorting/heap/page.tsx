"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import SortingVisualization from '@/components/visualization/sorting/SortingVisualization';

export default function HeapSortPage() {
  const [array, setArray] = useState([8, 3, 5, 4, 7, 6, 1, 2]);
  const [comparingIndices, setComparingIndices] = useState<[number, number]>([-1, -1]);
  const [swappingIndices, setSwappingIndices] = useState<[number, number]>([-1, -1]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const heapify = async (n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    setComparingIndices([largest, left]);
    await sleep(500);

    if (left < n && array[left] > array[largest]) {
      largest = left;
    }

    setComparingIndices([largest, right]);
    await sleep(500);

    if (right < n && array[right] > array[largest]) {
      largest = right;
    }

    if (largest !== i) {
      setSwappingIndices([i, largest]);
      await sleep(500);

      // Swap elements
      [array[i], array[largest]] = [array[largest], array[i]];
      setArray([...array]);
      
      await sleep(500);
      setSwappingIndices([-1, -1]);

      // Recursively heapify the affected sub-tree
      await heapify(n, largest);
    }

    setComparingIndices([-1, -1]);
  };

  const heapSort = async () => {
    const n = array.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(n, i);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      setSwappingIndices([0, i]);
      await sleep(500);

      // Move current root to end
      [array[0], array[i]] = [array[i], array[0]];
      setArray([...array]);
      
      setSortedIndices(prev => [...prev, i]);
      await sleep(500);
      setSwappingIndices([-1, -1]);

      // Heapify root element
      await heapify(i, 0);
    }

    setSortedIndices(prev => [0, ...prev]);
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
      title="Heap Sort Visualization"
      description="Visualize how Heap Sort builds a max heap and repeatedly extracts the maximum element to sort the array."
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
              onClick={() => heapSort()}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Start Heap Sort
            </button>
          </div>

          <SortingVisualization
            array={array}
            type="heap"
            comparingIndices={comparingIndices}
            swappingIndices={swappingIndices}
            sortedIndices={sortedIndices}
          />

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Heap Sort Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong> O(n log n) - All cases</p>
              <p><strong>Space Complexity:</strong> O(1)</p>
              <p><strong>Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>In-place sorting algorithm</li>
                <li>Not stable sort</li>
                <li>Based on binary heap data structure</li>
                <li>Comparison-based sort</li>
              </ul>
              <p><strong>Steps:</strong></p>
              <ol className="list-decimal list-inside mt-2 ml-4">
                <li>Build max heap from input array</li>
                <li>Repeatedly extract maximum element</li>
                <li>Place maximum at end of array</li>
                <li>Heapify reduced heap</li>
              </ol>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
