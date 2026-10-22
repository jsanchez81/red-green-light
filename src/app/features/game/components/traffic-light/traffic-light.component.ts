import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type TrafficLightColor = 'red' | 'green';

@Component({
  selector: 'app-traffic-light',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './traffic-light.component.html',
  styleUrl: './traffic-light.component.scss',
})
export class TrafficLightComponent {
  readonly color = input<TrafficLightColor>('red');

  readonly isRedActive = computed(() => this.color() === 'red');
  readonly isGreenActive = computed(() => this.color() === 'green');

  readonly statusText = computed(() =>
    this.color() === 'red' ? 'Semáforo en rojo: Alto' : 'Semáforo en verde: Adelante'
  );
}
