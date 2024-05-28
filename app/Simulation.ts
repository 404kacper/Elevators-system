// Simulation.ts
import {
  ELEVATOR_COUNT,
  SHAFT_X_OFFSET,
  SHAFT_WIDTH,
  SHAFT_TOP,
  SHAFT_BOTTOM,
  X_SHAFT_SPACING,
  FLOOR_HEIGHT,
  FLOOR_Y_POSITIONS,
  FLOOR_Y,
  ACTOR_COUNT,
  ACTOR_WIDTH,
  ACTOR_SHAFT_OFFSET,
} from './SimulationConstants';

import { ElevatorInterface } from './elevator/ElevatorInterface';
import { SimulationInterface } from './SimulationInterface';
import { ActorInterface } from './actor/ActorInterface';
import { Elevator } from './elevator/Elevator';
import { Actor } from './actor/Actor';

export class Simulation implements SimulationInterface {
  public elevators: ElevatorInterface[];
  public actors: ActorInterface[];

  constructor() {
    this.elevators = Array.from(
      { length: ELEVATOR_COUNT },
      () => new Elevator(SHAFT_BOTTOM, 1)
    );
    this.actors = Array.from({ length: ACTOR_COUNT }, (_, i) => {
      const shaftXCenter =
        SHAFT_X_OFFSET +
        (i % ELEVATOR_COUNT) * (SHAFT_WIDTH + X_SHAFT_SPACING) +
        SHAFT_WIDTH / 2;
      // initial position for actor is centre of the shaft + X_OFFSET to place him on the floor
      return new Actor(
        shaftXCenter - ACTOR_WIDTH / 2 + ACTOR_SHAFT_OFFSET,
        FLOOR_Y,
        i % ELEVATOR_COUNT,
        false
      );
    });
  }

  updateElevators() {
    this.elevators = this.elevators.map((elevator) => {
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
  }

  updateActors() {
    this.actors = this.actors.map((actor) => {
      const targetElevator = this.elevators[actor.targetElevator];
      let newY = actor.y;
      let inElevator = actor.inElevator;

      if (!inElevator) {
        // If the actor is not in the elevator and the elevator is at the actor's current floor
        if (
          FLOOR_Y_POSITIONS.includes(targetElevator.carY) &&
          actor.y === FLOOR_Y
        ) {
          const currentFloor = FLOOR_Y_POSITIONS.findIndex(
            (y) => y === targetElevator.carY
          );
          if (currentFloor === actor.destinationFloor) {
            newY = targetElevator.carY;
            inElevator = true;
            // change x position when entering elevator
            actor.x = actor.x - ACTOR_SHAFT_OFFSET;
          }
        }
      } else {
        // If the actor is in the elevator, move with the elevator
        newY = targetElevator.carY;

        // Exit the elevator if it reaches the destination floor
        if (FLOOR_Y_POSITIONS.includes(targetElevator.carY)) {
          const currentFloor = FLOOR_Y_POSITIONS.findIndex(
            (y) => y === targetElevator.carY
          );
          if (currentFloor === actor.destinationFloor) {
            inElevator = false;
            newY = targetElevator.carY;
            // change x position when leaving elevator
            actor.x = actor.x + ACTOR_SHAFT_OFFSET;
          }
        }
      }

      console.log(actor.y);

      return {
        ...actor,
        y: newY,
        inElevator,
      };
    });
  }
}
