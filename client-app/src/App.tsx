import React, { useState, Suspense, lazy } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import AppLayout from './layout/App.layout';
import UserLayout from './layout/User.layout';
import AdminLayout from './layout/Admin.layout';
import HomeLayout from './layout/Home.layout';
import { selectNotification } from './store/notification.slice';
import { selectAuth } from './store/auth.slice';
import { useAppSelector } from './app/hooks';
import { Notification } from './notification.helper';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

import NotFound from './components/not-found/NotFound';
import SignIn from './components/signin/SignIn';
import Signup from './components/signup/Signup';
import Home from './components/home/Home';
import Dashboard from './components/dashboard/Dashboard';
import Users from './components/users/Users';
import ReportScam from './components/report-scam/ReportScam';
import Forbidden from './components/errors/Forbidden';
import Profile from './components/profile/Profile';
import MyScams from './components/my-scams/MyScams';
import ScamList from './components/scam-list/ScamList';
import ScamDetail from './components/scam-detail/ScamDetail';
import EditScam from './components/edit-scam/EditScam';
import Support from './components/support/Support';
import ManageScams from './components/manage-scams/ManageScams';
import SubscribersList from './components/subscribers-list/SubscribersList';
import ForgetPassword from './components/forget-password/ForgetPassword';
import ResetPassword from './components/reset-password/ResetPassword';


interface AuthProps {
  allowed: boolean;
  [x: string]: any; // capture rest of props
}

function AuthRoute({ allowed, ...rest }: AuthProps) {
  return allowed ? <Route {...rest} /> : <Navigate to="/user/login" replace />
}

function Fallback() {
  return <Backdrop
  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  open={true}
>
  <CircularProgress color="inherit" />
</Backdrop>
}

function App() {
  const auth = useAppSelector(selectAuth);
  const notification = useAppSelector(selectNotification);
  const handleClose = () => {
    Notification.close();
  }

  return (
    <div className="App">
      <Suspense fallback={<div> <Fallback /> </div>}>
        <Routes>

          <Route path='/' element={<HomeLayout />} >
            <Route index element={<Home />} />
            <Route path='report' element={<ReportScam />} />
            <Route path='scams' element={<ScamList />} />
            <Route path='scams/:scamId' element={<ScamDetail />} />
            <Route path="scams/edit/:scamId" element={<EditScam />} />
          </Route>

          <Route path="/user" element={<UserLayout />}>

            {/* default navigation when user visits /user */}
            <Route index element={<Navigate to={'login'} replace />} />

            <Route path="login" element={<SignIn />} />
            <Route path="register" element={<Signup />} />

            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />

            {/* Redirect for signin and signup to login and register respectively */}
            <Route path="signin" element={<Navigate to="/user/login" replace />} />
            <Route path="signup" element={<Navigate to="/user/register" replace />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/app" element={<AppLayout />}>

            {/* default navigation when user visits /app */}
            <Route index element={<Navigate to={'dashboard'} replace />} />

            <Route path='dashboard' element={<Dashboard />} />
            <Route path='my-scams' element={<MyScams />} />
            <Route path='profile' element={<Profile />} />
            <Route path='support' element={<Support />} />

            <Route path="admin" element={<AdminLayout />}>
              <Route path="users" element={<Users />} />
              <Route path="scams" element={<ManageScams />} />
              <Route path="subscribers" element={<SubscribersList />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="403" element={<Forbidden />} />

          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense>

      <Snackbar open={notification.open} autoHideDuration={notification.timeout} onClose={handleClose}>
        <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

    </div>
  );
}

export default App;
