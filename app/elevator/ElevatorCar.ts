import { FLOOR_HEIGHT, SHAFT_HEIGHT } from '../SimulationConstants';
import { ElevatorCarInterface } from './ElevatorCarInterface';
import { ActorInterface } from '../actor/ActorInterface';

export class ElevatorCar implements ElevatorCarInterface {
  x: number;
  y: number;
  // -1 is up 1 is down
  direction: number;
  isPicked: boolean;
  isMoving: boolean;

  constructor(x: number, y: number, direction: number, isPicked: boolean) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.isPicked = isPicked;
    this.isMoving = false;
  }

  moveElevatorCar(): void {
    if (this.isMoving) {
      this.y = this.y + FLOOR_HEIGHT * this.direction;

      // - FLOOR_HEIGHT for last bounce
      if (this.y >= SHAFT_HEIGHT - FLOOR_HEIGHT) {
        this.y = SHAFT_HEIGHT - FLOOR_HEIGHT;
        this.direction = -this.direction;
      } else if (this.y <= 0) {
        this.y = 0;
        this.direction = -this.direction;
      }
    }
  }

  pickup(actor: ActorInterface) {
    let elevatorFloor = Math.floor(this.y / FLOOR_HEIGHT);
    actor.targetElevator = this;

    if (this.isPicked == true) {
      this.deliver(actor);
      // return to avoid further checks
      return;
    }

    if (this.isMoving) {
      // if elevator floor number is bigger (lower floor) than actors move up
      if (elevatorFloor > actor.startingFloor) {
        this.direction = -1;
        this.moveElevatorCar();
      } else if (elevatorFloor == actor.startingFloor) {
        this.isPicked = true;
      } else {
        this.direction = 1;
        this.moveElevatorCar();
      }
    }
  }

  deliver(actor: ActorInterface) {
    let elevatorFloor = Math.floor(this.y / FLOOR_HEIGHT);

    // same as pickup only difference is actors destination floor
    if (elevatorFloor > actor.destinationFloor) {
      this.direction = -1;
    } else {
      this.direction = 1;
    }

    if (elevatorFloor == actor.destinationFloor) {
      this.isPicked = false;
      this.isMoving = false;
    }

    if (this.isPicked == true) {
      this.moveElevatorCar();
    }
  }

  callElevator() {
    // assumes that pickup already has a new actor that's calling the elevator to start moving again
    this.isMoving = true;
  }
}
