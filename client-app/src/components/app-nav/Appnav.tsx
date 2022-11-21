import React, { createRef } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { dologout, selectAuth } from '../../store/auth.slice';
import { Role } from '../../constants';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import TuneIcon from '@mui/icons-material/Tune';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import { Search, SearchIconWrapper, StyledInputBase } from '../search/Search';
import { shortName } from '../../util/helper';
import Divider from '@mui/material/Divider';
import { setSearch } from '../../store/scam.slice';
import config from '../../config';

export default function Appnav() {

  const auth = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(dologout());
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      const search = (event.target as any).value;
      dispatch(setSearch(search));
      navigate(`/scams?search=${search}`)
    }
  }

  return <AppBar
    position="static"
    color="primary"
    elevation={0}
    sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
  >
    <Toolbar sx={{ flexWrap: 'wrap' }}>
      <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
        <Link to='/' style={{ color: 'white', textDecoration: 'none' }} >
          Scam Report
        </Link>
      </Typography>


      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onKeyDown={handleKeyDown}
        />
      </Search>


      <Tooltip title={auth?.user?.fullName || 'Settings'}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar 
            sx={{ bgcolor: '#ef9a9a' }}
            alt={auth.user && shortName(auth.user.fullName) || 'alt-text'} 
            src={auth.user && config.BASEURL + auth.user.avatar || '' }
          />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem id='dashboard-menu-item' onClick={() => navigate('/app/dashboard')} >
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        {
          auth.user?.roles.includes(Role.ADMIN) &&
          <MenuItem id='users-menu-item' onClick={() => navigate('/app/admin/users')} >
            <ListItemIcon>
              <ManageAccountsIcon fontSize="small" />
            </ListItemIcon>
            Manage Users
          </MenuItem>
        }
        {
          auth.user?.roles.includes(Role.ADMIN) &&
          <MenuItem id='users-menu-item' onClick={() => navigate('/app/admin/scams')} >
            <ListItemIcon>
              <TuneIcon fontSize="small" />
            </ListItemIcon>
            Manage Scam
          </MenuItem>
        }
        {
          auth.user?.roles.includes(Role.ADMIN) &&
          <MenuItem id='users-menu-item' onClick={() => navigate('/app/admin/subscribers')} >
            <ListItemIcon>
              <SubscriptionsIcon fontSize="small" />
            </ListItemIcon>
            Subscribers
          </MenuItem>
        }
        <MenuItem id='logout-menu-item' onClick={() => navigate('/app/my-scams')} >
          <ListItemIcon>
            <ListIcon fontSize="small" />
          </ListItemIcon>
          My Scams
        </MenuItem>
        <MenuItem id='support-menu-item' onClick={() => navigate('/app/support')} >
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          Support
        </MenuItem>
        <MenuItem id='profile-menu-item' onClick={() => navigate('/app/profile')} >
          <ListItemIcon>
            <AccountBoxIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem id='logout-menu-item' onClick={handleLogout} >
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Toolbar>
  </AppBar>
}