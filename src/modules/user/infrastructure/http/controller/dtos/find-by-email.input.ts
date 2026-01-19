import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindUserByEmailInput {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
