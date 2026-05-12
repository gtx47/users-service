import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CountUsersUseCase } from '../../application/use-cases/count-users/count-users.use-case';
import { PromoteToAdminUseCase } from '../../application/use-cases/promote-to-admin/promote-to-admin.use-case';
import { PromoteToAdminDto } from './dtos/promote-to-admin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly promoteToAdmin: PromoteToAdminUseCase,
    private readonly countUsers: CountUsersUseCase,
  ) {}

  @Post('promote')
  @HttpCode(HttpStatus.OK)
  async promote(@Body() dto: PromoteToAdminDto) {
    await this.promoteToAdmin.execute(dto);
    return { success: true, message: `${dto.email} ahora es admin` };
  }

  @Get('count')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async count() {
    const count = await this.countUsers.execute();
    return { count };
  }
}
