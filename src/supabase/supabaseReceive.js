import { supabase } from "./supabaseClient";

// join a room
const testChannel = supabase.channel('test-channel', {
  config: {
    broadcast: { self: true }
  }
});

// function to log any messages we receive
function messageReceived(payload) {
  console.log(payload);
}

// subscribe to the room
testChannel
  .on(
    'broadcast',
    { event: 'test-my-messages' },
    (payload) => messageReceived(payload)
  )

testChannel
  .subscribe((status) => {
    if (status !== 'SUBSCRIBED') { return }
    myChannel.send({
      type: 'broadcast',
      event: 'test-my-messages',
      payload: { message: 'talking to myself' },
    })
  })