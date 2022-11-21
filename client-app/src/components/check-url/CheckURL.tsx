import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { checkScam, CheckScamResult } from '../../services/scam.service';
import { useState } from 'react';

const validurlregex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

export default function CheckURL() {

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [scamResult, setScamResult] = useState<CheckScamResult | undefined>(undefined);

  const validate = (input: string) => {
    const validurl = validurlregex.test(input);
    if (!validurl) throw new Error('Please input valid url eg. https://app.domain.com');
  }

  const checkScamAsync = async (url: string) => {
    const result = await checkScam(url);
    setScamResult(result.data);
  }

  const handleSubmit = (event: any) => {
    try {
      setLoading(true);
      validate(url);
      checkScamAsync(url);

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    if (error) setError(undefined);
  };

  return <Box>
      <TextField
        id="url"
        label="Check Scam URL"
        variant="outlined"
        value={url}
        onChange={handleChange}
        error={Boolean(error)}
        helperText={error}
        fullWidth
        InputProps={{
          endAdornment: <Button onClick={handleSubmit} style={{ position: 'relative', left: '13px', height: '60px', width: '140px' }} variant='contained' disabled={loading} > {loading ? <CircularProgress color="inherit" size={24} /> : "Search"} </Button>
        }}
      />
      <br />
      {
        scamResult ?
          scamResult.threat == 0 ?
            <Typography color="success" component="span">
              is a trustworthy URL
            </Typography>
            :
            <Typography color="error" component="span">
              is not a trustworthy URL
            </Typography>
          :
          ""
      }
  </Box>
}
