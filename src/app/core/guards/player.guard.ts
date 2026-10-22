import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { PlayerService } from '../services/player.service';

export const playerGuard: CanActivateFn = (): boolean | UrlTree => {
  const playerService = inject(PlayerService);
  const router = inject(Router);

  if (playerService.hasActivePlayer() || playerService.currentPlayer()) {
    return true;
  }

  return router.parseUrl('/home');
};
