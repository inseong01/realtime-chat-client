import { useEffect, useReducer, useRef, useState } from 'react';

import { SetIconClickContext, UserIDContextContext } from './util/context/global';
import { ADMIN_ID, NICK_NAME, USER_ID, type CustomPresence, type MessageMetaData } from './util/const/const';
import { supabase } from './util/supabase/supabase-client';

import { initVisitorAppState, visitorReducer } from './feature/visitor/reducer';
import { VisitorDispatchContext, VisitorReducerStateContext } from './feature/visitor/context';

import './App.css';
import VisitorChatMode from './feature/visitor/visitor-index';
import ChattingAppIcon from './components/icon/icon-index';

function App() {
  const [isIconClicked, setIconClick] = useState(false);

  const [visitorState, visitorDispatch] = useReducer(visitorReducer, initVisitorAppState);

  const isAppOpenedRef = useRef(isIconClicked);

  const ID = localStorage.getItem('user_id') ?? USER_ID;
  const NAME = localStorage.getItem('user_name') ?? NICK_NAME;

  useEffect(() => {
    isAppOpenedRef.current = isIconClicked;
  }, [isIconClicked]);

  useEffect(() => {
    const userStatus: CustomPresence = {
      userID: ID,
      userName: NAME,
      online_at: new Date().toISOString(),
      isOnline: true,
      isTyping: false,
      messages: [],
    };

    const MY_CHANNEL = supabase
      /* 채팅방 설정 */
      .channel('channel_1', {
        config: {
          presence: { key: ID },
          broadcast: {
            self: true,
          },
        },
      });

    localStorage.setItem('user_id', ID);
    localStorage.setItem('user_name', NAME);

    MY_CHANNEL
      /* 데이터 송수신 */
      .on('broadcast', { event: 'send' }, (data) => {
        const myID = ID;
        const isAppOpened = isAppOpenedRef.current;

        visitorDispatch({ type: 'GET_MESSAGE', data: data as MessageMetaData, myID, isAppOpened });
      })
      .on('broadcast', { event: 'opponent' }, (data) => {
        const adminID = ADMIN_ID;

        visitorDispatch({ type: 'UPDATE_ADMIN_TYPING_STATUS', data: data as MessageMetaData, adminID });
      });

    MY_CHANNEL
      /* 채팅방 연결 */
      .on('presence', { event: 'join' }, ({ key }) => {
        const adminID = ADMIN_ID;
        const myID = ID;
        const isOnline = true;

        visitorDispatch({ type: 'UPDATE_ADMIN_ONLINE_STATUS', key, adminID, myID, isOnline });
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        const adminID = ADMIN_ID;
        const myID = ID;
        const isOnline = false;

        visitorDispatch({ type: 'UPDATE_ADMIN_ONLINE_STATUS', key, adminID, myID, isOnline });
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
  }, [ID, NAME]);

  const visitorReceivedMsgCount = visitorState.messages.reduce((acc, msg) => {
    return acc + (!msg.payload.isRead && msg.payload.id !== ID ? 1 : 0);
  }, 0);
  const msgCountMention =
    visitorReceivedMsgCount > 0
      ? `: 새로운 알림 ${visitorReceivedMsgCount > 99 ? '99+' : visitorReceivedMsgCount} 개`
      : '';

  const msgAlertMention = `채팅 ${msgCountMention}`;

  return (
    <>
      {/* HTML title */}
      <title>{msgAlertMention}</title>

      <SetIconClickContext.Provider value={setIconClick}>
        <UserIDContextContext.Provider value={ID}>
          {isIconClicked && (
            <VisitorReducerStateContext.Provider value={visitorState}>
              <VisitorDispatchContext.Provider value={visitorDispatch}>
                {/* 채팅방 - 방문자 */}
                <VisitorChatMode />
              </VisitorDispatchContext.Provider>
            </VisitorReducerStateContext.Provider>
          )}
        </UserIDContextContext.Provider>

        {/* 채팅방 아이콘 */}
        <ChattingAppIcon hasMsgAlert={msgCountMention.length > 0} />
      </SetIconClickContext.Provider>
    </>
  );
}

export default App;
