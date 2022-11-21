import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { format, parseISO, formatDistance } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuth } from '../../store/auth.slice';
import { removeScam } from '../../store/scam.slice';

type InputProps = {
  id: string;
  scamType: string;
  pseudonumUsed: string;
  fraudulentWebsite: string;
  scamContent: string;
  createdAt: string;
  withEditButton: boolean;
  withDeleteButton: boolean;
}

export default function ScamItem({ id, scamType, pseudonumUsed, fraudulentWebsite, scamContent, createdAt, withEditButton, withDeleteButton }: InputProps) {

  const naviage = useNavigate();
  const dispatch = useAppDispatch();

  const handleOnReadmore = () => {
    naviage(`/scams/${id}`);
  }

  const handleEditScam = () => {
    naviage(`/scams/edit/${id}`);
  }

  const handleDeleteScam = () => {
    dispatch(removeScam(id))
  }

  return <Card elevation={2}>
    <CardContent>

      <Grid container justifyContent="space-between">
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {format(parseISO(createdAt), 'EEE, dd MMM yyyy hh:mm aa')} - {formatDistance(parseISO(createdAt), new Date(), { addSuffix: true })}
        </Typography>

        <div>
          {
            withEditButton &&
            <IconButton aria-label="edit" onClick={handleEditScam}>
              <Tooltip title="edit" placement="right">
                <EditIcon />
              </Tooltip>
            </IconButton>
          }
          {
            withDeleteButton &&
            <IconButton aria-label="delete" onClick={handleDeleteScam}>
              <Tooltip title="delete" placement="right">
                <DeleteIcon />
              </Tooltip>
            </IconButton>
          }
        </div>


      </Grid>


      <Typography variant="h5" component="div" sx={{ textTransform: 'capitalize' }}>
        <Tooltip title="scam type" placement="right">
          <span>{scamType}</span>
        </Tooltip>
      </Typography>
      <Typography sx={{ mb: 1.5 }} >
        <Tooltip title="fraudulent website" placement="right">
          <span>{fraudulentWebsite}</span>
        </Tooltip>
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary" component="small">
        <Tooltip title="pseudonum used" placement="right">
          <span> {pseudonumUsed} </span>
        </Tooltip>
      </Typography>
      <Typography variant="body2">
        <Tooltip title="scam content" placement="top">
          <span> {scamContent} </span>
        </Tooltip>
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" onClick={handleOnReadmore} >Read More</Button>
    </CardActions>
  </Card >
}