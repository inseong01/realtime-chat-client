import './header-index.css';
import { AdminStateContext, SetAppCickContext } from '../../../App';

import { useContext } from 'react';

export default function ChatHeader() {
  const { status } = useContext(AdminStateContext);
  const { setAppClicked } = useContext(SetAppCickContext)!;

  const statusStyle = status ? 'online' : 'offline';
  const adminStatus = status ? '온라인' : '오프라인';

  return (
    <div className='chat-header'>
      <div
        className={`icon flex-center`}
        title={`현재 관리자는 ${adminStatus}입니다`}
        data-admin={statusStyle}
      >
        <span></span>
        관리자
      </div>
      <button
        className='flex-center'
        role='button'
        title='닫기'
        aria-label='채팅 창 닫기'
        onClick={() => setAppClicked((prev: boolean) => !prev)}
      >
        <CloseIconSVG />
      </button>
    </div>
  );
}

function CloseIconSVG() {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
      <line
        x1='3'
        y1='3'
        x2='21'
        y2='21'
        stroke='#222'
        strokeWidth='1'
        transform='rotate(0, 12, 12)'
      />
      <line
        x1='3'
        y1='21'
        x2='21'
        y2='3'
        stroke='#222'
        strokeWidth='1'
        transform='rotate(0, 12, 12)'
      />
    </svg>
  );
}
