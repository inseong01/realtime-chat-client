import './App.css';
import type { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';
import { supabase } from './supabase/supabaseClient';
import ChatHeader from './feature/app/header/header-index';
import ChatRoom from './feature/app/body/body-index';
import ChatFooter from './feature/app/footer/footer-index';

import { useState, createContext, useRef, useEffect } from 'react';

// https://supabase.com/docs/guides/realtime?queryGroups=language&language=js

const who = 'client';
export const WhoIsContext = createContext(who);

const initialOpponentState = { status: false, isTyping: false };
export const AdminStateContext = createContext(initialOpponentState);

export type MessagePayload = {
  [key: string]: any;
  type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
  event: string;
};

export default function App() {
  const [messages, getMessage] = useState<MessagePayload[]>([]);
  const roomId = useRef(null);

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
        <div className='chat'>
          <ChatHeader />
          <ChatRoom messages={messages} />
          <ChatFooter />
        </div>
      </AdminStateContext.Provider>
    </WhoIsContext.Provider>
  );
}
