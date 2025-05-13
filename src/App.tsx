import './App.css';
import type { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';
import { supabase } from './supabase/supabaseClient';
import ChatHeader from './feature/app/header/header-index';
import ChatRoom from './feature/app/body/body-index';
import ChatFooter from './feature/app/footer/footer-index';

import {
  useState,
  createContext,
  useEffect,
  type SetStateAction,
  type Dispatch,
  useContext,
} from 'react';

// https://supabase.com/docs/guides/realtime?queryGroups=language&language=js

const who = 'client';
export const WhoIsContext = createContext(who);

const initialOpponentState = { status: false, isTyping: false };
export const AdminStateContext = createContext(initialOpponentState);

type SetAppCickContext = { setAppClicked: Dispatch<SetStateAction<boolean>> };
export const SetAppCickContext = createContext<SetAppCickContext | undefined>(undefined);

type GetMessageContext = { getMessage: Dispatch<SetStateAction<MessagePayload[]>> };
export const GetMessageContext = createContext<GetMessageContext | undefined>(undefined);

export type MessagePayload = {
  [key: string]: any;
  type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
  event: string;
};

export default function App() {
  const [isAppClicked, setAppClicked] = useState(false);
  const [messages, getMessage] = useState<MessagePayload[]>([]);

  useEffect(() => {
    // join a room
    const testChannel = supabase.channel('test-channel', {
      config: {
        broadcast: { self: true },
      },
    });

    // subscribe to the room
    testChannel.on('broadcast', { event: 'shout' }, (payload) => {
      getMessage((prev) => [...prev, payload]);
    });

    testChannel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        return;
      }

      testChannel.send({
        type: 'broadcast',
        event: 'shout',
        payload: { message: 'talking to myself', writer: 'client' },
      });
    });

    return () => {
      testChannel.unsubscribe();
    };
  }, []);

  console.log(messages);

  return (
    <WhoIsContext.Provider value={who}>
      <AdminStateContext.Provider value={initialOpponentState}>
        <SetAppCickContext.Provider value={{ setAppClicked: setAppClicked }}>
          <GetMessageContext.Provider value={{ getMessage: getMessage }}>
            {isAppClicked && <OpenChat messages={messages} />}
            <AppIcon />
          </GetMessageContext.Provider>
        </SetAppCickContext.Provider>
      </AdminStateContext.Provider>
    </WhoIsContext.Provider>
  );
}

function OpenChat({ messages }: { messages }) {
  return (
    <div id='chat'>
      <ChatHeader />
      <ChatRoom messages={messages} />
      <ChatFooter />
    </div>
  );
}

function AppIcon() {
  const { setAppClicked } = useContext(SetAppCickContext)!;

  return (
    <button
      id='app_icon'
      onClick={() => setAppClicked((prev) => !prev)}
      title='챗 아이콘 버튼'
      aria-label='챗 아이콘 버튼'
    >
      C
    </button>
  );
}
