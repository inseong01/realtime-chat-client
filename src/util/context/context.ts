import { createContext, type Dispatch, type SetStateAction } from 'react';

import type { MessageDataPayload } from '../const/common';

type UserIDContext = string;
export const UserIDContextContext = createContext<UserIDContext>('');

export const initialOpponentState = { isOnline: false, isTyping: false };
export const OpponentStateContext = createContext(initialOpponentState);

type SetIconClickContext = { setIconClick: Dispatch<SetStateAction<boolean>> };
export const SetIconClickContext = createContext<SetIconClickContext>({
  setIconClick: () => {},
});

type GetMessageContext = { getMessage: Dispatch<SetStateAction<MessageDataPayload[]>> };
export const GetMessageContext = createContext<GetMessageContext | undefined>(undefined);
