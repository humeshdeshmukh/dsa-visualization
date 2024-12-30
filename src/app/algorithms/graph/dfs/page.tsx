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
}

export default function DFSPage() {
  const [nodes] = useState<Node[]>([
    { id: 0, value: 'A' },
    { id: 1, value: 'B' },
    { id: 2, value: 'C' },
    { id: 3, value: 'D' },
    { id: 4, value: 'E' },
    { id: 5, value: 'F' },
  ]);

  const [edges] = useState<Edge[]>([
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },
    { from: 3, to: 5 },
    { from: 4, to: 5 },
  ]);

  const [startNode, setStartNode] = useState(0);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  const [highlightEdges, setHighlightEdges] = useState<[number, number][]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const dfs = async (node: number, visited: Set<number>, path: number[]) => {
    if (visited.has(node)) return;

    visited.add(node);
    path.push(node);
    setVisitedNodes([...path]);
    await sleep(1000);

    // Find all neighbors
    const neighbors = edges
      .filter(edge => edge.from === node)
      .map(edge => edge.to);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        setHighlightEdges([[node, neighbor]]);
        await sleep(500);
        await dfs(neighbor, visited, path);
      }
    }
  };

  const runDFS = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setVisitedNodes([]);
    setHighlightEdges([]);

    const visited = new Set<number>();
    const path: number[] = [];
    await dfs(startNode, visited, path);

    // Highlight the complete DFS path
    const pathEdges: [number, number][] = [];
    for (let i = 0; i < path.length - 1; i++) {
      pathEdges.push([path[i], path[i + 1]]);
    }
    setHighlightEdges(pathEdges);
    setIsRunning(false);
  };

  return (
    <VisualizerLayout
      title="Depth-First Search Visualization"
      description="Visualize how DFS explores a graph by going as deep as possible before backtracking."
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
              onClick={runDFS}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Run DFS
            </button>
          </div>

          <GraphVisualization
            nodes={nodes}
            edges={edges}
            type="directed"
            highlightNodes={visitedNodes}
            highlightEdges={highlightEdges}
            currentNode={visitedNodes[visitedNodes.length - 1]}
          />

          <div className="glass-dark border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Visit Order:</h4>
            <div className="flex gap-2">
              {visitedNodes.map((nodeId, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                >
                  {nodes[nodeId].value}
                </div>
              ))}
            </div>
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">DFS Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong> O(V + E)</p>
              <p><strong>Space Complexity:</strong> O(V)</p>
              <p><strong>Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Explores as far as possible along each branch</li>
                <li>Uses a stack (recursive or explicit)</li>
                <li>Good for topological sorting</li>
                <li>Can find strongly connected components</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Finding connected components</li>
                <li>Pathfinding in mazes</li>
                <li>Topological sorting</li>
                <li>Solving puzzles with only one solution</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
