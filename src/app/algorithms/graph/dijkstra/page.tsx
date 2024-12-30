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

export default function DijkstraPage() {
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
  const [distances, setDistances] = useState<{ [key: number]: number }>({});
  const [path, setPath] = useState<{ [key: number]: number }>({});

  const runDijkstra = async () => {
    const dist: { [key: number]: number } = {};
    const prev: { [key: number]: number } = {};
    const unvisited = new Set(nodes.map(n => n.id));

    // Initialize distances
    nodes.forEach(node => {
      dist[node.id] = node.id === startNode ? 0 : Infinity;
    });

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let minDist = Infinity;
      let minNode = -1;
      unvisited.forEach(nodeId => {
        if (dist[nodeId] < minDist) {
          minDist = dist[nodeId];
          minNode = nodeId;
        }
      });

      if (minNode === -1) break;

      unvisited.delete(minNode);
      setHighlightNodes([minNode]);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update distances to neighbors
      edges
        .filter(edge => edge.from === minNode && unvisited.has(edge.to))
        .forEach(async edge => {
          const altDist = dist[minNode] + edge.weight;
          setHighlightEdges([[edge.from, edge.to]]);
          await new Promise(resolve => setTimeout(resolve, 500));

          if (altDist < dist[edge.to]) {
            dist[edge.to] = altDist;
            prev[edge.to] = minNode;
          }
        });

      setDistances({ ...dist });
      setPath({ ...prev });
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Highlight shortest paths
    const pathEdges: [number, number][] = [];
    nodes.forEach(node => {
      if (node.id !== startNode) {
        let current = node.id;
        while (prev[current] !== undefined) {
          pathEdges.push([prev[current], current]);
          current = prev[current];
        }
      }
    });
    setHighlightEdges(pathEdges);
    setHighlightNodes([]);
  };

  return (
    <VisualizerLayout
      title="Dijkstra's Algorithm Visualization"
      description="Visualize how Dijkstra's algorithm finds the shortest paths from a source node to all other nodes in a weighted graph."
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
              onClick={runDijkstra}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Run Dijkstra
            </button>
          </div>

          <GraphVisualization
            nodes={nodes}
            edges={edges}
            type="weighted"
            highlightNodes={highlightNodes}
            highlightEdges={highlightEdges}
          />

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(distances).map(([nodeId, distance]) => (
              <div key={nodeId} className="glass-dark border border-white/10 rounded-lg p-4">
                <p className="text-white">
                  Distance to {nodes[Number(nodeId)].value}: {distance === Infinity ? '∞' : distance}
                </p>
              </div>
            ))}
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Dijkstra's Algorithm Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong> O((V + E) log V) with priority queue</p>
              <p><strong>Space Complexity:</strong> O(V)</p>
              <p><strong>Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Finds shortest paths from source to all vertices</li>
                <li>Works on weighted graphs without negative edges</li>
                <li>Uses greedy approach to select minimum distance vertex</li>
                <li>Maintains a set of visited vertices and their distances</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
