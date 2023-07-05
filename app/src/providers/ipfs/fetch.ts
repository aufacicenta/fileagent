import asHttpsURL from "./asHttpsURL";

async function getFrom<T>(url: string, headers?: HeadersInit): Promise<T> {
  const response = await fetch(`${asHttpsURL(url)}`, {
    method: "GET",
    headers,
  });

  const data = await response.json();

  return data;
}

export default getFrom;
