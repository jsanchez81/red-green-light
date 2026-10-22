import { ChangeDetectionStrategy, Component, input } from '@angular/core';

// Icono SVG del juego: círculo dividido en verde y rojo
@Component({
  selector: 'app-split-circle-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './split-circle-icon.component.html',
  styleUrl: './split-circle-icon.component.scss',
})
export class SplitCircleIconComponent {
  readonly size = input<number>(120);

  // Título accesible para lectores de pantalla
  readonly accessibleTitle = input<string>('Icono del juego: Círculo dividido');

  // Descripción accesible para lectores de pantalla
  readonly accessibleDescription = input<string>(
    'Círculo dividido verticalmente: mitad izquierda verde y mitad derecha roja'
  );
}
