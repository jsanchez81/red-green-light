import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  computed,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';
import { LeaderboardService } from '../../core/services/leaderboard.service';
import { GameService } from './services/game.service';
import { GameHeaderComponent } from './components/game-header/game-header.component';
import { GamePlayComponent } from './components/game-play/game-play.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [GameHeaderComponent, GamePlayComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly playerService = inject(PlayerService);
  private readonly leaderboardService = inject(LeaderboardService);
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  private readonly player = this.playerService.currentPlayer;
  readonly playerName = computed(() => this.player()?.name ?? '');

  readonly highScore = computed(() => {
    const active = this.player();
    if (!active) {
      return 0;
    }
    const personalBest = this.leaderboardService.getPersonalBest(active.name);
    return Math.max(active.highScore ?? 0, personalBest);
  });

  readonly currentScore = computed(() => this.player()?.currentScore ?? 0);
  readonly lightColor = this.gameService.lightColor;

  ngOnInit(): void {
    this.gameService.startGame();
  }

  handleStepLeft(): void {
    this.gameService.step('left');
  }

  handleStepRight(): void {
    this.gameService.step('right');
  }

  handleLogout(): void {
    this.gameService.stopGame();
    this.playerService.resetPlayer();
    void this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.gameService.stopGame();
  }
}
