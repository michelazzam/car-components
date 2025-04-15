import { Get, Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { IsPublic } from './decorators/isPublic.decorator';
import { Roles } from './decorators/roles.decorator';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { RealIP } from 'nestjs-real-ip';

@ApiTags('User')
@Controller({ version: '1', path: 'users' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RateLimitGuard) // Apply failed login rate-limiting guard
  @IsPublic()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @RealIP() ip: string) {
    return await this.userService.login(loginDto, ip);
  }

  @Roles('admin', 'superAmsAdmin')
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
