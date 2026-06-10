export abstract class TokenHasherPort {
  abstract hash(token: string): Promise<string>;
}
