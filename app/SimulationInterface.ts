import { ElevatorInterface } from './elevator/ElevatorInterface';
import { ActorInterface } from './actor/ActorInterface';

export interface SimulationInterface {
  // class fields
  elevators: ElevatorInterface[];
  actors: ActorInterface[];

  // class functions
  updateActors (actors: ActorInterface[], updatedElevators: ElevatorInterface[]): ActorInterface[];
}
