import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { shortName } from '../../util/helper';
import { formatDistance, parseISO } from 'date-fns';
import { ChatUser } from '../../services/support.service';
import { useAppSelector } from '../../app/hooks';
import { selectAuth } from '../../store/auth.slice';
import config from '../../config';

type MessageInputProps = {
  id: string;
  content: string;
  sender: ChatUser,
  createdAt: string,
  updatedAt: string,
}

export function Message({ sender, createdAt, content }: MessageInputProps) {

  const auth = useAppSelector(selectAuth);
  const orientation = auth.user?.sub == sender.id ? 'ltr' : 'rtl';


  return orientation == 'rtl' ? <Box sx={{ mb: 2 }}>
    <Grid container>

      <Grid item >
        <Tooltip title={sender.fullName}>
          <Avatar sx={{ bgcolor: '#4db6ac' }} alt={shortName(sender.fullName)} src={config.BASEURL + sender.avatar} />
        </Tooltip>
      </Grid>

      <Grid item sx={{ ml: 1 }} xs={11} >

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography color="text.secondary" fontSize={12}>
            {createdAt && formatDistance(parseISO(createdAt), new Date(), { addSuffix: true })}
          </Typography>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Typography>
            {content}
          </Typography>
        </div>

      </Grid>
    </Grid>
  </Box>
    :
    <Box sx={{ mb: 2 }}>
      <Grid container>

        <Grid item sx={{ mr: 1, }} xs={11} >

          <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Typography color="text.secondary" fontSize={12}>
              {createdAt && formatDistance(parseISO(createdAt), new Date(), { addSuffix: true })}
            </Typography>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Typography>
              {content}
            </Typography>
          </div>

        </Grid>

        <Grid item >
          <Tooltip title={sender.fullName}>
            <Avatar sx={{ bgcolor: 'primary.main' }} alt={shortName(sender.fullName)} src={config.BASEURL + sender.avatar} />
          </Tooltip>
        </Grid>

      </Grid>
    </Box>
}