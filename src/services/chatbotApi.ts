import { ChatResponse, Session, Message } from '../types/chatbot';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

export class ChatbotAPI {
  private sessionId: string | null = null;

  // 세션 목록 조회
  async getSessions(page: number = 1, limit: number = 20): Promise<{ sessions: Session[]; total: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot/sessions?page=${page}&limit=${limit}&sortBy=lastMessageAt&order=desc`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`세션 목록 조회 실패: ${response.status}`);
      }

      const data = await response.json();
      return {
        sessions: data.data.sessions,
        total: data.data.pagination.total,
      };
    } catch (error) {
      console.error('세션 목록 조회 실패:', error);
      throw error;
    }
  }

  // 세션 생성
  async createSession(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'cs',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('세션 생성 실패 상세:', errorData);
        throw new Error(`세션 생성 실패: ${response.status}`);
      }

      const data = await response.json();
      const newSessionId = data.data.sessionId;
      this.sessionId = newSessionId;
      localStorage.setItem('chatbot_session_id', newSessionId);
      return newSessionId;
    } catch (error) {
      console.error('세션 생성 실패:', error);
      throw error;
    }
  }

  // 세션 메시지 조회
  async getSessionMessages(sessionId: string): Promise<Message[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot/sessions/${sessionId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`메시지 조회 실패: ${response.status}`);
      }

      const data = await response.json();
      return data.data.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.createdAt),
        citations: msg.metadata?.citations,
      }));
    } catch (error) {
      console.error('메시지 조회 실패:', error);
      throw error;
    }
  }

  // 메시지 전송
  async sendMessage(message: string, ragType: 'file-search-rag' | 'mongodb-rag' = 'file-search-rag'): Promise<ChatResponse> {
    try {
      // 세션이 없으면 생성
      if (!this.sessionId) {
        await this.createSession();
      }

      const requestBody = {
        message,
        ragType,
      };

      const response = await fetch(`${API_BASE_URL}/api/chatbot/sessions/${this.sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 응답 형식 변환
      return {
        success: data.success,
        message: data.data.aiMessage.content,
        citations: data.data.aiMessage.metadata?.citations,
        sessionId: data.data.sessionId,
      };
    } catch (error) {
      console.error('챗봇 API 호출 실패:', error);
      throw error;
    }
  }

  // 세션 종료
  async closeSession(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot/sessions/${sessionId}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`세션 종료 실패: ${response.status}`);
      }

      // 현재 세션이었다면 초기화
      if (this.sessionId === sessionId) {
        this.sessionId = null;
        localStorage.removeItem('chatbot_session_id');
      }
    } catch (error) {
      console.error('세션 종료 실패:', error);
      throw error;
    }
  }

  // 세션 변경
  setSession(sessionId: string) {
    this.sessionId = sessionId;
    localStorage.setItem('chatbot_session_id', sessionId);
  }

  // 현재 세션 ID 가져오기
  getCurrentSessionId(): string | null {
    return this.sessionId;
  }

  // 세션 초기화
  clearSession() {
    this.sessionId = null;
    localStorage.removeItem('chatbot_session_id');
  }

  // localStorage에서 세션 복원
  restoreSession() {
    const savedSessionId = localStorage.getItem('chatbot_session_id');
    if (savedSessionId) {
      this.sessionId = savedSessionId;
    }
  }
}

export const chatbotApi = new ChatbotAPI();
