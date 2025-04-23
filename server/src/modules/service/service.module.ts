import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, ServiceSchema } from './service.schema';

@Module({
  imports: [
    // configure model to be used in this Module
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
