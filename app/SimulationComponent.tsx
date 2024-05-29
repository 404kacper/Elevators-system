'use client';

import { useEffect, useRef, useState } from 'react';
import { Simulation } from './Simulation';
import {
  FLOOR_HEIGHT,
  SHAFT_HEIGHT,
  SHAFT_WIDTH,
  SLOW_DOWN_FACTOR,
} from './SimulationConstants';

const SimulationComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const frameCount = useRef(0);
  const [iteration, setIteration] = useState(0);
  const [simulation] = useState(() => new Simulation());

  const draw = (context: CanvasRenderingContext2D) => {
    // Clear the canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    // Draw each floor
    for (let i: number = 1; i < SHAFT_HEIGHT / FLOOR_HEIGHT + 1; i++) {
      context.strokeStyle = '#000';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, FLOOR_HEIGHT * i);
      context.lineTo(1200, FLOOR_HEIGHT * i);
      context.stroke();
    }

    context.fillRect(0,0, 10, 10);

    // Draw each elevator shaft first (in a lighter color for contrast)
    context.fillStyle = '#ddd';

    // Draw each elevator car and its cables
    context.strokeStyle = '#000';

    // Drawing the elevator cables

    // Drawing the elevator car

    // Draw each actor
  };

  const animate = () => {
    frameCount.current++;
    if (frameCount.current % SLOW_DOWN_FACTOR === 0) {
      setIteration((prev) => prev + 1);

      simulation.runSimulationStep();

      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          draw(context);
        }
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        // Draw the initial frame
        draw(context);
      }
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <>
      <div>Simulation Iteration: {iteration}</div>
      <canvas ref={canvasRef} width={1200} height={400}></canvas>
    </>
  );
};

export default SimulationComponent;
