"use client";

import { useState, useEffect } from 'react';
import { useVisualization } from '../VisualizationContext';
import Canvas from '../Canvas';

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  color?: 'red' | 'black'; // For Red-Black trees
  height?: number; // For AVL trees
  x?: number;
  y?: number;
}

interface TreeVisualizationProps {
  root: TreeNode | null;
  type?: 'binary' | 'bst' | 'avl' | 'red-black';
  highlightNodes?: number[];
  currentNode?: number;
}

const TreeVisualization = ({
  root,
  type = 'binary',
  highlightNodes = [],
  currentNode = -1,
}: TreeVisualizationProps) => {
  const { currentStep } = useVisualization();
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress((prev) => (prev + 0.1) % 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Calculate tree layout
  const calculateLayout = (node: TreeNode | null, level: number = 0, position: number = 0): void => {
    if (!node) return;

    const spacing = 60;
    const levelHeight = 80;

    node.x = position * spacing;
    node.y = level * levelHeight;

    calculateLayout(node.left, level + 1, position * 2 - 1);
    calculateLayout(node.right, level + 1, position * 2 + 1);
  };

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const nodeRadius = 25;

    // Center the tree
    ctx.translate(width / 2, 60);

    // Calculate layout if root exists
    if (root) {
      calculateLayout(root);
    }

    // Helper function to draw a node
    const drawNode = (node: TreeNode, index: number) => {
      if (!node || typeof node.x === 'undefined' || typeof node.y === 'undefined') return;

      // Draw edges to children
      if (node.left) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(156, 163, 175)';
        ctx.lineWidth = 2;
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.left.x!, node.left.y!);
        ctx.stroke();
      }

      if (node.right) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(156, 163, 175)';
        ctx.lineWidth = 2;
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.right.x!, node.right.y!);
        ctx.stroke();
      }

      // Draw node circle
      ctx.beginPath();
      let fillColor = 'rgb(59, 130, 246)'; // Default blue

      if (type === 'red-black' && node.color === 'red') {
        fillColor = 'rgb(239, 68, 68)';
      } else if (highlightNodes.includes(index)) {
        fillColor = 'rgb(34, 197, 94)';
      } else if (index === currentNode) {
        fillColor = 'rgb(234, 179, 8)';
      }

      ctx.fillStyle = fillColor;
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw node value
      ctx.fillStyle = 'white';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.value.toString(), node.x, node.y);

      // Draw height for AVL trees
      if (type === 'avl' && typeof node.height !== 'undefined') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px monospace';
        ctx.fillText(`h:${node.height}`, node.x, node.y + nodeRadius + 15);
      }
    };

    // Recursive function to draw the tree
    const drawTree = (node: TreeNode | null, index: number = 0) => {
      if (!node) return;
      drawNode(node, index);
      if (node.left) drawTree(node.left, index * 2 + 1);
      if (node.right) drawTree(node.right, index * 2 + 2);
    };

    drawTree(root);
  };

  return (
    <div className="w-full aspect-video">
      <Canvas draw={draw} />
    </div>
  );
};

export default TreeVisualization;
