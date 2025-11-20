# 푼타 챗봇 UI

푼타 백오피스 챗봇 API를 연동한 React 기반 챗봇 인터페이스입니다.

## 기술 스택

- React 19.2.0
- TypeScript 5.9.3
- Vite 7.2.2
- 푼타 챗봇 RAG API (File Search RAG / MongoDB RAG)

## 주요 기능

- 실시간 챗봇 대화
- RAG 방식 선택 (File Search RAG / MongoDB RAG)
- Citations 출처 표시
- 대화 세션 관리
- 푼타 브랜드 디자인

## 설치 및 실행

### 1. 의존성 설치
```bash
yarn install
```

### 2. 환경 변수 설정
`.env` 파일에서 API URL 확인:
```bash
# 로컬 개발 (백엔드 8081 포트)
VITE_API_BASE_URL=http://localhost:8081

# 배포 환경
# VITE_API_BASE_URL=https://api.admin.eatbuy.co.kr
```

### 3. 개발 서버 실행
```bash
yarn dev
```

브라우저에서 http://localhost:3000 접속

### 4. 프로덕션 빌드
```bash
yarn build
yarn preview
```

## 프로젝트 구조

```
running-test/
├── src/
│   ├── components/
│   │   ├── Chatbot.tsx       # 챗봇 메인 컴포넌트
│   │   └── Chatbot.css        # 챗봇 스타일
│   ├── services/
│   │   └── chatbotApi.ts      # 챗봇 API 서비스
│   ├── types/
│   │   └── chatbot.ts         # TypeScript 타입 정의
│   ├── App.tsx                # 앱 컴포넌트
│   ├── App.css                # 글로벌 스타일
│   └── main.tsx               # 앱 진입점
├── index.html                 # HTML 템플릿
├── vite.config.ts             # Vite 설정
├── tsconfig.json              # TypeScript 설정
└── package.json               # 패키지 정보

```

## API 연동

### 엔드포인트
- **POST** `/api/chatbot/chat`

### Request
```typescript
{
  message: string;
  ragType?: 'file-search-rag' | 'mongodb-rag';
  sessionId?: string;
}
```

### Response
```typescript
{
  success: boolean;
  message: string;
  citations?: Citation[];
  sessionId?: string;
}
```

## 사용 방법

1. **챗봇 대화**: 하단 입력창에 질문 입력 후 전송
2. **RAG 방식 선택**: 상단 드롭다운에서 File Search RAG 또는 MongoDB RAG 선택
3. **대화 초기화**: 상단 "대화 초기화" 버튼 클릭

## 개발 가이드

### 컴포넌트 구조
- `Chatbot.tsx`: 메인 챗봇 UI 및 로직
- `chatbotApi.ts`: API 통신 담당
- `chatbot.ts`: TypeScript 타입 정의

### 스타일링
- 푼타 브랜드 컬러: `#ff6b6b` ~ `#ff8787` (그라디언트)
- 반응형 디자인 적용
- 부드러운 애니메이션 효과

### API 백엔드 실행
푼타 백오피스 백엔드가 8081 포트에서 실행 중이어야 합니다:
```bash
cd /Users/kscold/Desktop/punta-backoffice-BE
yarn start:dev
# 또는
npm run start:dev
```

**백엔드 포트**: 8081 (로컬)
**API 엔드포인트**: http://localhost:8081/api/chatbot/chat

## 문의

프로젝트 관련 문의는 개발팀으로 연락주세요.
