'use client';

import {
  ELEVATOR_COUNT,
  CAR_WIDTH,
  CAR_HEIGHT,
  SHAFT_X_OFFSET,
  SHAFT_WIDTH,
  SHAFT_HEIGHT,
  SHAFT_TOP,
  SHAFT_SPACING,
  FLOOR_Y_POSITIONS,
  ACTOR_WIDTH,
  ACTOR_HEIGHT,
  SLOW_DOWN_FACTOR,
} from './SimulationConstants';

import { useEffect, useRef, useState } from 'react';
import { Simulation } from './Simulation';

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
    FLOOR_Y_POSITIONS.forEach((y) => {
      context.strokeStyle = '#000';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(SHAFT_X_OFFSET, y);
      context.lineTo(
        SHAFT_X_OFFSET + ELEVATOR_COUNT * (SHAFT_WIDTH + SHAFT_SPACING),
        y
      );
      context.stroke();
    });

    // Draw each elevator shaft first (in a lighter color for contrast)
    simulation.elevators.forEach((elevator, index) => {
      const shaftX = SHAFT_X_OFFSET + index * (SHAFT_WIDTH + SHAFT_SPACING);

      context.fillStyle = '#ddd';
      context.fillRect(shaftX, SHAFT_TOP, SHAFT_WIDTH, SHAFT_HEIGHT);
    });

    // Draw each elevator car and its cables
    simulation.elevators.forEach((elevator, index) => {
      const shaftX = SHAFT_X_OFFSET + index * (SHAFT_WIDTH + SHAFT_SPACING);

      // Drawing the elevator cables
      context.strokeStyle = '#000';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(shaftX + 5 + CAR_WIDTH / 2, SHAFT_TOP);
      context.lineTo(shaftX + 5 + CAR_WIDTH / 2, elevator.carY);
      context.stroke();

      // Drawing the elevator car
      context.fillStyle = '#aaa';
      context.fillRect(shaftX + 5, elevator.carY, CAR_WIDTH, CAR_HEIGHT);
    });

    // Draw each actor
    simulation.actors.forEach((actor) => {
      context.fillStyle = '#f00';
      context.fillRect(actor.x, actor.y, ACTOR_WIDTH, ACTOR_HEIGHT); // Actor
    });
  };

  const animate = () => {
    frameCount.current++;
    if (frameCount.current % SLOW_DOWN_FACTOR === 0) {
      setIteration((prev) => prev + 1);

      simulation.updateElevators();
      simulation.updateActors();

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
