import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from '../app/hooks';
import { selectAuth } from '../store/auth.slice';

export default function AdminLayout() {

  const auth = useAppSelector(selectAuth);

  if (!auth.isAuthenticated) return <Navigate to='/user/login' replace />;
  if (!auth.user?.roles.includes('admin')) return <Navigate to='/403' replace />
  return <>
    <Outlet />
  </> 
}