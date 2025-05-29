import type { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';

export type MessageDataPayload = {
  type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
  event: string;
  payload: {
    text: string;
    id: string;
    isTyping: boolean;
  };
};

export const initMessages: MessageDataPayload[] = [
  {
    type: 'broadcast',
    event: '',
    payload: { text: 'Welcome!', id: 'system', isTyping: false },
  },
];
