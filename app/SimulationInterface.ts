import { ElevatorInterface } from './elevator/ElevatorInterface';
import { ActorInterface } from './actor/ActorInterface';

export interface SimulationInterface {
  // Class fields
  elevators: ElevatorInterface[];
  actors: ActorInterface[];

  // Class methods
  updateElevators(): void;
  updateActors(): void;
}
