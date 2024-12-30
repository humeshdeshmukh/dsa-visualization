"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import TreeVisualization from '@/components/visualization/tree/TreeVisualization';

interface RBNode {
  value: number;
  color: 'red' | 'black';
  left?: RBNode;
  right?: RBNode;
  parent?: RBNode;
}

export default function RedBlackTreePage() {
  const [tree, setTree] = useState<RBNode>({
    value: 7,
    color: 'black',
    left: {
      value: 3,
      color: 'red',
      left: { value: 1, color: 'black' },
      right: { value: 5, color: 'black' }
    },
    right: {
      value: 11,
      color: 'red',
      left: { value: 9, color: 'black' },
      right: { value: 13, color: 'black' }
    }
  });
  const [highlightNode, setHighlightNode] = useState(-1);

  const rotateLeft = (node: RBNode): RBNode => {
    const rightChild = node.right!;
    node.right = rightChild.left;
    rightChild.left = node;
    return rightChild;
  };

  const rotateRight = (node: RBNode): RBNode => {
    const leftChild = node.left!;
    node.left = leftChild.right;
    leftChild.right = node;
    return leftChild;
  };

  const isRed = (node: RBNode | undefined): boolean => {
    return node ? node.color === 'red' : false;
  };

  const flipColors = (node: RBNode) => {
    node.color = node.color === 'red' ? 'black' : 'red';
    if (node.left) node.left.color = node.left.color === 'red' ? 'black' : 'red';
    if (node.right) node.right.color = node.right.color === 'red' ? 'black' : 'red';
  };

  const insertNode = (value: number) => {
    const insert = (node: RBNode | undefined): RBNode => {
      if (!node) {
        return { value, color: 'red' };
      }

      if (value < node.value) {
        node.left = insert(node.left);
      } else if (value > node.value) {
        node.right = insert(node.right);
      } else {
        return node;
      }

      // Fix-up red-black tree violations
      if (isRed(node.right) && !isRed(node.left)) {
        node = rotateLeft(node);
      }
      if (isRed(node.left) && isRed(node.left?.left)) {
        node = rotateRight(node);
      }
      if (isRed(node.left) && isRed(node.right)) {
        flipColors(node);
      }

      return node;
    };

    const newTree = insert({ ...tree });
    newTree.color = 'black'; // Root must be black
    setTree(newTree);
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
      title="Red-Black Tree Visualization"
      description="Visualize Red-Black Tree operations and understand how it maintains balance through color properties and rotations."
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
            type="red-black"
            highlightNodes={highlightNode !== -1 ? [highlightNode] : []}
          />

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Red-Black Tree Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Properties:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Every node is either red or black</li>
                <li>Root is always black</li>
                <li>All leaves (NIL) are black</li>
                <li>If a node is red, both its children are black</li>
                <li>Every path from root to leaves has same number of black nodes</li>
              </ul>
              <p><strong>Height:</strong> O(log n) - Guaranteed by color properties</p>
              <p><strong>Operations:</strong> All operations (insert, delete, search) take O(log n) time</p>
              <p><strong>Balancing Operations:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Color flips</li>
                <li>Left rotations</li>
                <li>Right rotations</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
