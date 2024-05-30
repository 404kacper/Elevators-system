import { ElevatorCarInterface } from '../elevator/ElevatorCarInterface';

export interface ActorInterface {
  x: number;
  y: number;
  inElevator: boolean;
  startingFloor: number;
  destinationFloor: number;
  tripFinished: boolean;
  tripDirection: number;
  targetElevator: ElevatorCarInterface | null;
  moveActor(): void;
}
