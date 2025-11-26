export interface Favorite {
  id: string;
  line: string;
  category: string;
  timestamp: number;
}

const STORAGE_KEY = "90s-rizz-favorites";
const MAX_FAVORITES = 50;

export const storage = {
  /**
   * Get all favorites from local storage
   */
  getFavorites(): Favorite[] {
    if (typeof window === "undefined") return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to get favorites:", error);
      return [];
    }
  },

  /**
   * Save a new favorite to local storage
   */
  saveFavorite(line: string, category: string): Favorite | null {
    if (typeof window === "undefined") return null;

    try {
      const favorites = this.getFavorites();

      // Check if already exists
      if (favorites.some((f) => f.line === line)) {
        console.warn("Favorite already exists");
        return null;
      }

      // Check storage limit
      if (favorites.length >= MAX_FAVORITES) {
        throw new Error(`Maximum ${MAX_FAVORITES} favorites reached. Please remove some first.`);
      }

      const newFavorite: Favorite = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        line,
        category,
        timestamp: Date.now(),
      };

      favorites.unshift(newFavorite); // Add to beginning
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      return newFavorite;
    } catch (error) {
      console.error("Failed to save favorite:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to save favorite");
    }
  },

  /**
   * Remove a favorite from local storage
   */
  removeFavorite(id: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      const favorites = this.getFavorites();
      const filtered = favorites.filter((f) => f.id !== id);

      if (filtered.length === favorites.length) {
        console.warn("Favorite not found");
        return false;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      return false;
    }
  },

  /**
   * Clear all favorites
   */
  clearFavorites(): boolean {
    if (typeof window === "undefined") return false;

    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Failed to clear favorites:", error);
      return false;
    }
  },

  /**
   * Check if local storage is available
   */
  isAvailable(): boolean {
    if (typeof window === "undefined") return false;

    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },
};
