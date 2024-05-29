import { ACTOR_X_MOVE_OFFSET, FLOOR_HEIGHT } from '../SimulationConstants';

import { ActorInterface } from '../actor/ActorInterface';
import { ElevatorCarInterface } from '../elevator/ElevatorCarInterface';
import { ElevatorSystemInterface } from './ElevatorSystemInterface';
import { ElevatorCar } from '../elevator/ElevatorCar';
import { Actor } from '../actor/Actor';

export class ElevatorSystem implements ElevatorSystemInterface {
  public elevators: ElevatorCarInterface[];
  public actors: ActorInterface[];
  public actorsIterator: number;

  constructor() {
    this.actorsIterator = 0;
    this.elevators = Array.from(
      { length: 1 },
      () => new ElevatorCar(0, 0, 1, false)
    );

    let startingFloor = 0;
    let destinationFloor = 3;
    this.actors = [
      new Actor(
        ACTOR_X_MOVE_OFFSET,
        FLOOR_HEIGHT + startingFloor * FLOOR_HEIGHT,
        this.elevators[0],
        startingFloor,
        destinationFloor,
        false
      ),
      new Actor(
        ACTOR_X_MOVE_OFFSET,
        FLOOR_HEIGHT + startingFloor * FLOOR_HEIGHT,
        this.elevators[0],
        startingFloor,
        destinationFloor + 1,
        false
      ),
      new Actor(
        ACTOR_X_MOVE_OFFSET,
        FLOOR_HEIGHT + destinationFloor * FLOOR_HEIGHT,
        this.elevators[0],
        destinationFloor,
        startingFloor,
        false
      )
    ];
  }

  selectElevator(): ElevatorCarInterface {
    return this.elevators[0];
  }

  selectActor(): ActorInterface | null {
    // Ensure actorsIterator is within bounds
    if (this.actorsIterator >= this.actors.length) {
      return null; // All actors have finished their trips
    }

    // Move to next actor if the current actor's trip is finished
    if (this.actors[this.actorsIterator].tripFinished) {
      this.actorsIterator++;
    }

    // Ensure actorsIterator is within bounds again after increment
    if (this.actorsIterator >= this.actors.length) {
      return null; // All actors have finished their trips
    }

    return this.actors[this.actorsIterator];
  }
}

