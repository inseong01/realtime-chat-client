import { useState, useEffect, useContext } from 'react';

import {
  OpponentStateContext,
  GetMessageContext,
  initialOpponentState,
  SetIconClickContext,
  USER_ID,
  UserIDContext,
} from './util/context/context';
import { initMessages, type MessageDataPayload } from './util/const/common';

import './App.css';
import { supabase } from './util/supabase/supabaseClient';
import ChatHeader from './feature/app/header/header-index';
import ChatMain from './feature/app/body/body-index';
import ChatFooter from './feature/app/footer/footer-index';

// https://supabase.com/docs/guides/realtime?queryGroups=language&language=js

/*
  Key가 USER_ID와 다르면 상대방 데이터로 판단 중
  
  다수 인원 접속 시 관리자 판별 어려움
  -> 관리자 ID 고유화 필요 
  -> 관리자 메시지 필터링 필요
*/

export default function App() {
  const [isIconClicked, setIconClick] = useState(false);
  const [opponentState, setOpponentState] = useState(initialOpponentState);
  const [messages, getMessage] = useState<MessageDataPayload[]>(initMessages);

  useEffect(() => {
    const userStatus = {
      userID: USER_ID,
      online_at: new Date().toISOString(),
      isOnline: true,
    };

    const MY_CHANNEL = supabase
      /* 채팅방 설정 */
      .channel('channel_1', {
        config: {
          presence: { key: USER_ID },
        },
      });

    MY_CHANNEL
      /* 데이터 송수신 */
      .on('broadcast', { event: 'send' }, (data) => {
        getMessage((prev) => [...prev, data as MessageDataPayload]);
      })
      .on('broadcast', { event: 'opponent' }, (data) => {
        const isOpponent = USER_ID !== data.payload.id;

        if (!isOpponent) return;

        const isTyping = data.payload.isTyping;
        setOpponentState((prev) => ({ ...prev, isTyping }));
      });

    MY_CHANNEL
      /* 채팅방 연결 */
      .on('presence', { event: 'sync' }, () => {})
      .on('presence', { event: 'join' }, ({ key }) => {
        if (key === USER_ID) return;

        const isOnline = true;
        setOpponentState((prev) => ({ ...prev, isOnline }));
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        if (key === USER_ID) return;

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
    <UserIDContext.Provider value={USER_ID}>
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
    </UserIDContext.Provider>
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
