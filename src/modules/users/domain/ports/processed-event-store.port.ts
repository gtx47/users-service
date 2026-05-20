export interface ProcessedEventStorePort {
  markIfNew(eventId: string): Promise<boolean>;
}
