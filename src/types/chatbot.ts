export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
}

export interface Citation {
  documentId: string;
  title: string;
  snippet: string;
  uri?: string; // 문서 원본 링크 (선택적)
  fullContent?: string; // 전체 문서 내용 (선택적, 모달로 표시 가능)
}

export interface ChatRequest {
  message: string;
  ragType?: 'file-search-rag' | 'mongodb-rag';
  sessionId?: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  citations?: Citation[];
  sessionId?: string;
}

export interface Session {
  id: string;
  sessionId: string;
  status: 'active' | 'closed';
  category?: string;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
}
