// Simulation.ts
import { ACTOR_X_MOVE_OFFSET, FLOOR_HEIGHT } from './SimulationConstants';

import { ElevatorCarInterface } from './elevator/ElevatorCarInterface';
import { SimulationInterface } from './SimulationInterface';
import { ActorInterface } from './actor/ActorInterface';
import { ElevatorCar } from './elevator/ElevatorCar';
import { Actor } from './actor/Actor';

export class Simulation implements SimulationInterface {
  public elevators: ElevatorCarInterface[];
  public actors: ActorInterface[];

  constructor() {
    this.elevators = Array.from(
      { length: 1 },
      () => new ElevatorCar(0, 0, 1, false)
    );

    this.actors = Array.from({ length: 1 }, (_, i) => {
      let startingFloor = 4;
      // Generate a random destination floor that's always different from starting floor
      // do {
      //   this.destinationFloor = Math.floor(Math.random() * FLOOR_COUNT);
      // } while (this.destinationFloor === this.startingFloor);
      let destinationFloor = 0;
      return new Actor(
        ACTOR_X_MOVE_OFFSET,
        FLOOR_HEIGHT + startingFloor * FLOOR_HEIGHT,
        this.elevators[0],
        startingFloor,
        destinationFloor,
        false
      );
    });
  }

  runSimulationStep(): void {
    // move actor first so that he's able to get inside the elevator on 0th iteration
    this.actors.forEach((actor) => {
      actor.moveActor();
    });
    this.elevators.forEach((elevator) => {
      elevator.pickup(this.actors[0]);
    });
  }
}
