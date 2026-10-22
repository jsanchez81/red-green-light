import { Routes } from '@angular/router';
import { playerGuard } from './core/guards/player.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Red & Green Game | Inicio',
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./features/game/game.component').then((m) => m.GameComponent),
    canActivate: [playerGuard],
    title: 'Red & Green Game | Juego',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
