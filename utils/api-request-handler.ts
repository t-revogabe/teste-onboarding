const API_BASE_URL = "https://api.example.com"; // TODO: Replace with your API base URL

// Set to true to log all API requests and responses
const DEBUG_API = __DEV__;

// TODO: Replace with your auth token retrieval logic
function getAuthToken(): string | null {
  return null;
}

// ---------------------------------------------------------------------------
// Core request function
// ---------------------------------------------------------------------------

async function request<T = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  data?: Record<string, unknown>,
  authenticated = true,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authenticated && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (data && method !== "GET") {
    config.body = JSON.stringify(data);
  }

  if (DEBUG_API) {
    console.log(`[API] ${method} ${endpoint}`, data ?? "");
  }

  const response = await fetch(url, config);

  if (DEBUG_API) {
    console.log(`[API] ${method} ${endpoint} → ${response.status}`);
  }

  return handleResponse<T>(response);
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return null as T;
  }

  if (response.status === 401) {
    // TODO: Handle unauthorized — clear tokens, redirect to login
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  const text = await response.text();
  if (!text) return null as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getRequest<T = unknown>(
  endpoint: string,
  query?: Record<string, string | number | boolean | null | undefined>,
): Promise<T> {
  let url = endpoint;

  if (query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value != null) {
        params.append(key, String(value));
      }
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  return request<T>(url, "GET");
}

export async function postRequest<T = unknown>(
  endpoint: string,
  data: Record<string, unknown>,
  authenticated = true,
): Promise<T> {
  return request<T>(endpoint, "POST", data, authenticated);
}

export async function patchRequest<T = unknown>(
  endpoint: string,
  data: Record<string, unknown>,
  authenticated = true,
): Promise<T> {
  return request<T>(endpoint, "PATCH", data, authenticated);
}

export async function deleteRequest<T = unknown>(
  endpoint: string,
  data?: Record<string, unknown>,
): Promise<T> {
  return request<T>(endpoint, "DELETE", data);
}
