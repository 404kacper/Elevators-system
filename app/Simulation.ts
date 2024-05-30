// Simulation.ts

import { SimulationInterface } from './SimulationInterface';
import { ActorInterface } from './actor/ActorInterface';
import { ElevatorSystem } from './system/ElevatorSystem';
import { ElevatorSystemInterface } from './system/ElevatorSystemInterface';
import { ElevatorCarInterface } from './elevator/ElevatorCarInterface';

export class Simulation implements SimulationInterface {
  elevatorSystem: ElevatorSystemInterface;
  actorsMap: Map<ActorInterface, ElevatorCarInterface> = new Map();

  constructor() {
    this.elevatorSystem = new ElevatorSystem();
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

    console.log(this.actorsMap);

    // old implementation for one actor and one elevator
    // let actorI = 0;
    // let elevatorI = 2;
    // if (!this.elevatorSystem.actors[actorI].tripFinished) {
    //   this.elevatorSystem.elevators[elevatorI].callElevator();
    // }
    // console.log(this.elevatorSystem.actors[actorI].tripFinished);
    // // move actor on the correct x coordinate according to his elevator
    // this.elevatorSystem.actors[actorI].moveActor();
    // this.elevatorSystem.elevators[elevatorI].pickup(
    //   this.elevatorSystem.actors[actorI]
    // );

    return false;
  }
}
