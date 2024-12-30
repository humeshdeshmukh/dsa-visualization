"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import ArrayVisualization from '@/components/visualization/array/ArrayVisualization';

export default function BasicArrayPage() {
  const [array, setArray] = useState([4, 8, 2, 9, 1, 5, 7, 3, 6]);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const handleInsert = () => {
    const value = Math.floor(Math.random() * 10) + 1;
    const index = Math.floor(Math.random() * (array.length + 1));
    setHighlightIndex(index);
    
    setTimeout(() => {
      const newArray = [...array];
      newArray.splice(index, 0, value);
      setArray(newArray);
      
      setTimeout(() => {
        setHighlightIndex(-1);
      }, 1000);
    }, 1000);
  };

  const handleDelete = () => {
    if (array.length === 0) return;
    
    const index = Math.floor(Math.random() * array.length);
    setHighlightIndex(index);
    
    setTimeout(() => {
      const newArray = array.filter((_, i) => i !== index);
      setArray(newArray);
      
      setTimeout(() => {
        setHighlightIndex(-1);
      }, 1000);
    }, 1000);
  };

  return (
    <VisualizerLayout
      title="Basic Array Visualization"
      description="Visualize basic array operations including insertion, deletion, and traversal. Understand how arrays store elements in contiguous memory locations."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={handleInsert}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Insert Random
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Delete Random
            </button>
          </div>

          <ArrayVisualization
            array={array}
            highlightIndices={highlightIndex !== -1 ? [highlightIndex] : []}
          />

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Array Operations</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Insertion:</strong> O(n) - May require shifting elements</p>
              <p><strong>Deletion:</strong> O(n) - May require shifting elements</p>
              <p><strong>Access:</strong> O(1) - Direct access by index</p>
              <p><strong>Search:</strong> O(n) - Linear search in unsorted array</p>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
