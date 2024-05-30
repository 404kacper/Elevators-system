import { ActorInterface } from './ActorInterface';
import { ElevatorCarInterface } from '../elevator/ElevatorCarInterface';
import { ACTOR_X_MOVE_OFFSET } from '../SimulationConstants';
import { FLOOR_HEIGHT, SHAFT_HEIGHT } from '../SimulationConstants';

export class Actor implements ActorInterface {
  x: number;
  y: number;
  inElevator: boolean;
  startingFloor: number;
  destinationFloor: number;
  tripFinished: boolean;
  tripDirection: number;
  targetElevator: ElevatorCarInterface | null;

  constructor(
    x: number,
    y: number,
    startingFloor: number,
    destinationFloor: number,
    inElevator: boolean
  ) {
    this.x = x;
    this.y = y;
    this.inElevator = inElevator;
    this.startingFloor = startingFloor;
    this.tripFinished = false;
    this.destinationFloor = destinationFloor;
    // -1 if the actor wants to ride up 1 if the actor wants to ride down
    this.tripDirection = startingFloor < destinationFloor ? 1 : -1;
    this.targetElevator = null;
  }

  // once the elevator is on the actors floor he gets in and starts driving towards his destination
  moveActor(): void {
    if (this.targetElevator) {
      if (
        this.targetElevator.y == this.startingFloor * FLOOR_HEIGHT &&
        !this.tripFinished &&
        !this.inElevator
      ) {
        // wait until elevator has picked up the actor to start moving
        // if elevator is on the starting floor of the actor & the actor hasn't finshed his trip yet
        // load the actor into elevator and start moving along with it
        this.inElevator = true;
        this.x -= ACTOR_X_MOVE_OFFSET;
      } else if (
        // exit the actor if his destination floor is reached & his trip is not finished & elevator direction matches the trip direction
        this.targetElevator.y == this.destinationFloor * FLOOR_HEIGHT &&
        !this.tripFinished &&
        Math.sign(this.targetElevator.direction) ==
          Math.sign(this.tripDirection)
      ) {
        this.inElevator = false;
        this.tripFinished = true;
        this.x += ACTOR_X_MOVE_OFFSET;
      } else if (
        // edge condition for exiting on the floor with the highest number
        // that is when moving down
        this.y >= SHAFT_HEIGHT - FLOOR_HEIGHT &&
        !this.tripFinished &&
        Math.sign(this.targetElevator.direction) !=
          Math.sign(this.tripDirection) &&
        this.targetElevator.y == this.destinationFloor * FLOOR_HEIGHT &&
        this.targetElevator.direction < 0
      ) {
        this.inElevator = false;
        this.tripFinished = true;
        this.x += ACTOR_X_MOVE_OFFSET;
      } else if (
        // edge condition for exiting on the floor with the lowest number
        // that is when moving up
        this.y == FLOOR_HEIGHT &&
        !this.tripFinished &&
        Math.sign(this.targetElevator.direction) !=
          Math.sign(this.tripDirection) &&
        this.targetElevator.y == this.destinationFloor * FLOOR_HEIGHT &&
        this.targetElevator.direction > 0
      ) {
        this.inElevator = false;
        this.tripFinished = true;
        this.x += ACTOR_X_MOVE_OFFSET;
      } else if (this.inElevator && this.tripDirection < 0) {
        this.x = this.targetElevator.x;
        this.y += FLOOR_HEIGHT * this.tripDirection;
      }

      // move elevator within the same iteration if it's going
      if (this.inElevator && this.tripDirection > 0) {
        this.x = this.targetElevator.x;
        this.y += FLOOR_HEIGHT * this.tripDirection;
      }
    }
  }
}
