import React, { createRef, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InputLabel from '@mui/material/InputLabel';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchScamTypes, getScamDetail, selectScam, updateScam } from '../../store/scam.slice';
import { selectAuth } from '../../store/auth.slice';
import { updateScamSchema } from '../validation.schema';
import { Notification } from '../../notification.helper';
import { Role } from '../../constants';

export default function EditScam() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const formRef = createRef();

  const [uploadFiles, setUploadFiles] = useState<File[] | null>(null);
  const [errors, setErrors] = useState<any>(undefined);

  const scam = useAppSelector(selectScam);
  const auth = useAppSelector(selectAuth);

  useEffect(() => {

    dispatch(fetchScamTypes());
    const scamId = params.scamId;
    if (scamId) dispatch(getScamDetail(scamId));

  }, []);

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

  const navigateToScamPage = () => {
    navigate(-1)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const inputData = Object.fromEntries(formData);

      inputData['userEmail'] = scam.selected?.userEmail || auth.user?.email || '';
    
      await updateScamSchema.validate(inputData);
  
      const scamData = new FormData();
      uploadFiles?.forEach(file => {
        scamData.append('files', file);
      });
  
      Object.entries(inputData).forEach(([key, value]) => {
        scamData.append(key, value);
      })

      const scamId = params.scamId;
      if (scamId)  
        dispatch(updateScam(scamId, scamData, navigateToScamPage));

    } catch (error: any) {
      Notification.error(error.message);
      setErrors(error);
    }

  };


  return <Container>

    {
      scam.loading && <Typography color="text.secondary"> Loading... </Typography>
    }

    {
      !scam.loading &&
      scam.selected &&
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
            Edit Scam
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} ref={formRef}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  disabled
                  id="userEmail"
                  label="Your Email Address"
                  name="userEmail"
                  autoComplete="email"
                  defaultValue={scam.selected.userEmail}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="scamType">Select Scam</InputLabel>
                  <Select
                    id="scamType"
                    name="scamType"
                    label="Select Scam"
                    defaultValue={scam.selected.scamType}
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
                  defaultValue={scam.selected.pseudonumUsed}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="fraudulentEmail"
                  label="Fraudulent Email Address"
                  name="fraudulentEmail"
                  defaultValue={scam.selected.fraudulentEmail}
                />
              </Grid>

              <Grid item xs={12} >
                <TextField
                  name="fraudulentWebsite"
                  fullWidth
                  id="fraudulentWebsite"
                  label="Url / Fraudulent website"
                  defaultValue={scam.selected.fraudulentWebsite}
                />
              </Grid>

              <Grid item xs={12} >
                <TextField
                  name="phoneNumber"
                  fullWidth
                  id="phoneNumber"
                  label="Phone linked to the scam"
                  defaultValue={scam.selected.phoneNumber}
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
                  defaultValue={scam.selected.scamContent}
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
                  defaultValue={scam.selected.explanation}
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel id="sell-purchase-related-input-label"></InputLabel>
                <FormControl>
                  <FormLabel id="sellPurchaseRelated">Is this report related to a purchase or use of the service ?</FormLabel>
                  <RadioGroup
                    aria-labelledby="sellPurchaseRelated"
                    defaultValue={scam.selected.sellPurchaseRelated}
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
                      uploadFiles.map((file, idx) => <p key={`upload-file-${idx}`}> File: {file.name} </p>)
                    }
                  </div>
                </Grid>

              </Grid>

            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Container>

    }

  </Container>

}