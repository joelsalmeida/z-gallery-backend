export class AuthenticateUserCommand {
  constructor(
    readonly email: string,
    readonly password: string,
  ) {}
}
