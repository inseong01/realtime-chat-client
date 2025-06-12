import { useContext } from 'react';

import { SetIconClickContext } from '../../../util/context/global';

import ICON_CLOSE from './../../../assets/icon-close.svg';

import styles from './header-index.module.css';

export default function ChatHeader({
  chatroomTitle = '환영합니다',
  opponentType,
  opponentStatus,
}: {
  chatroomTitle?: string;
  opponentType: string;
  opponentStatus: string;
}) {
  const setIconClick = useContext(SetIconClickContext);

  /* 닫기 */
  function onClickHeaderCloseIcon() {
    if (!setIconClick) {
      alert('채팅을 닫는 중 예기치 못한 오류가 발생했습니다.');
      return;
    }

    setIconClick((prev: boolean) => !prev);
  }

  return (
    <div className={styles.header}>
      {/* 제목 */}
      <div className={styles.titleBox}>
        <span className={styles.title}>{chatroomTitle}</span>
        <span className={styles.status}>
          현재 {opponentType}는 {opponentStatus}입니다.
        </span>
      </div>

      {/* 닫기 아이콘 */}
      <button
        className={styles.closeBtn}
        type='button'
        role='button'
        title='닫기'
        aria-label='채팅창 닫기'
        onClick={onClickHeaderCloseIcon}
      >
        <img src={ICON_CLOSE} alt='닫기' />
      </button>
    </div>
  );
}
