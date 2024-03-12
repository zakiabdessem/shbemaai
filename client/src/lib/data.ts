import { API_URL, ASSETS_BASE_URL } from "../app/constants";

export function asset(path: string) {
  // NOTE: Fetching remote assets from the Hugo admin dashboard Vercel dist.
  return `${ASSETS_BASE_URL}/${path}`;
}

export function api(path: string) {
  return `${API_URL}/${path}`;
}
