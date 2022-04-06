import { UserInterface } from './users.model';


export interface GroupInterface {
  id: number;
  name: string;
  users?: UserInterface[];
}

export class GroupModel implements GroupInterface {
  id = 0;
  projectID = '';
  name = '';

  constructor(properties?: GroupInterface) {
    properties && Object.assign(this, properties);
    if (!this.id) {
      this.id = Math.random();
    }
  }
}
