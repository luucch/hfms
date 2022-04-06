import randomString from '../utils/random-string';
import { GroupInterface } from './groups.model';

export interface UserInterface {
  id: string;
  groupId: number;
  name: string;
  email: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export class UserModel implements UserInterface {
  id = '';
  password = '';
  groupId = 0;
  name = '';
  email = '';
  createdAt = null;
  updatedAt = null;

  constructor(properties?: UserInterface) {
    properties && Object.assign(this, properties);
    if (!this.id) {
      this.id = randomString();
    }
  }
}
