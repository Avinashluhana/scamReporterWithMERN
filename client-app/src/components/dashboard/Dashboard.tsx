import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMyStats, fetchStats, selectDashboard } from '../../store/dashboard.slice';
import { selectAuth } from '../../store/auth.slice';
import { Role } from '../../constants';

export default function Dashboard() {

  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const dashboard = useAppSelector(selectDashboard);

  useEffect(() => {

    if (auth.user?.roles.includes(Role.ADMIN)) {
      dispatch(fetchStats());
    } else {
      dispatch(fetchMyStats())
    }

  }, []);

  return <Container sx={{ mt: 2 }}>
    {
      dashboard.loading ?
        "Loading..."
        :
        <>

          {
            auth.user?.roles.includes(Role.ADMIN)
              ?
              <Grid container spacing={2} textAlign="center" sx={{ mt: 4 }}>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant='h1' color="text.secondary" style={{ fontSize: '13rem', fontFamily: 'monospace' }} >
                      {dashboard.stats.subscribers}
                    </Typography>
                    <Typography variant='body1' color="primary.main"> Total Subscribers </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant='h1' color="text.secondary" style={{ fontSize: '13rem', fontFamily: 'monospace' }}>
                      {dashboard.stats.scams.total}
                    </Typography>
                    <Typography variant='body1' color="primary.main"> Total Scams </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant='h1' color="text.secondary" style={{ fontSize: '13rem', fontFamily: 'monospace' }}>
                      {dashboard.stats.scams.approved}
                    </Typography>
                    <Typography variant='body1' color="primary.main"> Approved Scams </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant='h1' color="text.secondary" style={{ fontSize: '13rem', fontFamily: 'monospace' }}>
                      {dashboard.stats.scams.pending}
                    </Typography>
                    <Typography variant='body1' color="primary.main"> Pending Scams </Typography>
                  </Box>
                </Grid>
              </Grid>
              :
              <Grid container spacing={2} textAlign="center" sx={{ mt: 4 }}>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant='h1' color="text.secondary" style={{ fontSize: '13rem', fontFamily: 'monospace' }} >
                      {dashboard.myStats.totalReportedScams}
                    </Typography>
                    <Typography variant='body1' color="primary.main"> My Reported Scam </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant='h1' color="text.secondary" style={{ fontSize: '13rem', fontFamily: 'monospace' }}>
                      {dashboard.myStats.isNewsSubscribed ? "YES" : "NO"}
                    </Typography>
                    <Typography variant='body1' color="primary.main"> News Letter Subscribed </Typography>
                  </Box>
                </Grid>
              </Grid>
          }
        </>
    }
  </Container>
}