import React, { Fragment, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { connect } from "react-redux";
import { ThemeChanger } from "@/shared/redux/action";

const Switcher = ({ local_varaiable, ThemeChanger }: any) => {
  useEffect(() => {
    ThemeChanger({
      ...local_varaiable,
      dir: "ltr",
      dataNavLayout: "vertical",
      dataMenuStyles: "dark",
      dataHeaderStyle: "light",
      dataToggled: "",
    });
  }, []);

  // const customstyles: any = `
  // ${
  //   local_varaiable.colorPrimaryRgb != ""
  //     ? `--primary-rgb:${local_varaiable.colorPrimaryRgb}`
  //     : ""
  // };
  // ${
  //   local_varaiable.colorPrimary != ""
  //     ? `--primary:${local_varaiable.colorPrimary}`
  //     : ""
  // };
  // ${local_varaiable.darkBg != "" ? `--dark-bg:${local_varaiable.darkBg}` : ""};
  // ${local_varaiable.bodyBg != "" ? `--body-bg:${local_varaiable.bodyBg}` : ""};
  // ${
  //   local_varaiable.inputBorder != ""
  //     ? `--input-border:${local_varaiable.inputBorder}`
  //     : ""
  // };
  // ${local_varaiable.Light != "" ? `--light:${local_varaiable.Light}` : ""};
  // `;

  return (
    <Fragment>
      <HelmetProvider>
        <Helmet>
          <html
            dir={local_varaiable.dir}
            className={local_varaiable.class}
            data-header-styles={local_varaiable.dataHeaderStyles}
            data-vertical-style={local_varaiable.dataVerticalStyle}
            data-nav-layout={local_varaiable.dataNavLayout}
            data-menu-styles={local_varaiable.dataMenuStyles}
            data-toggled={local_varaiable.dataToggled}
            data-nav-style={local_varaiable.dataNavStyle}
            hor-style={local_varaiable.horStyle}
            data-page-style={local_varaiable.dataPageStyle}
            data-width={local_varaiable.dataWidth}
            data-menu-position={local_varaiable.dataMenuPosition}
            data-header-position={local_varaiable.dataHeaderPosition}
            icon-overlay={local_varaiable.iconOverlay}
            bg-img={local_varaiable.bgImg}
            icon-text={local_varaiable.iconText}
            // loader={local_varaiable.loader}

            //Styles
            // style={customstyles}
          ></html>
        </Helmet>
      </HelmetProvider>
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  local_varaiable: state,
});

export default connect(mapStateToProps, { ThemeChanger })(Switcher);
