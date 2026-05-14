import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user/delete-user.use-case';
import { GetUserUseCase } from '../../application/use-cases/get-user/get-user.use-case';
import { ListUsersUseCase } from '../../application/use-cases/list-users/list-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/update-user/update-user.use-case';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AdminGuard } from './guards/admin.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class UsersController {
  constructor(
    private readonly listUsers: ListUsersUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  @Get('health')
  health() {
    return { ok: true, service: 'users' };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async list() {
    const data = await this.listUsers.execute();
    return { success: true, data, count: data.length };
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    const data = await this.getUser.execute({ id });
    return { success: true, data };
  }

  @Put('users/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const data = await this.updateUser.execute({ id, ...dto });
    return { success: true, data };
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.deleteUser.execute({ id });
    return { success: true };
  }
}
