import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-user-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-icon.component.html',
  styleUrl: './user-icon.component.scss',
})
export class UserIconComponent {
  readonly ariaLabel = input<string>('Abrir configuración de usuario');
  readonly userClick = output<void>();

  handleClick(): void {
    this.userClick.emit();
  }
}
