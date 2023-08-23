function get<T>(key: string, type: string = "{}"): T {
  const value = JSON.parse(localStorage.getItem(key) || type);

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
