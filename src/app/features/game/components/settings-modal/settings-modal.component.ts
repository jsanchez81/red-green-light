import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { LeaderboardService } from '../../../../core/services/leaderboard.service';

export interface PlayerRankingView {
  rank: number;
  name: string;
  maxScore: number;
}

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.scss',
})
export class SettingsModalComponent {
  private readonly leaderboardService = inject(LeaderboardService);

  readonly isOpen = input<boolean>(false);
  readonly closeModal = output<void>();
  readonly exitGame = output<void>();

  // Vista actual del modal: 'menu' (opciones) o 'ranking'
  readonly currentView = signal<'menu' | 'ranking'>('menu');

  // Ranking de jugadores ordenado por mayor puntuación
  readonly rankings = computed<PlayerRankingView[]>(() => {
    const entries = this.leaderboardService.topScores();
    const playerMaxMap = new Map<string, { displayName: string; maxScore: number }>();

    for (const entry of entries) {
      const key = entry.playerName.trim().toLowerCase();
      const current = playerMaxMap.get(key);
      if (!current || entry.score > current.maxScore) {
        playerMaxMap.set(key, {
          displayName: entry.playerName,
          maxScore: entry.score,
        });
      }
    }

    return Array.from(playerMaxMap.values())
      .sort((a, b) => b.maxScore - a.maxScore)
      .map((item, index) => ({
        rank: index + 1,
        name: item.displayName,
        maxScore: item.maxScore,
      }));
  });

  openRankingView(): void {
    this.currentView.set('ranking');
  }

  backToMenu(): void {
    this.currentView.set('menu');
  }

  handleClose(): void {
    this.currentView.set('menu');
    this.closeModal.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.handleClose();
    }
  }

  handleExit(): void {
    this.currentView.set('menu');
    this.exitGame.emit();
  }
}
