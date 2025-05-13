import './message-index.css';
import { type MessagePayload } from '../../../../../App';

export default function Message({ msg }: { msg: MessagePayload }) {
  const content = msg.payload.message;
  const writer = msg.payload.writer;

  return (
    <div data-writer={writer}>
      <div className='msg'>{content}</div>
    </div>
  );
}
