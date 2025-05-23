type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  // You can extend this with more options as needed
}

interface FetchResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export async function fetchApi<T>(
  url: string,
  options: FetchOptions = {},
): Promise<FetchResponse<T>> {
  const { method = 'GET', headers = {}, body } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    let data: T | null = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If response is not JSON, you can handle other formats here if needed
      data = (await response.text()) as unknown as T;
    }

    if (!response.ok) {
      return {
        data: null,
        error: (data && (data as any).message) || response.statusText,
        status: response.status,
      };
    }

    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    return {
      data: null,
      error: error.message || 'Network error',
      status: 0,
    };
  }
}
