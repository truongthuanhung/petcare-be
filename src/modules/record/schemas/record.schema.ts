import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from 'mongoose';
import { RecordType } from 'src/shared/enums/recordType.enum';

export type RecordDocument = HydratedDocument<Record>;

@Schema({ timestamps: true })
export class Record {
  @Prop({ enum: RecordType, required: true })
  type: RecordType;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  location: string;

  @Prop({ type: Types.ObjectId, ref: 'Pet', required: true })
  petId: ObjectId;
}

export const RecordSchema = SchemaFactory.createForClass(Record);
