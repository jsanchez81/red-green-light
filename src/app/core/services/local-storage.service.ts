import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Servicio seguro para interactuar con LocalStorage (compatible con SSR)
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Obtiene y parsea un elemento por clave
  getItem<T>(key: string): T | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  // Guarda un elemento serializado como JSON
  setItem<T>(key: string, value: T): boolean {
    if (!this.isBrowser) {
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch {
      return false;
    }
  }

  // Elimina una clave de LocalStorage
  removeItem(key: string): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignora errores si el acceso al almacenamiento está restringido
    }
  }

  // Limpia todo el almacenamiento
  clear(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      window.localStorage.clear();
    } catch {
      // Ignora errores si el acceso al almacenamiento está restringido
    }
  }
}
