import { TrafficLightColor } from '../../components/traffic-light/traffic-light.component';

export type StepDirection = 'left' | 'right';
export type StepFeedback = 'none' | 'step_success' | 'step_penalty' | 'red_penalty';

// Interfaz del contexto que los estados necesitan consultar o actualizar
export interface GameContext {
  readonly currentScore: number;
  getLastStep(): StepDirection | null;
  updateScore(newScore: number): void;
  resetScore(): void;
  setLastStep(direction: StepDirection): void;
  clearLastStep(): void;
  calculateGreenDuration(score: number): number;
}

// Contrato para los estados del semáforo (Rojo y Verde)
export interface GameState {
  readonly lightColor: TrafficLightColor;

  getDuration(context: GameContext): number;

  handleStep(direction: StepDirection, context: GameContext): StepFeedback;

  getNextState(): GameState;
}
