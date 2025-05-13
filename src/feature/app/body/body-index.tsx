import './body-index.css';
import Message from './chat/message/message-index';
import { AdminStateContext, type MessagePayload } from '../../../App';

import { useContext, useEffect, useRef } from 'react';

export default function ChatRoom({ messages }: { messages: MessagePayload[] }) {
  const { isTyping } = useContext(AdminStateContext);

  const chatRoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatRoomRef.current) return;

    const chatRoomHeight = chatRoomRef.current.scrollHeight;
    chatRoomRef.current.scrollTo(0, chatRoomHeight);
  }, [messages]);

  return (
    <div className='chat-room' ref={chatRoomRef}>
      <span></span>
      {messages.map((msg, index) => (
        <Message key={index} msg={msg} />
      ))}
      {isTyping && (
        <div className='receive'>
          <div className='msg'>
            <div className='typing flex-center'>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
