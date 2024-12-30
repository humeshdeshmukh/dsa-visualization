"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import ArrayVisualization from '@/components/visualization/array/ArrayVisualization';

interface DynamicArrayState {
  elements: number[];
  capacity: number;
  size: number;
}

export default function DynamicArrayPage() {
  const [array, setArray] = useState<DynamicArrayState>({
    elements: [1, 2, 3],
    capacity: 4,
    size: 3
  });
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [message, setMessage] = useState('');

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const pushElement = async () => {
    const newElement = Math.floor(Math.random() * 100) + 1;
    setMessage(`Adding element ${newElement}`);

    if (array.size === array.capacity) {
      setMessage('Array is full. Resizing...');
      setIsResizing(true);
      await sleep(1000);

      const newCapacity = array.capacity * 2;
      const newElements = [...array.elements];
      for (let i = array.size; i < newCapacity; i++) {
        newElements[i] = 0; // Empty slots
      }

      setArray({
        elements: newElements,
        capacity: newCapacity,
        size: array.size
      });
      await sleep(1000);
      setIsResizing(false);
    }

    setHighlightIndices([array.size]);
    await sleep(500);

    const newElements = [...array.elements];
    newElements[array.size] = newElement;
    
    setArray({
      ...array,
      elements: newElements,
      size: array.size + 1
    });

    await sleep(500);
    setHighlightIndices([]);
    setMessage('');
  };

  const popElement = async () => {
    if (array.size === 0) {
      setMessage('Array is empty');
      return;
    }

    setMessage('Removing last element');
    setHighlightIndices([array.size - 1]);
    await sleep(500);

    const newElements = [...array.elements];
    newElements[array.size - 1] = 0; // Mark as empty

    setArray({
      ...array,
      elements: newElements,
      size: array.size - 1
    });

    // Check if we should shrink the array
    if (array.size - 1 <= array.capacity / 4 && array.capacity > 4) {
      setMessage('Array is sparse. Shrinking...');
      setIsResizing(true);
      await sleep(1000);

      const newCapacity = Math.floor(array.capacity / 2);
      const newElements = newElements.slice(0, newCapacity);

      setArray({
        elements: newElements,
        capacity: newCapacity,
        size: array.size - 1
      });

      await sleep(1000);
      setIsResizing(false);
    }

    await sleep(500);
    setHighlightIndices([]);
    setMessage('');
  };

  return (
    <VisualizerLayout
      title="Dynamic Array Visualization"
      description="Visualize how Dynamic Arrays (like ArrayList or Vector) grow and shrink automatically to accommodate elements."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={pushElement}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Push Random Element
            </button>
            <button
              onClick={popElement}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Pop Element
            </button>
          </div>

          {message && (
            <div className="text-white bg-gray-800 p-4 rounded-lg">
              {message}
            </div>
          )}

          <div className="glass-dark border border-white/10 rounded-lg p-6">
            <div className="mb-4">
              <div className="text-white">
                <span className="font-semibold">Size:</span> {array.size} |{' '}
                <span className="font-semibold">Capacity:</span> {array.capacity}
              </div>
            </div>

            <ArrayVisualization
              array={array.elements.map((val, i) => ({
                value: val,
                isActive: i < array.size,
                isHighlighted: highlightIndices.includes(i),
                isResizing: isResizing
              }))}
              showIndices
            />
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Dynamic Array Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Access: O(1)</li>
                <li>Search: O(n)</li>
                <li>Insert/Delete at end: Amortized O(1)</li>
                <li>Insert/Delete at middle: O(n)</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(n)</p>
              <p><strong>Key Features:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Automatic resizing</li>
                <li>Contiguous memory</li>
                <li>Random access</li>
                <li>Cache-friendly</li>
              </ul>
              <p><strong>Common Operations:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Push/Pop (at end)</li>
                <li>Get/Set by index</li>
                <li>Resize (grow/shrink)</li>
                <li>Clear/Empty check</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
