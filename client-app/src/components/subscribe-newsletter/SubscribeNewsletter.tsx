import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { subscribeNewsletterSchema } from '../validation.schema';
import { useAppDispatch } from '../../app/hooks';
import { subscribeNL } from '../../store/scam.slice';
import Typography from '@mui/material/Typography';

export default function SubscribeNewsletter() {

  const dispatch = useAppDispatch();
  const [formError, setFormError] = useState<any>(undefined);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {

      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const inputData = Object.fromEntries(formData);

      await subscribeNewsletterSchema.validate(inputData);
      dispatch(subscribeNL(inputData));

    } catch (error: any) {
      setFormError(error);
    }
  }

  return <Box>
    <Typography variant='body1' sx={{ mb: 1, }} color="text.secondary"
    >
      News Letter
    </Typography>
    <form onSubmit={handleSubmit} >
      <TextField
        id='email'
        name='email'
        label="Email"
        error={formError}
        helperText={formError?.message}
        onFocus={() => setFormError(undefined)}
        variant='outlined'
        fullWidth
      />
      <Button type='submit' variant='outlined' fullWidth sx={{ mt: 1 }}>
        Subscribe
      </Button>
    </form>

  </Box>
}