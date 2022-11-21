
const engine = localStorage;

export enum Key {
  ACCESS_TOKEN = 'access_token',
  USER = "user",
}

export function get<T>(key: string) {
  const value = engine.getItem(key);
  if (!value) return null;
  return value.startsWith('{') ? JSON.parse(value) as T : value as T;
}

export function set(key: string, value: any) {
  if (typeof value == 'object') value = JSON.stringify(value);
  engine.setItem(key, value);
}

export function del(key: string) {
  engine.removeItem(key);
}

export function clear() {
  engine.clear();
}