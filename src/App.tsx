import { useState, useEffect, useContext } from 'react';

import {
  OpponentStateContext,
  GetMessageContext,
  initialOpponentState,
  SetIconClickContext,
  UserIDContextContext,
} from './util/context/context';
import {
  ADMIN_ID,
  initMessages,
  USER_ID,
  type MessageDataPayload,
} from './util/const/common';
import { supabase } from './util/supabase/supabaseClient';

import './App.css';
import ChatHeader from './feature/app/header/header-index';
import ChatMain from './feature/app/body/body-index';
import ChatFooter from './feature/app/footer/footer-index';

// https://supabase.com/docs/guides/realtime?queryGroups=language&language=js

/*
  문제점

  - 모든 메시지를 수신하고 본인 메시지만 필터링 중, 다른 발신인의 메시지 염탐 가능 
  - ADMIN_ID: 인식 방법, 다른 사용자와 구분 가능해야 함
*/

export default function App() {
  const [isIconClicked, setIconClick] = useState(false);
  const [opponentState, setOpponentState] = useState(initialOpponentState);
  const [messages, getMessage] = useState<MessageDataPayload[]>(initMessages);

  const localStorageID = localStorage.getItem('id');
  const ID = localStorageID ?? USER_ID;

  useEffect(() => {
    localStorage.setItem('id', ID);

    const userStatus = {
      userID: ID,
      online_at: new Date().toISOString(),
      isOnline: true,
    };

    const MY_CHANNEL = supabase
      /* 채팅방 설정 */
      .channel('channel_1', {
        config: {
          presence: { key: ID },
        },
      });

    MY_CHANNEL
      /* 데이터 송수신 */
      .on('broadcast', { event: 'send' }, (data) => {
        const isMySelf = data.payload.id === ID;
        const isMyMessage = data.payload?.receiver_id === ID;

        if (!(isMySelf || isMyMessage)) return;

        getMessage((prev) => [...prev, data as MessageDataPayload]);
      })
      .on('broadcast', { event: 'opponent' }, (data) => {
        const isAdmin = data.payload.id === ADMIN_ID;

        if (!isAdmin) return;

        const isTyping = data.payload.isTyping;
        setOpponentState((prev) => ({ ...prev, isTyping }));
      });

    MY_CHANNEL
      /* 채팅방 연결 */
      .on('presence', { event: 'sync' }, () => {})
      .on('presence', { event: 'join' }, ({ key }) => {
        if (key === ID) return;
        if (key !== ADMIN_ID) return;

        const isOnline = true;
        setOpponentState((prev) => ({ ...prev, isOnline }));
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key === ID) return;
        if (key !== ADMIN_ID) return;

        const isOnline = false;
        setOpponentState((prev) => ({ ...prev, isOnline }));
      });

    MY_CHANNEL
      /* 사용자 추적 설정 */
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        await MY_CHANNEL.track(userStatus);
      });

    return () => {
      MY_CHANNEL.unsubscribe();
    };
  }, []);

  return (
    <UserIDContextContext.Provider value={ID}>
      <OpponentStateContext.Provider value={opponentState}>
        <SetIconClickContext.Provider value={{ setIconClick: setIconClick }}>
          <GetMessageContext.Provider value={{ getMessage: getMessage }}>
            {/* 채팅방 */}
            {isIconClicked && <ChatRoomDisplay messages={messages} />}

            {/* 채팅방 아이콘 */}
            <ChattingAppIcon />
          </GetMessageContext.Provider>
        </SetIconClickContext.Provider>
      </OpponentStateContext.Provider>
    </UserIDContextContext.Provider>
  );
}

function ChatRoomDisplay({ messages }: { messages: MessageDataPayload[] }) {
  return (
    <div id='chat'>
      <ChatHeader />
      <ChatMain messages={messages} />
      <ChatFooter />
    </div>
  );
}

function ChattingAppIcon() {
  const { setIconClick } = useContext(SetIconClickContext);

  function onClicAppIcon() {
    setIconClick((prev: boolean) => !prev);
  }

  return (
    <button
      id='app_icon'
      onClick={onClicAppIcon}
      title='챗 아이콘 버튼'
      aria-label='챗 아이콘 버튼'
    >
      C
    </button>
  );
}
