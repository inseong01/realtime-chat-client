import './header-index.css';
import { WhoIsContext, AdminStateContext } from '../../../App';

import { useContext } from 'react';

export default function ChatHeader() {
  const who = useContext(WhoIsContext);
  const { status } = useContext(AdminStateContext);

  return (
    <div className='chat-header'>
      <div
        className={`icon ${status ? 'online' : 'offline'}`}
        title={`현재 관리자는 ${status ? '온라인' : '오프라인'}입니다`}
      >
        <span></span>
        관리자
      </div>
      <div className='title'>{`ChatBot ${who}`}</div>
      <div className='close-btn' title='닫기'>
        X
      </div>
    </div>
  );
}
