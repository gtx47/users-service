import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../users.tokens';
import { PublicUser } from '../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(): Promise<PublicUser[]> {
    const users = await this.userRepository.findAll();
    return users.map((u) => u.toJSON());
  }
}
