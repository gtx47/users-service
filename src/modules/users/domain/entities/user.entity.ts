export type UserRole = 'customer' | 'admin';

export interface UserProps {
  id?: string | null;
  name: string;
  email: string;
  role?: UserRole;
}

export interface PublicUser {
  id: string | null;
  name: string;
  email: string;
  role: UserRole;
}

export class User {
  public readonly id: string | null;
  public name: string;
  public email: string;
  public role: UserRole;

  constructor(props: UserProps) {
    const { id, name, email, role = 'customer' } = props;

    if (!name) {
      throw new Error('Nombre requerido');
    }
    if (!email) {
      throw new Error('Email requerido');
    }
    if (!['customer', 'admin'].includes(role)) {
      throw new Error('Rol inválido');
    }

    this.id = id ?? null;
    this.name = name;
    this.email = email;
    this.role = role;
  }

  promote(): void {
    this.role = 'admin';
  }

  toJSON(): PublicUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }
}
