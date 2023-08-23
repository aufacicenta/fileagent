function get<T>(key: string): T | null {
  const item = localStorage.getItem(key);

  if (item === null) {
    return null;
  }

  const value = JSON.parse(item);

  return value;
}

const set = (key: string, value: unknown = {}) => {
  const val = typeof value === "object" ? JSON.stringify(value) : value;

  localStorage.setItem(key, val as string);
};

export const useLocalStorage = () => ({
  set,
  get,
});
