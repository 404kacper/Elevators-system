// Simulation.ts

import { SimulationInterface } from './SimulationInterface';
import { ActorInterface } from './actor/ActorInterface';
import { ElevatorCarInterface } from './elevator/ElevatorCarInterface';
import { ElevatorSystem } from './system/ElevatorSystem';
import { ElevatorSystemInterface } from './system/ElevatorSystemInterface';

export class Simulation implements SimulationInterface {
  elevatorSystem: ElevatorSystemInterface;

  constructor() {
    this.elevatorSystem = new ElevatorSystem();
  }

  runSimulationStep(): void {
    let selectedElevator: ElevatorCarInterface =
      this.elevatorSystem.selectElevator();
    let selectedActor: ActorInterface | null =
      this.elevatorSystem.selectActor();

    if (selectedActor === null) {
      // Stop the simulation or handle as needed
      return;
    }

    let currentTripStatus: boolean = selectedActor.tripFinished;

    selectedActor.moveActor();
    selectedElevator.pickup(selectedActor);

    // Call elevator only if there are more actors to transport
    if (
      currentTripStatus !== selectedActor.tripFinished &&
      selectedActor.tripFinished
    ) {
      let nextActor = this.elevatorSystem.selectActor();
      if (nextActor !== null) {
        selectedElevator.callElevator();
      }
    }
  }
}
