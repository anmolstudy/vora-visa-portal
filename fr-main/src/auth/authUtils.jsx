// ─── Token helpers (sessionStorage — clears on tab close) ────────────────────
// NOTE: For maximum security, use httpOnly cookies set server-side.
const TOKEN_KEY = "auth_token";

export const setToken = (token) => sessionStorage.setItem(TOKEN_KEY, token);
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const removeToken = () => sessionStorage.removeItem(TOKEN_KEY);

export const isLoggedIn = () => !!getToken();

// ─── Role is NOT stored in localStorage/sessionStorage ───────────────────────
// Role is read from the AuthContext (fetched from /api/auth/me on load).
// Never trust a role stored in client storage — it can be tampered with.
// Use useAuth().user.role for role-based UI rendering.
