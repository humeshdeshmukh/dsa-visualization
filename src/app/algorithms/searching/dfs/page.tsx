"use client";

import { useState, useRef, useEffect } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

interface Node {
  id: string;
  x: number;
  y: number;
  neighbors: string[];
  visited: boolean;
  discoveryTime: number;
  finishTime: number;
  parent: string | null;
}

export default function DFSPage() {
  const [nodes, setNodes] = useState<{ [key: string]: Node }>({});
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [startNode, setStartNode] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawGraph();
  }, [nodes, selectedNode, startNode]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges with arrows showing DFS tree
    Object.values(nodes).forEach(node => {
      node.neighbors.forEach(neighborId => {
        const neighbor = nodes[neighborId];
        if (neighbor) {
          const isTreeEdge = neighbor.parent === node.id;
          const isBackEdge = node.parent === neighborId;
          
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(neighbor.x, neighbor.y);
          
          if (isTreeEdge) {
            // Draw arrow for tree edge
            const angle = Math.atan2(neighbor.y - node.y, neighbor.x - node.x);
            const headLen = 10;
            ctx.strokeStyle = '#22C55E'; // Green for tree edges
            ctx.lineWidth = 2;
            
            // Draw arrowhead
            ctx.lineTo(
              neighbor.x - headLen * Math.cos(angle - Math.PI / 6),
              neighbor.y - headLen * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(neighbor.x, neighbor.y);
            ctx.lineTo(
              neighbor.x - headLen * Math.cos(angle + Math.PI / 6),
              neighbor.y - headLen * Math.sin(angle + Math.PI / 6)
            );
          } else if (isBackEdge) {
            ctx.strokeStyle = '#EF4444'; // Red for back edges
            ctx.setLineDash([5, 5]); // Dashed line for back edges
          } else {
            ctx.strokeStyle = '#FFFFFF'; // White for unexplored edges
            ctx.setLineDash([]); // Solid line
          }
          
          ctx.stroke();
          ctx.setLineDash([]); // Reset dash pattern
          ctx.lineWidth = 1; // Reset line width
        }
      });
    });

    // Draw nodes
    Object.values(nodes).forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      
      // Color based on state
      if (node.id === startNode) {
        ctx.fillStyle = '#22C55E'; // Green for start node
      } else if (node.visited) {
        ctx.fillStyle = '#3B82F6'; // Blue for visited
      } else {
        ctx.fillStyle = '#1F2937'; // Default dark gray
      }
      
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id, node.x, node.y);

      // Draw discovery/finish times if visited
      if (node.visited && node.discoveryTime !== undefined) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.fillText(`${node.discoveryTime}/${node.finishTime}`, node.x, node.y + 30);
      }
    });
  };

  const addNode = (x: number, y: number) => {
    const newId = String.fromCharCode(65 + Object.keys(nodes).length); // A, B, C, ...
    setNodes({
      ...nodes,
      [newId]: {
        id: newId,
        x,
        y,
        neighbors: [],
        visited: false,
        discoveryTime: -1,
        finishTime: -1,
        parent: null
      }
    });
    setMessage(`Added node ${newId}`);
  };

  const addEdge = (fromId: string, toId: string) => {
    if (fromId === toId) {
      setMessage('Cannot create self-loop');
      return;
    }

    const fromNode = nodes[fromId];
    const toNode = nodes[toId];

    if (fromNode.neighbors.includes(toId)) {
      setMessage('Edge already exists');
      return;
    }

    setNodes({
      ...nodes,
      [fromId]: {
        ...fromNode,
        neighbors: [...fromNode.neighbors, toId]
      },
      [toId]: {
        ...toNode,
        neighbors: [...toNode.neighbors, fromId]
      }
    });

    setMessage(`Added edge between ${fromId} and ${toId}`);
    setSelectedNode(null);
  };

  const resetNodes = () => {
    const resetState = Object.fromEntries(
      Object.entries(nodes).map(([id, node]) => [
        id,
        { ...node, visited: false, discoveryTime: -1, finishTime: -1, parent: null }
      ])
    );
    setNodes(resetState);
    setStartNode(null);
    setMessage('');
    setTime(0);
  };

  const dfsVisit = async (nodeId: string, updatedNodes: { [key: string]: Node }, parentId: string | null = null) => {
    const currentTime = ++time;
    setTime(currentTime);
    
    updatedNodes[nodeId].visited = true;
    updatedNodes[nodeId].discoveryTime = currentTime;
    updatedNodes[nodeId].parent = parentId;
    
    setNodes({ ...updatedNodes });
    setMessage(`Discovering node ${nodeId} at time ${currentTime}`);
    await sleep(1000);

    for (const neighborId of updatedNodes[nodeId].neighbors) {
      if (!updatedNodes[neighborId].visited) {
        await dfsVisit(neighborId, updatedNodes, nodeId);
      } else if (!updatedNodes[neighborId].finishTime) {
        setMessage(`Found back edge from ${nodeId} to ${neighborId}`);
        await sleep(500);
      }
    }

    const finishTime = ++time;
    setTime(finishTime);
    updatedNodes[nodeId].finishTime = finishTime;
    setNodes({ ...updatedNodes });
    setMessage(`Finishing node ${nodeId} at time ${finishTime}`);
    await sleep(1000);
  };

  const runDFS = async () => {
    if (!startNode || isRunning) return;
    setIsRunning(true);
    setTime(0);

    // Reset all nodes
    const resetState = Object.fromEntries(
      Object.entries(nodes).map(([id, node]) => [
        id,
        { ...node, visited: false, discoveryTime: -1, finishTime: -1, parent: null }
      ])
    );
    setNodes(resetState);
    await sleep(500);

    await dfsVisit(startNode, resetState);

    setMessage('DFS completed');
    setIsRunning(false);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a node
    const clickedNodeId = Object.keys(nodes).find(id => {
      const node = nodes[id];
      return Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 20;
    });

    if (clickedNodeId) {
      if (e.ctrlKey) {
        // Set start node on Ctrl+Click
        setStartNode(clickedNodeId);
        setMessage(`Set ${clickedNodeId} as start node`);
      } else if (selectedNode === null) {
        setSelectedNode(clickedNodeId);
        setMessage(`Selected node ${clickedNodeId}`);
      } else {
        addEdge(selectedNode, clickedNodeId);
      }
    } else {
      addNode(x, y);
      setSelectedNode(null);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNodeId = Object.keys(nodes).find(id => {
      const node = nodes[id];
      return Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 20;
    });

    if (clickedNodeId) {
      setDraggedNode(clickedNodeId);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedNode || isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes({
      ...nodes,
      [draggedNode]: {
        ...nodes[draggedNode],
        x,
        y
      }
    });
  };

  const handleCanvasMouseUp = () => {
    setDraggedNode(null);
  };

  const clearGraph = () => {
    setNodes({});
    setSelectedNode(null);
    setStartNode(null);
    setMessage('Graph cleared');
    setTime(0);
  };

  return (
    <VisualizerLayout
      title="Depth-First Search (DFS) Visualization"
      description="Visualize how DFS explores a graph by going as deep as possible before backtracking."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={clearGraph}
              disabled={isRunning}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Clear Graph
            </button>
            <button
              onClick={resetNodes}
              disabled={isRunning}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Reset
            </button>
            <button
              onClick={runDFS}
              disabled={!startNode || isRunning}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Run DFS
            </button>
          </div>

          {message && (
            <div className="text-white bg-gray-800 p-4 rounded-lg">
              {message}
            </div>
          )}

          <div className="glass-dark border border-white/10 rounded-lg p-6">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              onClick={handleCanvasClick}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              className="w-full bg-gray-900 rounded-lg cursor-pointer"
            />
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">DFS Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Click empty space to add a node</li>
                <li>Click a node to select it, then click another to create an edge</li>
                <li>Ctrl+Click a node to set it as the start node</li>
                <li>Drag nodes to reposition them</li>
                <li>Click Run DFS to start the visualization</li>
              </ul>
              <p><strong>Edge Colors:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Green arrows: Tree edges (DFS tree)</li>
                <li>Red dashed: Back edges</li>
                <li>White: Unexplored edges</li>
              </ul>
              <p><strong>Node Labels:</strong> discovery time / finish time</p>
              <p><strong>Time Complexity:</strong> O(V + E)</p>
              <p><strong>Space Complexity:</strong> O(V)</p>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Topological sorting</li>
                <li>Cycle detection</li>
                <li>Path finding</li>
                <li>Maze generation</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
