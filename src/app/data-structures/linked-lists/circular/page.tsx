"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import LinkedListVisualization from '@/components/visualization/linked-list/LinkedListVisualization';

interface ListNode {
  value: number;
  id: number;
}

export default function CircularLinkedListPage() {
  const [nodes, setNodes] = useState<ListNode[]>([
    { value: 1, id: 1 },
    { value: 2, id: 2 },
    { value: 3, id: 3 },
  ]);
  const [highlightNodes, setHighlightNodes] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [nextId, setNextId] = useState(4);
  const [currentNode, setCurrentNode] = useState<number | null>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const insertAfter = async (position: number) => {
    const newValue = Math.floor(Math.random() * 100) + 1;
    setMessage(`Inserting ${newValue} after position ${position}`);
    
    const newNode = { value: newValue, id: nextId };
    const newNodes = [...nodes];
    newNodes.splice(position + 1, 0, newNode);
    
    setHighlightNodes([nextId]);
    setNodes(newNodes);
    setNextId(nextId + 1);
    
    await sleep(1000);
    setHighlightNodes([]);
    setMessage('');
  };

  const deleteNode = async (position: number) => {
    if (nodes.length === 0) {
      setMessage('List is empty');
      return;
    }

    setMessage(`Deleting node at position ${position}`);
    setHighlightNodes([nodes[position].id]);
    await sleep(1000);
    
    const newNodes = [...nodes];
    newNodes.splice(position, 1);
    setNodes(newNodes);
    
    setHighlightNodes([]);
    setMessage('');
  };

  const traverse = async () => {
    if (nodes.length === 0) {
      setMessage('List is empty');
      return;
    }

    setMessage('Traversing circular list');
    
    // Traverse the list twice to show circular nature
    for (let round = 0; round < 2; round++) {
      for (let i = 0; i < nodes.length; i++) {
        setCurrentNode(i);
        setHighlightNodes([nodes[i].id]);
        await sleep(500);
      }
    }
    
    setCurrentNode(null);
    setHighlightNodes([]);
    setMessage('');
  };

  const rotate = async (direction: 'left' | 'right') => {
    if (nodes.length <= 1) {
      setMessage('List too short to rotate');
      return;
    }

    setMessage(`Rotating list ${direction}`);
    const newNodes = [...nodes];
    
    if (direction === 'left') {
      const firstNode = newNodes.shift()!;
      newNodes.push(firstNode);
    } else {
      const lastNode = newNodes.pop()!;
      newNodes.unshift(lastNode);
    }
    
    for (let i = 0; i < newNodes.length; i++) {
      setHighlightNodes([newNodes[i].id]);
      await sleep(500);
    }
    
    setNodes(newNodes);
    setHighlightNodes([]);
    setMessage('');
  };

  return (
    <VisualizerLayout
      title="Circular Linked List Visualization"
      description="Visualize operations on a Circular Linked List where the last node points back to the first node, creating a cycle."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => insertAfter(nodes.length - 1)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Insert at End
            </button>
            <button
              onClick={() => deleteNode(nodes.length - 1)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Delete Last Node
            </button>
            <button
              onClick={traverse}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Traverse List
            </button>
            <button
              onClick={() => rotate('left')}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
            >
              Rotate Left
            </button>
            <button
              onClick={() => rotate('right')}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              Rotate Right
            </button>
          </div>

          {message && (
            <div className="text-white bg-gray-800 p-4 rounded-lg">
              {message}
            </div>
          )}

          <LinkedListVisualization
            nodes={nodes}
            highlightNodes={highlightNodes}
            type="circular"
            currentNode={currentNode}
          />

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Circular Linked List Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Access: O(n)</li>
                <li>Search: O(n)</li>
                <li>Insert/Delete: O(1) with reference, O(n) without</li>
                <li>Rotation: O(1)</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(n)</p>
              <p><strong>Key Features:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>No null termination</li>
                <li>Last node points to first</li>
                <li>Continuous traversal possible</li>
                <li>Efficient rotation operations</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Round-robin scheduling</li>
                <li>Circular buffers</li>
                <li>Game turn management</li>
                <li>Repeating task execution</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
