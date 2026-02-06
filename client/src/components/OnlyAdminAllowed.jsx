import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RouteSignin } from "../helper/RouteName";

const OnlyAdminAllowed = () => {
  const user = useSelector((state) => state.user);
  if (user && user.isLoggedin && user.user.role === "admin") {
    return <Outlet />;
  }else{
    return <Navigate to= {RouteSignin}/>
  }
};

export default OnlyAdminAllowed;
