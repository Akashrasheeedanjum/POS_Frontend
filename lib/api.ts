const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/$/, '');

const PRODUCTION_API_URL = 'https://pos-backend-gold.vercel.app/v1';

function getClientApiUrl(): string {
  const url = API_URL || PRODUCTION_API_URL;
  if (typeof window !== 'undefined' && /localhost|127\.0\.0\.1/i.test(url)) {
    return url;
  }
  if (/localhost|127\.0\.0\.1/i.test(url) && process.env.NODE_ENV === 'production') {
    return PRODUCTION_API_URL;
  }
  return url;
}
interface ApiRequestOptions extends RequestInit {
  data?: any;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  token?: string;
}

export const api = async <T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const {
    method = 'GET',
    data,
    params,
    headers = {},
    token,
    ...restOptions
  } = options;

  // Add Content-Type header for requests with body
  if (data) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Construct URL with query parameters
  const url = new URL(`${getClientApiUrl()}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const config: RequestInit = {
    method,
    headers,
    ...restOptions,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url.toString(), config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const error: any = new Error(
      errorData?.message || `Request failed with status ${response.status}`
    );
    error.statusCode = response.status;
    error.data = errorData;
    throw error;
  }

  // Handle cases where response might be empty
  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
};

// Specific API methods for convenience
export const apiGet = <T = any>(endpoint: string, token?: string) =>
  api<T>(endpoint, { token });

export const apiPost = <T = any>(endpoint: string, data: any, token?: string) =>
  api<T>(endpoint, { method: 'POST', data, token});

export const apiPut = <T = any>(endpoint: string, data?: any, token?: string) =>
  api<T>(endpoint, { method: 'PUT', data, token });

export const apiPatch = <T = any>(endpoint: string, data: any, token?: string) =>
  api<T>(endpoint, { method: 'PATCH', data, token });

export const apiDelete = <T = any>(endpoint: string, token?: string) =>
  api<T>(endpoint, { method: 'DELETE', token });