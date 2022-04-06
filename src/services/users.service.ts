import {
  UserModel,
} from '../models/users.model';
import {
  TokenInterface
} from '../models/auth.model';
import * as CommonService from './common.service';
import { TABLE_LIST } from '../models/tables.model';
import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import conf from '../config/jwt';

export const login = async (id: string, password: string): Promise<TokenInterface | null> => {
  const user = await CommonService.findById<UserModel>(TABLE_LIST.USERS, id);
  const hashPassword = createHash('sha512').update(password).digest('hex');
  console.log(hashPassword);

  if (user.password == hashPassword) {
    const payload = {
      id: user.id,
      groupId: user.groupId,
    };
    const result = {
      accessToken: jwt.sign(payload, conf.secretKey!, conf.option as jwt.SignOptions),
    }
    return result;
  } else {
    return null;
  }
};

export const findByUserId = async ( userID: string ): Promise<UserModel> => {
  const user = await CommonService.findById<UserModel>(TABLE_LIST.USERS, userID);
  return user;
};
