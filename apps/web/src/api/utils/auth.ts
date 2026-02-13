/**
 * Authentication utilities
 */

export const authUtils = {
  /**
   * Get auth token from localStorage
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },

  /**
   * Set auth token to localStorage
   */
  setToken(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth_token", token);
  },

  /**
   * Remove auth token from localStorage
   */
  removeToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth_token");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
