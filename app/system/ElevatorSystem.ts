import {
  ACTOR_X_MOVE_OFFSET,
  ELEVATORS_COUNT,
  FLOOR_HEIGHT,
  SHAFT_X_OFFSET,
} from '../SimulationConstants';

import { ActorInterface } from '../actor/ActorInterface';
import { ElevatorCarInterface } from '../elevator/ElevatorCarInterface';
import { ElevatorSystemInterface } from './ElevatorSystemInterface';
import { ElevatorCar } from '../elevator/ElevatorCar';
import { Actor } from '../actor/Actor';

export class ElevatorSystem implements ElevatorSystemInterface {
  public elevators: ElevatorCarInterface[];
  public actors: ActorInterface[];

  constructor() {
    this.elevators = Array.from(
      { length: ELEVATORS_COUNT },
      (_, i) => new ElevatorCar(SHAFT_X_OFFSET * i, 0, 1, false)
    );
    let startingFloor = 0;
    let destinationFloor = 3;
    this.actors = [
      new Actor(
        ACTOR_X_MOVE_OFFSET,
        FLOOR_HEIGHT + startingFloor * FLOOR_HEIGHT,
        startingFloor,
        destinationFloor,
        false
      ),
      new Actor(
        ACTOR_X_MOVE_OFFSET,
        FLOOR_HEIGHT + startingFloor * FLOOR_HEIGHT,
        startingFloor,
        destinationFloor + 1,
        false
      ),
      new Actor(
        ACTOR_X_MOVE_OFFSET,
        FLOOR_HEIGHT + destinationFloor * FLOOR_HEIGHT,
        destinationFloor,
        startingFloor,
        false
      ),
      new Actor(
        ACTOR_X_MOVE_OFFSET,
        FLOOR_HEIGHT + destinationFloor * FLOOR_HEIGHT,
        destinationFloor,
        startingFloor + 1,
        false
      ),
    ];
  }

  findFreeElevator(): ElevatorCarInterface | null {
    for (let elevator of this.elevators) {
      // select an elevator that isn't moving (not making any trips)
      if (!elevator.isMoving) {
        return elevator;
      }
    }
     return null;
  }

  selectActor(): ActorInterface | null {
    for (let actor of this.actors) {
      // select actor that hasn't done his trip && isn't in elevator
      if (!actor.tripFinished && !actor.inElevator) {
        return actor;
      }
    }
     return null;
  }
}
