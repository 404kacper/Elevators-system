import { ActorInterface } from '../actor/ActorInterface';
import { ElevatorCarInterface } from '../elevator/ElevatorCarInterface';

export interface ElevatorSystemInterface {
  elevators: ElevatorCarInterface[];
  actors: ActorInterface[];
  actorsIterator: number;
  selectElevator(): ElevatorCarInterface;
  selectActor(): ActorInterface | null;
}
