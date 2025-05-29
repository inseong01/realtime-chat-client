import { useContext, useEffect, useRef } from 'react';

import { OpponentStateContext, USER_ID } from '../../../util/context/context';
import type { MessageDataPayload } from '../../../util/const/common';

import styles from './body-index.module.css';

export default function ChatMain({ messages }: { messages: MessageDataPayload[] }) {
  const { isTyping } = useContext(OpponentStateContext);

  const chatRoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatRoomRef.current) return;

    const chatRoomHeight = chatRoomRef.current.scrollHeight;
    chatRoomRef.current.scrollTo(0, chatRoomHeight);
  }, [messages]);

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
  const content = msg.payload.text;
  const writer = USER_ID === msg.payload.id ? 'client' : 'admin';

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
