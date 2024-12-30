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
  degree: number;
  highlighted: boolean;
}

interface Edge {
  node1: string;
  node2: string;
  highlighted: boolean;
}

export default function UndirectedGraphPage() {
  const [nodes, setNodes] = useState<{ [key: string]: Node }>({});
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawGraph();
  }, [nodes, edges, selectedNode]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    edges.forEach(edge => {
      const node1 = nodes[edge.node1];
      const node2 = nodes[edge.node2];
      if (node1 && node2) {
        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        ctx.strokeStyle = edge.highlighted ? '#F59E0B' : '#FFFFFF';
        ctx.lineWidth = edge.highlighted ? 2 : 1;
        ctx.stroke();
        ctx.lineWidth = 1;
      }
    });

    // Draw nodes
    Object.values(nodes).forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = node.highlighted ? '#F59E0B' : 
                     node.id === selectedNode ? '#3B82F6' : '#1F2937';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
      
      // Draw node label and degree
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id, node.x, node.y);
      ctx.font = '12px Arial';
      ctx.fillText(`deg: ${node.degree}`, node.x, node.y + 30);
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
        degree: 0,
        highlighted: false
      }
    });
    setMessage(`Added node ${newId}`);
  };

  const addEdge = (node1Id: string, node2Id: string) => {
    if (node1Id === node2Id) {
      setMessage('Cannot create self-loop');
      return;
    }

    if (edges.some(e => 
      (e.node1 === node1Id && e.node2 === node2Id) || 
      (e.node1 === node2Id && e.node2 === node1Id)
    )) {
      setMessage('Edge already exists');
      return;
    }

    const updatedNodes = { ...nodes };
    updatedNodes[node1Id].neighbors.push(node2Id);
    updatedNodes[node1Id].degree++;
    updatedNodes[node2Id].neighbors.push(node1Id);
    updatedNodes[node2Id].degree++;

    setNodes(updatedNodes);
    setEdges([...edges, { node1: node1Id, node2: node2Id, highlighted: false }]);
    setMessage(`Added edge between ${node1Id} and ${node2Id}`);
    setSelectedNode(null);
  };

  const highlightConnectedComponent = (startNodeId: string) => {
    const visited = new Set<string>();
    const updatedNodes = { ...nodes };
    const updatedEdges = [...edges];

    // Reset all highlights
    Object.values(updatedNodes).forEach(node => node.highlighted = false);
    updatedEdges.forEach(edge => edge.highlighted = false);

    // DFS to find connected component
    const dfs = (nodeId: string) => {
      visited.add(nodeId);
      updatedNodes[nodeId].highlighted = true;

      updatedNodes[nodeId].neighbors.forEach(neighborId => {
        // Highlight edge
        const edge = updatedEdges.find(e => 
          (e.node1 === nodeId && e.node2 === neighborId) ||
          (e.node1 === neighborId && e.node2 === nodeId)
        );
        if (edge) edge.highlighted = true;

        if (!visited.has(neighborId)) {
          dfs(neighborId);
        }
      });
    };

    dfs(startNodeId);
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setMessage(`Highlighted connected component containing node ${startNodeId}`);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
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
        // Highlight connected component on Ctrl+Click
        highlightConnectedComponent(clickedNodeId);
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
    if (!draggedNode) return;

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
    setMessage('Graph cleared');
  };

  const clearHighlights = () => {
    const updatedNodes = { ...nodes };
    const updatedEdges = [...edges];

    Object.values(updatedNodes).forEach(node => node.highlighted = false);
    updatedEdges.forEach(edge => edge.highlighted = false);

    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setMessage('Cleared highlights');
  };

  return (
    <VisualizerLayout
      title="Undirected Graph Visualization"
      description="Visualize undirected graph properties and operations. Click to add nodes, select nodes to create edges, and use Ctrl+Click to highlight connected components."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={clearGraph}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Clear Graph
            </button>
            <button
              onClick={clearHighlights}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
            >
              Clear Highlights
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
            <h3 className="text-lg font-semibold text-white">Undirected Graph Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Click empty space to add a node</li>
                <li>Click a node to select it, then click another to create an edge</li>
                <li>Ctrl+Click a node to highlight its connected component</li>
                <li>Drag nodes to reposition them</li>
              </ul>
              <p><strong>Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Edges have no direction</li>
                <li>Node degree = number of incident edges</li>
                <li>Connected components are highlighted</li>
                <li>No self-loops allowed</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Social networks</li>
                <li>Computer networks</li>
                <li>Road networks</li>
                <li>Molecule structures</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
