"use client";

import { useState, useEffect } from 'react';
import { useVisualization } from '../VisualizationContext';
import Canvas from '../Canvas';

interface ListNode {
  value: number;
  next?: ListNode;
  prev?: ListNode;
}

interface LinkedListVisualizationProps {
  head: ListNode | null;
  highlightNodes?: number[];
  currentNode?: number;
  type?: 'singly' | 'doubly' | 'circular';
}

const LinkedListVisualization = ({
  head,
  highlightNodes = [],
  currentNode = -1,
  type = 'singly'
}: LinkedListVisualizationProps) => {
  const { currentStep } = useVisualization();
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress((prev) => (prev + 0.1) % 1);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const nodeRadius = 30;
    const horizontalSpacing = 120;
    const startX = 60;
    const centerY = height / 2;

    // Helper function to draw a node
    const drawNode = (x: number, y: number, value: number, index: number) => {
      // Node circle
      ctx.beginPath();
      ctx.fillStyle = highlightNodes.includes(index) 
        ? 'rgb(34, 197, 94)' 
        : index === currentNode
        ? 'rgb(239, 68, 68)'
        : 'rgb(59, 130, 246)';
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Node value
      ctx.fillStyle = 'white';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(value.toString(), x, y);

      // Next pointer box
      if (type !== 'doubly') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(x + nodeRadius / 2, y - 10, 20, 20);
      }

      // Prev pointer box for doubly linked list
      if (type === 'doubly') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(x - nodeRadius / 2 - 20, y - 10, 20, 20);
        ctx.fillRect(x + nodeRadius / 2, y - 10, 20, 20);
      }
    };

    // Draw arrows between nodes
    const drawArrow = (fromX: number, fromY: number, toX: number, toY: number, bidirectional = false) => {
      const headLength = 10;
      const angle = Math.atan2(toY - fromY, toX - fromX);

      ctx.beginPath();
      ctx.strokeStyle = 'rgb(156, 163, 175)';
      ctx.lineWidth = 2;
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(
        toX - headLength * Math.cos(angle - Math.PI / 6),
        toY - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        toX - headLength * Math.cos(angle + Math.PI / 6),
        toY - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      if (bidirectional) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(
          fromX + headLength * Math.cos(angle - Math.PI / 6),
          fromY + headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          fromX + headLength * Math.cos(angle + Math.PI / 6),
          fromY + headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      }
    };

    // Draw the linked list
    let current = head;
    let index = 0;
    let prevX = startX;
    let prevY = centerY;

    while (current) {
      const x = startX + index * horizontalSpacing;
      const y = centerY;

      drawNode(x, y, current.value, index);

      if (index > 0) {
        drawArrow(
          prevX + nodeRadius + 20,
          prevY,
          x - nodeRadius,
          y,
          type === 'doubly'
        );
      }

      prevX = x;
      prevY = y;
      current = current.next;
      index++;

      // Draw circular connection if it's a circular linked list
      if (type === 'circular' && !current && index > 1) {
        drawArrow(
          prevX + nodeRadius + 20,
          prevY,
          startX - nodeRadius,
          centerY
        );
      }
    }
  };

  return (
    <div className="w-full aspect-video">
      <Canvas draw={draw} />
    </div>
  );
};

export default LinkedListVisualization;
