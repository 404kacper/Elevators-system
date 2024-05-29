import { ActorInterface } from './ActorInterface';
import { FLOOR_COUNT } from '../SimulationConstants';

export class Actor implements ActorInterface {
  x: number;
  y: number;
  targetElevator: number;
  inElevator: boolean;
  startingFloor: number;
  destinationFloor: number;

  constructor(
    x: number,
    y: number,
    targetElevator: number,
    inElevator: boolean
  ) {
    this.x = x;
    this.y = y;
    this.targetElevator = targetElevator;
    this.inElevator = inElevator;
    this.startingFloor = 0;
    // Generate a random destination floor that's always different from starting floor
    do {
      this.destinationFloor = Math.floor(Math.random() * FLOOR_COUNT);
    } while (this.destinationFloor === this.startingFloor);
  }

  moveActor(): void {
      
  }
}
