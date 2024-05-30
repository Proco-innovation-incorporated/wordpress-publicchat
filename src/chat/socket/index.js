import Io from "socket.io-client";

export const createSocketConnection = (clientKey = 'd3fe6c6e-c1de-422e-8d84-df9686b49f791') => {
  const socket = new Io(`https://channel.dev.ezeeassist.io/api/livechat/in/${clientKey}`, {
    transports: ['websocket']
  });

  setTimeout(() => {
    store.setState('loadedConnection', true)
  }, 3000)
  // socket.on('connect', () => {
  //   console.log('Successfully connected!');
  // });

  return socket;
}
