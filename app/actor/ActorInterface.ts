import { ElevatorCarInterface } from '../elevator/ElevatorCarInterface';

export interface ActorInterface {
  x: number;
  y: number;
  targetElevator: ElevatorCarInterface;
  inElevator: boolean;
  startingFloor: number;
  destinationFloor: number;
  tripFinished: boolean;
  tripDirection: number;
  moveActor(): void;
}
