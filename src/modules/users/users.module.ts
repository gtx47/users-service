import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CountUsersUseCase } from './application/use-cases/count-users/count-users.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user/delete-user.use-case';
import { GetUserUseCase } from './application/use-cases/get-user/get-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users/list-users.use-case';
import { PromoteToAdminUseCase } from './application/use-cases/promote-to-admin/promote-to-admin.use-case';
import { SyncUserFromEventUseCase } from './application/use-cases/sync-user-from-event/sync-user-from-event.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user/update-user.use-case';
import { RabbitMQUserEventSubscriber } from './infrastructure/messaging/rabbitmq-user-event-subscriber';
import { MongoUserRepository } from './infrastructure/persistence/mongo-user.repository';
import {
  USER_MODEL_NAME,
  UserSchema,
} from './infrastructure/persistence/user.schema';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { AdminController } from './interfaces/http/admin.controller';
import { AdminGuard } from './interfaces/http/guards/admin.guard';
import { JwtAuthGuard } from './interfaces/http/guards/jwt-auth.guard';
import { UsersController } from './interfaces/http/users.controller';
import {
  ADMIN_PROMOTE_SECRET,
  TOKEN_SERVICE,
  USER_REPOSITORY,
} from './users.tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: USER_MODEL_NAME, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [UsersController, AdminController],
  providers: [
    ListUsersUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    PromoteToAdminUseCase,
    CountUsersUseCase,
    SyncUserFromEventUseCase,
    RabbitMQUserEventSubscriber,
    JwtAuthGuard,
    AdminGuard,
    { provide: USER_REPOSITORY, useClass: MongoUserRepository },
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
    {
      provide: ADMIN_PROMOTE_SECRET,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) =>
        cfg.getOrThrow<string>('ADMIN_PROMOTE_SECRET'),
    },
  ],
})
export class UsersModule {}
