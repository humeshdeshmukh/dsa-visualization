"use client";

import { useState, useRef, useEffect } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

interface Node {
  id: string;
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
}

export default function DirectedGraphPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
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
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        drawArrow(ctx, fromNode.x, fromNode.y, toNode.x, toNode.y);
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = node.id === selectedNode ? '#3B82F6' : '#1F2937';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();
      
      // Draw node label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id, node.x, node.y);
    });
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const headLength = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    // Calculate the point where the arrow should start and end (accounting for node radius)
    const radius = 20;
    const startX = fromX + radius * Math.cos(angle);
    const startY = fromY + radius * Math.sin(angle);
    const endX = toX - radius * Math.cos(angle);
    const endY = toY - radius * Math.sin(angle);

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

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
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  };

  const addNode = (x: number, y: number) => {
    const newId = String.fromCharCode(65 + nodes.length); // A, B, C, ...
    setNodes([...nodes, { id: newId, x, y }]);
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

    setEdges([...edges, { from: fromId, to: toId }]);
    setMessage(`Added edge from ${fromId} to ${toId}`);
    setSelectedNode(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a node
    const clickedNode = nodes.find(node => 
      Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 20
    );

    if (clickedNode) {
      if (selectedNode === null) {
        setSelectedNode(clickedNode.id);
        setMessage(`Selected node ${clickedNode.id}`);
      } else {
        addEdge(selectedNode, clickedNode.id);
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

    const clickedNode = nodes.find(node => 
      Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 20
    );

    if (clickedNode) {
      setDraggedNode(clickedNode.id);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedNode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setNodes(nodes.map(node => 
      node.id === draggedNode ? { ...node, x, y } : node
    ));
  };

  const handleCanvasMouseUp = () => {
    setDraggedNode(null);
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setMessage('Graph cleared');
  };

  return (
    <VisualizerLayout
      title="Directed Graph Visualization"
      description="Visualize directed graph operations and properties. Click to add nodes, select nodes to create edges."
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
            <h3 className="text-lg font-semibold text-white">Directed Graph Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Click empty space to add a node</li>
                <li>Click a node to select it</li>
                <li>Click another node to create a directed edge</li>
                <li>Drag nodes to reposition them</li>
              </ul>
              <p><strong>Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Edges have direction (one-way)</li>
                <li>Can represent dependencies</li>
                <li>Used in state machines</li>
                <li>Can detect cycles</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Web page links</li>
                <li>Social networks</li>
                <li>Dependency graphs</li>
                <li>Flow networks</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
