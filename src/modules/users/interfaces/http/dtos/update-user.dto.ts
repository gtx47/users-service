import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Nombre inválido' })
  @MinLength(1, { message: 'Nombre inválido' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;
}
