import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

export const MIN_PLAYER_NAME_LENGTH = 4;

export interface PlayerNameValidationErrors {
  required?: boolean;
  minlength?: {
    requiredLength: number;
    actualLength: number;
  };
  invalidCharacters?: boolean;
}

/**
 * Validador para el nombre de jugador:
 * Requerido, alfanumérico y mínimo 4 caracteres.
 */
export function playerNameValidator(): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const rawValue = control.value;

    if (rawValue === null || rawValue === undefined) {
      return { required: true };
    }

    const trimmed = String(rawValue).trim();

    if (trimmed.length === 0) {
      return { required: true };
    }

    if (trimmed.length < MIN_PLAYER_NAME_LENGTH) {
      return {
        minlength: {
          requiredLength: MIN_PLAYER_NAME_LENGTH,
          actualLength: trimmed.length,
        },
      };
    }

    if (!ALPHANUMERIC_REGEX.test(trimmed)) {
      return { invalidCharacters: true };
    }

    return null;
  };
}
