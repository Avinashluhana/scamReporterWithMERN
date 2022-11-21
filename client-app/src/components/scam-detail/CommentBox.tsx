import React, { createRef, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { commentSchema } from '../validation.schema';
import { postScamComment } from '../../store/scam.slice';
import { useAppDispatch } from '../../app/hooks';

type CommentBoxProps = {
  scamId: string;
}

export default function CommentBox({ scamId }: CommentBoxProps) {

  const dispatch = useAppDispatch();
  const commentForm = createRef<HTMLFormElement>();

  const [error, setError] = useState<any>(undefined);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    try {

      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const inputData = Object.fromEntries(formData);
  
      await commentSchema.validate(inputData);

      dispatch(postScamComment(scamId, inputData));

      commentForm.current?.reset();


    } catch (error) {
      setError(error);
    }
  }

  return <Box sx={{ mb: 2 }}>

    <form ref={commentForm} onSubmit={handleSubmit}>

      <TextField
        id="comment-field"
        name="content"
        label="Write Comment"
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