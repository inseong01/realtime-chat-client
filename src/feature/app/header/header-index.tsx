import { memo, useContext } from 'react';

import { OpponentStateContext, SetIconClickContext } from '../../../util/context/context';

import './header-index.css';

export default function ChatHeader() {
  const { isOnline } = useContext(OpponentStateContext);
  const { setIconClick } = useContext(SetIconClickContext);

  const statusStyle = isOnline ? 'online' : 'offline';
  const adminStatus = isOnline ? '온라인' : '오프라인';

  function onClickHeaderCloseIcon() {
    setIconClick((prev: boolean) => !prev);
  }

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
        onClick={onClickHeaderCloseIcon}
      >
        <OptimizedCloseIconSVG />
      </button>
    </div>
  );
}

const OptimizedCloseIconSVG = memo(function CloseIconSVG() {
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
});
