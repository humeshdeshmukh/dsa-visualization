"use client";

import { useState, useRef, useEffect } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

interface HeapNode {
  value: number;
  priority: number;
  highlighted?: boolean;
}

export default function PriorityQueuePage() {
  const [heap, setHeap] = useState<HeapNode[]>([]);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);

  useEffect(() => {
    drawHeap();
  }, [heap, highlightedNodes]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const drawHeap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (heap.length === 0) return;

    const levelHeight = 60;
    const nodeRadius = 20;
    const startX = canvas.width / 2;
    const startY = 40;

    // Draw edges first
    for (let i = 0; i < heap.length; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const nodesInLevel = Math.pow(2, level);
      const levelWidth = canvas.width * 0.8;
      const spacing = levelWidth / nodesInLevel;
      const offset = (canvas.width - levelWidth) / 2 + spacing / 2;
      const position = i - Math.pow(2, level) + 1;
      
      const x = offset + position * spacing;
      const y = startY + level * levelHeight;

      // Draw edges to children
      const leftChild = 2 * i + 1;
      const rightChild = 2 * i + 2;

      if (leftChild < heap.length || rightChild < heap.length) {
        const nextLevel = level + 1;
        const nextNodesInLevel = Math.pow(2, nextLevel);
        const nextLevelWidth = canvas.width * 0.8;
        const nextSpacing = nextLevelWidth / nextNodesInLevel;
        const nextOffset = (canvas.width - nextLevelWidth) / 2 + nextSpacing / 2;

        ctx.beginPath();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        if (leftChild < heap.length) {
          const leftX = nextOffset + (leftChild - Math.pow(2, nextLevel) + 1) * nextSpacing;
          const leftY = startY + nextLevel * levelHeight;
          ctx.moveTo(x, y + nodeRadius);
          ctx.lineTo(leftX, leftY - nodeRadius);
        }

        if (rightChild < heap.length) {
          const rightX = nextOffset + (rightChild - Math.pow(2, nextLevel) + 1) * nextSpacing;
          const rightY = startY + nextLevel * levelHeight;
          ctx.moveTo(x, y + nodeRadius);
          ctx.lineTo(rightX, rightY - nodeRadius);
        }

        ctx.stroke();
      }
    }

    // Draw nodes
    for (let i = 0; i < heap.length; i++) {
      const level = Math.floor(Math.log2(i + 1));
      const nodesInLevel = Math.pow(2, level);
      const levelWidth = canvas.width * 0.8;
      const spacing = levelWidth / nodesInLevel;
      const offset = (canvas.width - levelWidth) / 2 + spacing / 2;
      const position = i - Math.pow(2, level) + 1;
      
      const x = offset + position * spacing;
      const y = startY + level * levelHeight;

      // Draw node circle
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
      
      if (highlightedNodes.includes(i)) {
        ctx.fillStyle = '#F59E0B'; // Yellow for highlighted nodes
      } else {
        ctx.fillStyle = '#3B82F6'; // Blue for normal nodes
      }
      
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Draw node value and priority
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${heap[i].value}`, x, y - 6);
      ctx.fillText(`(${heap[i].priority})`, x, y + 6);
    }
  };

  const swap = (arr: HeapNode[], i: number, j: number) => {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  };

  const siftUp = async (index: number) => {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      setHighlightedNodes([index, parentIndex]);
      await sleep(1000);

      if (heap[parentIndex].priority > heap[index].priority) {
        swap(heap, index, parentIndex);
        setHeap([...heap]);
        index = parentIndex;
      } else {
        break;
      }
    }
    setHighlightedNodes([]);
  };

  const siftDown = async (index: number) => {
    const length = heap.length;
    
    while (true) {
      let smallest = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;

      setHighlightedNodes([index, leftChild, rightChild]);
      await sleep(1000);

      if (leftChild < length && heap[leftChild].priority < heap[smallest].priority) {
        smallest = leftChild;
      }
      if (rightChild < length && heap[rightChild].priority < heap[smallest].priority) {
        smallest = rightChild;
      }

      if (smallest !== index) {
        swap(heap, index, smallest);
        setHeap([...heap]);
        index = smallest;
      } else {
        break;
      }
    }
    setHighlightedNodes([]);
  };

  const enqueue = async (value: number, priority: number) => {
    if (isAnimating) return;
    setIsAnimating(true);

    setMessage(`Enqueueing value ${value} with priority ${priority}`);
    const newHeap = [...heap, { value, priority }];
    setHeap(newHeap);
    await sleep(1000);

    await siftUp(newHeap.length - 1);
    setMessage(`Enqueued value ${value} with priority ${priority}`);
    setIsAnimating(false);
  };

  const dequeue = async () => {
    if (isAnimating || heap.length === 0) return;
    setIsAnimating(true);

    const removedNode = heap[0];
    setMessage(`Dequeuing value ${removedNode.value} with priority ${removedNode.priority}`);
    
    if (heap.length === 1) {
      setHeap([]);
    } else {
      heap[0] = heap[heap.length - 1];
      heap.pop();
      setHeap([...heap]);
      await sleep(1000);
      await siftDown(0);
    }

    setMessage(`Dequeued value ${removedNode.value} with priority ${removedNode.priority}`);
    setIsAnimating(false);
    return removedNode;
  };

  const handleEnqueue = () => {
    const value = Math.floor(Math.random() * 100);
    const priority = Math.floor(Math.random() * 10);
    enqueue(value, priority);
  };

  const clearQueue = () => {
    setHeap([]);
    setMessage('Priority queue cleared');
    setHighlightedNodes([]);
  };

  return (
    <VisualizerLayout
      title="Priority Queue Visualization"
      description="Visualize a min-heap based priority queue where lower priority numbers have higher precedence."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={handleEnqueue}
              disabled={isAnimating}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Enqueue Random
            </button>
            <button
              onClick={() => dequeue()}
              disabled={isAnimating || heap.length === 0}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Dequeue
            </button>
            <button
              onClick={clearQueue}
              disabled={isAnimating || heap.length === 0}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Clear Queue
            </button>
          </div>

          {message && (
            <div className="text-white bg-gray-800 p-4 rounded-lg">
              {message}
            </div>
          )}

          <div className="glass-dark border border-white/10 rounded-lg p-6">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full bg-gray-900 rounded-lg"
            />
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
                <li>Based on Binary Min-Heap</li>
                <li>Parent has lower priority than children</li>
                <li>Complete binary tree structure</li>
                <li>Root is always the highest priority element</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Task scheduling</li>
                <li>Dijkstra's algorithm</li>
                <li>Event-driven simulation</li>
                <li>Huffman coding</li>
              </ul>
              <p><strong>Node Format:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Value: The actual data</li>
                <li>Priority: Lower number = higher priority</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
