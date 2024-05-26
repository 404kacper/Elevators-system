import { ActorInterface } from './ActorInterface';

export class Actor implements ActorInterface {
  x: number;
  y: number;
  targetElevator: number;
  inElevator: boolean;
  destinationFloor: number;

  constructor(
    x: number,
    y: number,
    targetElevator: number,
    inElevator: boolean,
    destinationFloor: number
  ) {
    this.x = x;
    this.y = y;
    this.targetElevator = targetElevator;
    this.inElevator = inElevator;
    this.destinationFloor = destinationFloor;
  }
}
