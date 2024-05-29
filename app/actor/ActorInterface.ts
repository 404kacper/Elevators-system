export interface ActorInterface {
  x: number;
  y: number;
  targetElevator: number;
  inElevator: boolean;
  startingFloor: number;
  destinationFloor: number;
  moveActor(): void;
}
