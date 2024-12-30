"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import GraphVisualization from '@/components/visualization/graph/GraphVisualization';

interface Node {
  id: number;
  value: string;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
}

export default function KruskalPage() {
  const [nodes] = useState<Node[]>([
    { id: 0, value: 'A' },
    { id: 1, value: 'B' },
    { id: 2, value: 'C' },
    { id: 3, value: 'D' },
    { id: 4, value: 'E' },
    { id: 5, value: 'F' },
  ]);

  const [edges] = useState<Edge[]>([
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 2 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 3, weight: 8 },
    { from: 2, to: 4, weight: 10 },
    { from: 3, to: 4, weight: 2 },
    { from: 3, to: 5, weight: 6 },
    { from: 4, to: 5, weight: 3 },
  ]);

  const [highlightNodes, setHighlightNodes] = useState<number[]>([]);
  const [highlightEdges, setHighlightEdges] = useState<[number, number][]>([]);
  const [mstEdges, setMstEdges] = useState<[number, number][]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  class UnionFind {
    parent: number[];
    rank: number[];

    constructor(size: number) {
      this.parent = Array.from({ length: size }, (_, i) => i);
      this.rank = Array(size).fill(0);
    }

    find(x: number): number {
      if (this.parent[x] !== x) {
        this.parent[x] = this.find(this.parent[x]);
      }
      return this.parent[x];
    }

    union(x: number, y: number): boolean {
      const rootX = this.find(x);
      const rootY = this.find(y);

      if (rootX === rootY) return false;

      if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX]++;
      }

      return true;
    }
  }

  const runKruskal = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setMstEdges([]);
    setHighlightEdges([]);
    setHighlightNodes([]);

    // Sort edges by weight
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const uf = new UnionFind(nodes.length);
    const mst: [number, number][] = [];

    for (const edge of sortedEdges) {
      setHighlightEdges([[edge.from, edge.to]]);
      setHighlightNodes([edge.from, edge.to]);
      await sleep(1000);

      if (uf.union(edge.from, edge.to)) {
        mst.push([edge.from, edge.to]);
        setMstEdges([...mst]);
        await sleep(500);
      }
    }

    setHighlightEdges([]);
    setHighlightNodes([]);
    setIsRunning(false);
  };

  return (
    <VisualizerLayout
      title="Kruskal's MST Algorithm Visualization"
      description="Visualize how Kruskal's algorithm finds a Minimum Spanning Tree by selecting edges in increasing order of weight."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={runKruskal}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Run Kruskal's Algorithm
            </button>
          </div>

          <GraphVisualization
            nodes={nodes}
            edges={edges}
            type="weighted"
            highlightNodes={highlightNodes}
            highlightEdges={mstEdges.length > 0 ? mstEdges : highlightEdges}
          />

          <div className="glass-dark border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">MST Edges:</h4>
            <div className="flex flex-wrap gap-2">
              {mstEdges.map(([from, to], index) => {
                const edge = edges.find(e => e.from === from && e.to === to);
                return (
                  <div
                    key={index}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg"
                  >
                    {nodes[from].value} - {nodes[to].value} ({edge?.weight})
                  </div>
                );
              })}
            </div>
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Kruskal's Algorithm Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong> O(E log E) or O(E log V)</p>
              <p><strong>Space Complexity:</strong> O(V)</p>
              <p><strong>Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Finds Minimum Spanning Tree</li>
                <li>Uses Union-Find data structure</li>
                <li>Greedy approach</li>
                <li>Works on undirected weighted graphs</li>
              </ul>
              <p><strong>Steps:</strong></p>
              <ol className="list-decimal list-inside mt-2 ml-4">
                <li>Sort edges by weight</li>
                <li>Process edges in ascending order</li>
                <li>Add edge if it doesn't create cycle</li>
                <li>Continue until V-1 edges are added</li>
              </ol>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
