import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getScamDetail, selectScam } from '../../store/scam.slice';
import { format, formatDistance, parseISO } from 'date-fns';
import ScamCommentList from './ScamCommentList';
import config from '../../config';

export default function ScamDetail() {

  const dispatch = useAppDispatch();
  const params = useParams();
  const scam = useAppSelector(selectScam)

  useEffect(() => {
    const scamId = params.scamId;

    if (scamId) dispatch(getScamDetail(scamId));

  }, []);

  return <Container>
    {scam.loading && "Loading..."}
    {
      scam.selected &&
      <div>
        <Typography variant="h2">
          {scam.selected.scamType}
        </Typography>
        <Typography color="text.secondary">
          {format(parseISO(scam.selected.createdAt), 'EEE, dd MMM yyyy hh:mm aa')} - {formatDistance(parseISO(scam.selected.createdAt), new Date(), { addSuffix: true })}
        </Typography>

        <hr />

        <Typography sx={{ mb: 1.5 }}>
          {scam.selected.scamContent}
        </Typography>
        <Typography sx={{ mb: 1.5 }}>
          {scam.selected.explanation}
        </Typography>

        <Box>
          <Typography>
            {scam.selected.pseudonumUsed}
          </Typography>
          <Typography>
            {scam.selected.fraudulentWebsite}
          </Typography>
          <Typography>
            {scam.selected.fraudulentEmail}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant='h5'>
            Attachments
          </Typography>
          {scam.selected.media.length < 1 && <Typography color="text.secondary">No Attachments Found!</Typography>}
          <ImageList cols={3} rowHeight={180}>
            {scam.selected.media.filter( m => m.endsWith('.png') || m.endsWith('.jpg') || m.endsWith('.jpeg') ).map((media, idx) => (
              <ImageListItem key={`upload-img-${idx}`} component="a" href={`${config.BASEURL}${media}`} target="_blank">
                <img
                  src={`${config.BASEURL}${media}`}
                  srcSet={`${config.BASEURL}${media}`}
                  alt={`upload-img-${media}`}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>

          <ul>
          {
            scam.selected.media.filter(m => !m.endsWith('.png') && !m.endsWith('.jpg') && !m.endsWith('.jpeg')).map((media, idx) => (
              <li key={idx}> <a href={`${config.BASEURL}${media}`} target="_blank" >{media}</a> </li>
            ))
          }            
          </ul>


        </Box>
      </div>
    }
    {
      scam.error &&
      <Typography color="error">
        Error: {scam.error.message}
      </Typography>
    }

    {
      scam.selected &&
      params.scamId &&
      <ScamCommentList scamId={params.scamId} />
    }


  </Container>
}