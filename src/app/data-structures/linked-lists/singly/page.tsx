"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import LinkedListVisualization from '@/components/visualization/linked-list/LinkedListVisualization';

interface ListNode {
  value: number;
  next?: ListNode;
}

export default function SinglyLinkedListPage() {
  const [nodes, setNodes] = useState<ListNode[]>([
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
  ]);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  // Connect nodes
  nodes.forEach((node, index) => {
    node.next = index < nodes.length - 1 ? nodes[index + 1] : undefined;
  });

  const handleInsert = () => {
    const value = Math.floor(Math.random() * 10) + 1;
    const index = Math.floor(Math.random() * (nodes.length + 1));
    setHighlightIndex(index);
    
    setTimeout(() => {
      const newNodes = [...nodes];
      newNodes.splice(index, 0, { value });
      setNodes(newNodes);
      
      setTimeout(() => {
        setHighlightIndex(-1);
      }, 1000);
    }, 1000);
  };

  const handleDelete = () => {
    if (nodes.length === 0) return;
    
    const index = Math.floor(Math.random() * nodes.length);
    setHighlightIndex(index);
    
    setTimeout(() => {
      const newNodes = nodes.filter((_, i) => i !== index);
      setNodes(newNodes);
      
      setTimeout(() => {
        setHighlightIndex(-1);
      }, 1000);
    }, 1000);
  };

  return (
    <VisualizerLayout
      title="Singly Linked List Visualization"
      description="Visualize singly linked list operations including insertion, deletion, and traversal. See how nodes are connected in a single direction."
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

          <LinkedListVisualization
            head={nodes[0]}
            highlightNodes={highlightIndex !== -1 ? [highlightIndex] : []}
            type="singly"
          />

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Singly Linked List Operations</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Insertion:</strong> O(1) at head, O(n) at specific position</p>
              <p><strong>Deletion:</strong> O(1) at head, O(n) at specific position</p>
              <p><strong>Access:</strong> O(n) - Must traverse from head</p>
              <p><strong>Search:</strong> O(n) - Must traverse from head</p>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
