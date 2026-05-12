import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { USER_REPOSITORY } from '../../../users.tokens';
import { PublicUser } from '../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';

export interface GetUserCommand {
  id: string;
}

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: GetUserCommand): Promise<PublicUser> {
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user.toJSON();
  }
}
