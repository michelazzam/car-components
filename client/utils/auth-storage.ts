const AUTH_TOKEN_KEY = "THERMOBOX_AUTH_TOKEN";
import { jwtDecode } from "jwt-decode";

export function setAccessToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(token));
}

export function getAccessToken(): string {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
      ? JSON.parse(localStorage.getItem(AUTH_TOKEN_KEY)!)
      : "";
  } catch (error) {
    return "";
  }
}

export function clearAccessToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);

  window.location.href = "/sign-in";
}

export function getCurrentUserId(): string | undefined {
  const token = getAccessToken();
  if (!token) {
    console.error("No token found in local storage.");
    return undefined;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.userId;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return undefined;
  }
}

export interface JwtPayload {
  userId: string;
}
