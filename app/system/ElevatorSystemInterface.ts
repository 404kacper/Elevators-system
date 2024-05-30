import { ActorInterface } from '../actor/ActorInterface';
import { ElevatorCarInterface } from '../elevator/ElevatorCarInterface';

export interface ElevatorSystemInterface {
  elevators: ElevatorCarInterface[];
  actors: ActorInterface[];
  findFreeElevator(): ElevatorCarInterface | null;
  selectActor(): ActorInterface | null;
}
