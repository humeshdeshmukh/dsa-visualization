"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

interface HashNode {
  key: string;
  value: string;
}

interface Bucket {
  nodes: HashNode[];
}

export default function SeparateChainingPage() {
  const [tableSize] = useState(8);
  const [hashTable, setHashTable] = useState<Bucket[]>(
    Array(tableSize).fill(null).map(() => ({ nodes: [] }))
  );
  const [highlightBucket, setHighlightBucket] = useState<number>(-1);
  const [message, setMessage] = useState('');
  const [collisions, setCollisions] = useState(0);
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
    const index = hashFunction(key);
    setHighlightBucket(index);
    setMessage(`Hashing key "${key}" to index ${index}`);
    await sleep(1000);

    const bucket = hashTable[index];
    const existingNode = bucket.nodes.find(node => node.key === key);

    if (existingNode) {
      setMessage(`Updating value for key "${key}"`);
      existingNode.value = value;
    } else {
      setMessage(`Inserting new key-value pair at index ${index}`);
      bucket.nodes.push({ key, value });
      if (bucket.nodes.length > 1) {
        setCollisions(prev => prev + 1);
      }
    }

    const totalItems = hashTable.reduce((sum, bucket) => sum + bucket.nodes.length, 0);
    setLoadFactor(totalItems / tableSize);

    setHashTable([...hashTable]);
    await sleep(1000);
    setHighlightBucket(-1);
    setMessage('');
  };

  const search = async (key: string) => {
    const index = hashFunction(key);
    setHighlightBucket(index);
    setMessage(`Searching for key "${key}" at index ${index}`);
    await sleep(1000);

    const bucket = hashTable[index];
    const node = bucket.nodes.find(node => node.key === key);

    if (node) {
      setMessage(`Found value "${node.value}" for key "${key}"`);
    } else {
      setMessage(`Key "${key}" not found`);
    }

    await sleep(1500);
    setHighlightBucket(-1);
    setMessage('');
  };

  const remove = async (key: string) => {
    const index = hashFunction(key);
    setHighlightBucket(index);
    setMessage(`Removing key "${key}" from index ${index}`);
    await sleep(1000);

    const bucket = hashTable[index];
    const nodeIndex = bucket.nodes.findIndex(node => node.key === key);

    if (nodeIndex !== -1) {
      bucket.nodes.splice(nodeIndex, 1);
      setHashTable([...hashTable]);
      setMessage(`Removed key "${key}"`);
      
      const totalItems = hashTable.reduce((sum, bucket) => sum + bucket.nodes.length, 0);
      setLoadFactor(totalItems / tableSize);
    } else {
      setMessage(`Key "${key}" not found`);
    }

    await sleep(1000);
    setHighlightBucket(-1);
    setMessage('');
  };

  const handleInsert = () => {
    const key = Math.random().toString(36).substring(7);
    const value = Math.random().toString(36).substring(7);
    insert(key, value);
  };

  return (
    <VisualizerLayout
      title="Separate Chaining Hash Table Visualization"
      description="Visualize how Separate Chaining handles collisions by maintaining a linked list of elements at each bucket."
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
              onClick={() => search(hashTable.find(b => b.nodes.length > 0)?.nodes[0]?.key || '')}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Search First Key
            </button>
            <button
              onClick={() => remove(hashTable.find(b => b.nodes.length > 0)?.nodes[0]?.key || '')}
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
            <div className="space-y-4">
              {hashTable.map((bucket, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    highlightBucket === index ? 'bg-yellow-500' : 'bg-gray-700'
                  }`}
                >
                  <div className="text-white font-mono mb-2">Bucket {index}:</div>
                  <div className="flex gap-2 flex-wrap">
                    {bucket.nodes.map((node, nodeIndex) => (
                      <div
                        key={nodeIndex}
                        className="px-3 py-1 bg-blue-500 rounded-lg text-white"
                      >
                        {node.key}: {node.value}
                      </div>
                    ))}
                    {bucket.nodes.length === 0 && (
                      <div className="text-gray-400">Empty</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark border border-white/10 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Statistics:</h4>
                <div className="space-y-2 text-gray-300">
                  <p>Collisions: {collisions}</p>
                  <p>Load Factor: {loadFactor.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Separate Chaining Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Average Case: O(1 + α) where α is the load factor</li>
                <li>Worst Case: O(n) when all keys hash to same bucket</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(n + m) where m is table size</p>
              <p><strong>Advantages:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Simple to implement</li>
                <li>Deletion is easy</li>
                <li>Performance degrades gracefully</li>
                <li>No space is wasted</li>
              </ul>
              <p><strong>Disadvantages:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Extra space for linked lists</li>
                <li>Poor cache performance</li>
                <li>Extra overhead per node</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
