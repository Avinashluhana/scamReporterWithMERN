import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { Model } from "mongoose";
import { IAuthUser } from "src/auth/interface/user.interface";
import { HelperService } from "src/shared/helper.service";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserOutDto } from "./dtos/user-out.dto";
import { User, UserDocument } from "./user.model";

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly helperService: HelperService,
  ) {}

  async create(input: User) {
    // hash password before storing in db
    input.password = await this.helperService.generateHash(input.password);
    const user = new this.userModel(input);
    return user.save();
  }

  async findAll(): Promise<UserOutDto[]> {
    const users = await this.userModel.find().exec();
    return plainToInstance(UserOutDto, users, {
      excludeExtraneousValues: true,
    })
  }

  async findByEmail(email: string): Promise<UserOutDto> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) throw new NotFoundException();
    return plainToInstance(UserOutDto, user, {
      excludeExtraneousValues: true,
    })
  }
  
  async findById(id: string): Promise<UserOutDto> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException();
    return plainToInstance(UserOutDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async updateUser(authUser: IAuthUser, input: UpdateUserDto) {
    const user = await this.userModel.findById(authUser.sub);
    if (!user) throw new NotFoundException();

    if (input.email && authUser.email != input.email) {
      const isEmailAlreadyRegistered = await this.userModel.findOne({ email: input.email });
      if (isEmailAlreadyRegistered) 
        throw new BadRequestException('email already registered');
    }

    Object.assign(user, input);
    await user.save();

    return { message: 'Profile updated. Please signin again' };
  }

  async deleteById(userId: string): Promise<UserOutDto> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException();

    await user.remove();

    return plainToInstance(UserOutDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async patchUser(userId: string, input: PatchUserDto): Promise<UserOutDto> {
    const user = await this.userModel.findById(userId);

    if (!user) throw new NotFoundException();

    Object.assign(user, input);
    await user.save();

    return plainToInstance(UserOutDto, user, {
      excludeExtraneousValues: true,
    });
  }

}