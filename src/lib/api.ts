import { supabase } from './supabase';
import type {
  Space,
  Document,
  ChatMessage,
  ChatResponse,
  IngestResponse,
  CreateSpaceInput,
  UserConfig,
} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Get auth headers for API requests
async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  
  return {
    'Authorization': session?.access_token ? `Bearer ${session.access_token}` : '',
    'Content-Type': 'application/json',
  };
}

// Generic fetch wrapper with error handling
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Spaces API
export const spacesApi = {
  list: async (): Promise<Space[]> => {
    return fetchApi<Space[]>('/spaces');
  },

  get: async (spaceId: string): Promise<Space> => {
    return fetchApi<Space>(`/spaces/${spaceId}`);
  },

  create: async (input: CreateSpaceInput): Promise<Space> => {
    return fetchApi<Space>(`/spaces?name=${encodeURIComponent(input.name)}`, {
      method: 'POST',
    });
  },

  delete: async (spaceId: string): Promise<void> => {
    await fetchApi(`/spaces/${spaceId}`, {
      method: 'DELETE',
    });
  },
};

// Documents API
export const documentsApi = {
  list: async (spaceId: string): Promise<Document[]> => {
    return fetchApi<Document[]>(`/spaces/${spaceId}/documents`);
  },

  upload: async (spaceId: string, files: FileList): Promise<IngestResponse[]> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_URL}/ingest/${spaceId}`, {
      method: 'POST',
      headers: {
        'Authorization': session?.access_token ? `Bearer ${session.access_token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(error.detail);
    }

    return response.json();
  },

  delete: async (spaceId: string, documentId: string): Promise<void> => {
    await fetchApi(`/spaces/${spaceId}/documents/${documentId}`, {
      method: 'DELETE',
    });
  },
};

// Chat API
export const chatApi = {
  send: async (spaceId: string, query: string): Promise<ChatResponse> => {
    return fetchApi<ChatResponse>(`/chat/${spaceId}`, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  },

  history: async (spaceId: string): Promise<ChatMessage[]> => {
    return fetchApi<ChatMessage[]>(`/spaces/${spaceId}/messages`);
  },

  clear: async (spaceId: string): Promise<void> => {
    await fetchApi(`/spaces/${spaceId}/messages`, {
      method: 'DELETE',
    });
  },
};

// User Config API (uses Supabase directly)
export const userConfigApi = {
  get: async (): Promise<UserConfig | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_configs')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }

    return data;
  },

  upsert: async (config: Partial<UserConfig>): Promise<UserConfig> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_configs')
      .upsert({
        user_id: user.id,
        ...config,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};

// Export all APIs
export const api = {
  spaces: spacesApi,
  documents: documentsApi,
  chat: chatApi,
  userConfig: userConfigApi,
};
