import './message-index.css';
import { type MessagePayload } from '../../../../../App';

export default function Message({ msg }: { msg: MessagePayload }) {
  const content = msg.payload.message;

  return (
    <div>
      <div className='msg'>{content}</div>
    </div>
  );
}
