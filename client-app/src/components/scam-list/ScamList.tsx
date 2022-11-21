import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ScamItem from './ScamItem';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { findScam, getUserScams, selectScam, } from '../../store/scam.slice';
import { useSearchParams } from 'react-router-dom';

type ScamListProps = {
  showMyScams?: boolean
}

export default function ScamList({ showMyScams }: ScamListProps) {

  const dispatch = useAppDispatch();
  const scams = useAppSelector(selectScam);
  const [searchParams] = useSearchParams();

  useEffect(() => {

    const search = searchParams.get('search');
    if (search) {
      dispatch(findScam({ text: search }));
      return;
    }

    if (showMyScams) {
      dispatch(getUserScams())
      return
    }
    dispatch(findScam());
  }, []);

  useEffect(() => {

    dispatch(findScam({ text: scams.search }));

  }, [scams.search])


  return <Container>

    <Grid container sx={{ mt: 2 }}>
      {scams.loading && "Loading..."}
      {!scams.loading && scams.items.length < 1 && "No Scam Found!"}
      {scams.items.map(scam => (
        <Grid key={scam.id} item xs={12} sx={{ mb: .9 }}>
          <ScamItem {...scam} withEditButton={showMyScams || false} withDeleteButton={showMyScams || false} />
        </Grid>
      )
      )}
    </Grid>
  </Container>
}