import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProcessedEventStorePort } from '../../domain/ports/processed-event-store.port';
import {
  PROCESSED_EVENT_MODEL_NAME,
  ProcessedEventMongo,
} from './processed-event.schema';

@Injectable()
export class MongoProcessedEventStore implements ProcessedEventStorePort {
  constructor(
    @InjectModel(PROCESSED_EVENT_MODEL_NAME)
    private readonly model: Model<ProcessedEventMongo>,
  ) {}

  async markIfNew(eventId: string): Promise<boolean> {
    if (!eventId) return false;
    try {
      await this.model.create({ eventId });
      return true;
    } catch (err: unknown) {
      const e = err as { code?: number };
      if (e?.code === 11000) return false;
      throw err;
    }
  }
}
