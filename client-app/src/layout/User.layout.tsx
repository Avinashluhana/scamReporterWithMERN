import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from '../app/hooks';
import Topnav from '../components/top-nav/Topnav';
import { selectAuth } from '../store/auth.slice';

export default function UserLayout() {
  
  const auth = useAppSelector(selectAuth);

  if (auth.isAuthenticated) return <Navigate to='/app' replace />;

  return <>
    <Topnav />
    <Outlet />
  </>
}