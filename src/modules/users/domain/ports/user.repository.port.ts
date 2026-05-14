import { User, UserRole } from '../entities/user.entity';

export interface UpdateUserChanges {
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface UpsertUserData {
  name: string;
  email: string;
  role: UserRole;
}

export interface UserRepositoryPort {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, changes: UpdateUserChanges): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
  upsertByEmail(data: UpsertUserData): Promise<User>;
}
