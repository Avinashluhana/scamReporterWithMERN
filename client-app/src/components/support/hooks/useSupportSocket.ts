import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAppDispatch } from '../../../app/hooks';
import config from '../../../config';
import { createChatSuccess, sendMessageSuccess, updateMessageSuccess } from '../../../store/chat.slice';
import { get, Key } from '../../../store/storage';
import { Notification } from '../../../notification.helper';

const token = get(Key.ACCESS_TOKEN);
const support = io(`${config.BASEURL}/support`, {
  extraHeaders: {
    'Authorization': `Bearer ${token}`,
  }
});

export function useSupportSocket() {
  const [isConnected, setIsConnected] = useState(support.connected);
  const dispatch = useAppDispatch();

  const joinChat = (chatId: string) => {
    support.emit('chat.join', { chatId });
  }

  useEffect(() => {
    support.on('connect', () => {
      setIsConnected(true);
    });

    support.on('disconnect', () => {      
      setIsConnected(false);
    });

    support.on('chat.message.new', (data: any) => {
      dispatch(sendMessageSuccess(data));
    });

    support.on('chat.message.updated', (data: any) => {
      dispatch(updateMessageSuccess(data));
    });

    support.on('chat.new', (data: any) => {
      dispatch(createChatSuccess(data));
    });

    support.on('notification.new', (data) => {
    });

    support.on('exception', (exception) => {
      Notification.error(exception?.message || exception?.name || exception);
    });
    

    return () => {
      support.off('connect');
      support.off('disconnect');
      support.off('chat.new');
      support.off('chat.message.new');
      support.off('chat.message.updated');
      support.off('notification.new');
      support.off('exception');
    };
  }, []);


  return { isConnected, joinChat };
}