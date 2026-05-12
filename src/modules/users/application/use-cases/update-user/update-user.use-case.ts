import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../../../users.tokens';
import { PublicUser } from '../../../domain/entities/user.entity';
import {
  UpdateUserChanges,
  UserRepositoryPort,
} from '../../../domain/ports/user.repository.port';

export interface UpdateUserCommand {
  id: string;
  name?: string;
  email?: string;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: UpdateUserCommand): Promise<PublicUser> {
    const { id, name, email } = command;
    const changes: UpdateUserChanges = {};
    if (name !== undefined) changes.name = name;
    if (email !== undefined) changes.email = email;

    const updated = await this.userRepository.update(id, changes);
    if (!updated) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return updated.toJSON();
  }
}
