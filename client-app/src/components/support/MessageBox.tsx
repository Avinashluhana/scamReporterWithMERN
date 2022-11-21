import React, { useState, createRef, } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { messageSchema } from '../validation.schema';
import { postMessage, selectChat } from '../../store/chat.slice';
import { Notification } from '../../notification.helper';

export function MessageBox() {

  const dispatch = useAppDispatch();
  const chat = useAppSelector(selectChat);
  const commentForm = createRef<HTMLFormElement>();
  const [error, setError] = useState<any>(undefined);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {

      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const inputData = Object.fromEntries(formData);
  
      await messageSchema.validate(inputData);

      const chatId = chat.selected?.id;

      if (!chatId) return Notification.error('Chat Not Selected');

      dispatch(postMessage(chatId, inputData));
      commentForm.current?.reset();

    } catch (error) {
      setError(error);
    }
  }

  return <Box sx={{ pr: 2 }} >
    <form ref={commentForm} onSubmit={handleSubmit}>

      <TextField
        id="message-field"
        name="content"
        label="Write Message"
        error={error}
        helperText={error?.message}
        variant='outlined'
        onFocus={() => setError(undefined)}
        fullWidth
        InputProps={{
          endAdornment: <IconButton type='submit' aria-label="post-comment"> <SendIcon /> </IconButton>
        }}
      />
    </form>

  </Box>

}