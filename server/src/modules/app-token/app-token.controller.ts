import { Controller, Get } from '@nestjs/common';
import { AppTokenService } from './app-token.service';
import { IsPublic } from '../user/decorators/isPublic.decorator';
import { ApiTags } from '@nestjs/swagger';

@IsPublic()
@ApiTags('App Token')
@Controller({ version: '1', path: 'app-token' })
export class AppTokenController {
  constructor(private readonly appTokenService: AppTokenService) {}

  @Get('validate')
  findAll() {
    return this.appTokenService.isValid();
  }
}
