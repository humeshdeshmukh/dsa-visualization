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

export default function BFSPage() {
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
  const [currentLevel, setCurrentLevel] = useState<number[]>([]);
  const [highlightEdges, setHighlightEdges] = useState<[number, number][]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const bfs = async () => {
    const visited = new Set<number>();
    const queue: number[] = [startNode];
    const levels: number[][] = [[startNode]];
    const path: number[] = [];
    const pathEdges: [number, number][] = [];

    visited.add(startNode);
    path.push(startNode);
    setVisitedNodes([...path]);

    while (queue.length > 0) {
      const levelSize = queue.length;
      const currentLevel: number[] = [];

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;
        currentLevel.push(node);

        // Find all neighbors
        const neighbors = edges
          .filter(edge => edge.from === node)
          .map(edge => edge.to)
          .filter(neighbor => !visited.has(neighbor));

        for (const neighbor of neighbors) {
          visited.add(neighbor);
          queue.push(neighbor);
          path.push(neighbor);
          pathEdges.push([node, neighbor]);
          setHighlightEdges([[node, neighbor]]);
          await sleep(500);
        }
      }

      setCurrentLevel(currentLevel);
      levels.push([...queue]);
      setVisitedNodes([...path]);
      await sleep(1000);
    }

    // Show complete BFS path
    setHighlightEdges(pathEdges);
  };

  const runBFS = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setVisitedNodes([]);
    setCurrentLevel([]);
    setHighlightEdges([]);

    await bfs();
    setIsRunning(false);
  };

  return (
    <VisualizerLayout
      title="Breadth-First Search Visualization"
      description="Visualize how BFS explores a graph level by level, visiting all neighbors before moving to the next level."
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
              onClick={runBFS}
              disabled={isRunning}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Run BFS
            </button>
          </div>

          <GraphVisualization
            nodes={nodes}
            edges={edges}
            type="directed"
            highlightNodes={visitedNodes}
            highlightEdges={highlightEdges}
            currentNode={currentLevel.length > 0 ? currentLevel[currentLevel.length - 1] : -1}
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

          <div className="glass-dark border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Current Level:</h4>
            <div className="flex gap-2">
              {currentLevel.map((nodeId, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg"
                >
                  {nodes[nodeId].value}
                </div>
              ))}
            </div>
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">BFS Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong> O(V + E)</p>
              <p><strong>Space Complexity:</strong> O(V)</p>
              <p><strong>Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Explores graph level by level</li>
                <li>Uses a queue data structure</li>
                <li>Finds shortest path in unweighted graphs</li>
                <li>Visits all vertices at current distance before moving to next level</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Finding shortest paths</li>
                <li>Web crawling</li>
                <li>Social networking</li>
                <li>GPS Navigation</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
