import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Backup {
  @Prop({ required: true })
  lastCloudBackup: Date;

  @Prop()
  localBackupPath: string;
}

export type IBackup = HydratedDocument<Backup>;

export const BackupSchema = SchemaFactory.createForClass(Backup);
