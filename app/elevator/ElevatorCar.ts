import { FLOOR_HEIGHT, SHAFT_HEIGHT } from '../SimulationConstants';
import { ElevatorCarInterface } from './ElevatorCarInterface';

export class ElevatorCar implements ElevatorCarInterface {
  x: number;
  y: number;
  direction: number;

  constructor(x: number, y: number, direction: number) {
    this.x = x;
    this.y = y;
    this.direction = direction;
  }

  moveElevatorCar(): void {
    this.y = this.y + FLOOR_HEIGHT * this.direction;

    // - FLOOR_HEIGHT for last bounce
    if (this.y >= SHAFT_HEIGHT - FLOOR_HEIGHT) {
      this.direction = -this.direction;
    } else if (this.y <= 0) {
      this.direction = -this.direction;
    }
  }
}
