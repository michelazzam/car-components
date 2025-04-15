import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser, User } from './user.schema';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { HashingService } from './services/hashing.service';
import { JwtGeneratorService } from './services/jwt-generator.service';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<IUser>,
    private readonly hashingService: HashingService,
    private readonly jwtGeneratorService: JwtGeneratorService,
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

  async login(dto: LoginDto) {
    const { username, password } = dto;

    // find user using username + should be active
    const user = await this.userModel
      .findOne({
        username,
        isActive: true,
      })
      .lean();
    if (!user || !user.password)
      throw new BadRequestException('Invalid credentials');

    // compare password
    const validPassword = await this.hashingService.comparePassword({
      hashedPassword: user.password,
      password,
    });
    if (!validPassword) throw new BadRequestException('Invalid credentials');

    const userId = user._id?.toString();

    const { accessToken, refreshToken } =
      await this.jwtGeneratorService.generateTokens({
        id: userId,
      });

    // send the user data so the frontend save it in localstorage since this is a local system
    const { password: _, ...userData } = user;

    return {
      data: {
        accessToken,
        refreshToken,
        userData,
      },
    };
  }

  async findAll() {
    return await this.userModel.find();
  }
}
