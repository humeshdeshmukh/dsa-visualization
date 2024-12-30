"use client";

import { useState, useEffect } from 'react';
import { useVisualization } from '../VisualizationContext';
import Canvas from '../Canvas';

interface HeapNode {
  value: number;
  x?: number;
  y?: number;
}

interface HeapVisualizationProps {
  nodes: HeapNode[];
  type?: 'min' | 'max';
  highlightNodes?: number[];
  swappingIndices?: [number, number];
  currentNode?: number;
}

const HeapVisualization = ({
  nodes,
  type = 'min',
  highlightNodes = [],
  swappingIndices = [-1, -1],
  currentNode = -1,
}: HeapVisualizationProps) => {
  const { currentStep } = useVisualization();
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress((prev) => (prev + 0.1) % 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Calculate heap layout
  const calculateLayout = () => {
    const levelHeight = 80;
    const nodeSpacing = 60;

    nodes.forEach((node, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const position = index - Math.pow(2, level) + 1;
      const totalNodesInLevel = Math.pow(2, level);
      const levelWidth = totalNodesInLevel * nodeSpacing;

      node.x = position * levelWidth / totalNodesInLevel - levelWidth / 2 + nodeSpacing / 2;
      node.y = level * levelHeight;
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const nodeRadius = 25;

    // Center the heap
    ctx.translate(width / 2, 60);

    // Calculate layout
    calculateLayout();

    // Draw edges first
    nodes.forEach((node, index) => {
      if (!node.x || !node.y) return;

      // Draw edges to children
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;

      if (leftChildIndex < nodes.length) {
        const leftChild = nodes[leftChildIndex];
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(156, 163, 175)';
        ctx.lineWidth = 2;
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(leftChild.x!, leftChild.y!);
        ctx.stroke();
      }

      if (rightChildIndex < nodes.length) {
        const rightChild = nodes[rightChildIndex];
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(156, 163, 175)';
        ctx.lineWidth = 2;
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(rightChild.x!, rightChild.y!);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach((node, index) => {
      if (!node.x || !node.y) return;

      // Handle swapping animation
      let drawX = node.x;
      let drawY = node.y;

      if (swappingIndices.includes(index)) {
        const otherIndex = swappingIndices[0] === index ? swappingIndices[1] : swappingIndices[0];
        const otherNode = nodes[otherIndex];
        const dx = otherNode.x! - node.x;
        const dy = otherNode.y! - node.y;
        drawX += dx * Math.sin(animationProgress * Math.PI);
        drawY += dy * Math.sin(animationProgress * Math.PI);
      }

      // Draw node circle
      ctx.beginPath();
      let fillColor = type === 'min' ? 'rgb(59, 130, 246)' : 'rgb(239, 68, 68)';

      if (highlightNodes.includes(index)) {
        fillColor = 'rgb(34, 197, 94)';
      } else if (index === currentNode) {
        fillColor = 'rgb(234, 179, 8)';
      }

      ctx.fillStyle = fillColor;
      ctx.arc(drawX, drawY, nodeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw node value
      ctx.fillStyle = 'white';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.value.toString(), drawX, drawY);

      // Draw index for reference
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '12px monospace';
      ctx.fillText(`(${index})`, drawX, drawY + nodeRadius + 15);
    });
  };

  return (
    <div className="w-full aspect-video">
      <Canvas draw={draw} />
    </div>
  );
};

export default HeapVisualization;
