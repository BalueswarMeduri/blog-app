import React from "react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../helper/Firebase";
import { showToast } from "../helper/showToast";
import { useNavigate } from "react-router-dom";
import { getenv } from "../helper/getenv";
import { RouteIndex } from "../helper/RouteName";
import { useDispatch } from "react-redux";
import { setuser } from "../redux/user/user.slice";
import { useSelector } from "react-redux";

const GoogleLogin = () => {
  // for check user logged or not
  const user = useSelector((state) => state.user);
  console.log(user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlelogin = async () => {
    try {
      const googleResponse = await signInWithPopup(auth, provider);
      const user = googleResponse.user;
      const bodyData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      };
      const response = await fetch(`${getenv("BACKEND")}/auth/google-login`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });
      const data = await response.json();
      if (!response.ok) {
        showToast("error", data.message);
        console.log(data.message);
      }
      dispatch(setuser(data.newuser));
      console.log(data.newuser);
      navigate(RouteIndex);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
      console.log(error.message);
    }
  };
  return (
    <Button className="w-full cursor-pointer" onClick={handlelogin}>
      <FcGoogle />
      Continue with Google
    </Button>
  );
};

export default GoogleLogin;
