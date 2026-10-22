import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TrafficLightComponent, TrafficLightColor } from '../traffic-light/traffic-light.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

// Tablero de juego: semáforo, marcadores y botones de paso
@Component({
  selector: 'app-game-play',
  standalone: true,
  imports: [TrafficLightComponent, UiButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game-play.component.html',
  styleUrl: './game-play.component.scss',
})
export class GamePlayComponent {
  readonly highScore = input<number>(0);
  readonly currentScore = input<number>(0);
  readonly lightColor = input<TrafficLightColor>('red');

  readonly stepLeft = output<void>();
  readonly stepRight = output<void>();

  onLeftClick(): void {
    this.stepLeft.emit();
  }

  onRightClick(): void {
    this.stepRight.emit();
  }
}
