// Simulation.ts
import {} from './SimulationConstants';

import { ElevatorInterface } from './elevator/ElevatorInterface';
import { SimulationInterface } from './SimulationInterface';
import { ActorInterface } from './actor/ActorInterface';
import { Elevator } from './elevator/Elevator';
import { Actor } from './actor/Actor';

export class Simulation implements SimulationInterface {
  public elevators: ElevatorInterface[];
  public actors: ActorInterface[];

  constructor() {
    this.elevators = Array.from({ length: 1 }, () => new Elevator(0, 0, 1));
    this.actors = Array.from({ length: 1 }, (_, i) => {
      return new Actor(1, 1, 0, false);
    });
  }

  runSimulationStep(): void {
    this.elevators.forEach((elevator) => {
      elevator.moveElevator();
    });
    this.actors.forEach((actor) => {
      actor.moveActor();
    });
  }
}
