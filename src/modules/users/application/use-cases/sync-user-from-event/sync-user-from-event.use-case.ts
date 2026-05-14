import { Inject, Injectable, Logger } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../users.tokens';
import { UserRole } from '../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';

export interface SyncUserFromEventCommand {
  name?: unknown;
  email?: unknown;
  role?: unknown;
}

@Injectable()
export class SyncUserFromEventUseCase {
  private readonly logger = new Logger('SyncUserFromEventUseCase');

  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: SyncUserFromEventCommand): Promise<void> {
    const name = typeof command.name === 'string' ? command.name.trim() : '';
    const email = typeof command.email === 'string' ? command.email.trim() : '';
    const roleRaw =
      typeof command.role === 'string' ? command.role : 'customer';

    if (!name || !email) {
      this.logger.warn(
        `evento ignorado por payload incompleto: ${JSON.stringify(command)}`,
      );
      return;
    }

    const role: UserRole = roleRaw === 'admin' ? 'admin' : 'customer';
    const user = await this.userRepository.upsertByEmail({ name, email, role });
    this.logger.log(`sincronizado ${user.email} (${user.role})`);
  }
}
