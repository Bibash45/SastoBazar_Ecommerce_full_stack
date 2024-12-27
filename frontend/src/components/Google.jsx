import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLoginMutation } from "../slices/usersApiSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { setCredentials } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import { setActiveLink, playSound } from "../slices/soundSlice";
import { toast } from "react-toastify";
import Loader from "./Loader";



const Google = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();

  const handleLinkClick = (to) => {
    dispatch(setActiveLink(to));
    dispatch(playSound("loginSound")); // Use the correct sound key here
  };

  const handleNotificationSound = () => {
    dispatch(playSound("notificationSound"));
  };

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const res = await googleLogin({ token }).unwrap();
      const user = res.user;

      dispatch(setCredentials({ ...user }));
      handleLinkClick(redirect); // Play sound and set active link
      navigate(redirect);
    } catch (error) {
      handleNotificationSound();
      toast.error(error?.data?.message || error.error);
      console.error("Login error:", error); // Log the error for debugging
    }
  };

  return (
    <>
      <div className="pb-3">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
      {isLoading && <Loader />}
    </>
  );
};

export default Google;
