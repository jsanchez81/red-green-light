import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Campo de entrada reutilizable compatible con Reactive Forms (ControlValueAccessor)
@Component({
  selector: 'app-ui-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.scss',
})
export class UiInputComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly inputId = input<string>('input-' + Math.random().toString(36).substring(2, 9));
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly hint = input<string | null>(null);
  readonly errorMessage = input<string | null>(null);
  readonly isInvalid = input<boolean>(false);
  readonly maxlength = input<number | null>(null);
  readonly autocomplete = input<string>('off');

  protected readonly value = signal<string>('');
  protected readonly disabled = signal<boolean>(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const nextValue = target.value;
    this.value.set(nextValue);
    this.onChange(nextValue);
  }

  protected handleBlur(): void {
    this.onTouched();
  }
}
