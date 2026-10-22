import { Injectable, computed, inject, signal } from '@angular/core';
import { LeaderboardEntry } from '../models/leaderboard.model';
import { LocalStorageService } from './local-storage.service';

export const LEADERBOARD_STORAGE_KEY = 'redgreen_leaderboard';
export const MAX_STORED_SCORES = 50;

// Servicio para gestionar el ranking y puntuaciones históricas
@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private readonly storage = inject(LocalStorageService);
  private readonly _entries = signal<LeaderboardEntry[]>(this.loadInitialEntries());

  readonly topScores = this._entries.asReadonly();
  readonly totalRecords = computed(() => this._entries().length);

  // Carga las puntuaciones guardadas, asegurando un registro por jugador
  private loadInitialEntries(): LeaderboardEntry[] {
    const saved = this.storage.getItem<LeaderboardEntry[]>(LEADERBOARD_STORAGE_KEY);
    if (!Array.isArray(saved)) {
      return [];
    }

    // 1. Filtrar registros inválidos o sin nombre
    const validEntries = saved.filter((entry) => Boolean(entry?.playerName?.trim()));

    // 2. Ordenar de mayor a menor puntuación
    const sorted = this.sortEntries(validEntries);

    // 3. Dejar solo la mejor partida de cada jugador.
    // Al estar ya ordenadas de mayor a menor, la primera que vemos de cada jugador es siempre su récord.
    const seenPlayers = new Set<string>();
    const uniqueEntries = sorted.filter((entry) => {
      const playerKey = entry.playerName.trim().toLowerCase();
      if (seenPlayers.has(playerKey)) {
        return false; // Ya vimos a este jugador antes con una puntuación superior
      }
      seenPlayers.add(playerKey);
      return true;
    });

    const clean = uniqueEntries.slice(0, MAX_STORED_SCORES);

    // Si había elementos inválidos o repetidos en el almacenamiento, lo reparamos
    if (clean.length !== saved.length) {
      this.storage.setItem(LEADERBOARD_STORAGE_KEY, clean);
    }

    return clean;
  }

  getTopScores(limit = 10): LeaderboardEntry[] {
    return this._entries().slice(0, Math.max(1, limit));
  }

  recordScore(playerName: string, score: number): LeaderboardEntry {
    const trimmedName = playerName.trim();
    const normalizedName = trimmedName.toLowerCase();
    const safeScore = Math.max(0, score);

    // Busca registros previos del jugador
    const existingEntries = this._entries().filter(
      (e) => e.playerName.trim().toLowerCase() === normalizedName
    );
    const existingBest = existingEntries.length > 0
      ? Math.max(...existingEntries.map((e) => e.score))
      : 0;
    const newScore = Math.max(existingBest, safeScore);

    const firstExisting = existingEntries[0];
    const entry: LeaderboardEntry = {
      id: firstExisting?.id ?? `score_${crypto.randomUUID()}`,
      playerName: trimmedName,
      score: newScore,
      achievedAt:
        newScore > existingBest || !firstExisting
          ? new Date().toISOString()
          : firstExisting.achievedAt,
    };

    // Actualiza la lista sin duplicados
    const listWithoutPlayer = this._entries().filter(
      (e) => e.playerName.trim().toLowerCase() !== normalizedName
    );

    const updated = this.sortEntries([...listWithoutPlayer, entry]).slice(
      0,
      MAX_STORED_SCORES
    );

    this.storage.setItem(LEADERBOARD_STORAGE_KEY, updated);
    this._entries.set(updated);

    return entry;
  }

  // Devuelve el récord más alto de un jugador
  getPersonalBest(playerName: string): number {
    const normalized = playerName.trim().toLowerCase();
    const playerEntries = this._entries().filter(
      (entry) => entry.playerName.toLowerCase() === normalized
    );

    if (playerEntries.length === 0) {
      return 0;
    }

    return Math.max(...playerEntries.map((e) => e.score));
  }

  // Borra todo el ranking de LocalStorage y memoria
  clearLeaderboard(): void {
    this.storage.removeItem(LEADERBOARD_STORAGE_KEY);
    this._entries.set([]);
  }

  // Ordena por puntuación de mayor a menor
  private sortEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
    return [...entries].sort((a, b) => b.score - a.score);
  }
}
