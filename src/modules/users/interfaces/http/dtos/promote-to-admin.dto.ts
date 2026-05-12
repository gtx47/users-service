import { IsEmail, IsString, MinLength } from 'class-validator';

export class PromoteToAdminDto {
  @IsString({ message: 'Secret requerido' })
  @MinLength(1, { message: 'Secret requerido' })
  secret!: string;

  @IsEmail({}, { message: 'Email inválido' })
  email!: string;
}
