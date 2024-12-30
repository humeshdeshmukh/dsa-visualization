"use client";

import { useState, useRef, useEffect } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

interface Node {
  id: string;
  x: number;
  y: number;
  distance: number;
  predecessor: string | null;
}

interface Edge {
  from: string;
  to: string;
  weight: number;
  relaxed?: boolean;
}

const INFINITY = Number.MAX_SAFE_INTEGER;

export default function BellmanFordPage() {
  const [nodes, setNodes] = useState<{ [key: string]: Node }>({});
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [startNode, setStartNode] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [currentEdge, setCurrentEdge] = useState<Edge | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, selectedNode, startNode, currentEdge]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];
      if (fromNode && toNode) {
        const isCurrent = currentEdge === edge;
        drawWeightedArrow(ctx, fromNode.x, fromNode.y, toNode.x, toNode.y, edge.weight, edge.relaxed, isCurrent);
      }
    });

    // Draw nodes
    Object.values(nodes).forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      
      // Color based on state
      if (node.id === startNode) {
        ctx.fillStyle = '#22C55E'; // Green for start node
      } else if (node.distance < INFINITY) {
        ctx.fillStyle = '#3B82F6'; // Blue for visited
      } else {
        ctx.fillStyle = '#1F2937'; // Default dark gray
      }
      
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Draw node label and distance
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id, node.x, node.y);
      
      const distanceText = node.distance === INFINITY ? '∞' : node.distance.toString();
      ctx.font = '12px Arial';
      ctx.fillText(distanceText, node.x, node.y + 30);
    });
  };

  const drawWeightedArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    weight: number,
    relaxed?: boolean,
    isCurrent?: boolean
  ) => {
    const headLength = 10;
    const radius = 20;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    // Calculate start and end points accounting for node radius
    const startX = fromX + radius * Math.cos(angle);
    const startY = fromY + radius * Math.sin(angle);
    const endX = toX - radius * Math.cos(angle);
    const endY = toY - radius * Math.sin(angle);

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    
    if (isCurrent) {
      ctx.strokeStyle = '#F59E0B'; // Yellow for current edge
      ctx.lineWidth = 2;
    } else if (relaxed) {
      ctx.strokeStyle = '#22C55E'; // Green for relaxed edges
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = '#FFFFFF'; // White for normal edges
      ctx.lineWidth = 1;
    }
    
    ctx.stroke();
    ctx.lineWidth = 1;

    // Draw the arrow head
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle - Math.PI / 6),
      endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      endX - headLength * Math.cos(angle + Math.PI / 6),
      endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = isCurrent ? '#F59E0B' : (relaxed ? '#22C55E' : '#FFFFFF');
    ctx.fill();

    // Draw weight
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(weight.toString(), midX, midY - 10);
  };

  const addNode = (x: number, y: number) => {
    const newId = String.fromCharCode(65 + Object.keys(nodes).length); // A, B, C, ...
    setNodes({
      ...nodes,
      [newId]: {
        id: newId,
        x,
        y,
        distance: INFINITY,
        predecessor: null
      }
    });
    setMessage(`Added node ${newId}`);
  };

  const addEdge = (fromId: string, toId: string) => {
    if (fromId === toId) {
      setMessage('Cannot create self-loop');
      return;
    }

    if (edges.some(e => e.from === fromId && e.to === toId)) {
      setMessage('Edge already exists');
      return;
    }

    const weight = Math.floor(Math.random() * 10) - 2; // Random weight between -2 and 7
    setEdges([...edges, { from: fromId, to: toId, weight }]);
    setMessage(`Added edge from ${fromId} to ${toId} with weight ${weight}`);
    setSelectedNode(null);
  };

  const resetNodes = () => {
    setNodes(
      Object.fromEntries(
        Object.entries(nodes).map(([id, node]) => [
          id,
          { ...node, distance: INFINITY, predecessor: null }
        ])
      )
    );
    setEdges(edges.map(edge => ({ ...edge, relaxed: false })));
    setStartNode(null);
    setMessage('');
    setCurrentEdge(null);
  };

  const runBellmanFord = async () => {
    if (!startNode || isRunning) return;
    setIsRunning(true);

    // Initialize distances
    const updatedNodes = { ...nodes };
    Object.values(updatedNodes).forEach(node => {
      node.distance = INFINITY;
      node.predecessor = null;
    });
    updatedNodes[startNode].distance = 0;
    setNodes(updatedNodes);
    
    const updatedEdges = edges.map(edge => ({ ...edge, relaxed: false }));
    setEdges(updatedEdges);
    await sleep(1000);

    // Main relaxation loop
    const V = Object.keys(nodes).length;
    let hasNegativeCycle = false;

    for (let i = 1; i <= V; i++) {
      setMessage(`Iteration ${i} of ${V}`);
      let relaxed = false;

      for (let j = 0; j < updatedEdges.length; j++) {
        const edge = updatedEdges[j];
        setCurrentEdge(edge);
        await sleep(500);

        const u = updatedNodes[edge.from];
        const v = updatedNodes[edge.to];

        if (u.distance !== INFINITY && u.distance + edge.weight < v.distance) {
          v.distance = u.distance + edge.weight;
          v.predecessor = u.id;
          edge.relaxed = true;
          relaxed = true;

          // If we're in the Vth iteration and still relaxing edges, we have a negative cycle
          if (i === V) {
            hasNegativeCycle = true;
            break;
          }

          setMessage(`Relaxed edge ${edge.from}->${edge.to}: new distance to ${edge.to} = ${v.distance}`);
          setNodes({ ...updatedNodes });
          setEdges([...updatedEdges]);
          await sleep(1000);
        }
      }

      if (!relaxed && i < V) {
        setMessage('No more edges to relax. Algorithm converged early.');
        break;
      }

      if (hasNegativeCycle) {
        setMessage('Negative cycle detected! Distances may not be correct.');
        break;
      }
    }

    setCurrentEdge(null);
    if (!hasNegativeCycle) {
      setMessage('Bellman-Ford algorithm completed successfully');
    }
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
    setEdges([]);
    setSelectedNode(null);
    setStartNode(null);
    setMessage('Graph cleared');
    setCurrentEdge(null);
  };

  return (
    <VisualizerLayout
      title="Bellman-Ford Algorithm Visualization"
      description="Visualize how the Bellman-Ford algorithm finds shortest paths in a weighted digraph, even with negative edge weights."
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
              onClick={runBellmanFord}
              disabled={!startNode || isRunning}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Run Bellman-Ford
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
            <h3 className="text-lg font-semibold text-white">Bellman-Ford Algorithm Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Click empty space to add a node</li>
                <li>Click a node to select it, then click another to create an edge</li>
                <li>Ctrl+Click a node to set it as the start node</li>
                <li>Drag nodes to reposition them</li>
                <li>Click Run Bellman-Ford to start the visualization</li>
              </ul>
              <p><strong>Edge Colors:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>White: Normal edges</li>
                <li>Yellow: Currently being processed</li>
                <li>Green: Successfully relaxed</li>
              </ul>
              <p><strong>Time Complexity:</strong> O(VE)</p>
              <p><strong>Space Complexity:</strong> O(V)</p>
              <p><strong>Key Features:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Handles negative edge weights</li>
                <li>Detects negative cycles</li>
                <li>Finds shortest paths from source</li>
                <li>Works with directed graphs</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Network routing protocols</li>
                <li>Currency exchange</li>
                <li>Traffic routing</li>
                <li>Arbitrage detection</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
