import { Injectable, computed, inject, signal } from '@angular/core';
import { Player } from '../models/player.model';
import { LocalStorageService } from './local-storage.service';

export const ACTIVE_PLAYER_STORAGE_KEY = 'redgreen_active_player';
export const ALL_PLAYERS_STORAGE_KEY = 'redgreen_all_players';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly storage = inject(LocalStorageService);
  private readonly _currentPlayer = signal<Player | null>(this.loadInitialPlayer());

  readonly currentPlayer = this._currentPlayer.asReadonly();
  readonly hasActivePlayer = computed(() => this._currentPlayer() !== null);

  // Carga el jugador activo desde LocalStorage
  private loadInitialPlayer(): Player | null {
    const stored = this.storage.getItem<Player>(ACTIVE_PLAYER_STORAGE_KEY);
    if (!stored) {
      return null;
    }
    return {
      ...stored,
      createdAt: new Date(stored.createdAt),
      currentScore: stored.currentScore ?? 0,
      highScore: stored.highScore ?? 0,
    };
  }

  // Carga todos los jugadores registrados
  private loadAllPlayers(): Record<string, Player> {
    const raw = this.storage.getItem<Record<string, Player> | Player>(ALL_PLAYERS_STORAGE_KEY);
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      if ('id' in raw && 'name' in raw) {
        const playerObj = raw as Player;
        return { [playerObj.name.toLowerCase()]: playerObj };
      }
      return raw as Record<string, Player>;
    }

    // Si no existe, intenta recuperar desde el jugador activo
    const active = this.storage.getItem<Player>(ACTIVE_PLAYER_STORAGE_KEY);
    if (active && active.name) {
      return { [active.name.toLowerCase()]: active };
    }

    return {};
  }

  // Limpia el texto eliminando caracteres no alfanuméricos
  sanitizeInput(raw: string): string {
    if (!raw) return '';
    return raw.trim().replace(/[^a-zA-Z0-9]/g, '');
  }

  // Crea una sesión de jugador o recupera una existente
  createPlayer(rawName: string): Player {
    const cleanName = this.sanitizeInput(rawName);

    if (cleanName.length < 4) {
      throw new Error('El nombre de jugador debe tener al menos 4 caracteres alfanuméricos.');
    }

    const allPlayers = this.loadAllPlayers();
    const key = cleanName.toLowerCase();
    const existing = allPlayers[key];

    let player: Player;
    if (existing) {
      player = {
        ...existing,
        name: cleanName,
        createdAt: new Date(existing.createdAt),
        currentScore: existing.currentScore ?? 0,
        highScore: existing.highScore ?? 0,
      };
    } else {
      player = {
        id: this.generateSessionId(),
        name: cleanName,
        createdAt: new Date(),
        currentScore: 0,
        highScore: 0,
      };
      allPlayers[key] = player;
      this.storage.setItem(ALL_PLAYERS_STORAGE_KEY, allPlayers);
    }

    this.persistPlayer(player);
    return player;
  }

  // Actualiza la puntuación del jugador y su récord personal
  updateScore(score: number): Player | null {
    const current = this._currentPlayer();
    if (!current) {
      return null;
    }

    const safeScore = Math.max(0, score);
    const updated: Player = {
      ...current,
      currentScore: safeScore,
      highScore: Math.max(current.highScore, safeScore),
    };

    const allPlayers = this.loadAllPlayers();
    allPlayers[current.name.toLowerCase()] = updated;
    this.storage.setItem(ALL_PLAYERS_STORAGE_KEY, allPlayers);

    this.persistPlayer(updated);
    return updated;
  }

  // Limpia la sesión del jugador activo
  resetPlayer(): void {
    this.storage.removeItem(ACTIVE_PLAYER_STORAGE_KEY);
    this._currentPlayer.set(null);
  }

  private persistPlayer(player: Player): void {
    this.storage.setItem(ACTIVE_PLAYER_STORAGE_KEY, player);
    this._currentPlayer.set(player);
  }

  private generateSessionId(): string {
    return `player_${crypto.randomUUID()}`;
  }
}
