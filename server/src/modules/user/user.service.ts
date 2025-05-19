import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, User } from './user.schema';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { HashingService } from './services/hashing.service';
import { JwtGeneratorService } from './services/jwt-generator.service';
import { RateLimiterService } from './services/rate-limiter.service';
import { AddUserDto } from './dto/add-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { EditUserPermissionsDto } from './dto/edit-user-permissions.dto';
import { ReqUserData } from './interfaces/req-user-data.interface';
import { EditProfileDto } from './dto/edit-profile.dto';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<IUser>,
    private readonly hashingService: HashingService,
    private readonly jwtGeneratorService: JwtGeneratorService,
    private readonly rateLimiterService: RateLimiterService,
  ) {}

  // on server start
  onModuleInit() {
    this.populateSuperAmsAdmin();
  }

  private async populateSuperAmsAdmin() {
    const superAmsAdmin = await this.userModel.findOne({
      role: 'superAmsAdmin',
    });

    if (!superAmsAdmin) {
      const hashedPassword = await this.hashingService.hashPassword('admin');

      await this.userModel.create({
        username: 'ams',
        password: hashedPassword,
        email: 'support@advanced-meta.com',
        role: 'superAmsAdmin',
      });
      console.info('Super Ams Admin created');
    } else {
      console.info('Super Ams Admin already exists');
    }
  }

  async login(dto: LoginDto, ip: string) {
    const { username, password } = dto;

    // find user using username + should be active
    const user = await this.userModel
      .findOne({
        username,
        isActive: true,
      })
      .lean();
    if (!user || !user.password) {
      this.rateLimiterService.registerFailedAttempt(ip);
      throw new BadRequestException('Invalid credentials');
    }

    // compare password
    const validPassword = await this.hashingService.comparePassword({
      hashedPassword: user.password,
      password,
    });
    if (!validPassword) {
      this.rateLimiterService.registerFailedAttempt(ip);
      throw new BadRequestException('Invalid credentials');
    }

    // If login is successful, reset failed attempts
    this.rateLimiterService.resetFailedAttempts(ip);

    const userId = user._id?.toString();

    const { accessToken } = await this.jwtGeneratorService.generateTokens({
      id: userId,
    });

    // send the user data so the frontend save it in localstorage since this is a local system
    const { password: _, ...userData } = user;

    return {
      data: {
        accessToken,
        userData,
      },
    };
  }

  async addUser(dto: AddUserDto, reqUser: ReqUserData) {
    const { username, email, role, salary, password } = dto;

    // admin cannot put superAmsAdmin
    if (role === 'superAmsAdmin' && reqUser.role === 'admin') {
      throw new ForbiddenException('Forbidden');
    }

    let hashedPassword = password
      ? await this.hashingService.hashPassword(password)
      : null;

    await this.userModel.create({
      username,
      email,
      role,
      salary,
      password: hashedPassword,
    });
  }

  async editUser(userId: string, dto: EditUserDto, reqUser: ReqUserData) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const { username, email, role, salary, password } = dto;

    // admin cannot put superAmsAdmin
    if (role === 'superAmsAdmin' && reqUser.role === 'admin') {
      throw new ForbiddenException('Forbidden');
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    if (salary) user.salary = salary;
    if (password) {
      const hashedPassword = await this.hashingService.hashPassword(password);
      user.password = hashedPassword;
    }

    await user.save();
  }

  async editUserPermissions(userId: string, dto: EditUserPermissionsDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const { permissions } = dto;
    user.permissions = permissions;

    await user.save();
  }

  async deleteUser(userId: string, reqUser: ReqUserData) {
    if (reqUser._id.toString() === userId)
      throw new BadRequestException('You cannot delete yourself!');

    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    await this.userModel.findByIdAndUpdate(userId, {
      isActive: false,
      username: `${user.username}-${userId}`,
      email: `${user.email}-${userId}`,
    });
  }

  async editMyProfile(userId: string, dto: EditProfileDto) {
    await this.userModel.findByIdAndUpdate(userId, {
      username: dto.username,
      email: dto.email,
    });
  }

  async findAll() {
    return await this.userModel.find({ isActive: true }).select('-password');
  }

  async findOne(id: string) {
    return this.userModel.findById(id).select('-password');
  }
}
