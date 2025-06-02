import type { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';
import { v1 as uuidv1 } from 'uuid';

export const USER_ID = uuidv1();

export type MessageDataPayload = {
  type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
  event: string;
  payload: {
    text: string;
    id: string;
    isTyping: boolean;
    send_at: string;
    // sender_id?: string;
    receiver_id?: string;
  };
};

export const initMessages: MessageDataPayload[] = [
  {
    type: 'broadcast',
    event: '',
    payload: {
      text: 'Welcome!',
      id: '',
      isTyping: false,
      send_at: '',
      // sender_id: USER_ID, // 사용자
      receiver_id: '', // 관리자 타입과 일치
    },
  },
];

export const ADMIN_ID = '99478830-3d2d-11f0-a097-1780455c1367';
