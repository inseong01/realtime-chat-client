import './footer-index.css';
import { AdminStateContext } from '../../../App';

import { useContext, useState } from 'react';

export default function ChatFooter() {
  const { status } = useContext(AdminStateContext);

  const [text, typingText] = useState('');

  return (
    <div className='chat-footer'>
      <input
        type='text'
        className='text_input'
        value={text}
        onChange={(e) => typingText(e.target.value)}
        // disabled={!status}
        placeholder={status ? '문의 내용을 입력해주세요' : '현재 관리자가 오프라인입니다'}
      />
      <button className='text_input_btn' onClick={() => {}}>
        Send
      </button>
    </div>
  );
}
