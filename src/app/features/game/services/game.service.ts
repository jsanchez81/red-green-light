import { Injectable, OnDestroy, inject, signal } from '@angular/core';
import { TrafficLightColor } from '../components/traffic-light/traffic-light.component';
import { PlayerService } from '../../../core/services/player.service';
import { LeaderboardService } from '../../../core/services/leaderboard.service';
import {
  GameContext,
  GameState,
  StepDirection,
  StepFeedback,
  RedState,
  RED_LIGHT_DURATION_MS,
} from './states';

export { RED_LIGHT_DURATION_MS };
export type { StepDirection, StepFeedback };
export const BASE_GREEN_DURATION_MS = 10000;
export const MIN_GREEN_DURATION_MS = 2000;
export const SCORE_REDUCTION_RATE_MS = 100;
export const JITTER_RANGE_MS = 1500;

// Calcula la duración del semáforo verde según la puntuación
export function calculateGreenDuration(
  score: number,
  randomFn: () => number = Math.random
): number {
  const safeScore = Math.max(0, score);
  const base = Math.max(
    BASE_GREEN_DURATION_MS - safeScore * SCORE_REDUCTION_RATE_MS,
    MIN_GREEN_DURATION_MS
  );
  // Variación aleatoria entre -1500ms y +1500ms
  const jitter = Math.floor(randomFn() * (JITTER_RANGE_MS * 2 + 1)) - JITTER_RANGE_MS;
  return Math.max(200, base + jitter);
}

// Servicio que controla el bucle del semáforo y las reglas del juego
@Injectable({
  providedIn: 'root',
})
export class GameService implements OnDestroy, GameContext {
  private readonly playerService = inject(PlayerService);
  private readonly leaderboardService = inject(LeaderboardService);

  private readonly _lightColor = signal<TrafficLightColor>('red');
  readonly lightColor = this._lightColor.asReadonly();

  private readonly _lastStep = signal<StepDirection | null>(null);
  readonly lastStep = this._lastStep.asReadonly();

  private readonly _feedback = signal<StepFeedback>('none');
  readonly feedback = this._feedback.asReadonly();

  private currentState: GameState = new RedState();
  private abortController: AbortController | null = null;

  // Implementación de GameContext
  get currentScore(): number {
    return this.playerService.currentPlayer()?.currentScore ?? 0;
  }

  getLastStep(): StepDirection | null {
    return this._lastStep();
  }

  updateScore(newScore: number): void {
    const updated = this.playerService.updateScore(newScore);
    if (updated && updated.highScore >= newScore) {
      this.leaderboardService.recordScore(updated.name, updated.highScore);
    }
  }

  resetScore(): void {
    this.playerService.updateScore(0);
  }

  setLastStep(direction: StepDirection): void {
    this._lastStep.set(direction);
  }

  clearLastStep(): void {
    this._lastStep.set(null);
  }

  calculateGreenDuration(score: number): number {
    return calculateGreenDuration(score);
  }

  // Inicia o reinicia la partida
  startGame(): void {
    this.stopGame();
    this.abortController = new AbortController();
    this.currentState = new RedState();
    this._lightColor.set(this.currentState.lightColor);
    this._lastStep.set(null);
    this._feedback.set('none');
    void this.runGameLoop(this.abortController.signal);
  }

  // Detiene el temporizador y el juego
  stopGame(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  // Bucle principal de alternancia entre semáforo rojo y verde
  private async runGameLoop(signal: AbortSignal): Promise<void> {
    try {
      while (!signal.aborted) {
        this._lightColor.set(this.currentState.lightColor);
        const duration = this.currentState.getDuration(this);
        await this.sleep(duration, signal);

        // Transición al siguiente estado
        this.currentState = this.currentState.getNextState();
      }
    } catch (error) {
      if (signal.aborted) {
        return;
      }
      console.error('Error inesperado en runGameLoop:', error);
    }
  }

  // Pausa cancelable usando AbortSignal
  private sleep(ms: number, signal: AbortSignal): Promise<void> {
    if (signal.aborted) {
      return Promise.reject(new Error('Aborted'));
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, ms);

      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          reject(new Error('Aborted'));
        },
        { once: true }
      );
    });
  }

  // Procesa el paso (izquierda/derecha) según el estado actual
  step(direction: StepDirection): void {
    const player = this.playerService.currentPlayer();
    if (!player) {
      return;
    }

    const feedback = this.currentState.handleStep(direction, this);
    this._feedback.set(feedback);
  }

  ngOnDestroy(): void {
    this.stopGame();
  }
}
