"use client";

import { useState } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';
import TreeVisualization from '@/components/visualization/tree/TreeVisualization';

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

export default function BSTPage() {
  const [tree, setTree] = useState<TreeNode>({
    value: 8,
    left: {
      value: 3,
      left: { value: 1 },
      right: { value: 6 }
    },
    right: {
      value: 10,
      right: { value: 14 }
    }
  });
  const [highlightNode, setHighlightNode] = useState(-1);
  const [searchValue, setSearchValue] = useState('');

  const insertNode = (value: number) => {
    const insert = (node: TreeNode | undefined): TreeNode => {
      if (!node) {
        return { value };
      }

      if (value < node.value) {
        return { ...node, left: insert(node.left) };
      } else {
        return { ...node, right: insert(node.right) };
      }
    };

    setTree(insert(tree));
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

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (!isNaN(value)) {
      searchNode(value);
    }
  };

  return (
    <VisualizerLayout
      title="Binary Search Tree Visualization"
      description="Visualize Binary Search Tree operations including insertion, deletion, and search. Understand how BST maintains its ordering property."
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
            <div className="flex gap-2">
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Enter value"
                className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          <TreeVisualization
            root={tree}
            type="bst"
            highlightNodes={highlightNode !== -1 ? [highlightNode] : []}
          />

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Binary Search Tree Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Insertion:</strong> O(log n) average case, O(n) worst case</p>
              <p><strong>Deletion:</strong> O(log n) average case, O(n) worst case</p>
              <p><strong>Search:</strong> O(log n) average case, O(n) worst case</p>
              <p><strong>Property:</strong> For any node, all left subtree values are smaller and all right subtree values are larger</p>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
