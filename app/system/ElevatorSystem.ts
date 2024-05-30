import {
  SHAFT_X_OFFSET,
} from '../SimulationConstants';

import { ActorInterface } from '../actor/ActorInterface';
import { ElevatorCarInterface } from '../elevator/ElevatorCarInterface';
import { ElevatorSystemInterface } from './ElevatorSystemInterface';
import { ElevatorCar } from '../elevator/ElevatorCar';

export class ElevatorSystem implements ElevatorSystemInterface {
  public elevators: ElevatorCarInterface[];
  public actors: ActorInterface[];

  constructor(actors: ActorInterface[], elevatorsCount: number) {
    this.elevators = Array.from(
      { length: elevatorsCount },
      (_, i) => new ElevatorCar(SHAFT_X_OFFSET * i, 0, 1, false)
    );
    this.actors = actors;
    console.log(this.actors);
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
