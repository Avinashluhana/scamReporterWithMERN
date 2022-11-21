import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from '../app/hooks';
import Appnav from '../components/app-nav/Appnav';
import { selectAuth } from '../store/auth.slice';

export default function AppLayout() {

  const auth = useAppSelector(selectAuth);

  if (!auth.isAuthenticated) return <Navigate to='/user/login' replace />;
  return <>
    <Appnav />
    <Outlet />
  </> 
}