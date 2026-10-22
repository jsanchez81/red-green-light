import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { playerNameValidator } from '../../../../core/validators/player-name.validator';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';
import { UiInputComponent } from '../../../../shared/components/ui-input/ui-input.component';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [ReactiveFormsModule, UiButtonComponent, UiInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.scss',
})
export class PlayerFormComponent {
  readonly playerSubmit = output<string>();
  readonly nameControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [playerNameValidator()],
  });

  readonly form = new FormGroup({
    playerName: this.nameControl,
  });

  get errorMessage(): string | null {
    if (!this.nameControl.errors || !(this.nameControl.dirty || this.nameControl.touched)) {
      return null;
    }

    const errors = this.nameControl.errors;

    if (errors['required']) {
      return 'El nombre de jugador es obligatorio.';
    }

    if (errors['minlength']) {
      const { requiredLength, actualLength } = errors['minlength'];
      return `Debe contener al menos ${requiredLength} caracteres (actual: ${actualLength}).`;
    }

    if (errors['invalidCharacters']) {
      return 'Solo se permiten caracteres alfanuméricos (sin espacios ni símbolos especiales).';
    }

    return 'El formato del nombre no es válido.';
  }

  get isInputInvalid(): boolean {
    return this.nameControl.invalid && (this.nameControl.dirty || this.nameControl.touched);
  }

  get isSubmitDisabled(): boolean {
    const value = this.nameControl.value.trim();
    return value.length === 0 || this.form.invalid;
  }

  onSubmit(): void {
    if (this.isSubmitDisabled) {
      this.nameControl.markAsTouched();
      return;
    }

    const cleanName = this.nameControl.value.trim();
    this.playerSubmit.emit(cleanName);
  }
}
