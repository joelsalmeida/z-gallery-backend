import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { RealtimeEventId } from '../value-objects';

export abstract class RealtimeIntegrationEvent {
  abstract readonly id: RealtimeEventId;

  abstract serialize(): string;

  protected static parseDto<T extends object>(
    cls: new () => T,
    payload: string,
  ): T {
    return deserializeAndValidate(cls, payload);
  }
}

// TODO: This function can be moved and reused.
function deserializeAndValidate<T extends object>(
  cls: new () => T,
  payload: string,
): T {
  let parsed: unknown;

  try {
    parsed = JSON.parse(payload);
  } catch {
    throw new Error(
      `Failed to parse integration event payload as JSON: ${payload}`,
    );
  }

  const instance = plainToInstance(cls, parsed);

  const errors = validateSync(instance, {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
  });

  if (errors.length > 0) {
    const messages = errors
      .map((error) => {
        const field = error.property;
        const constraints = Object.values(error.constraints ?? {}).join(', ');
        return `Field "${field}" invalid: ${constraints}`;
      })
      .join('; ');

    throw new Error(
      `Integration event ${cls.name} validation error: ${messages}`,
    );
  }

  return instance;
}
