"use client";

import { useState, useRef, useEffect } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  highlighted?: boolean;
  x?: number;
  y?: number;
}

export default function BinaryTreePage() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [traversalPath, setTraversalPath] = useState<number[]>([]);

  useEffect(() => {
    calculateNodePositions();
    drawTree();
  }, [root, traversalPath]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const calculateNodePositions = () => {
    if (!root || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const levelHeight = 60;
    const startY = 40;

    const calculatePositionsRecursive = (
      node: TreeNode,
      level: number,
      left: number,
      right: number
    ): number => {
      const x = (left + right) / 2;
      node.x = x;
      node.y = startY + level * levelHeight;

      if (node.left) {
        calculatePositionsRecursive(node.left, level + 1, left, x);
      }
      if (node.right) {
        calculatePositionsRecursive(node.right, level + 1, x, right);
      }

      return x;
    };

    calculatePositionsRecursive(root, 0, 0, canvas.width);
  };

  const drawTree = () => {
    const canvas = canvasRef.current;
    if (!canvas || !root) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawNode = (node: TreeNode) => {
      if (!node.x || !node.y) return;

      // Draw edges to children
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;

      if (node.left) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y + 20);
        ctx.lineTo(node.left.x!, node.left.y! - 20);
        ctx.stroke();
      }

      if (node.right) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y + 20);
        ctx.lineTo(node.right.x!, node.right.y! - 20);
        ctx.stroke();
      }

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      
      if (traversalPath.includes(node.value)) {
        const index = traversalPath.indexOf(node.value);
        const hue = (index / traversalPath.length) * 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
      } else if (node.highlighted) {
        ctx.fillStyle = '#F59E0B';
      } else {
        ctx.fillStyle = '#3B82F6';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Draw value
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.value.toString(), node.x, node.y);
    };

    const drawTreeRecursive = (node: TreeNode) => {
      drawNode(node);
      if (node.left) drawTreeRecursive(node.left);
      if (node.right) drawTreeRecursive(node.right);
    };

    drawTreeRecursive(root);
  };

  const insert = async (value: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTraversalPath([]);

    const insertRecursive = (node: TreeNode | null, value: number): TreeNode => {
      if (!node) {
        return { value, left: null, right: null };
      }

      if (Math.random() < 0.5) {
        node.left = insertRecursive(node.left, value);
      } else {
        node.right = insertRecursive(node.right, value);
      }

      return node;
    };

    if (!root) {
      setRoot({ value, left: null, right: null });
      setMessage(`Inserted ${value} as root`);
    } else {
      const newRoot = { ...root };
      insertRecursive(newRoot, value);
      setRoot(newRoot);
      setMessage(`Inserted ${value}`);
    }

    setIsAnimating(false);
  };

  const traverseInOrder = async () => {
    if (isAnimating || !root) return;
    setIsAnimating(true);
    setTraversalPath([]);

    const result: number[] = [];
    const traverse = async (node: TreeNode) => {
      if (node.left) {
        await traverse(node.left);
      }
      
      result.push(node.value);
      setTraversalPath([...result]);
      await sleep(1000);
      
      if (node.right) {
        await traverse(node.right);
      }
    };

    setMessage('Starting in-order traversal');
    await traverse(root);
    setMessage(`In-order traversal: ${result.join(' → ')}`);
    await sleep(1000);
    setTraversalPath([]);
    setIsAnimating(false);
  };

  const traversePreOrder = async () => {
    if (isAnimating || !root) return;
    setIsAnimating(true);
    setTraversalPath([]);

    const result: number[] = [];
    const traverse = async (node: TreeNode) => {
      result.push(node.value);
      setTraversalPath([...result]);
      await sleep(1000);
      
      if (node.left) {
        await traverse(node.left);
      }
      if (node.right) {
        await traverse(node.right);
      }
    };

    setMessage('Starting pre-order traversal');
    await traverse(root);
    setMessage(`Pre-order traversal: ${result.join(' → ')}`);
    await sleep(1000);
    setTraversalPath([]);
    setIsAnimating(false);
  };

  const traversePostOrder = async () => {
    if (isAnimating || !root) return;
    setIsAnimating(true);
    setTraversalPath([]);

    const result: number[] = [];
    const traverse = async (node: TreeNode) => {
      if (node.left) {
        await traverse(node.left);
      }
      if (node.right) {
        await traverse(node.right);
      }
      
      result.push(node.value);
      setTraversalPath([...result]);
      await sleep(1000);
    };

    setMessage('Starting post-order traversal');
    await traverse(root);
    setMessage(`Post-order traversal: ${result.join(' → ')}`);
    await sleep(1000);
    setTraversalPath([]);
    setIsAnimating(false);
  };

  const handleInsert = () => {
    const value = Math.floor(Math.random() * 100);
    insert(value);
  };

  const clearTree = () => {
    setRoot(null);
    setMessage('Tree cleared');
    setTraversalPath([]);
  };

  return (
    <VisualizerLayout
      title="Binary Tree Visualization"
      description="Visualize binary tree operations and traversals with random insertions."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={handleInsert}
              disabled={isAnimating}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Insert Random
            </button>
            <button
              onClick={traverseInOrder}
              disabled={isAnimating || !root}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              In-Order
            </button>
            <button
              onClick={traversePreOrder}
              disabled={isAnimating || !root}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Pre-Order
            </button>
            <button
              onClick={traversePostOrder}
              disabled={isAnimating || !root}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Post-Order
            </button>
            <button
              onClick={clearTree}
              disabled={isAnimating || !root}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Clear Tree
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
              className="w-full bg-gray-900 rounded-lg"
            />
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Binary Tree Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Traversal Orders:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>In-Order: Left → Root → Right</li>
                <li>Pre-Order: Root → Left → Right</li>
                <li>Post-Order: Left → Right → Root</li>
              </ul>
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Insertion: O(h) where h is height</li>
                <li>Traversal: O(n) where n is number of nodes</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(n)</p>
              <p><strong>Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Each node has at most 2 children</li>
                <li>Left child is displayed on the left</li>
                <li>Right child is displayed on the right</li>
                <li>Tree is not necessarily balanced</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Expression trees</li>
                <li>File system organization</li>
                <li>Decision trees</li>
                <li>Game trees</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
