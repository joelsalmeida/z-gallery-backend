export interface PasswordResetEmailData {
  email: string;
  token: string;
}

export abstract class EmailSenderPort {
  abstract sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void>;
}
