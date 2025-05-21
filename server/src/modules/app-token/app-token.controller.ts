import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppTokenService } from './app-token.service';
import { IsPublic } from '../user/decorators/isPublic.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ValidateAppTokenDto } from './dto/create-app-token.dto';

@IsPublic()
@ApiTags('App Token')
@Controller({ version: '1', path: 'app-token' })
export class AppTokenController {
  constructor(private readonly appTokenService: AppTokenService) {}

  @Get('validate')
  findAll() {
    return this.appTokenService.isValid();
  }

  @Post('validate')
  async validateToken(@Body() dto: ValidateAppTokenDto) {
    await this.appTokenService.validateTokenAndSave(dto);
    return { message: 'License validated successfully' };
  }
}
