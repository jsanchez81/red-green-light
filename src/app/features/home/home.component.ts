import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';
import { SplitCircleIconComponent } from '../../shared/components/split-circle-icon/split-circle-icon.component';
import { PlayerFormComponent } from './components/player-form/player-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SplitCircleIconComponent, PlayerFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly playerService = inject(PlayerService);
  private readonly router = inject(Router);

  // Gestiona el registro del jugador y redirige al juego
  handlePlayerSubmit(playerName: string): void {
    try {
      this.playerService.createPlayer(playerName);
      void this.router.navigate(['/game']);
    } catch (error) {
      console.error('Error creating player session:', error);
    }
  }
}
