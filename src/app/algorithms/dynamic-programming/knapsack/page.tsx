"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

interface Item {
  id: number;
  weight: number;
  value: number;
}

export default function KnapsackPage() {
  const [items] = useState<Item[]>([
    { id: 0, weight: 2, value: 3 },
    { id: 1, weight: 3, value: 4 },
    { id: 2, weight: 4, value: 5 },
    { id: 3, weight: 5, value: 6 },
  ]);

  const [capacity, setCapacity] = useState(10);
  const [dp, setDp] = useState<number[][]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentCell, setCurrentCell] = useState<[number, number] | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const solveKnapsack = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setSelectedItems([]);

    // Initialize DP table
    const n = items.length;
    const newDp: number[][] = Array(n + 1)
      .fill(0)
      .map(() => Array(capacity + 1).fill(0));
    setDp(newDp);
    await sleep(500);

    // Fill DP table
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        setCurrentCell([i, w]);
        await sleep(200);

        if (items[i - 1].weight <= w) {
          newDp[i][w] = Math.max(
            items[i - 1].value + newDp[i - 1][w - items[i - 1].weight],
            newDp[i - 1][w]
          );
        } else {
          newDp[i][w] = newDp[i - 1][w];
        }
        setDp([...newDp]);
      }
    }

    // Find selected items
    let w = capacity;
    const selected: number[] = [];
    for (let i = n; i > 0 && w > 0; i--) {
      if (newDp[i][w] !== newDp[i - 1][w]) {
        selected.push(items[i - 1].id);
        w -= items[i - 1].weight;
        setCurrentCell([i, w]);
        await sleep(500);
      }
    }

    setSelectedItems(selected);
    setCurrentCell(null);
    setIsRunning(false);
  };

  return (
    <VisualizerLayout
      title="0/1 Knapsack Dynamic Programming Visualization"
      description="Visualize how Dynamic Programming solves the 0/1 Knapsack problem by building a table of optimal solutions for subproblems."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-white">Capacity:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={capacity}
                onChange={(e) => setCapacity(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20 px-3 py-2 bg-gray-800 text-white rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={solveKnapsack}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Solve Knapsack
            </button>
          </div>

          <div className="glass-dark border border-white/10 rounded-lg p-6">
            <h4 className="text-white font-semibold mb-4">Items:</h4>
            <div className="grid grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg ${
                    selectedItems.includes(item.id) ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                >
                  <div className="text-white">
                    <div>Weight: {item.weight}</div>
                    <div>Value: {item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark border border-white/10 rounded-lg p-6 overflow-x-auto">
            <h4 className="text-white font-semibold mb-4">DP Table:</h4>
            <div className="inline-block">
              <div className="grid" style={{ gridTemplateColumns: `auto repeat(${capacity + 1}, minmax(40px, 1fr))` }}>
                <div className="p-2 text-white font-semibold">Items/Weight</div>
                {Array(capacity + 1)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="p-2 text-white font-semibold text-center">
                      {i}
                    </div>
                  ))}
                {dp.map((row, i) => (
                  <>
                    <div key={`item-${i}`} className="p-2 text-white font-semibold">
                      {i === 0 ? '0' : `Item ${i}`}
                    </div>
                    {row.map((cell, j) => (
                      <div
                        key={`${i}-${j}`}
                        className={`p-2 text-white text-center ${
                          currentCell?.[0] === i && currentCell?.[1] === j
                            ? 'bg-yellow-500'
                            : 'bg-gray-700'
                        }`}
                      >
                        {cell}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">0/1 Knapsack Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong> O(n * W)</p>
              <p><strong>Space Complexity:</strong> O(n * W)</p>
              <p><strong>Problem Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>NP-hard problem</li>
                <li>Optimal substructure</li>
                <li>Overlapping subproblems</li>
                <li>Items cannot be split (0/1 property)</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Resource allocation</li>
                <li>Portfolio optimization</li>
                <li>Cargo loading</li>
                <li>Investment decisions</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
