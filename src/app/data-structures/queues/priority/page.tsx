"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import HeapVisualization from '@/components/visualization/heap/HeapVisualization';

interface PriorityQueueNode {
  value: number;
  priority: number;
}

export default function PriorityQueuePage() {
  const [queue, setQueue] = useState<PriorityQueueNode[]>([
    { value: 1, priority: 5 },
    { value: 2, priority: 3 },
    { value: 3, priority: 4 },
    { value: 4, priority: 1 },
    { value: 5, priority: 2 },
  ]);
  const [highlightNodes, setHighlightNodes] = useState<number[]>([]);
  const [swappingNodes, setSwappingNodes] = useState<[number, number]>([-1, -1]);
  const [message, setMessage] = useState('');

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const heapifyUp = async (index: number) => {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      
      setHighlightNodes([index, parentIndex]);
      await sleep(1000);

      if (queue[parentIndex].priority < queue[index].priority) {
        setSwappingNodes([index, parentIndex]);
        await sleep(500);

        // Swap nodes
        const temp = queue[index];
        queue[index] = queue[parentIndex];
        queue[parentIndex] = temp;
        
        setQueue([...queue]);
        await sleep(500);
        
        index = parentIndex;
      } else {
        break;
      }
    }
    
    setHighlightNodes([]);
    setSwappingNodes([-1, -1]);
  };

  const heapifyDown = async (index: number) => {
    const size = queue.length;
    
    while (true) {
      let largest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      setHighlightNodes([index, leftChild, rightChild]);
      await sleep(1000);

      if (leftChild < size && queue[leftChild].priority > queue[largest].priority) {
        largest = leftChild;
      }
      if (rightChild < size && queue[rightChild].priority > queue[largest].priority) {
        largest = rightChild;
      }

      if (largest !== index) {
        setSwappingNodes([index, largest]);
        await sleep(500);

        // Swap nodes
        const temp = queue[index];
        queue[index] = queue[largest];
        queue[largest] = temp;
        
        setQueue([...queue]);
        await sleep(500);
        
        index = largest;
      } else {
        break;
      }
    }
    
    setHighlightNodes([]);
    setSwappingNodes([-1, -1]);
  };

  const enqueue = async () => {
    const value = Math.floor(Math.random() * 100) + 1;
    const priority = Math.floor(Math.random() * 10) + 1;
    
    setMessage(`Enqueuing value ${value} with priority ${priority}`);
    const newNode = { value, priority };
    queue.push(newNode);
    setQueue([...queue]);
    
    await heapifyUp(queue.length - 1);
    setMessage('');
  };

  const dequeue = async () => {
    if (queue.length === 0) {
      setMessage('Queue is empty');
      return;
    }

    setMessage(`Dequeuing highest priority item: ${queue[0].value} (priority: ${queue[0].priority})`);
    setHighlightNodes([0]);
    await sleep(1000);

    queue[0] = queue[queue.length - 1];
    queue.pop();
    setQueue([...queue]);

    if (queue.length > 0) {
      await heapifyDown(0);
    }

    setMessage('');
  };

  return (
    <VisualizerLayout
      title="Priority Queue Visualization"
      description="Visualize Priority Queue operations using a Max Heap implementation. Elements with higher priority values are dequeued first."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={enqueue}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Enqueue Random
            </button>
            <button
              onClick={dequeue}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Dequeue Highest Priority
            </button>
          </div>

          {message && (
            <div className="text-white bg-gray-800 p-4 rounded-lg">
              {message}
            </div>
          )}

          <HeapVisualization
            nodes={queue.map(node => ({ value: `${node.value} (${node.priority})` }))}
            type="priority"
            highlightNodes={highlightNodes}
            swappingIndices={swappingNodes}
          />

          <div className="glass-dark border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Queue Contents:</h4>
            <div className="flex flex-wrap gap-2">
              {queue.map((node, index) => (
                <div
                  key={index}
                  className={`px-3 py-1 rounded-lg ${
                    highlightNodes.includes(index)
                      ? 'bg-yellow-500'
                      : index === 0
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                >
                  <span className="text-white">
                    Value: {node.value}, Priority: {node.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Priority Queue Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Enqueue: O(log n)</li>
                <li>Dequeue: O(log n)</li>
                <li>Peek: O(1)</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(n)</p>
              <p><strong>Implementation Details:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Based on Max Heap</li>
                <li>Complete binary tree structure</li>
                <li>Priority-based ordering</li>
                <li>Efficient priority management</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Task scheduling</li>
                <li>Event handling</li>
                <li>Dijkstra's algorithm</li>
                <li>Operating systems</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
