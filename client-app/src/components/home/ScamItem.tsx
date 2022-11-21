import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { Scam } from "../../store/scam.slice";
import config from '../../config';


export default function ScamItem({ id, scamType, scamContent, media }: Scam) {

  const navigate = useNavigate();

  return <Card >
  <CardMedia
    component="img"
    height="140"
    image={ media.length ? config.BASEURL + media.filter( m => m.endsWith('.png') || m.endsWith('.jpg') || m.endsWith('.jpeg') )[0] : "/static/placeholder.jpeg" }
    alt="green iguana"
  />
  <CardContent>
    <Typography gutterBottom variant="h5" component="div">
      { scamType }
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ maxHeight: 180, overflow: 'hidden' }}>
      { scamContent }
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small" onClick={() => navigate(`/scams/${id}`)} >Learn More</Button>
  </CardActions>
</Card>
}