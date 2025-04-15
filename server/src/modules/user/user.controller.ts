import {
  Get,
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { IsPublic } from './decorators/isPublic.decorator';
import { Roles } from './decorators/roles.decorator';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { RealIP } from 'nestjs-real-ip';
import { AddUserDto } from './dto/add-user.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { EditUserPermissionsDto } from './dto/edit-user-permissions.dto';
import { User } from './decorators/user.decorator';
import { ReqUserData } from './interfaces/req-user-data.interface';

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
  @Post('add')
  async addUser(@Body() addUserDto: AddUserDto) {
    await this.userService.addUser(addUserDto);

    return { message: 'User added successfully' };
  }

  @Roles('admin', 'superAmsAdmin')
  @Put('edit/:id')
  async editUser(@Body() editUserDto: EditUserDto, @Param('id') id: string) {
    await this.userService.editUser(id, editUserDto);

    return { message: 'User updated successfully' };
  }

  @Roles('admin', 'superAmsAdmin')
  @Put('edit-permissions/:id')
  async editUserPermissions(
    @Body() dto: EditUserPermissionsDto,
    @Param('id') id: string,
  ) {
    await this.userService.editUserPermissions(id, dto);

    return { message: 'Permissions updated successfully' };
  }

  @Roles('admin', 'superAmsAdmin')
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);

    return { message: 'User deleted successfully' };
  }

  @Get('authenticate')
  authenticate(@User() user: ReqUserData) {
    return user;
  }

  @Roles('admin', 'superAmsAdmin')
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
