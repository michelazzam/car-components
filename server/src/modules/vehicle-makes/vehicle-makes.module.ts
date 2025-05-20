import { Module } from '@nestjs/common';
import { VehicleMakesService } from './vehicle-makes.service';
import { VehicleMakesController } from './vehicle-makes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleMakes, VehicleMakesSchema } from './vehicle-makes.schema';

@Module({
  imports: [
    // configure model to be used in this Module
    MongooseModule.forFeature([
      { name: VehicleMakes.name, schema: VehicleMakesSchema },
    ]),
  ],
  controllers: [VehicleMakesController],
  providers: [VehicleMakesService],
  exports: [VehicleMakesService],
})
export class VehicleMakesModule {}
