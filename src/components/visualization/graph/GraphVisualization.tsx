"use client";

import { useState, useEffect } from 'react';
import { useVisualization } from '../VisualizationContext';
import Canvas from '../Canvas';

interface GraphNode {
  id: number;
  value: string | number;
  x?: number;
  y?: number;
}

interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
  directed?: boolean;
}

interface GraphVisualizationProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  type?: 'undirected' | 'directed' | 'weighted';
  highlightNodes?: number[];
  highlightEdges?: [number, number][];
  currentNode?: number;
}

const GraphVisualization = ({
  nodes,
  edges,
  type = 'undirected',
  highlightNodes = [],
  highlightEdges = [],
  currentNode = -1,
}: GraphVisualizationProps) => {
  const { currentStep } = useVisualization();
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress((prev) => (prev + 0.1) % 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Calculate force-directed layout
  useEffect(() => {
    const simulation = () => {
      const repulsionForce = 200;
      const attractionForce = 0.1;
      const centerForce = 0.01;

      nodes.forEach((node) => {
        if (!node.x || !node.y) {
          node.x = Math.random() * 600 - 300;
          node.y = Math.random() * 400 - 200;
        }
      });

      // Apply forces
      nodes.forEach((node1) => {
        let fx = 0;
        let fy = 0;

        // Repulsion between nodes
        nodes.forEach((node2) => {
          if (node1 !== node2) {
            const dx = node1.x! - node2.x!;
            const dy = node1.y! - node2.y!;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 0.1) return;

            const force = repulsionForce / (distance * distance);
            fx += (dx / distance) * force;
            fy += (dy / distance) * force;
          }
        });

        // Attraction along edges
        edges.forEach((edge) => {
          if (edge.from === node1.id || edge.to === node1.id) {
            const other = nodes.find(n => 
              n.id === (edge.from === node1.id ? edge.to : edge.from)
            );
            if (other) {
              const dx = node1.x! - other.x!;
              const dy = node1.y! - other.y!;
              const distance = Math.sqrt(dx * dx + dy * dy);
              fx -= dx * attractionForce;
              fy -= dy * attractionForce;
            }
          }
        });

        // Center force
        fx -= node1.x! * centerForce;
        fy -= node1.y! * centerForce;

        // Update position
        node1.x! += fx;
        node1.y! += fy;
      });
    };

    // Run simulation steps
    for (let i = 0; i < 100; i++) {
      simulation();
    }
  }, [nodes, edges]);

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const nodeRadius = 25;

    // Center the graph
    ctx.translate(width / 2, height / 2);

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const isHighlighted = highlightEdges.some(
        ([f, t]) => (f === edge.from && t === edge.to) || (!edge.directed && f === edge.to && t === edge.from)
      );

      ctx.beginPath();
      ctx.strokeStyle = isHighlighted ? 'rgb(34, 197, 94)' : 'rgb(156, 163, 175)';
      ctx.lineWidth = isHighlighted ? 3 : 2;

      if (edge.directed) {
        // Draw arrow
        const angle = Math.atan2(toNode.y! - fromNode.y!, toNode.x! - fromNode.x!);
        const length = Math.sqrt(
          Math.pow(toNode.x! - fromNode.x!, 2) + Math.pow(toNode.y! - fromNode.y!, 2)
        );
        const headLength = 15;
        const headAngle = Math.PI / 6;

        ctx.moveTo(fromNode.x!, fromNode.y!);
        ctx.lineTo(
          toNode.x! - (nodeRadius + headLength) * Math.cos(angle),
          toNode.y! - (nodeRadius + headLength) * Math.sin(angle)
        );
        ctx.stroke();

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(
          toNode.x! - nodeRadius * Math.cos(angle),
          toNode.y! - nodeRadius * Math.sin(angle)
        );
        ctx.lineTo(
          toNode.x! - (nodeRadius + headLength) * Math.cos(angle - headAngle),
          toNode.y! - (nodeRadius + headLength) * Math.sin(angle - headAngle)
        );
        ctx.lineTo(
          toNode.x! - (nodeRadius + headLength) * Math.cos(angle + headAngle),
          toNode.y! - (nodeRadius + headLength) * Math.sin(angle + headAngle)
        );
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.moveTo(fromNode.x!, fromNode.y!);
        ctx.lineTo(toNode.x!, toNode.y!);
        ctx.stroke();
      }

      // Draw weight if weighted
      if (type === 'weighted' && edge.weight !== undefined) {
        const midX = (fromNode.x! + toNode.x!) / 2;
        const midY = (fromNode.y! + toNode.y!) / 2;
        ctx.fillStyle = 'white';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(edge.weight.toString(), midX, midY - 10);
      }
    });

    // Draw nodes
    nodes.forEach((node) => {
      ctx.beginPath();
      const isHighlighted = highlightNodes.includes(node.id);
      const isCurrent = currentNode === node.id;
      
      ctx.fillStyle = isHighlighted 
        ? 'rgb(34, 197, 94)' 
        : isCurrent 
        ? 'rgb(234, 179, 8)'
        : 'rgb(59, 130, 246)';
      
      ctx.arc(node.x!, node.y!, nodeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw node value
      ctx.fillStyle = 'white';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.value.toString(), node.x!, node.y!);
    });
  };

  return (
    <div className="w-full aspect-video">
      <Canvas draw={draw} />
    </div>
  );
};

export default GraphVisualization;
