import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Notification } from '../../notification.helper';
import { selectAuth, updateSelf } from '../../store/auth.slice';
import config from '../../config';

export default function Profile() {

  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const inputFileRef = React.createRef<HTMLInputElement>();
  const [selectedProfile, setSelectedProfile] = useState<File|undefined>(undefined);
  const [avatar, setAvatar] = useState<string|undefined>(undefined);

  const handleOnProfileChange = () => {
    inputFileRef.current?.click();
  }

  const handleFileChange = (event: any) => {
    const selectedFile: File = event.target.files && event.target.files[0];
    console.log('file: ', selectedFile);

    if (!selectedFile) return;

    const maxFileSizeInMbs = 1;
    if (selectedFile.size > maxFileSizeInMbs * 1024 * 1024) return Notification.error(`can not upload file size of more then ${maxFileSizeInMbs} Mb`);

    setSelectedProfile(selectedFile);

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setAvatar(url);
    }

    reader.readAsDataURL(selectedFile);
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const inputData = Object.fromEntries(formData);

    const input = new FormData();
    if (selectedProfile) input.append('avatar', selectedProfile);
    input.append('fullName', `${inputData.firstName} ${inputData.lastName}`);
    input.append('email', `${inputData.email}`);

    dispatch(updateSelf(input));
  }

  useEffect(() => {
    setAvatar(config.BASEURL + auth.user?.avatar);
  }, [auth.user])

  return <Container component="main" maxWidth="xs">
    <CssBaseline />
    <Box
      sx={{
        marginTop: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box>
        <Tooltip title="click to edit profile" placement="right-end">
          <Avatar
            sx={{ m: 1, bgcolor: 'secondary.main', width: 72, height: 72, cursor: 'pointer' }}
            src={avatar}
            onClick={handleOnProfileChange}
          />
        </Tooltip>
          <input 
            type="file" 
            onChange={handleFileChange}
            hidden ref={inputFileRef} 
            accept='image/*'
          />
      </Box>
      <Typography component="h1" variant="h5">
        Edit Profile
      </Typography>
      {
        auth.user ?
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  defaultValue={auth.user.fullName.split(/\s/)[0] || ''}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  defaultValue={auth.user.fullName.split(/\s/)[1] || ''}
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  defaultValue={auth.user.email}
                  autoComplete="email"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Change
            </Button>
          </Box>
          :
          "Not Information to show"
      }
    </Box>
  </Container>
}