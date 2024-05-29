import { ElevatorInterface } from './ElevatorInterface';

export class Elevator implements ElevatorInterface {
  x: number;
  y: number;
  direction: number;

  constructor(x: number, y: number, direction: number) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  moveElevator(): void {
      
  }
}
