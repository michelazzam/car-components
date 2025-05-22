import React, { Fragment, useEffect } from "react";

const Landinglayout = ({ children }: any) => {
  useEffect(() => {
    import("preline");
  }, []);

  return (
    <Fragment>
      {children}
      <div id="responsive-overlay"></div>
    </Fragment>
  );
};

export default Landinglayout;
