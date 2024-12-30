"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import HeapVisualization from '@/components/visualization/heap/HeapVisualization';

interface HeapNode {
  value: number;
}

export default function MinHeapPage() {
  const [heap, setHeap] = useState<HeapNode[]>([
    { value: 1 },
    { value: 3 },
    { value: 2 },
    { value: 7 },
    { value: 8 },
    { value: 4 },
    { value: 5 },
  ]);
  const [highlightNodes, setHighlightNodes] = useState<number[]>([]);
  const [swappingNodes, setSwappingNodes] = useState<[number, number]>([-1, -1]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const heapifyUp = async (index: number) => {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      
      setHighlightNodes([index, parentIndex]);
      await sleep(1000);

      if (heap[parentIndex].value > heap[index].value) {
        setSwappingNodes([index, parentIndex]);
        await sleep(500);

        // Swap nodes
        const temp = heap[index];
        heap[index] = heap[parentIndex];
        heap[parentIndex] = temp;
        
        setHeap([...heap]);
        await sleep(500);
        
        index = parentIndex;
      } else {
        break;
      }
    }
    
    setHighlightNodes([]);
    setSwappingNodes([-1, -1]);
  };

  const insert = async (value: number) => {
    const newNode = { value };
    heap.push(newNode);
    setHeap([...heap]);
    await heapifyUp(heap.length - 1);
  };

  const extractMin = async () => {
    if (heap.length === 0) return;

    setHighlightNodes([0]);
    await sleep(1000);

    const min = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    setHeap([...heap]);

    if (heap.length > 0) {
      let index = 0;
      while (true) {
        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;
        let smallest = index;

        setHighlightNodes([index, leftChild, rightChild]);
        await sleep(1000);

        if (leftChild < heap.length && heap[leftChild].value < heap[smallest].value) {
          smallest = leftChild;
        }
        if (rightChild < heap.length && heap[rightChild].value < heap[smallest].value) {
          smallest = rightChild;
        }

        if (smallest !== index) {
          setSwappingNodes([index, smallest]);
          await sleep(500);

          // Swap nodes
          const temp = heap[index];
          heap[index] = heap[smallest];
          heap[smallest] = temp;
          
          setHeap([...heap]);
          await sleep(500);
          
          index = smallest;
        } else {
          break;
        }
      }
    }

    setHighlightNodes([]);
    setSwappingNodes([-1, -1]);
    return min;
  };

  const handleInsert = () => {
    const value = Math.floor(Math.random() * 100) + 1;
    insert(value);
  };

  return (
    <VisualizerLayout
      title="Min Heap Visualization"
      description="Visualize Min Heap operations including insertion and extract-min. Understand how heap maintains the min-heap property."
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
              onClick={() => extractMin()}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Extract Min
            </button>
          </div>

          <HeapVisualization
            nodes={heap}
            type="min"
            highlightNodes={highlightNodes}
            swappingIndices={swappingNodes}
          />

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Min Heap Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Structure Property:</strong> Complete binary tree</p>
              <p><strong>Heap Property:</strong> Parent's key is less than or equal to children's keys</p>
              <p><strong>Operations:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Insert: O(log n)</li>
                <li>Extract-Min: O(log n)</li>
                <li>Get-Min: O(1)</li>
                <li>Heapify: O(n)</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Priority Queues</li>
                <li>Dijkstra's Algorithm</li>
                <li>Heap Sort</li>
                <li>Event-driven simulation</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
