import { useContext, useEffect } from 'react';

import { UserIDContextContext } from '../../util/context/global';

import { VisitorDispatchContext, VisitorReducerStateContext } from './context';

import styles from './visitor-index.module.css';
import ChatHeader from '../../components/chat/header/heaer-index';
import ChatFooter from '../../components/chat/footer/footer-index';
import ChatBody from '../../components/chat/body/body-index';

export default function VisitorChatMode() {
  const { adminStatus } = useContext(VisitorReducerStateContext);
  const visitorState = useContext(VisitorReducerStateContext);
  const reducer = useContext(VisitorDispatchContext);
  const USER_ID = useContext(UserIDContextContext);

  /* 윈도우 포커스 여부 */
  useEffect(() => {
    if (!reducer) return;
    reducer({ type: 'READ_MESSAGE' });

    function readMessagesIfVisible() {
      if (!reducer) return;
      if (document.visibilityState === 'visible') {
        reducer({ type: 'READ_MESSAGE' });
      }
    }

    window.addEventListener('visibilitychange', readMessagesIfVisible);

    return () => {
      window.removeEventListener('visibilitychange', readMessagesIfVisible);
    };
  }, [reducer]);

  const isOnline = adminStatus.isOnline;
  const isTyping = adminStatus.isTyping;
  const statusString = isOnline ? '온라인' : '오프라인';

  return (
    <div className={styles.chat}>
      {/* 헤더 */}
      <ChatHeader opponentType='상담사' opponentStatus={statusString} />

      {/* 메인 */}
      <ChatBody messages={visitorState.messages} isOpponentTyping={isTyping} />

      {/* 푸터 */}
      <ChatFooter id={USER_ID} receiver_id='admin' isOpponentOnline={isOnline} />
    </div>
  );
}
