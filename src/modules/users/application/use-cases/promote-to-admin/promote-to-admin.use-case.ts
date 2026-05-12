import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ADMIN_PROMOTE_SECRET,
  USER_REPOSITORY,
} from '../../../users.tokens';
import { PublicUser } from '../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';

export interface PromoteToAdminCommand {
  email: string;
  secret: string;
}

@Injectable()
export class PromoteToAdminUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
    @Inject(ADMIN_PROMOTE_SECRET) private readonly adminSecret: string,
  ) {}

  async execute(command: PromoteToAdminCommand): Promise<PublicUser> {
    const { email, secret } = command;

    if (!this.adminSecret) {
      throw new InternalServerErrorException(
        'ADMIN_PROMOTE_SECRET no configurado',
      );
    }
    if (secret !== this.adminSecret) {
      throw new UnauthorizedException('Secret inválido');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.id) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const updated = await this.userRepository.update(user.id, { role: 'admin' });
    if (!updated) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return updated.toJSON();
  }
}
