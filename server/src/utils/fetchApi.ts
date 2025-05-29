type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number; // Adding timeout option
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
  const { method = 'GET', headers = {}, body, timeout = 5000 } = options;

  // Create a new AbortController to handle the timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal, // Pass the signal to the fetch
    });

    clearTimeout(timeoutId); // Clear the timeout once the response is received

    const contentType = response.headers.get('content-type');
    let data: T | null = null;

    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (err) {
        throw new Error('Failed to parse response as JSON');
      }
    } else {
      // If response is not JSON, handle other formats as necessary
      data = (await response.text()) as unknown as T;
    }

    if (!response.ok) {
      // If the response status is not OK, throw an error
      const message = (data && (data as any).message) || response.statusText;
      throw new Error(message);
    }

    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error: any) {
    clearTimeout(timeoutId); // Clear timeout on error

    if (error.name === 'AbortError') {
      return {
        data: null,
        error: 'Request timeout',
        status: 408, // Timeout status code
      };
    }

    return {
      data: null,
      error: error.message || 'Something went wrong',
      status: error.status || 500, // Default to internal server error if no status
    };
  }
}
