import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProcessedEventDocument = HydratedDocument<ProcessedEventMongo>;

@Schema({
  collection: 'processedevents',
  timestamps: { createdAt: true, updatedAt: false },
})
export class ProcessedEventMongo {
  @Prop({ type: String, required: true, unique: true, index: true })
  eventId!: string;
  createdAt?: Date;
}

export const ProcessedEventSchema = SchemaFactory.createForClass(ProcessedEventMongo);
export const PROCESSED_EVENT_MODEL_NAME = 'UsersProcessedEvent';
