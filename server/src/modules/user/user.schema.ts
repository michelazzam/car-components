import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  @Prop()
  name: string;
}

export type IUser = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
