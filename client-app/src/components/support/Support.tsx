import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getChatList, getChatMessages, getSupportUsers, selectChat, setSelectedChat, startChat } from '../../store/chat.slice';
import { MessageBox } from './MessageBox';
import { Message } from './Message';
import { IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { shortName } from '../../util/helper';
import { formatDistance, parseISO } from 'date-fns';
import { selectAuth } from '../../store/auth.slice';
import { Chat, ChatUser } from '../../services/support.service';
import { useSupportSocket } from './hooks/useSupportSocket';
import config from '../../config';


export default function Support() {

  const dispatch = useAppDispatch();
  const chatStore = useAppSelector(selectChat);
  const auth = useAppSelector(selectAuth);

  const { joinChat } = useSupportSocket();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {

    dispatch(getSupportUsers());
    dispatch(getChatList());

  }, []);

  const handleOnChatSelected = (chat: Chat) => {
    joinChat(chat.id);
    dispatch(setSelectedChat(chat));
    dispatch(getChatMessages(chat.id));
  }

  const handleStartChat = (user: ChatUser) => {
    dispatch(startChat({
      participants: [ user.id ],
    }));
  }

  const ITEM_HEIGHT = 48;

  const currentChatUser = chatStore.selected?.participants.find(p => p.id != auth.user?.sub);

  return <Grid container>

    <Grid item xs={3}>

      <Grid item display="flex" justifyContent="space-between" sx={{ mt: 1, px: 2 }}>
        <Typography variant='body1' component="h5" color="text.secondary" sx={{ mt: .8 }} >
          Chats
        </Typography>

        <div>
          <Tooltip title="Chat Add">

            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>

          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '20ch',
              },
            }}
          >
            {chatStore.users.map((user, i) => (
              <MenuItem key={user.id} onClick={() => handleStartChat(user) }>
                {user.fullName}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Grid>

      <List dense sx={{ width: '95%', bgcolor: 'background.paper' }}>
        {
          chatStore.chats.length > 0 ?
          chatStore.chats.map((chat, i) => {
          const other = chat.participants.find(p => p.id != auth.user?.sub);
          return (
            <ListItem
              key={i}
              disablePadding
            >
              <ListItemButton selected={chat.id == chatStore.selected?.id } onClick={() => handleOnChatSelected(chat) } >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#4db6ac' }} alt={shortName(other?.fullName || '')} src={config.BASEURL + other?.avatar} />
                </ListItemAvatar>
                <ListItemText primary={other?.fullName} secondary={formatDistance(parseISO(chat.createdAt), new Date(), { addSuffix: true })} />
              </ListItemButton>
            </ListItem>
          );
        })
        :
        <Typography color="text.secondary" sx={{ textAlign: 'center' }} >
          No Chats Found!
        </Typography>
        }
      </List>



    </Grid>

    <Grid item xs={9} sx={{ height: '92vh' }} display="flex" flexDirection="column-reverse" justifyContent="space-between" >

      <MessageBox />

      <Stack sx={{ overflowY: 'scroll', my: 2, mr: 2, height: '100%', flexDirection: "column-reverse" }} >

        {
          chatStore.messages.length > 0 ?
          chatStore.messages.map((msg) => <Message key={msg.id} {...msg} />)
            :
            <Typography color="text.secondary" sx={{ textAlign: 'center' }} > No Messages Found... </Typography>
        }

      </Stack>

      <Box sx={{ p: 1.6 }} bgcolor="secondary.main">
        
        <Typography variant='body2' >
          { currentChatUser? currentChatUser.fullName : "Chat not selected"  }
        </Typography>

      </Box>
    </Grid>
  </Grid>
}