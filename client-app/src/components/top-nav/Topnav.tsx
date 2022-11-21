import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAuth } from '../../store/auth.slice';
import { setSearch } from '../../store/scam.slice';
import { Search, SearchIconWrapper, StyledInputBase } from '../search/Search';


export default function Topnav() {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

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

      <nav>
        <NavLink to="/report" className={({ isActive }) => (isActive ? "link-active" : "link")}>
          Report
        </NavLink>
        <NavLink to="/scams" className={({ isActive }) => (isActive ? "link-active" : "link")}>
          Scams
        </NavLink>
        {
          !auth.isAuthenticated ?
            <NavLink to="/user/login" className={({ isActive }) => (isActive ? "link-active" : "link")}>
              Login
            </NavLink>
            :
            <NavLink to="/app/dashboard" className={({ isActive }) => (isActive ? "link-active" : "link")}>
              Dashboard
            </NavLink>
        }
      </nav>
    </Toolbar>
  </AppBar>

}