// src/features/ai/types/ai.types.ts
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  answer: string;
}

export interface AIError {
  message: string;
  status?: number;
}

export interface ParentChild {
  profile: {
    id?: number;
    name?: string;
    full_name?: string;
    class_name?: string;
    [key: string]: any;
  };
  grades: any[];
}