"use client";

import { useState, useEffect } from 'react';
import { useVisualization } from '../VisualizationContext';
import Canvas from '../Canvas';

interface SortingVisualizationProps {
  array: number[];
  type: 'bubble' | 'quick' | 'merge' | 'heap' | 'insertion';
  comparingIndices?: [number, number];
  swappingIndices?: [number, number];
  pivotIndex?: number;
  sortedIndices?: number[];
}

const SortingVisualization = ({
  array,
  type,
  comparingIndices = [-1, -1],
  swappingIndices = [-1, -1],
  pivotIndex = -1,
  sortedIndices = [],
}: SortingVisualizationProps) => {
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
    const elementWidth = width / array.length;
    const maxValue = Math.max(...array);

    // Draw array elements
    array.forEach((value, index) => {
      const x = index * elementWidth;
      const elementHeight = (value / maxValue) * (height - 100);
      const y = height - elementHeight;

      // Determine element color
      let color = 'rgb(59, 130, 246)'; // Default blue

      if (sortedIndices.includes(index)) {
        color = 'rgb(34, 197, 94)'; // Green for sorted
      }
      if (index === pivotIndex) {
        color = 'rgb(168, 85, 247)'; // Purple for pivot
      }
      if (comparingIndices.includes(index)) {
        color = 'rgb(234, 179, 8)'; // Yellow for comparing
      }
      if (swappingIndices.includes(index)) {
        color = 'rgb(239, 68, 68)'; // Red for swapping
      }

      // Draw rectangle with animation
      ctx.fillStyle = color;
      if (swappingIndices.includes(index)) {
        const otherIndex = swappingIndices[0] === index ? swappingIndices[1] : swappingIndices[0];
        const dx = (otherIndex - index) * elementWidth;
        const offsetX = dx * Math.sin(animationProgress * Math.PI);
        ctx.fillRect(x + offsetX + 2, y, elementWidth - 4, elementHeight);
      } else {
        ctx.fillRect(x + 2, y, elementWidth - 4, elementHeight);
      }

      // Draw value text
      ctx.fillStyle = 'white';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        value.toString(),
        x + elementWidth / 2,
        height - 20
      );
    });

    // Draw comparison arrows
    if (comparingIndices[0] !== -1 && comparingIndices[1] !== -1) {
      const x1 = comparingIndices[0] * elementWidth + elementWidth / 2;
      const x2 = comparingIndices[1] * elementWidth + elementWidth / 2;
      
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.5)';
      ctx.lineWidth = 2;
      ctx.moveTo(x1, 50);
      ctx.lineTo(x2, 50);
      ctx.stroke();

      // Animated comparison indicator
      const circleX = x1 + (x2 - x1) * animationProgress;
      ctx.beginPath();
      ctx.fillStyle = 'rgb(234, 179, 8)';
      ctx.arc(circleX, 50, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return (
    <div className="w-full aspect-video">
      <Canvas draw={draw} />
    </div>
  );
};

export default SortingVisualization;
