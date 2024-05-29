import { ActorInterface } from './ActorInterface';
import { ElevatorCarInterface } from '../elevator/ElevatorCarInterface';
import { ACTOR_X_MOVE_OFFSET, FLOOR_COUNT } from '../SimulationConstants';
import { FLOOR_HEIGHT, SHAFT_HEIGHT } from '../SimulationConstants';

export class Actor implements ActorInterface {
  x: number;
  y: number;
  targetElevator: ElevatorCarInterface;
  inElevator: boolean;
  startingFloor: number;
  destinationFloor: number;
  tripFinished: boolean;

  constructor(
    x: number,
    y: number,
    targetElevator: ElevatorCarInterface,
    inElevator: boolean
  ) {
    this.x = x;
    this.y = y;
    this.targetElevator = targetElevator;
    this.inElevator = inElevator;
    this.startingFloor = 0;
    this.tripFinished = false;
    // Generate a random destination floor that's always different from starting floor
    // do {
    //   this.destinationFloor = Math.floor(Math.random() * FLOOR_COUNT);
    // } while (this.destinationFloor === this.startingFloor);
    this.destinationFloor = 4;
  }

  moveActor(): void {
    console.log(this.startingFloor, this.destinationFloor);
    // if elevator is on the starting floor of the actor & the actor hasn't finshed his trip yet
    // load the actor into elevator and start moving along with it
    if (this.targetElevator.y === this.startingFloor && !this.tripFinished) {
      this.inElevator = true;
      this.x -= ACTOR_X_MOVE_OFFSET;
    }

    // exit the actor if his destination floor is reached
    if (
      this.targetElevator.y === this.destinationFloor * FLOOR_HEIGHT &&
      !this.tripFinished
    ) {
      this.inElevator = false;
      this.tripFinished = true;
      this.x += ACTOR_X_MOVE_OFFSET;
    }

    // independat moving logic since either of them is going to lag one iteration behind the other
    if (this.inElevator) {
      // move in the same direction as the elevator
      this.y = this.y + FLOOR_HEIGHT * this.targetElevator.direction;
    }
  }
}
