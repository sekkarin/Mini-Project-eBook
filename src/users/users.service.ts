import {
  Body,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';

import { User } from './interfaces/user.interface';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { PaginatedDto } from './../utils/dto/paginated.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async findOne(username: string) {
    return this.userModel.findOne({ username: username }).exec();
  }
  async findOneToken(token: string) {
    return this.userModel.findOne({ refreshToken: token });
  }
  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email }).exec();
  }
  async getUserByUserName(username: string) {
    return await this.userModel
      .findOne({
        where: {
          username: username,
        },
      })
      .exec();
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.userModel
      .findOne({ username: username })
      .select('-password -refreshToken -isAlive -role')
      .exec();
  }
  async getAll(page = 1, limit = 10, currentUserId: string) {
    const itemCount = await this.userModel.countDocuments({
      _id: { $ne: currentUserId },
    });
    const users = await this.userModel
      .find({ _id: { $ne: currentUserId } })
      .skip((page - 1) * limit)
      .limit(limit);

    const usersResponse = users.map((user) => this.mapToUserResponseDto(user));
    return new PaginatedDto<UserResponseDto>(
      usersResponse,
      page,
      limit,
      itemCount,
    );
  }
  async findOneById(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const userResponse = this.mapToUserResponseDto(user);
      return userResponse;
    } catch (error) {
      return error;
    }
  }
  async update(
    userUpdate: UpdateUserDto,
    id: string,
    file: Express.Multer.File | undefined,
    url: string,
  ) {
    let profileUrl: string | undefined = undefined;
    let hashPassword: string | undefined = undefined;
    try {
      const user = await this.userModel.findOne({ _id: id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (file?.filename) {
        profileUrl = url + file.filename;
        if (user?.profileUrl) {
          const fullUrl = user.profileUrl.split('/profile/')[1];
          this.deleteFile(fullUrl);
        }
      }
      if (userUpdate?.password) {
        hashPassword = await bcrypt.hash(userUpdate?.password, 10);
      }
      const updateUser = await this.userModel
        .findOneAndUpdate(
          { _id: id },
          { ...userUpdate, profileUrl, password: hashPassword },
          { new: true },
        )
        .exec();
      const userResponse = this.mapToUserResponseDto(updateUser);
      return userResponse;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  private deleteFile(path: string) {
    const filePath = './uploads/profiles/' + path;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  async createUser(@Body() crateUserDto: CreateUserDto) {
    const usernameAlreadyExists = await this.findOne(crateUserDto.username);
    if (usernameAlreadyExists) {
      throw new UnauthorizedException('username has been used');
    }
    const emailAlreadyExists = await this.findByEmail(crateUserDto.email);
    if (emailAlreadyExists) {
      throw new UnauthorizedException('email has been used');
    }
    const createdUser = new this.userModel({
      ...crateUserDto,
    });
    await createdUser.save();

    const userResponse = this.mapToUserResponseDto(createdUser);

    return userResponse;
  }
  async deleteUser(id: string) {
    return await this.userModel.deleteOne({ _id: id });
  }
  private mapToUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profileUrl: user.profileUrl,
    };
  }
}
