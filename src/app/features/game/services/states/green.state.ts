import { GameState, GameContext, StepDirection, StepFeedback } from './game-state.interface';
import { TrafficLightColor } from '../../components/traffic-light/traffic-light.component';
import { RedState } from './red.state';

// Estado con semáforo en verde: pasos alternados suman +1 punto, repetidos restan 1
export class GreenState implements GameState {
  readonly lightColor: TrafficLightColor = 'green';

  getDuration(context: GameContext): number {
    return context.calculateGreenDuration(context.currentScore);
  }

  handleStep(direction: StepDirection, context: GameContext): StepFeedback {
    const lastStep = context.getLastStep();

    if (lastStep !== null && lastStep === direction) {
      // Mismo botón pulsado consecutivamente: resta 1 punto
      context.updateScore(Math.max(0, context.currentScore - 1));
      context.setLastStep(direction);
      return 'step_penalty';
    }

    // Botones alternados: suma 1 punto
    context.updateScore(context.currentScore + 1);
    context.setLastStep(direction);
    return 'step_success';
  }

  getNextState(): GameState {
    return new RedState();
  }
}
