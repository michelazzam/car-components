import React, { Fragment } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Switcher from "../switcher/switcher";

const Authenticationlayout = ({ children }: any) => {
  return (
    <Fragment>
      <HelmetProvider>
        <Helmet>
          <body></body>
        </Helmet>
        {children}
        <Switcher />
      </HelmetProvider>
    </Fragment>
  );
};

export default Authenticationlayout;
