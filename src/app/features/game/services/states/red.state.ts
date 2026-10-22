import { GameState, GameContext, StepDirection, StepFeedback } from './game-state.interface';
import { TrafficLightColor } from '../../components/traffic-light/traffic-light.component';
import { GreenState } from './green.state';

export const RED_LIGHT_DURATION_MS = 3000;

// Estado con semáforo en rojo: dura 3s y pulsar reinicia la puntuación a 0
export class RedState implements GameState {
  readonly lightColor: TrafficLightColor = 'red';

  getDuration(_context: GameContext): number {
    return RED_LIGHT_DURATION_MS;
  }

  handleStep(_direction: StepDirection, context: GameContext): StepFeedback {
    context.resetScore();
    context.clearLastStep();
    return 'red_penalty';
  }

  getNextState(): GameState {
    return new GreenState();
  }
}
