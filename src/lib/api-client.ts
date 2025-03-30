
// Using explicit string comparison to fix the type error
export const compareIds = (id1: string | number, id2: string | number): boolean => {
  return String(id1) === String(id2);
};

// Create api client for use in components
export const api = {
  get: async <T>(path: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`/api${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  },
  post: async <T>(path: string, data?: any, options?: RequestInit): Promise<T> => {
    const response = await fetch(`/api${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  },
  put: async <T>(path: string, data?: any, options?: RequestInit): Promise<T> => {
    const response = await fetch(`/api${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  },
  delete: async <T>(path: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(`/api${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }
};
