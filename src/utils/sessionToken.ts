// Login token for the api/v1/storystream/* routes. Not stored under `token`:
// the axios interceptor would then send it to every shared API route, whose CORS
// rules refuse the Authorization header.
const TOKEN_KEY = "ssSessionToken";

export const saveSessionToken = (token?: string | null): void => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Could not save session token:", error);
  }
};

export const getSessionToken = (): string => {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
};

export const isLoggedIn = (): boolean => {
  try {
    return localStorage.getItem("isLoggedIn") === "true";
  } catch {
    return false;
  }
};

// Logged-in state the backend no longer accepts (expired token, or a login from
// before tokens were kept): sign out and ask the user to log in again.
export const endSessionAndRedirectToLogin = (): void => {
  try {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("loginData");
    localStorage.removeItem("authData");
  } catch (error) {
    console.error("Could not clear session:", error);
  }
  saveSessionToken(null);
  window.location.assign("/auth/login");
};
