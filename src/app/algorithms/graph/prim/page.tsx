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

export default function PrimPage() {
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

  const [startNode, setStartNode] = useState(0);
  const [highlightNodes, setHighlightNodes] = useState<number[]>([]);
  const [highlightEdges, setHighlightEdges] = useState<[number, number][]>([]);
  const [mstEdges, setMstEdges] = useState<[number, number][]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runPrim = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setMstEdges([]);
    setHighlightEdges([]);
    setHighlightNodes([]);

    const visited = new Set<number>();
    const mst: [number, number][] = [];
    
    // Start with the selected node
    visited.add(startNode);
    setHighlightNodes([startNode]);
    await sleep(1000);

    while (visited.size < nodes.length) {
      let minWeight = Infinity;
      let minEdge: Edge | null = null;

      // Find minimum weight edge from visited to unvisited nodes
      for (const edge of edges) {
        const isFromVisited = visited.has(edge.from);
        const isToVisited = visited.has(edge.to);

        if ((isFromVisited && !isToVisited) || (!isFromVisited && isToVisited)) {
          setHighlightEdges([[edge.from, edge.to]]);
          await sleep(500);

          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            minEdge = edge;
          }
        }
      }

      if (minEdge) {
        const newNode = visited.has(minEdge.from) ? minEdge.to : minEdge.from;
        visited.add(newNode);
        mst.push([minEdge.from, minEdge.to]);
        setMstEdges([...mst]);
        setHighlightNodes(Array.from(visited));
        await sleep(1000);
      }
    }

    setHighlightEdges([]);
    setIsRunning(false);
  };

  return (
    <VisualizerLayout
      title="Prim's MST Algorithm Visualization"
      description="Visualize how Prim's algorithm finds a Minimum Spanning Tree by growing a single tree from a starting vertex."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <select
              value={startNode}
              onChange={(e) => setStartNode(Number(e.target.value))}
              className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
            >
              {nodes.map(node => (
                <option key={node.id} value={node.id}>
                  Node {node.value}
                </option>
              ))}
            </select>
            <button
              onClick={runPrim}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Run Prim's Algorithm
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
            <h3 className="text-lg font-semibold text-white">Prim's Algorithm Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong> O(E log V) with binary heap</p>
              <p><strong>Space Complexity:</strong> O(V)</p>
              <p><strong>Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Finds Minimum Spanning Tree</li>
                <li>Grows single tree from start vertex</li>
                <li>Greedy approach</li>
                <li>Works on undirected weighted graphs</li>
              </ul>
              <p><strong>Steps:</strong></p>
              <ol className="list-decimal list-inside mt-2 ml-4">
                <li>Start with any vertex</li>
                <li>Find minimum weight edge to unvisited vertex</li>
                <li>Add vertex to MST</li>
                <li>Repeat until all vertices are included</li>
              </ol>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
