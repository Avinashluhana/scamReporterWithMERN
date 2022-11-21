import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SubscribeNewsletter from '../subscribe-newsletter/SubscribeNewsletter';

import CheckURL from "../check-url/CheckURL";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useEffect } from 'react';
import { getTopScams, Scam, selectScam } from '../../store/scam.slice';
import ScamItem from './ScamItem';

const top = 10;

export default function Home() {

  const dispatch = useAppDispatch();
  const scam = useAppSelector(selectScam);


  useEffect(() => {
    dispatch(getTopScams(top, 0));
  }, [])

  return <Grid container >

    <Grid item xl={4} sx={{ mt: 4 }} >
      <Container>
        <SubscribeNewsletter />
      </Container>
    </Grid>


    <Grid item xl={12}>
      <Container>

        <Box
          sx={{
            bgcolor: 'background.paper',
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Scam Report
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Something short and leading about the collection below—its contents,
              the creator, etc. Make it short and sweet, but not too short so folks
              don&apos;t simply skip over it entirely.
            </Typography>
          </Container>
        </Box>

        <CheckURL />
      </Container>
    </Grid>


    <Container sx={{ mt: 2 }}>

      <Typography variant="h5">
        Top {top} Recent Scams
      </Typography>

      <Grid container spacing={1} sx={{ mt: 2 }}>

        {
          scam.topScams.map((item: Scam, i) => <Grid item xs={4} key={i}>
            <ScamItem {...item} />
          </Grid>)
        }

      </Grid>

    </Container>
  </Grid>
}