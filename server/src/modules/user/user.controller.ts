import { Get, Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { IsPublic } from './decorators/isPublic.decorator';

@ApiTags('User')
@Controller({ version: '1', path: 'users' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
