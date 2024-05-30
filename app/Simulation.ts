// Simulation.ts

import { SimulationInterface } from './SimulationInterface';
import { ActorInterface } from './actor/ActorInterface';
import { ElevatorSystem } from './system/ElevatorSystem';
import { ElevatorSystemInterface } from './system/ElevatorSystemInterface';
import { ElevatorCarInterface } from './elevator/ElevatorCarInterface';

export class Simulation implements SimulationInterface {
  elevatorSystem: ElevatorSystemInterface;
  actorsMap: Map<ActorInterface, ElevatorCarInterface> = new Map();

  constructor(actors: ActorInterface[], elevatorsCount: number) {
    this.elevatorSystem = new ElevatorSystem(actors, elevatorsCount);
  }

  runSimulationStep(): boolean {
    // new implementation for all actors and all available elevators
    // constantly looking for new actors for each move
    this.elevatorSystem.actors.forEach((actor) => {
      if (
        !actor.tripFinished &&
        !actor.inElevator &&
        !this.actorsMap.has(actor)
      ) {
        // all actors will be assigned one elevator
        let associatedElevator = this.elevatorSystem.findFreeElevator();
        // immediately calling it in order to be able to move
        associatedElevator?.callElevator();
        if (associatedElevator) this.actorsMap.set(actor, associatedElevator);
      }
    });

    // move all the actors that haven't finished their trip
    // and remove the ones that did finish their trips
    Array.from(this.actorsMap.keys()).forEach((actor) => {
      let associatedElevator = this.actorsMap.get(actor);
      // check if actor has finished his trip
      // if it's done moving remove actor from the map
      if (!actor.tripFinished) {
        actor.moveActor();
        associatedElevator?.pickup(actor);
      } else {
        this.actorsMap.delete(actor);
      }
    });
    return false;
  }
}
