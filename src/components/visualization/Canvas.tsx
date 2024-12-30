"use client";

import { useRef, useEffect } from 'react';
import { useVisualization } from './VisualizationContext';

interface CanvasProps {
  width?: number;
  height?: number;
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
}

const Canvas = ({ width = 800, height = 400, draw }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying, speed } = useVisualization();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let frameCount = 0;
    let animationFrameId: number;

    const render = () => {
      if (isPlaying) {
        frameCount += speed;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, isPlaying, speed]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full bg-gray-900/50 rounded-lg"
    />
  );
};

export default Canvas;
