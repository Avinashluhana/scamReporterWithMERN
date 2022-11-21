import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchScamComments, ScamComment, selectScam } from '../../store/scam.slice';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import CommentBox from './CommentBox';
import { formatDistance, parseISO } from 'date-fns';
import { shortName } from '../../util/helper';
import config from '../../config';


type ScamCommentParams = {
  scamId: string;
};

function CommentItem({ content, author, createdAt }: ScamComment) {
  return <Box sx={{ mb: 2 }}>
    <Grid container>
      <Grid item >
        <Avatar alt={shortName(author.fullName)} src={config.BASEURL + author.avatar} />
      </Grid>
      <Grid item sx={{ ml: 2 }} xs={11} >

        <Grid container justifyContent="space-between" >
          <Typography>
            {author.fullName}
          </Typography>
          <Typography color="text.secondary">
            { createdAt && formatDistance(parseISO(createdAt), new Date(), { addSuffix: true }) }
          </Typography>

        </Grid>



        <Typography>
          {content}
        </Typography>
      </Grid>
    </Grid>
  </Box>
}

export default function ScamCommentList({ scamId }: ScamCommentParams) {

  const dispatch = useAppDispatch();
  const scam = useAppSelector(selectScam);

  useEffect(() => {

    dispatch(fetchScamComments(scamId));

  }, []);

  return <Box sx={{ mt: 1 }}>
    <Typography variant='h5' sx={{ mb: 2 }}>
      Comments
    </Typography>

    <CommentBox scamId={scamId} />

    {
      scam.scamComments.map(comment => <CommentItem key={comment.id} {...comment} />)
    }

    {
      scam.scamComments.length < 1 && <Typography color="text.secondary">
        No Comments Found
      </Typography>
    }

  </Box>
}