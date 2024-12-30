"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

interface HashNode {
  key: string;
  value: string;
}

export default function BasicHashTablePage() {
  const [tableSize] = useState(16);
  const [table, setTable] = useState<(HashNode | null)[]>(Array(tableSize).fill(null));
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [message, setMessage] = useState('');
  const [collisions, setCollisions] = useState(0);
  const [loadFactor, setLoadFactor] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
    if (isAnimating) return;
    setIsAnimating(true);

    const index = hashFunction(key);
    setHighlightIndex(index);
    setMessage(`Hashing key "${key}" to index ${index}`);
    await sleep(1000);

    if (table[index] === null) {
      const newTable = [...table];
      newTable[index] = { key, value };
      setTable(newTable);
      
      const itemCount = newTable.filter(item => item !== null).length;
      setLoadFactor(itemCount / tableSize);
      
      setMessage(`Inserted key-value pair at index ${index}`);
    } else if (table[index].key === key) {
      const newTable = [...table];
      newTable[index] = { key, value };
      setTable(newTable);
      setMessage(`Updated value for key "${key}" at index ${index}`);
    } else {
      setCollisions(prev => prev + 1);
      setMessage(`Collision at index ${index}! Cannot insert key "${key}"`);
    }

    await sleep(1000);
    setHighlightIndex(-1);
    setIsAnimating(false);
  };

  const search = async (key: string) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const index = hashFunction(key);
    setHighlightIndex(index);
    setMessage(`Searching for key "${key}" at index ${index}`);
    await sleep(1000);

    if (table[index] === null) {
      setMessage(`Key "${key}" not found`);
    } else if (table[index].key === key) {
      setMessage(`Found value "${table[index].value}" for key "${key}"`);
    } else {
      setMessage(`Key "${key}" not found (collision at this index)`);
    }

    await sleep(1000);
    setHighlightIndex(-1);
    setIsAnimating(false);
  };

  const remove = async (key: string) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const index = hashFunction(key);
    setHighlightIndex(index);
    setMessage(`Removing key "${key}" from index ${index}`);
    await sleep(1000);

    if (table[index] === null) {
      setMessage(`Key "${key}" not found`);
    } else if (table[index].key === key) {
      const newTable = [...table];
      newTable[index] = null;
      setTable(newTable);
      
      const itemCount = newTable.filter(item => item !== null).length;
      setLoadFactor(itemCount / tableSize);
      
      setMessage(`Removed key "${key}"`);
    } else {
      setMessage(`Key "${key}" not found (collision at this index)`);
    }

    await sleep(1000);
    setHighlightIndex(-1);
    setIsAnimating(false);
  };

  const handleInsert = () => {
    const key = Math.random().toString(36).substring(7);
    const value = Math.random().toString(36).substring(7);
    insert(key, value);
  };

  const handleSearch = () => {
    const firstItem = table.find(item => item !== null);
    if (firstItem) {
      search(firstItem.key);
    } else {
      setMessage('Table is empty');
    }
  };

  const handleRemove = () => {
    const firstItem = table.find(item => item !== null);
    if (firstItem) {
      remove(firstItem.key);
    } else {
      setMessage('Table is empty');
    }
  };

  const clearTable = () => {
    setTable(Array(tableSize).fill(null));
    setCollisions(0);
    setLoadFactor(0);
    setMessage('Hash table cleared');
  };

  return (
    <VisualizerLayout
      title="Basic Hash Table Visualization"
      description="Visualize basic hash table operations with simple collision detection."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={handleInsert}
              disabled={isAnimating}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Insert Random
            </button>
            <button
              onClick={handleSearch}
              disabled={isAnimating}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Search First Key
            </button>
            <button
              onClick={handleRemove}
              disabled={isAnimating}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Remove First Key
            </button>
            <button
              onClick={clearTable}
              disabled={isAnimating}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Clear Table
            </button>
          </div>

          {message && (
            <div className="text-white bg-gray-800 p-4 rounded-lg">
              {message}
            </div>
          )}

          <div className="glass-dark border border-white/10 rounded-lg p-6">
            <div className="grid grid-cols-4 gap-4">
              {table.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    index === highlightIndex
                      ? 'bg-yellow-500'
                      : item
                      ? 'bg-blue-500'
                      : 'bg-gray-700'
                  }`}
                >
                  <div className="text-white font-mono mb-1">Index {index}</div>
                  {item ? (
                    <div className="text-white">
                      <div className="truncate">{item.key}: {item.value}</div>
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
                  <p>Total Collisions: {collisions}</p>
                  <p>Load Factor: {loadFactor.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Hash Table Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Average Case: O(1) for insert, search, delete</li>
                <li>Worst Case: O(1) for insert, O(1) for search/delete with collision</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(n)</p>
              <p><strong>Features:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Fixed size table</li>
                <li>Simple collision detection</li>
                <li>No collision resolution</li>
                <li>Direct addressing</li>
              </ul>
              <p><strong>Limitations:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Cannot handle collisions</li>
                <li>Space inefficient</li>
                <li>Fixed capacity</li>
                <li>No dynamic resizing</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
