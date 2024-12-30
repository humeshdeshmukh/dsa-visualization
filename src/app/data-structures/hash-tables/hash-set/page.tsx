"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

interface HashNode {
  value: string;
  next: HashNode | null;
}

export default function HashSetPage() {
  const [initialSize] = useState(8);
  const [table, setTable] = useState<(HashNode | null)[]>(Array(initialSize).fill(null));
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [message, setMessage] = useState('');
  const [collisions, setCollisions] = useState(0);
  const [loadFactor, setLoadFactor] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [size, setSize] = useState(0);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const hashFunction = (value: string): number => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = ((hash << 5) - hash) + value.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % table.length;
  };

  const rehash = async () => {
    const oldTable = [...table];
    const newSize = table.length * 2;
    const newTable = Array(newSize).fill(null);
    setTable(newTable);
    setMessage(`Rehashing: expanding table size to ${newSize}`);
    await sleep(1000);

    let newCollisions = 0;
    for (let i = 0; i < oldTable.length; i++) {
      let node = oldTable[i];
      while (node) {
        const index = hashFunction(node.value);
        if (newTable[index]) {
          newCollisions++;
        }
        newTable[index] = {
          value: node.value,
          next: newTable[index]
        };
        node = node.next;
      }
    }

    setTable(newTable);
    setCollisions(newCollisions);
    setLoadFactor(size / newSize);
    setMessage('Rehashing complete');
    await sleep(500);
  };

  const add = async (value: string) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const index = hashFunction(value);
    setHighlightIndex(index);
    setMessage(`Hashing value "${value}" to index ${index}`);
    await sleep(1000);

    let node = table[index];
    while (node) {
      if (node.value === value) {
        setMessage(`Value "${value}" already exists in set`);
        setHighlightIndex(-1);
        setIsAnimating(false);
        return;
      }
      node = node.next;
    }

    const newTable = [...table];
    if (newTable[index]) {
      setCollisions(prev => prev + 1);
      setMessage(`Collision at index ${index}! Adding to chain.`);
      await sleep(500);
    }

    newTable[index] = {
      value,
      next: newTable[index]
    };
    setTable(newTable);
    setSize(prev => prev + 1);
    
    const newLoadFactor = (size + 1) / table.length;
    setLoadFactor(newLoadFactor);
    
    if (newLoadFactor > 0.75) {
      await rehash();
    }

    setMessage(`Added value "${value}" at index ${index}`);
    await sleep(500);
    setHighlightIndex(-1);
    setIsAnimating(false);
  };

  const contains = async (value: string) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const index = hashFunction(value);
    setHighlightIndex(index);
    setMessage(`Searching for value "${value}" at index ${index}`);
    await sleep(1000);

    let node = table[index];
    let steps = 0;
    while (node) {
      steps++;
      if (node.value === value) {
        setMessage(`Found value "${value}" after ${steps} step(s)`);
        await sleep(1000);
        setHighlightIndex(-1);
        setIsAnimating(false);
        return true;
      }
      node = node.next;
      await sleep(500);
    }

    setMessage(`Value "${value}" not found in set`);
    await sleep(500);
    setHighlightIndex(-1);
    setIsAnimating(false);
    return false;
  };

  const remove = async (value: string) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const index = hashFunction(value);
    setHighlightIndex(index);
    setMessage(`Removing value "${value}" from index ${index}`);
    await sleep(1000);

    if (!table[index]) {
      setMessage(`Value "${value}" not found`);
      setHighlightIndex(-1);
      setIsAnimating(false);
      return;
    }

    const newTable = [...table];
    if (newTable[index].value === value) {
      newTable[index] = newTable[index].next;
      setTable(newTable);
      setSize(prev => prev - 1);
      setLoadFactor(size / table.length);
      setMessage(`Removed value "${value}"`);
      await sleep(500);
      setHighlightIndex(-1);
      setIsAnimating(false);
      return;
    }

    let node = newTable[index];
    while (node.next) {
      if (node.next.value === value) {
        node.next = node.next.next;
        setTable(newTable);
        setSize(prev => prev - 1);
        setLoadFactor(size / table.length);
        setMessage(`Removed value "${value}"`);
        await sleep(500);
        setHighlightIndex(-1);
        setIsAnimating(false);
        return;
      }
      node = node.next;
    }

    setMessage(`Value "${value}" not found`);
    await sleep(500);
    setHighlightIndex(-1);
    setIsAnimating(false);
  };

  const handleAdd = () => {
    const value = Math.random().toString(36).substring(7);
    add(value);
  };

  const handleContains = () => {
    let firstValue = null;
    for (let i = 0; i < table.length; i++) {
      let node = table[i];
      if (node) {
        firstValue = node.value;
        break;
      }
    }
    
    if (firstValue) {
      contains(firstValue);
    } else {
      setMessage('Set is empty');
    }
  };

  const handleRemove = () => {
    let firstValue = null;
    for (let i = 0; i < table.length; i++) {
      let node = table[i];
      if (node) {
        firstValue = node.value;
        break;
      }
    }
    
    if (firstValue) {
      remove(firstValue);
    } else {
      setMessage('Set is empty');
    }
  };

  const clearSet = () => {
    setTable(Array(initialSize).fill(null));
    setCollisions(0);
    setLoadFactor(0);
    setSize(0);
    setMessage('Hash set cleared');
  };

  return (
    <VisualizerLayout
      title="Hash Set Visualization"
      description="Visualize hash set operations with chaining for collision resolution and dynamic resizing."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={handleAdd}
              disabled={isAnimating}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Add Random
            </button>
            <button
              onClick={handleContains}
              disabled={isAnimating}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Contains First
            </button>
            <button
              onClick={handleRemove}
              disabled={isAnimating}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Remove First
            </button>
            <button
              onClick={clearSet}
              disabled={isAnimating}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Clear Set
            </button>
          </div>

          {message && (
            <div className="text-white bg-gray-800 p-4 rounded-lg">
              {message}
            </div>
          )}

          <div className="glass-dark border border-white/10 rounded-lg p-6">
            <div className="grid grid-cols-4 gap-4">
              {table.map((head, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    index === highlightIndex
                      ? 'bg-yellow-500'
                      : head
                      ? 'bg-blue-500'
                      : 'bg-gray-700'
                  }`}
                >
                  <div className="text-white font-mono mb-1">Index {index}</div>
                  {head ? (
                    <div className="space-y-2">
                      {(() => {
                        const nodes = [];
                        let node = head;
                        let count = 0;
                        while (node && count < 3) {
                          nodes.push(
                            <div key={node.value} className="text-white truncate">
                              {node.value}
                            </div>
                          );
                          node = node.next;
                          count++;
                        }
                        if (node) {
                          nodes.push(
                            <div key="more" className="text-gray-300 italic">
                              + more...
                            </div>
                          );
                        }
                        return nodes;
                      })()}
                    </div>
                  ) : (
                    <div className="text-gray-400">Empty</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark border border-white/10 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Statistics:</h4>
                <div className="space-y-2 text-gray-300">
                  <p>Size: {size}</p>
                  <p>Table Length: {table.length}</p>
                  <p>Total Collisions: {collisions}</p>
                  <p>Load Factor: {loadFactor.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Hash Set Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Average Case: O(1) for add, contains, remove</li>
                <li>Worst Case: O(n) when many collisions</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(n)</p>
              <p><strong>Features:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>No duplicate values</li>
                <li>Dynamic resizing (rehashing)</li>
                <li>Chaining for collision resolution</li>
                <li>Load factor tracking</li>
              </ul>
              <p><strong>Implementation Details:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Rehashing when load factor > 0.75</li>
                <li>Linked list chaining</li>
                <li>Table size doubles on rehash</li>
                <li>Maintains insertion order in chains</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
