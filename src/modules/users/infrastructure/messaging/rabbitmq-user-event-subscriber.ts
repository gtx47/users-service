import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Channel } from 'amqplib';
import { SyncUserFromEventUseCase } from '../../application/use-cases/sync-user-from-event/sync-user-from-event.use-case';
import {
  AmqpConnection,
  connectWithRetry,
  DOMAIN_EVENTS_EXCHANGE,
  USERS_USER_EVENTS_QUEUE,
} from './amqp-connection';

const ROUTING_KEYS = ['user.registered', 'user.role-changed'];

@Injectable()
export class RabbitMQUserEventSubscriber
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger('RabbitMQUserEventSubscriber');
  private connection: AmqpConnection | null = null;
  private channel: Channel | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly syncUser: SyncUserFromEventUseCase,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const url = this.config.get<string>('RABBITMQ_URL');
    if (!url) {
      this.logger.warn(
        'RABBITMQ_URL no configurado; los eventos no se consumirán',
      );
      return;
    }

    try {
      const connection = await connectWithRetry(url);
      this.connection = connection;
      const channel = await connection.createChannel();
      this.channel = channel;
      await channel.assertExchange(DOMAIN_EVENTS_EXCHANGE, 'topic', {
        durable: true,
      });
      await channel.assertQueue(USERS_USER_EVENTS_QUEUE, { durable: true });
      await channel.prefetch(10);

      for (const key of ROUTING_KEYS) {
        await channel.bindQueue(
          USERS_USER_EVENTS_QUEUE,
          DOMAIN_EVENTS_EXCHANGE,
          key,
        );
      }

      await this.start();
      this.logger.log(`consuming queue '${USERS_USER_EVENTS_QUEUE}'`);
    } catch (err) {
      this.logger.error(
        `no se pudo conectar a RabbitMQ: ${(err as Error).message}`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.channel) await this.channel.close();
    } catch (err) {
      this.logger.warn(`channel close: ${(err as Error).message}`);
    }
    try {
      if (this.connection) await this.connection.close();
    } catch (err) {
      this.logger.warn(`connection close: ${(err as Error).message}`);
    }
    this.channel = null;
    this.connection = null;
  }

  private async start(): Promise<void> {
    if (!this.channel) throw new Error('subscriber no conectado');
    await this.channel.consume(USERS_USER_EVENTS_QUEUE, async (msg) => {
      if (!msg || !this.channel) return;
      const routingKey = msg.fields.routingKey;
      try {
        const payload = JSON.parse(msg.content.toString()) as Record<
          string,
          unknown
        >;
        await this.syncUser.execute({
          ...payload,
          eventId: msg.properties.messageId ?? undefined,
        });
        this.channel.ack(msg);
      } catch (err) {
        this.logger.error(
          `handler failed for ${routingKey}: ${(err as Error).message}`,
        );
        this.channel.nack(msg, false, false);
      }
    });
  }
}
