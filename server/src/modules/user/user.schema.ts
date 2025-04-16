import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  PermissionModuleAction,
  PermissionModuleName,
  userPermissions,
} from './interfaces/user.permissions';

export const userRoles = ['user', 'admin', 'superAmsAdmin'] as const;
export type UserRole = (typeof userRoles)[number];

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  salary: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ enum: userRoles, required: true })
  role: UserRole;

  // Add permissions object with keys like Events, Members, etc.
  @Prop({
    type: Object,
    default: userPermissions,
  })
  permissions: Record<
    PermissionModuleName,
    Record<PermissionModuleAction, boolean>
  >;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type IUser = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
