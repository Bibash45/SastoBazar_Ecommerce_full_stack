import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Google = () => {
  const handleSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    console.log(token);

    axios({
      method: "POST",
      url: `http://localhost:5000/api/google-login`,
      data: { idToken: token },
    })
      .then((response) => {
        console.log("GOOGLE SIGNIN SUCCESS", response);
        // inform parent component
      })
      .catch((error) => {
        console.log("GOOGLE SIGNIN ERROR", error.response);
      });
  };

  return (
    <div className="pb-3">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default Google;
