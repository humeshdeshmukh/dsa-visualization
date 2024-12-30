"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import SortingVisualization from '@/components/visualization/sorting/SortingVisualization';

export default function MergeSortPage() {
  const [array, setArray] = useState([8, 3, 5, 4, 7, 6, 1, 2]);
  const [comparingIndices, setComparingIndices] = useState<[number, number]>([-1, -1]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const merge = async (left: number, mid: number, right: number) => {
    const temp = [...array];
    let i = left;
    let j = mid + 1;
    let k = 0;
    const merged: number[] = [];

    while (i <= mid && j <= right) {
      setComparingIndices([i, j]);
      await sleep(500);

      if (temp[i] <= temp[j]) {
        merged[k++] = temp[i++];
      } else {
        merged[k++] = temp[j++];
      }
    }

    while (i <= mid) {
      merged[k++] = temp[i++];
    }

    while (j <= right) {
      merged[k++] = temp[j++];
    }

    for (i = 0; i < k; i++) {
      temp[left + i] = merged[i];
      setArray([...temp]);
      setSortedIndices([...Array(left + i + 1).keys()]);
      await sleep(100);
    }
  };

  const mergeSort = async (left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await mergeSort(left, mid);
      await mergeSort(mid + 1, right);
      await merge(left, mid, right);
    }
  };

  const handleSort = async () => {
    setSortedIndices([]);
    setComparingIndices([-1, -1]);
    await mergeSort(0, array.length - 1);
    setComparingIndices([-1, -1]);
    setSortedIndices([...Array(array.length).keys()]);
  };

  const handleRandomize = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50) + 1);
    setArray(newArray);
    setSortedIndices([]);
    setComparingIndices([-1, -1]);
  };

  return (
    <VisualizerLayout
      title="Merge Sort Visualization"
      description="Visualize how Merge Sort recursively divides the array into smaller subarrays, sorts them, and merges them back together."
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
              onClick={handleSort}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Start Merge Sort
            </button>
          </div>

          <SortingVisualization
            array={array}
            type="merge"
            comparingIndices={comparingIndices}
            sortedIndices={sortedIndices}
          />

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Merge Sort Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong> O(n log n) - Always</p>
              <p><strong>Space Complexity:</strong> O(n)</p>
              <p><strong>Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Stable sorting algorithm</li>
                <li>Divide and conquer approach</li>
                <li>Not in-place (requires extra space)</li>
                <li>Predictable performance (always O(n log n))</li>
              </ul>
              <p><strong>Steps:</strong></p>
              <ol className="list-decimal list-inside mt-2 ml-4">
                <li>Divide array into two halves</li>
                <li>Recursively sort both halves</li>
                <li>Merge sorted halves</li>
              </ol>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
