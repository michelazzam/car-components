import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Organization {
  @Prop({ required: true })
  name: string;

  @Prop()
  address: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  tvaNumber: string;

  @Prop()
  tvaPercentage: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type IOrganization = HydratedDocument<Organization>;

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
