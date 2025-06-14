# 방문자 전용

이 프로젝트는 `Supabase Realtime`을 활용한 **방문자 전용** 채팅 웹 애플리케이션입니다.  
실시간 채팅 웹 애플리케이션에 대한 전반적인 정보는 [여기](https://github.com/inseong01/supabase-realtime-chat)에서 확인할 수 있습니다.

## 구현 방법

### 데이터 처리 방식

`useContext`

- `global`

  - 채팅방 열림 상태

  - 사용자 ID

- `visitor`

  - 디스패치

  - 리듀서 상태

`useReducer`

- `GET_MESSAGE`

  - 본인/관리자 메시지만 수신

  - 페이지가 활성화된 상태에서 채팅창이 열려 있거나 본인 메시지면 읽음 처리

- `READ_MESSAGE`

  - 읽지 않은 메시지 읽음 처리

  - 페이지 활성화, 채팅창 열기 상황에 사용

- `UPDATE_ADMIN_TYPING_STATUS`

  - 상대방 메시지 작성 여부 상태 처리

- `SET_ADMIN_ONLINE_STATUS`

  - 상대방 온라인 여부 상태 처리

## 설치 및 실행 방법

### 저장소 복제

```bash
git clone https://github.com/inseong01/realtime-chat-client.git
```

### 패키지 설치

```bash
cd realtime-chat-client
```

```bash
npm install
```

### 환경 변수 설정

애플리케이션을 정상적으로 실행하려면 환경 변수를 지정해야 합니다.

```bash
# .env
VITE_SUPABASE_URL=<YOUR_SUPABASE_URL>
VITE_SUPABASE_ANON_KEY=<YOUR_SUPABASE_KEY>
```

### 애플리케이션 실행

```bash
# 개발 모드 실행
npm run dev
```
