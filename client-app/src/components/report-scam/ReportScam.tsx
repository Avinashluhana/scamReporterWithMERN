import React, { useState, useEffect, createRef } from 'react';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import MenuItem from '@mui/material/MenuItem';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { registerScamSchema } from '../validation.schema';
import { fetchScamTypes, registerScam, selectScam } from '../../store/scam.slice';
import { Notification } from '../../notification.helper';
import { useNavigate } from 'react-router-dom';
import { selectAuth } from '../../store/auth.slice';

export default function ReportScam() {

  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const scam = useAppSelector(selectScam);
  const formRef = createRef<HTMLFormElement>();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<any>(undefined);

  const resetForm = () => {
    formRef.current?.reset();
  }

  const navigateToScamPage = () => {
    if (auth.isAuthenticated) return navigate('/app/my-scams')
    navigate('/scams');
  }


  const [uploadFiles, setUploadFiles] = useState<File[] | null>(null);

  useEffect(() => {
    dispatch(fetchScamTypes());
  }, [])

  const handleFileChange = (event: React.FormEvent<HTMLInputElement>) => {
    const targetFiles = event.currentTarget.files;
    const totalFiles = targetFiles?.length || 0;
    const files: File[] = [];
    for (let i = 0 ; i < totalFiles; i++ ) {
      const file = event.currentTarget.files?.item(i);
      if (file) files.push(file);
    }
    setUploadFiles(files);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const inputData = Object.fromEntries(formData);

      if (auth.isAuthenticated && auth.user) inputData['userEmail'] = auth.user.email;
    
      await registerScamSchema.validate(inputData);
  
      const scamData = new FormData();
      uploadFiles?.forEach(file => {
        scamData.append('files', file);
      });

      inputData['subscribeNewsLetter'] = inputData['subscribeNewsLetter'] === 'on' ? "true": "false";
  
      Object.entries(inputData).forEach(([key, value]) => {
        scamData.append(key, value);
      })
  
      dispatch(registerScam(scamData, navigateToScamPage));
  
    } catch (error: any) {
      Notification.error(error.message);
      setErrors(error);
    }

  };

  return <>
    <Container component="main" maxWidth="sm">
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
          Report A Scam
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} ref={formRef}>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="userEmail"
                label="Your Email Address"
                name="userEmail"
                autoComplete="email"
                defaultValue={auth.user?.email}
                disabled={ auth.isAuthenticated }
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox id="subscribeNewsLetter" name="subscribeNewsLetter" color="primary" />}
                label={<small>Subscribe Newsletter</small>}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="scamType">Select Scam</InputLabel>
                <Select
                  id="scamType"
                  name="scamType"
                  label="Select Scam"
                  defaultValue={'none'}
                >
                  <MenuItem value={'none'}>=== Select Scam Type ===</MenuItem>
                  {scam.types.map(scam => <MenuItem key={scam.id} value={scam.name} >{scam.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} >
              <TextField
                name="pseudonumUsed"
                fullWidth
                id="pseudonym"
                label="Pseudonym Used by the Scammer"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="fraudulentEmail"
                label="Fraudulent Email Address"
                name="fraudulentEmail"
              />
            </Grid>

            <Grid item xs={12} >
              <TextField
                name="fraudulentWebsite"
                fullWidth
                id="fraudulentWebsite"
                label="Url / Fraudulent website"
              />
            </Grid>

            <Grid item xs={12} >
              <TextField
                name="phoneNumber"
                fullWidth
                id="phoneNumber"
                label="Phone linked to the scam"
              />
            </Grid>

            <Grid item xs={12} >
              <TextField
                name="scamContent"
                fullWidth
                multiline
                rows={4}
                id="scamContent"
                label="Content of Scam"
              />
            </Grid>

            <Grid item xs={12} >
              <TextField
                name="explanation"
                fullWidth
                multiline
                rows={4}
                id="explanation"
                label="Comment / Explanation"
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel id="sell-purchase-related-input-label"></InputLabel>
              <FormControl>
                <FormLabel id="sellPurchaseRelated">Is this report related to a purchase or use of the service ?</FormLabel>
                <RadioGroup
                  aria-labelledby="sellPurchaseRelated"
                  defaultValue="nope"
                  name="sellPurchaseRelated"
                >
                  <FormControlLabel value="nope" control={<Radio />} label="Nope" />
                  <FormControlLabel value="yes" control={<Radio />} label="Yes I have consumed" />
                  <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>

              <Grid>
                <Button
                  variant="contained"
                  component="label"
                >
                  Upload File
                  <input
                    type="file"
                    hidden
                    multiple
                    accept='application/msword, application/vnd.ms-excel, text/plain, application/pdf, image/*'
                    onChange={handleFileChange}
                  />
                </Button>
                <div style={{ maxHeight: '200px', overflow: 'hidden' }}>
                  {
                    uploadFiles &&
                    uploadFiles.length > 0 &&
                    uploadFiles.map(file => <p> File: { file.name } </p>)
                  }
                </div>
              </Grid>

            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox id="iaccept" name="iaccept" color="primary" />}
                label={<small>I accept the general conditions of use of this site</small>}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sumbit
          </Button>
        </Box>
      </Box>
    </Container>

  </>
}