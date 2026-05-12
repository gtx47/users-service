import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../../users.tokens';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';

@Injectable()
export class CountUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(): Promise<number> {
    return this.userRepository.count();
  }
}
