"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import TreeVisualization from '@/components/visualization/tree/TreeVisualization';

interface AVLNode {
  value: number;
  height: number;
  left?: AVLNode;
  right?: AVLNode;
}

export default function AVLTreePage() {
  const [tree, setTree] = useState<AVLNode>({
    value: 8,
    height: 3,
    left: {
      value: 3,
      height: 2,
      left: { value: 1, height: 1 },
      right: { value: 6, height: 1 }
    },
    right: {
      value: 10,
      height: 2,
      right: { value: 14, height: 1 }
    }
  });
  const [highlightNode, setHighlightNode] = useState(-1);

  const getHeight = (node: AVLNode | undefined): number => {
    return node ? node.height : 0;
  };

  const getBalance = (node: AVLNode | undefined): number => {
    return node ? getHeight(node.left) - getHeight(node.right) : 0;
  };

  const rightRotate = (y: AVLNode): AVLNode => {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;

    return x;
  };

  const leftRotate = (x: AVLNode): AVLNode => {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;

    return y;
  };

  const insertNode = (value: number) => {
    const insert = (node: AVLNode | undefined): AVLNode => {
      if (!node) {
        return { value, height: 1 };
      }

      if (value < node.value) {
        node.left = insert(node.left);
      } else if (value > node.value) {
        node.right = insert(node.right);
      } else {
        return node;
      }

      node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
      const balance = getBalance(node);

      // Left Left Case
      if (balance > 1 && value < node.left!.value) {
        return rightRotate(node);
      }

      // Right Right Case
      if (balance < -1 && value > node.right!.value) {
        return leftRotate(node);
      }

      // Left Right Case
      if (balance > 1 && value > node.left!.value) {
        node.left = leftRotate(node.left!);
        return rightRotate(node);
      }

      // Right Left Case
      if (balance < -1 && value < node.right!.value) {
        node.right = rightRotate(node.right!);
        return leftRotate(node);
      }

      return node;
    };

    setTree(insert({ ...tree }));
  };

  const handleInsert = () => {
    const value = Math.floor(Math.random() * 20) + 1;
    insertNode(value);
  };

  const searchNode = (value: number) => {
    let current = tree;
    let index = 0;

    const animateSearch = async () => {
      while (current) {
        setHighlightNode(index);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (current.value === value) {
          return;
        }

        if (value < current.value) {
          current = current.left;
          index = index * 2 + 1;
        } else {
          current = current.right;
          index = index * 2 + 2;
        }
      }

      setHighlightNode(-1);
    };

    animateSearch();
  };

  return (
    <VisualizerLayout
      title="AVL Tree Visualization"
      description="Visualize AVL Tree operations including insertion, deletion, and rotations. Understand how AVL trees maintain balance for optimal performance."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={handleInsert}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Insert Random
            </button>
          </div>

          <TreeVisualization
            root={tree}
            type="avl"
            highlightNodes={highlightNode !== -1 ? [highlightNode] : []}
          />

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">AVL Tree Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Balance Factor:</strong> For any node, the heights of left and right subtrees differ by at most 1</p>
              <p><strong>Height:</strong> O(log n) - Always balanced</p>
              <p><strong>Operations:</strong> All operations (insert, delete, search) take O(log n) time</p>
              <p><strong>Rotations:</strong> Used to maintain balance after insertions and deletions</p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Left-Left Case: Right rotation</li>
                <li>Right-Right Case: Left rotation</li>
                <li>Left-Right Case: Left rotation then Right rotation</li>
                <li>Right-Left Case: Right rotation then Left rotation</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
