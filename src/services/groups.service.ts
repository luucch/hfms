import mysql2 from '../db';
import { PoolConnection } from 'mysql2/promise';
import * as CommonService from './common.service';
import { TABLE_LIST } from '../models/tables.model';
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

export const findByGroupId = async ( groupID: number ): Promise<GroupModel> => {
  const group = await CommonService.findById<GroupModel>(TABLE_LIST.GROUPS, groupID + '');
  return group;
};