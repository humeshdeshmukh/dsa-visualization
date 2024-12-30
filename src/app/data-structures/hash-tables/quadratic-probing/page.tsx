"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

interface HashNode {
  key: string;
  value: string;
  isDeleted?: boolean;
}

export default function QuadraticProbingPage() {
  const [tableSize] = useState(16);
  const [hashTable, setHashTable] = useState<(HashNode | null)[]>(
    Array(tableSize).fill(null)
  );
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const [probeCount, setProbeCount] = useState(0);
  const [loadFactor, setLoadFactor] = useState(0);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const hashFunction = (key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash) % tableSize;
  };

  const insert = async (key: string, value: string) => {
    let initialIndex = hashFunction(key);
    let index = initialIndex;
    let probes = 0;
    let i = 1;
    const visited = new Set<number>();
    
    setMessage(`Initial hash index for key "${key}": ${index}`);
    setHighlightIndices([index]);
    await sleep(1000);

    while (hashTable[index] !== null && !hashTable[index]?.isDeleted && !visited.has(index)) {
      visited.add(index);
      probes++;
      setProbeCount(prev => prev + 1);
      
      index = (initialIndex + i * i) % tableSize;
      setMessage(`Collision occurred. Quadratic probing step ${i}, new position: ${index}`);
      setHighlightIndices([index]);
      await sleep(500);
      i++;
    }

    if (visited.size === tableSize) {
      setMessage('Hash table is full');
      setHighlightIndices([]);
      return;
    }

    hashTable[index] = { key, value };
    setHashTable([...hashTable]);
    
    const itemCount = hashTable.filter(item => item !== null && !item.isDeleted).length;
    setLoadFactor(itemCount / tableSize);

    setMessage(`Inserted at index ${index}`);
    await sleep(1000);
    setHighlightIndices([]);
    setMessage('');
  };

  const search = async (key: string) => {
    let initialIndex = hashFunction(key);
    let index = initialIndex;
    let i = 1;
    const visited = new Set<number>();

    setMessage(`Searching for key "${key}" starting at index ${index}`);
    setHighlightIndices([index]);
    await sleep(1000);

    while (hashTable[index] !== null && !visited.has(index)) {
      if (!hashTable[index]?.isDeleted && hashTable[index]?.key === key) {
        setMessage(`Found key "${key}" with value "${hashTable[index]?.value}" at index ${index}`);
        await sleep(1500);
        setHighlightIndices([]);
        setMessage('');
        return;
      }

      visited.add(index);
      index = (initialIndex + i * i) % tableSize;
      setMessage(`Key not found at ${(initialIndex + (i-1) * (i-1)) % tableSize}, probing next position: ${index}`);
      setHighlightIndices([index]);
      await sleep(500);
      i++;
    }

    setMessage(`Key "${key}" not found in hash table`);
    await sleep(1500);
    setHighlightIndices([]);
    setMessage('');
  };

  const remove = async (key: string) => {
    let initialIndex = hashFunction(key);
    let index = initialIndex;
    let i = 1;
    const visited = new Set<number>();

    setMessage(`Removing key "${key}" starting at index ${index}`);
    setHighlightIndices([index]);
    await sleep(1000);

    while (hashTable[index] !== null && !visited.has(index)) {
      if (!hashTable[index]?.isDeleted && hashTable[index]?.key === key) {
        hashTable[index].isDeleted = true;
        setHashTable([...hashTable]);
        
        const itemCount = hashTable.filter(item => item !== null && !item.isDeleted).length;
        setLoadFactor(itemCount / tableSize);

        setMessage(`Marked key "${key}" as deleted at index ${index}`);
        await sleep(1500);
        setHighlightIndices([]);
        setMessage('');
        return;
      }

      visited.add(index);
      index = (initialIndex + i * i) % tableSize;
      setHighlightIndices([index]);
      await sleep(500);
      i++;
    }

    setMessage(`Key "${key}" not found in hash table`);
    await sleep(1500);
    setHighlightIndices([]);
    setMessage('');
  };

  const handleInsert = () => {
    const key = Math.random().toString(36).substring(7);
    const value = Math.random().toString(36).substring(7);
    insert(key, value);
  };

  return (
    <VisualizerLayout
      title="Quadratic Probing Hash Table Visualization"
      description="Visualize how Quadratic Probing handles collisions by using quadratic function to find next available slot."
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
              onClick={() => search(hashTable.find(item => item && !item.isDeleted)?.key || '')}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Search First Key
            </button>
            <button
              onClick={() => remove(hashTable.find(item => item && !item.isDeleted)?.key || '')}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Remove First Key
            </button>
          </div>

          {message && (
            <div className="text-white bg-gray-800 p-4 rounded-lg">
              {message}
            </div>
          )}

          <div className="glass-dark border border-white/10 rounded-lg p-6">
            <div className="grid grid-cols-4 gap-4">
              {hashTable.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    highlightIndices.includes(index)
                      ? 'bg-yellow-500'
                      : item?.isDeleted
                      ? 'bg-red-500/30'
                      : item
                      ? 'bg-blue-500'
                      : 'bg-gray-700'
                  }`}
                >
                  <div className="text-white font-mono mb-1">Index {index}</div>
                  {item && !item.isDeleted ? (
                    <div className="text-white">
                      <div>{item.key}: {item.value}</div>
                    </div>
                  ) : item?.isDeleted ? (
                    <div className="text-gray-300">Deleted</div>
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
                  <p>Total Probes: {probeCount}</p>
                  <p>Load Factor: {loadFactor.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Quadratic Probing Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Average Case: O(1/(1-α)) where α is the load factor</li>
                <li>Worst Case: O(n) when probing fails to find empty slot</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(n)</p>
              <p><strong>Advantages:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Reduces primary clustering</li>
                <li>Better distribution than linear probing</li>
                <li>Good cache performance</li>
                <li>Simple implementation</li>
              </ul>
              <p><strong>Disadvantages:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Secondary clustering</li>
                <li>Not guaranteed to find empty slot</li>
                <li>Table size should be prime</li>
                <li>Performance degrades at high load factors</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
