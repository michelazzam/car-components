import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class AppToken {
  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  lastValidatedAt: Date;
}

export type IAppToken = HydratedDocument<AppToken>;

export const AppTokenSchema = SchemaFactory.createForClass(AppToken);
