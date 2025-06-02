import { useContext, useState, type ChangeEvent } from 'react';

import {
  OpponentStateContext,
  UserIDContextContext,
} from '../../../util/context/context';
import { type MessageDataPayload } from '../../../util/const/common';
import { supabase } from '../../../util/supabase/supabaseClient';

import './footer-index.css';

export default function ChatFooter() {
  const { isOnline } = useContext(OpponentStateContext);
  const USER_ID = useContext(UserIDContextContext);

  const [text, typingText] = useState('');

  const MY_CHANNEL = supabase.channel('channel_1', {
    config: {
      broadcast: { self: true },
    },
  });

  /* 메시지 전송 */
  function onClickSendMessage() {
    if (!text.length) return;

    const receiver_id = 'admin';
    const send_at = new Date().toISOString();

    const msgData: MessageDataPayload = {
      type: 'broadcast',
      event: 'send',
      payload: { text: text, isTyping: false, id: USER_ID, send_at, receiver_id },
    };

    const updatedOpponentState: MessageDataPayload = {
      type: 'broadcast',
      event: 'opponent',
      payload: { text: '', isTyping: false, id: USER_ID, send_at },
    };

    Promise.all([MY_CHANNEL.send(msgData), MY_CHANNEL.send(updatedOpponentState)]).catch(
      (err) => {
        console.error('Error sending messages: ', err);
      }
    );

    typingText('');
  }

  /* 메시지 작성 */
  function onChangeTypingWords(e: ChangeEvent<HTMLInputElement>) {
    typingText(e.target.value);

    const receiver_id = 'admin';
    const send_at = new Date().toISOString();
    const isTyping = e.target.value.length !== 0;

    const updatedOpponentState: MessageDataPayload = {
      type: 'broadcast',
      event: 'opponent',
      payload: { text: '', isTyping, id: USER_ID, send_at, receiver_id },
    };

    MY_CHANNEL.send(updatedOpponentState).then((res) => console.log(res));
  }

  return (
    <div className='chat-footer'>
      <input
        type='text'
        className='text_input'
        onChange={onChangeTypingWords}
        value={text}
        disabled={!isOnline}
        placeholder={
          isOnline ? '문의 내용을 입력해주세요' : '현재 관리자가 오프라인입니다'
        }
      />
      <button
        className='send_btn flex-center'
        onClick={onClickSendMessage}
        title='전송하기'
        aria-label='전송하기'
        role='button'
      >
        <SendIconSVG />
      </button>
    </div>
  );
}

const SendIconSVG = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
    >
      <path
        d='M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z'
        stroke='#fff'
        strokeWidth='1'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};
