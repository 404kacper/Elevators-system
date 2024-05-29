import { ActorInterface } from '../actor/ActorInterface';

export interface ElevatorCarInterface {
  x: number;
  y: number;
  direction: number;
  isPicked: boolean;
  isMoving: boolean;
  moveElevatorCar(): void;
  pickup(actor: ActorInterface): void;
  deliver(actor: ActorInterface): void;
}
