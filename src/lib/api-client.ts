// Client-side PHP API helpers

export const PHP_API_URL = "/php/api.php";

export function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("haulmate_admin_token") : null;
  return token
    ? {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
}

export async function apiRequest<T = any>(
  action: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${PHP_API_URL}?action=${action}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch (err) {
    throw new Error(text || `HTTP error ${response.status}`);
  }

  if (!response.ok || json.success === false) {
    throw new Error(json.error || `Request failed with status ${response.status}`);
  }

  return json as T;
}
