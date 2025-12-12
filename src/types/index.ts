// User types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserConfig {
  id: string;
  user_id: string;
  openai_api_key: string | null;
  llama_cloud_api_key: string | null;
  cohere_api_key: string | null;
  qdrant_url: string | null;
  qdrant_api_key: string | null;
  default_llm_model: string;
  theme: 'light' | 'dark' | 'system';
  created_at: string;
  updated_at: string;
}

// Space types
export interface Space {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
  status: 'active' | 'processing' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface CreateSpaceInput {
  name: string;
  description?: string;
}

// Document types
export interface Document {
  id: string;
  space_id: string;
  user_id: string;
  filename: string;
  file_size: number | null;
  mime_type: string | null;
  storage_path: string;
  status: 'processing' | 'indexed' | 'failed';
  error_message: string | null;
  uploaded_at: string;
  indexed_at: string | null;
}

// Chat types
export interface ChatMessage {
  id: string;
  space_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  sources: Source[] | null;
  created_at: string;
}

export interface Source {
  text: string;
  score: number | null;
  metadata: {
    filename?: string;
    space_id?: string;
    page?: number;
    section?: string;
    [key: string]: unknown;
  };
}

export interface ChatRequest {
  query: string;
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
}

// API Response types
export interface ApiError {
  detail: string;
}

export interface IngestResponse {
  message: string;
  filename: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
}
