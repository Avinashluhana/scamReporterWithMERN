import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { dologin, selectAuth } from '../../store/auth.slice';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

export default function SignIn() {

  const [searchParams] = useSearchParams();
  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();


  const postLoginCB = () => {
    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) return window.location.href = redirectUrl;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    const data = new FormData(event.currentTarget);
    const input = {
      email: data.get('email')?.toString() as string,
      password: data.get('password')?.toString() as string,
    };

    dispatch(dologin(input.email, input.password, postLoginCB));

  };

  return <>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>

            <Grid item xs>
              <Link to="/user/forget-password" style={{ color: '#d4445e' }}>
                Forgot password?
              </Link>
            </Grid>            
            <Grid item>
              <Typography variant="body2">
                <Link to="/user/register" style={{ color: '#d4445e' }} >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  </>
}