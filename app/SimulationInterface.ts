import { ElevatorInterface } from './elevator/ElevatorInterface';
import { ActorInterface } from './actor/ActorInterface';

export interface SimulationInterface {
  elevators: ElevatorInterface[];
  actors: ActorInterface[];

  runSimulationStep(): void;
}
