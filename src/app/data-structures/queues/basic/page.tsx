"use client";

import { useState, useRef, useEffect } from 'react';
import VisualizerLayout from '@/components/shared/VisualizerLayout';
import { VisualizationProvider } from '@/components/visualization/VisualizationContext';
import VisualizationControls from '@/components/visualization/VisualizationControls';

interface QueueNode {
  value: string;
  highlighted?: boolean;
}

export default function BasicQueuePage() {
  const [queue, setQueue] = useState<QueueNode[]>([]);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(-1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxSize = 10;

  useEffect(() => {
    drawQueue();
  }, [queue, front, rear]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const drawQueue = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const boxWidth = 60;
    const boxHeight = 60;
    const startX = (canvas.width - (maxSize * boxWidth)) / 2;
    const startY = canvas.height / 2 - boxHeight / 2;

    // Draw empty boxes for the entire queue capacity
    for (let i = 0; i < maxSize; i++) {
      const x = startX + i * boxWidth;
      ctx.beginPath();
      ctx.rect(x, startY, boxWidth, boxHeight);
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Draw index numbers below boxes
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(i.toString(), x + boxWidth / 2, startY + boxHeight + 20);
    }

    // Draw queue elements
    queue.forEach((node, index) => {
      const x = startX + index * boxWidth;
      
      // Fill box
      ctx.beginPath();
      ctx.rect(x, startY, boxWidth, boxHeight);
      ctx.fillStyle = node.highlighted ? '#F59E0B' : '#3B82F6';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.stroke();

      // Draw value
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.value, x + boxWidth / 2, startY + boxHeight / 2);
    });

    // Draw front and rear pointers
    const pointerY = startY - 30;
    if (queue.length > 0) {
      // Draw front pointer
      const frontX = startX + front * boxWidth + boxWidth / 2;
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.moveTo(frontX, pointerY);
      ctx.lineTo(frontX - 10, pointerY + 20);
      ctx.lineTo(frontX + 10, pointerY + 20);
      ctx.closePath();
      ctx.fill();
      ctx.fillText('Front', frontX, pointerY - 10);

      // Draw rear pointer
      const rearX = startX + rear * boxWidth + boxWidth / 2;
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.moveTo(rearX, pointerY);
      ctx.lineTo(rearX - 10, pointerY + 20);
      ctx.lineTo(rearX + 10, pointerY + 20);
      ctx.closePath();
      ctx.fill();
      ctx.fillText('Rear', rearX, pointerY - 10);
    }
  };

  const enqueue = async (value: string) => {
    if (isAnimating || queue.length >= maxSize) return;
    setIsAnimating(true);

    const newNode: QueueNode = { value, highlighted: true };
    const newQueue = [...queue, newNode];
    setQueue(newQueue);
    setRear(newQueue.length - 1);
    setMessage(`Enqueuing value "${value}"`);
    await sleep(1000);

    newNode.highlighted = false;
    setQueue([...newQueue]);
    setMessage(`Enqueued value "${value}"`);
    setIsAnimating(false);
  };

  const dequeue = async () => {
    if (isAnimating || queue.length === 0) return;
    setIsAnimating(true);

    const removedValue = queue[front].value;
    queue[front].highlighted = true;
    setQueue([...queue]);
    setMessage(`Dequeuing value "${removedValue}"`);
    await sleep(1000);

    const newQueue = queue.slice(1);
    setQueue(newQueue);
    setRear(newQueue.length - 1);
    setMessage(`Dequeued value "${removedValue}"`);
    setIsAnimating(false);
  };

  const handleEnqueue = () => {
    if (queue.length >= maxSize) {
      setMessage('Queue is full');
      return;
    }
    const value = Math.random().toString(36).substring(7);
    enqueue(value);
  };

  const clearQueue = () => {
    setQueue([]);
    setFront(0);
    setRear(-1);
    setMessage('Queue cleared');
  };

  return (
    <VisualizerLayout
      title="Basic Queue Visualization"
      description="Visualize a basic FIFO (First-In-First-Out) queue with enqueue and dequeue operations."
    >
      <VisualizationProvider>
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
              onClick={handleEnqueue}
              disabled={isAnimating || queue.length >= maxSize}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Enqueue Random
            </button>
            <button
              onClick={() => dequeue()}
              disabled={isAnimating || queue.length === 0}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Dequeue
            </button>
            <button
              onClick={clearQueue}
              disabled={isAnimating || queue.length === 0}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Clear Queue
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
              height={200}
              className="w-full bg-gray-900 rounded-lg"
            />
          </div>

          <div className="glass-dark border border-white/10 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Queue Status:</h4>
                <div className="space-y-2 text-gray-300">
                  <p>Size: {queue.length}</p>
                  <p>Front Index: {queue.length > 0 ? front : 'N/A'}</p>
                  <p>Rear Index: {queue.length > 0 ? rear : 'N/A'}</p>
                  <p>Capacity: {maxSize}</p>
                </div>
              </div>
            </div>
          </div>

          <VisualizationControls />

          <div className="glass-dark border border-white/10 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Queue Properties</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Time Complexity:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Enqueue: O(1)</li>
                <li>Dequeue: O(1)</li>
                <li>Peek: O(1)</li>
              </ul>
              <p><strong>Space Complexity:</strong> O(n)</p>
              <p><strong>Features:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>FIFO (First-In-First-Out)</li>
                <li>Fixed capacity</li>
                <li>Front and rear pointers</li>
                <li>Linear data structure</li>
              </ul>
              <p><strong>Applications:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Process scheduling</li>
                <li>Print job management</li>
                <li>Request handling</li>
                <li>BFS traversal</li>
              </ul>
              <p><strong>Operations:</strong></p>
              <ul className="list-disc list-inside mt-2 ml-4">
                <li>Enqueue: Add to rear</li>
                <li>Dequeue: Remove from front</li>
                <li>Front: Get front element</li>
                <li>IsEmpty: Check if empty</li>
                <li>IsFull: Check if full</li>
              </ul>
            </div>
          </div>
        </div>
      </VisualizationProvider>
    </VisualizerLayout>
  );
}
