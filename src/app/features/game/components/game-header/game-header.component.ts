import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { SplitCircleIconComponent } from '../../../../shared/components/split-circle-icon/split-circle-icon.component';
import { UserIconComponent } from '../../../../shared/components/user-icon/user-icon.component';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';

@Component({
  selector: 'app-game-header',
  standalone: true,
  imports: [SplitCircleIconComponent, UserIconComponent, SettingsModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-header.component.html',
  styleUrl: './game-header.component.scss',
})
export class GameHeaderComponent {
  readonly playerName = input.required<string>();
  readonly logout = output<void>();

  readonly isSettingsOpen = signal<boolean>(false);

  openSettings(): void {
    this.isSettingsOpen.set(true);
  }

  closeSettings(): void {
    this.isSettingsOpen.set(false);
  }

  handleExit(): void {
    this.isSettingsOpen.set(false);
    this.logout.emit();
  }
}
