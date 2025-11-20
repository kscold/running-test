import { useState, useRef, useEffect } from 'react';
import { Message, Session, Citation } from '../types/chatbot';
import { chatbotApi } from '../services/chatbotApi';
import './Chatbot.css';

// 출처 토글 컴포넌트
const CitationToggle = ({ citations }: { citations: Citation[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCitation, setExpandedCitation] = useState<number | null>(null);

  return (
    <div className="citations-container">
      <button
        className="citations-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '▼' : '▶'} 출처 {citations.length}개 {isOpen ? '숨기기' : '보기'}
      </button>
      {isOpen && (
        <div className="citations">
          {citations.map((citation, idx) => (
            <div key={idx} className="citation">
              <div className="citation-header">
                <strong className="citation-title">
                  {citation.title || `출처 ${idx + 1}`}
                </strong>
                <span className="citation-id">ID: {citation.documentId}</span>
              </div>

              {/* 스니펫 (발췌문) */}
              {citation.snippet && (
                <div className="citation-snippet">
                  <div className="snippet-label">📄 발췌문:</div>
                  <p>{citation.snippet}</p>
                </div>
              )}

              {/* 전체 내용 보기 (있는 경우) */}
              {citation.fullContent && (
                <div className="citation-full-content">
                  <button
                    className="full-content-toggle"
                    onClick={() => setExpandedCitation(expandedCitation === idx ? null : idx)}
                  >
                    {expandedCitation === idx ? '▼ 전체 내용 숨기기' : '▶ 전체 내용 보기'}
                  </button>
                  {expandedCitation === idx && (
                    <div className="full-content-text">
                      {citation.fullContent}
                    </div>
                  )}
                </div>
              )}

              {/* 원본 링크 (있는 경우) */}
              {citation.uri && (
                <a
                  href={citation.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="citation-link"
                >
                  🔗 원본 문서 보기 →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Chatbot = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ragType, setRagType] = useState<'file-search-rag' | 'mongodb-rag'>('file-search-rag');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스크롤 하단 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 세션 목록 로드
  const loadSessions = async () => {
    try {
      const { sessions: loadedSessions } = await chatbotApi.getSessions();
      setSessions(loadedSessions);
    } catch (error) {
      console.error('세션 목록 로드 실패:', error);
    }
  };

  // 세션 메시지 로드
  const loadSessionMessages = async (sessionId: string) => {
    try {
      const loadedMessages = await chatbotApi.getSessionMessages(sessionId);
      setMessages(loadedMessages);
    } catch (error) {
      console.error('메시지 로드 실패:', error);
      setMessages([]);
    }
  };

  // 컴포넌트 마운트 시
  useEffect(() => {
    chatbotApi.restoreSession();
    const savedSessionId = chatbotApi.getCurrentSessionId();

    loadSessions();

    if (savedSessionId) {
      setCurrentSessionId(savedSessionId);
      loadSessionMessages(savedSessionId);
    }
  }, []);

  // 새 채팅 시작
  const handleNewChat = async () => {
    try {
      const newSessionId = await chatbotApi.createSession();
      setCurrentSessionId(newSessionId);
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: '안녕하세요! 푼타 챗봇입니다. 궁금하신 점을 물어보세요.',
          timestamp: new Date(),
        }
      ]);
      await loadSessions();
    } catch (error) {
      console.error('새 채팅 생성 실패:', error);
    }
  };

  // 세션 선택
  const handleSelectSession = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    chatbotApi.setSession(sessionId);
    await loadSessionMessages(sessionId);

    // 모바일에서 사이드바 닫기
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  // 세션 삭제
  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('이 대화를 삭제하시겠습니까?')) return;

    try {
      await chatbotApi.closeSession(sessionId);
      await loadSessions();

      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
        chatbotApi.clearSession();
      }
    } catch (error) {
      console.error('세션 삭제 실패:', error);
    }
  };

  // 메시지 전송
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // 세션이 없으면 새로 생성
    if (!currentSessionId) {
      await handleNewChat();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatbotApi.sendMessage(input.trim(), ragType);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message || '응답을 받지 못했습니다.',
        timestamp: new Date(),
        citations: response.citations,
      };

      setMessages(prev => [...prev, assistantMessage]);
      await loadSessions(); // 세션 목록 갱신
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      {/* 사이드바 */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>푼타 챗봇</h2>
          <button className="new-chat-button" onClick={handleNewChat}>
            + 새 채팅
          </button>
        </div>

        <div className="session-list">
          {sessions.length === 0 && (
            <div className="empty-sessions">
              <p>채팅 기록이 없습니다</p>
              <p className="hint">새 채팅을 시작해보세요!</p>
            </div>
          )}
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`session-item ${currentSessionId === session.sessionId ? 'active' : ''}`}
              onClick={() => handleSelectSession(session.sessionId)}
            >
              <div className="session-info">
                <div className="session-title">
                  대화 {session.messageCount > 0 ? `(${session.messageCount})` : ''}
                </div>
                <div className="session-time">
                  {new Date(session.lastMessageAt).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <button
                className="delete-button"
                onClick={(e) => handleDeleteSession(session.sessionId, e)}
                title="대화 삭제"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <select
            value={ragType}
            onChange={(e) => setRagType(e.target.value as 'file-search-rag' | 'mongodb-rag')}
            className="rag-selector"
          >
            <option value="file-search-rag">File Search RAG</option>
            <option value="mongodb-rag">MongoDB RAG</option>
          </select>
        </div>
      </div>

      {/* 메인 채팅 영역 */}
      <div className="chat-area">
        {/* 모바일 헤더 */}
        <div className="mobile-header">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1>푼타 챗봇</h1>
        </div>

        {/* 메시지 영역 */}
        <div className="messages-container">
          {currentSessionId ? (
            <>
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.role}`}>
                  <div className="message-content">
                    <div className="message-text">{message.content}</div>
                    {message.citations && message.citations.length > 0 && (
                      <CitationToggle citations={message.citations} />
                    )}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message assistant">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="empty-chat">
              <div className="empty-icon">💬</div>
              <h2>푼타 챗봇에 오신 것을 환영합니다!</h2>
              <p>새 채팅을 시작하거나</p>
              <p>이전 대화를 선택해주세요</p>
              <button className="start-chat-button" onClick={handleNewChat}>
                새 채팅 시작하기
              </button>
            </div>
          )}
        </div>

        {/* 입력 영역 */}
        {currentSessionId && (
          <div className="input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              disabled={isLoading}
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="send-button"
            >
              전송
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
