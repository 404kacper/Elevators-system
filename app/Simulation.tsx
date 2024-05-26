'use client';

import { useEffect, useRef, useState } from 'react';
import { ElevatorInterface } from './elevator/ElevatorInterface';
import { ActorInterface } from './actor/ActorInterface';
import { Elevator } from './elevator/Elevator';
import { Actor } from './actor/Actor';

const ELEVATOR_COUNT: number = 16;

const CAR_WIDTH: number = 40;
const CAR_HEIGHT: number = 40;

const SHAFT_X_OFFSET: number = 50;
const SHAFT_WIDTH: number = 50;
const SHAFT_HEIGHT: number = 300;
const SHAFT_TOP: number = 50;
const SHAFT_BOTTOM: number = SHAFT_TOP + SHAFT_HEIGHT - CAR_HEIGHT;
const SHAFT_SPACING: number = 60;

const FLOOR_COUNT: number = 5;
const FLOOR_HEIGHT: number = SHAFT_HEIGHT / FLOOR_COUNT;
const FLOOR_Y_POSITIONS: number[] = Array.from(
  { length: FLOOR_COUNT },
  (_, i) => SHAFT_TOP + i * FLOOR_HEIGHT
);
const FLOOR_Y: number = SHAFT_BOTTOM + 10;

const ACTOR_COUNT: number = 16;
const ACTOR_WIDTH: number = 10;
const ACTOR_HEIGHT: number = 10;

const SLOW_DOWN_FACTOR = 100;

const Simulation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const frameCount = useRef(0);
  const [iteration, setIteration] = useState(0);
  const [elevators, setElevators] = useState<ElevatorInterface[]>(
    Array.from({ length: ELEVATOR_COUNT }, () => new Elevator(SHAFT_TOP, 1))
  );
  const [actors, setActors] = useState<ActorInterface[]>(
    Array.from(
      { length: ACTOR_COUNT },
      (_, i) => {
        const shaftXCenter = SHAFT_X_OFFSET + (i % ELEVATOR_COUNT) * (SHAFT_WIDTH + SHAFT_SPACING) + SHAFT_WIDTH / 2;
        const actorX = shaftXCenter - ACTOR_WIDTH / 2;
        return new Actor(
          actorX,
          FLOOR_Y,
          i % ELEVATOR_COUNT,
          false,
          Math.floor(Math.random() * FLOOR_COUNT)
        );
      }
    )
  );

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
    elevators.forEach((elevator, index) => {
      const shaftX = SHAFT_X_OFFSET + index * (SHAFT_WIDTH + SHAFT_SPACING);

      context.fillStyle = '#ddd';
      context.fillRect(shaftX, SHAFT_TOP, SHAFT_WIDTH, SHAFT_HEIGHT);
    });

    // Draw each elevator car and its cables
    elevators.forEach((elevator, index) => {
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
    actors.forEach((actor) => {
      context.fillStyle = '#f00';
      context.fillRect(actor.x, actor.y, ACTOR_WIDTH, ACTOR_HEIGHT); // Actor
    });
  };

  const animate = () => {
    frameCount.current++;
    if (frameCount.current % SLOW_DOWN_FACTOR === 0) {
      setIteration((prev) => prev + 1);

      const updatedElevators = elevators.map((elevator) => {
        let newCarY = elevator.carY + elevator.direction * FLOOR_HEIGHT;
        let newDirection = elevator.direction;

        // Reverse direction if at the top or bottom
        if (newCarY < SHAFT_TOP || newCarY > SHAFT_BOTTOM) {
          newDirection = -newDirection;
          newCarY = elevator.carY + newDirection * FLOOR_HEIGHT;
        }

        return {
          carY: newCarY,
          direction: newDirection,
        };
      });

      const updatedActors = actors.map((actor) => {
        const targetElevator = updatedElevators[actor.targetElevator];
        let newY = actor.y;
        let inElevator = actor.inElevator;

        if (!inElevator) {
          // If the actor is not in the elevator and the elevator is at the actor's current floor
          if (FLOOR_Y_POSITIONS.includes(targetElevator.carY) && actor.y === FLOOR_Y) {
            const currentFloor = FLOOR_Y_POSITIONS.findIndex(
              (y) => y === targetElevator.carY
            );
            if (currentFloor === actor.destinationFloor) {
              newY = targetElevator.carY + 15; // Move actor inside the elevator
              inElevator = true;
            }
          }
        } else {
          // If the actor is in the elevator, move with the elevator
          newY = targetElevator.carY + 15;

          // Exit the elevator if it reaches the destination floor
          if (FLOOR_Y_POSITIONS.includes(targetElevator.carY)) {
            const currentFloor = FLOOR_Y_POSITIONS.findIndex(
              (y) => y === targetElevator.carY
            );
            if (currentFloor === actor.destinationFloor) {
              inElevator = false;
              newY = targetElevator.carY;
            }
          }
        }

        return {
          ...actor,
          y: newY,
          inElevator,
        };
      });

      setElevators(updatedElevators);
      setActors(updatedActors);

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
  }, [elevators, actors]);

  return (
    <>
      <div>Simulation Iteration: {iteration}</div>
      <canvas ref={canvasRef} width={1200} height={400}></canvas>
    </>
  );
};

export default Simulation;
