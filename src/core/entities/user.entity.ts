export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  ORG_ADMIN = 'ORG_ADMIN',
  ADMIN = 'ADMIN',
}

export class UserEntity {
  constructor(
    public readonly id: string | null,
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly organizationId: string,
    public role: UserRole = UserRole.EMPLOYEE,
  ) {}
}