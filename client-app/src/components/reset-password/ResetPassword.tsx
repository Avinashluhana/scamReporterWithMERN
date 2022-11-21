import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useResetPassword } from "../../hooks/reset-password.hook";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Notification } from "../../notification.helper";


export default function ResetPassword() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { loading, onResetPassword } = useResetPassword(onSuccess);

  function onSuccess() {
    navigate('/user/login', { replace: true });
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = searchParams.get('token') || '';

    const data = new FormData(event.currentTarget);
    const input = {
      password: data.get('password')?.toString() as string,
      confirmPassword: data.get('confirmPassword')?.toString() as string,
      token,
    };

    if (input.password != input.confirmPassword) return Notification.error('password and confirm password mismatch');

    onResetPassword({
      password: input.password,
      token,
    });
  };


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
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Reset Password
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          id="confirmPassword"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 2 }}
          disabled={loading}
        >
          Reset Password
          {
            loading && <CircularProgress sx={{ mx: 2 }} size={18} color="inherit" />
          }
        </Button>

      </Box>
    </Box>
  </Container>
}