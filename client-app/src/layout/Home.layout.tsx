import { Outlet } from "react-router-dom";
import Topnav from "../components/top-nav/Topnav";

export default function HomeLayout() {
  return <>
    <Topnav />
    <Outlet />
  </>
}