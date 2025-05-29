import { createContext, type Dispatch, type SetStateAction } from 'react';
import { v1 as uuidv1 } from 'uuid';

import type { MessageDataPayload } from '../const/common';

export const USER_ID = uuidv1();
export const UserIDContext = createContext(USER_ID);

export const initialOpponentState = { isOnline: false, isTyping: false };
export const OpponentStateContext = createContext(initialOpponentState);

type SetIconClickContext = { setIconClick: Dispatch<SetStateAction<boolean>> };
export const SetIconClickContext = createContext<SetIconClickContext>({
  setIconClick: () => {},
});

type GetMessageContext = { getMessage: Dispatch<SetStateAction<MessageDataPayload[]>> };
export const GetMessageContext = createContext<GetMessageContext | undefined>(undefined);
