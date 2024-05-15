import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostDocument } from '../../posts/domain/post.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from '../domain/user.schema';
import { userMapper } from './users.mapper';
import { OutputUsersType } from '../api/output/users.output.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async doesExistByLoginOrEmail(login: string, email: string) {
    const user = await this.userModel.findOne({
      $or: [{ 'accountData.email': email }, { 'accountData.login': login }],
    });
    return !!user;
  }
  async createUser(userData: User): Promise<OutputUsersType | null> {
    const newUser = new this.userModel(userData);
    await newUser.save();

    const user = await this.userModel.findOne({ _id: newUser.id });
    if (!user) return null;

    return userMapper(user);
  }

  async deleteUser(userId: string) {
    const deleted = await this.userModel.deleteOne({
      _id: new ObjectId(userId),
    });
    return !!deleted.deletedCount;
  }
  async confirmEmail(userId: ObjectId) {
    const confirm = await this.userModel.updateOne(
      { _id: userId },
      {
        $set: {
          'emailConfirmation.isConfirmed': true,
        },
      },
    );
    return confirm.modifiedCount === 1;
  }
}
