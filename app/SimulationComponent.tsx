'use client';

import { useEffect, useRef, useState } from 'react';
import { Simulation } from './Simulation';
import {
  CAR_HEIGHT,
  CAR_WIDTH,
  FLOOR_HEIGHT,
  SHAFT_HEIGHT,
  SHAFT_WIDTH,
  SLOW_DOWN_FACTOR,
  ACTOR_WIDTH,
  ACTOR_HEIGHT,
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

    // Draw each elevator shaft
    context.fillStyle = '#ddd';
    context.fillRect(0, 0, SHAFT_WIDTH, SHAFT_HEIGHT);

    // Draw each elevator car
    context.fillStyle = '#000';
    simulation.elevators.forEach((elevatorCar) => {
      // + 10 to center the car inside elevator
      context.fillRect(
        elevatorCar.x + 10,
        elevatorCar.y,
        CAR_WIDTH,
        CAR_HEIGHT
      );
    });

    // Draw each actor
    context.fillStyle = '#FF0000';
    simulation.actors.forEach((actor) => {
      // + 20 to center the actor inside elevator car
      context.fillRect(
        actor.x + ACTOR_WIDTH + 20,
        actor.y,
        ACTOR_WIDTH,
        ACTOR_HEIGHT
      );
    });
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
