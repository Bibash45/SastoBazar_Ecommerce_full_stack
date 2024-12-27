import React from "react";
import { Helmet } from "react-helmet-async";

const Meta = ({ 
  title = "SastoBazar", 
  description = "Dherai sasto pauxa kahile kahi tw free mai", 
  keywords = "Gadget, electronics, buy electronics, cheap electronics" 
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="shortcut icon" href="./images/logo2.png" />
    </Helmet>
  );
};

export default Meta;
