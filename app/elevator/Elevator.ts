import { ElevatorInterface } from "./ElevatorInterface";

export class Elevator implements ElevatorInterface {
  carY: number;
  direction: number;

  constructor(carY: number, direction: number) {
    this.carY = carY;
    this.direction = direction;
  }
}