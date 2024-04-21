import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../domain/user.schema';
import { Model } from 'mongoose';

import { UsersSortData } from '../../base/sortData/sortData.model';
import { Pagination } from '../../base/paginationInputDto/paginationOutput';
import { userMapper } from './users.mapper';
import { OutputUsersType } from '../api/output/users.output.dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getAllUsers(
    sortData: UsersSortData,
  ): Promise<Pagination<OutputUsersType>> {
    const {
      searchLoginTerm,
      searchEmailTerm,
      sortDirection,
      sortBy,
      pageSize,
      pageNumber,
    } = sortData;

    const login = searchLoginTerm
      ? {
          'accountData.login': { $regex: `${searchLoginTerm}`, $options: 'i' },
        }
      : {};
    const email = searchLoginTerm
      ? {
          'accountData.email': { $regex: `${searchEmailTerm}`, $options: 'i' },
        }
      : {};
    const filter = {
      $or: [login, email],
    };

    const users = await this.userModel
      .find(filter)
      .sort({ [`accountData.${sortBy}`]: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);
    const totalCount = await this.userModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount,
      page: pageNumber,
      pageSize,
      totalCount,
      items: users.map(userMapper),
    };
  }
}
