import { ElevatorInterface } from './elevator/ElevatorCarInterface';
import { ActorInterface } from './actor/ActorInterface';

export interface SimulationInterface {
  elevators: ElevatorInterface[];
  actors: ActorInterface[];

  runSimulationStep(): void;
}
