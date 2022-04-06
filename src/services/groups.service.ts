import mysql2 from '../db';
import { PoolConnection } from 'mysql2/promise';
import {
  GroupInterface,
  GroupModel,
} from '../models/groups.model';

export const create = async (group: GroupModel): Promise<void> => {
  const SQL =
    'INSERT INTO `groups` (`id`, `projectID`, `name`) VALUES (?, ?, ?)';

  return await mysql2.run((con: PoolConnection) => {
    const query = con.format(SQL, [group.id, group.projectID, group.name]);
    mysql2.queryLog(query);
    return con.query(query);
  });
};
