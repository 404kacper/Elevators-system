'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  SHAFT_X_OFFSET,
  ACTOR_X_MOVE_OFFSET,
  ELEVATORS_COUNT,
} from './SimulationConstants';
import { ActorInterface } from './actor/ActorInterface';
import { Actor } from './actor/Actor';

const SimulationComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const frameCount = useRef(0);
  const [iteration, setIteration] = useState(0);
  const [simulation, setSimulation] = useState<Simulation>(() => new Simulation([]));
  const [runSimulation, setRunSimulation] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const [actorsInputField, setActorsInputField] = useState('');
  let actors: ActorInterface[] = [];

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(event.target.value));
  };

  const handleActorsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActorsInputField(event.target.value);
  };

  const parseActorsInput = (input: string): [number, number][] => {
    const actorPairs = input.trim().split(/\s+/);
    return actorPairs
      .map((pair) => {
        const match = pair.match(/\[(\d+),(\d+)\]/);
        if (match) {
          const [, start, target] = match;
          return [parseInt(start, 10), parseInt(target, 10)];
        }
        return null;
      })
      .filter((pair): pair is [number, number] => pair !== null);
  };

  const startSimulation = () => {
    parseActorsInput(actorsInputField).forEach((floorsPair) => {
      let newActor: ActorInterface = new Actor(
        ACTOR_X_MOVE_OFFSET,
        floorsPair[0]*FLOOR_HEIGHT,
        floorsPair[0],
        floorsPair[1],
        false
      );
      actors.push(newActor);
    });
    setSimulation(new Simulation(actors, sliderValue));
    setRunSimulation(true);
  };

  const draw = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    for (let i = 1; i < SHAFT_HEIGHT / FLOOR_HEIGHT + 1; i++) {
      context.strokeStyle = '#000';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, FLOOR_HEIGHT * i);
      context.lineTo(2000, FLOOR_HEIGHT * i);
      context.stroke();
    }

    context.fillStyle = '#ddd';
    simulation.elevatorSystem.elevators.forEach((elevatorCar, i) => {
      context.fillRect(SHAFT_X_OFFSET * i, 0, SHAFT_WIDTH, SHAFT_HEIGHT);
    });

    context.fillStyle = '#000';
    simulation.elevatorSystem.elevators.forEach((elevatorCar) => {
      context.fillRect(elevatorCar.x + 10, elevatorCar.y, CAR_WIDTH, CAR_HEIGHT);
    });

    context.fillStyle = '#FF0000';
    simulation.elevatorSystem.actors.forEach((actor) => {
      context.fillRect(actor.x + ACTOR_WIDTH + 20, actor.y - 10, ACTOR_WIDTH, ACTOR_HEIGHT);
    });
  };

  const animate = () => {
    frameCount.current++;
    if (frameCount.current % SLOW_DOWN_FACTOR === 0) {
      setIteration((prev) => prev + 1);

      const simulationCompleted = simulation.runSimulationStep();

      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context && runSimulation) { // Only draw if runSimulation is true
          draw(context);
        }
      }

      if (simulationCompleted) {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
        return; // Stop the animation loop
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (runSimulation) {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          draw(context);
        }
      }
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [runSimulation]);

  return (
    <>
      {runSimulation ? (
        <>
          <div>Simulation Iteration: {iteration}</div>
          <canvas ref={canvasRef} width={1800} height={400}></canvas>
        </>
      ) : (
        <>
          <div>Chosen amount of elevators: {sliderValue}</div>
          <div className='slidecontainer'>
            <input
              type='range'
              min='1'
              max='16'
              step='1'
              value={sliderValue}
              className='slider'
              id='myRange'
              onChange={handleSliderChange}
            />
          </div>
          <div>
            <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Enter actors array below:
            </label>
            <input
              type='text'
              id='actors_input'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Example - two actors separated by single whitespace: [1,3] [2,4]'
              onChange={handleActorsInputChange}
              value={actorsInputField}
              required
            />
            <p id='helper-text-explanation' className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
              First value within square brackets is the starting floor while second one is the destination floor
            </p>
          </div>
          <button
            className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'
            onClick={startSimulation}
          >
            Run Simulation
          </button>
        </>
      )}
    </>
  );
};

export default SimulationComponent;
