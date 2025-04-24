import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Backup {
  @Prop({ required: true })
  lastBackup: Date;
}

export type IBackup = HydratedDocument<Backup>;

export const BackupSchema = SchemaFactory.createForClass(Backup);
