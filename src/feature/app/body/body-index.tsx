import { useContext, useEffect, useRef } from 'react';

import {
  OpponentStateContext,
  UserIDContextContext,
} from '../../../util/context/context';
import { type MessageDataPayload } from '../../../util/const/common';

import styles from './body-index.module.css';

export default function ChatMain({ messages }: { messages: MessageDataPayload[] }) {
  const { isTyping } = useContext(OpponentStateContext);

  const chatRoomRef = useRef<HTMLDivElement>(null);

  /* 메시지 창 위치 조절 */
  useEffect(() => {
    if (!chatRoomRef.current) return;

    const chatRoomHeight = chatRoomRef.current.scrollHeight;
    chatRoomRef.current.scrollTo(0, chatRoomHeight);
  }, [messages, isTyping]);

  return (
    <div className={styles.chatRoom} ref={chatRoomRef}>
      {/* 메시지 목록 */}
      <MessagesDisplay messages={messages} />

      {/* 입력중 애니메이션 */}
      {isTyping && <TypingAnimation />}
    </div>
  );
}

function MessagesDisplay({ messages }: { messages: MessageDataPayload[] }) {
  return (
    <>
      {messages.map((msg, index) => (
        <Message key={index} msg={msg} />
      ))}
    </>
  );
}

function Message({ msg }: { msg: MessageDataPayload }) {
  const USER_ID = useContext(UserIDContextContext);

  const writer = USER_ID === msg.payload.id ? 'client' : 'admin';
  const content = msg.payload.text;

  return (
    <div data-writer={writer}>
      <div className={styles.msg}>{content}</div>
    </div>
  );
}

function TypingAnimation() {
  return (
    <div className={styles.receive}>
      <div className={styles.msg}>
        <div className={`${styles.typing} flex-center`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
