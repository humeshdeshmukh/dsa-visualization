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

export default function DoublyLinkedListPage() {
  const [nodes, setNodes] = useState<ListNode[]>([
    { value: 1, id: 1 },
    { value: 2, id: 2 },
    { value: 3, id: 3 },
  ]);
  const [highlightNodes, setHighlightNodes] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [nextId, setNextId] = useState(4);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const insertAtHead = async () => {
    const newValue = Math.floor(Math.random() * 100) + 1;
    setMessage(`Inserting ${newValue} at head`);
    
    const newNode = { value: newValue, id: nextId };
    setHighlightNodes([nextId]);
    setNodes([newNode, ...nodes]);
    setNextId(nextId + 1);
    
    await sleep(1000);
    setHighlightNodes([]);
    setMessage('');
  };

  const insertAtTail = async () => {
    const newValue = Math.floor(Math.random() * 100) + 1;
    setMessage(`Inserting ${newValue} at tail`);
    
    const newNode = { value: newValue, id: nextId };
    setHighlightNodes([nextId]);
    setNodes([...nodes, newNode]);
    setNextId(nextId + 1);
    
    await sleep(1000);
    setHighlightNodes([]);
    setMessage('');
  };

  const deleteAtHead = async () => {
    if (nodes.length === 0) {
      setMessage('List is empty');
      return;
    }

    setMessage('Deleting from head');
    setHighlightNodes([nodes[0].id]);
    await sleep(1000);
    
    setNodes(nodes.slice(1));
    setHighlightNodes([]);
    setMessage('');
  };

  const deleteAtTail = async () => {
    if (nodes.length === 0) {
      setMessage('List is empty');
      return;
    }

    setMessage('Deleting from tail');
    setHighlightNodes([nodes[nodes.length - 1].id]);
    await sleep(1000);
    
    setNodes(nodes.slice(0, -1));
    setHighlightNodes([]);
    setMessage('');
  };

  const reverse = async () => {
    if (nodes.length <= 1) {
      setMessage('List too short to reverse');
      return;
    }

    setMessage('Reversing list');
    const reversedNodes = [...nodes].reverse();
    
    for (let i = 0; i < reversedNodes.length; i++) {
      setHighlightNodes([reversedNodes[i].id]);
      await sleep(500);
    }
    
    setNodes(reversedNodes);
    setHighlightNodes([]);
    setMessage('');
  };

  return (
    <VisualizerLayout
      title="Doubly Linked List Visualization"
      description="Visualize operations on a Doubly Linked List where each node contains references to both next and previous nodes."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={insertAtHead}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Insert at Head
            </button>
            <button
              onClick={insertAtTail}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Insert at Tail
            </button>
            <button
              onClick={deleteAtHead}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Delete from Head
            </button>
            <button
              onClick={deleteAtTail}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
            >
              Delete from Tail
            </button>
            <button
              onClick={reverse}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              Reverse List
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
            type="doubly"
          />

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Doubly Linked List Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Access: O(n)</li>
                <li>Search: O(n)</li>
                <li>Insert/Delete at ends: O(1)</li>
                <li>Insert/Delete at middle: O(n)</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(n)</p>
              <p><strong>Key Features:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Bidirectional traversal</li>
                <li>No need to keep track of previous node</li>
                <li>Easy deletion of nodes</li>
                <li>More memory per node</li>
              </ul>
              <p><strong>Common Operations:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Insert at head/tail</li>
                <li>Delete from head/tail</li>
                <li>Forward/backward traversal</li>
                <li>Reverse list</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
