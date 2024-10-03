import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { Frequency } from 'src/shared/enums/frequency.enum';
import { ReminderType } from 'src/shared/enums/reminderType.enum';

export type ReminderDocument = HydratedDocument<Reminder>;

@Schema({ timestamps: true })
export class Reminder {
  @Prop({ enum: Frequency, required: true })
  frequency: Frequency;

  @Prop({ enum: ReminderType, required: true })
  type: ReminderType;

  @Prop({ default: null })
  location: string;

  @Prop({ type: Date, required: true })
  occurDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId: ObjectId;
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);
