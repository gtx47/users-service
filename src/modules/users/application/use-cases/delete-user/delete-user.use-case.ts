import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../../../users.tokens';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';

export interface DeleteUserCommand {
  id: string;
}

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: DeleteUserCommand): Promise<true> {
    const ok = await this.userRepository.delete(command.id);
    if (!ok) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return true;
  }
}
