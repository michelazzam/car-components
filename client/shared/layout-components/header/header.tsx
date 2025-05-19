import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import UseAuth from "@/api-hooks/useAuth";
import { useGetUsdRate } from "@/api-hooks/usdRate/use-get-usdRate";
import UsdRateModal from "@/components/pages/navbar/UsdRateModal";
import { useLogoutUser } from "@/hooks/useLogoutUser";
import BackupDBModal from "@/components/pages/navbar/BackupDB";
import { connect } from "react-redux";
import { ThemeChanger } from "@/shared/redux/action";
import store from "@/shared/redux/store";
import UpdatesButton from "./UpdatesButton";
import { MdOutlineBackup } from "react-icons/md";
import { useGetCaisse } from "@/api-hooks/caisse/use-get-caisse";
import OpenCloseCaisseModal from "@/components/pages/navbar/OpenCloseCaisseModal";
import { cn } from "@/utils/cn";

const Header = ({ local_varaiable, ThemeChanger }: any) => {
  const { user } = UseAuth();
  const { data } = useGetUsdRate();
  const canReadCaisse = user?.permissions?.Accounting?.read;
  const canOpenCloseCaisse = user?.permissions?.Accounting?.update;
  const isAdmin = user?.role === "admin" || user?.role === "superAmsAdmin";
  const { data: caisseStatus } = useGetCaisse();
  //----------------------- HOOKS -------------------
  const logout = useLogoutUser();

  //full screen
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const element = document.documentElement;
    if (!document.fullscreenElement) {
      // Enter fullscreen mode
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", fullscreenChangeHandler);

    return () => {
      document.removeEventListener("fullscreenchange", fullscreenChangeHandler);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const windowObject = window;
      if (windowObject.innerWidth <= 991) {
        ThemeChanger({ ...local_varaiable, dataToggled: "close" });
      } else {
        ThemeChanger({ ...local_varaiable, dataToggled: "" });
      }
    };
    handleResize(); // Check on component mount
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function menuClose() {
    const theme = store.getState();
    if (window.innerWidth <= 992) {
      ThemeChanger({ ...theme, dataToggled: "close" });
    }
    if (window.innerWidth >= 992) {
      ThemeChanger({
        ...theme,
        dataToggled: local_varaiable.dataToggled
          ? local_varaiable.dataToggled
          : "",
      });
      // local_varaiable.dataHeaderStyles == 'dark' ? 'light' : 'dark',
    }
  }

  const toggleSidebar = () => {
    const theme = store.getState();
    let sidemenuType = theme.dataNavLayout;
    if (window.innerWidth >= 992) {
      if (sidemenuType === "vertical") {
        let verticalStyle = theme.dataVerticalStyle;
        const navStyle = theme.dataNavStyle;
        switch (verticalStyle) {
          // closed
          case "closed":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.dataToggled === "close-menu-close") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "close-menu-close" });
            }
            break;
          // icon-overlay
          case "overlay":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.dataToggled === "icon-overlay-close") {
              ThemeChanger({ ...theme, dataToggled: "", iconOverlay: "" });
            } else {
              if (window.innerWidth >= 992) {
                ThemeChanger({
                  ...theme,
                  dataToggled: "icon-overlay-close",
                  iconOverlay: "",
                });
              }
            }
            break;
          // icon-text
          case "icontext":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.dataToggled === "icon-text-close") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "icon-text-close" });
            }
            break;
          // doublemenu
          case "doublemenu":
            ThemeChanger({ ...theme, dataNavStyle: "" });
            ThemeChanger({ ...theme, dataNavStyle: "" });
            if (theme.dataToggled === "double-menu-open") {
              ThemeChanger({ ...theme, dataToggled: "double-menu-close" });
            } else {
              let sidemenu = document.querySelector(".side-menu__item.active");
              if (sidemenu) {
                ThemeChanger({ ...theme, dataToggled: "double-menu-open" });
                if (sidemenu.nextElementSibling) {
                  sidemenu.nextElementSibling.classList.add(
                    "double-menu-active"
                  );
                } else {
                  ThemeChanger({ ...theme, dataToggled: "" });
                }
              }
            }
            // doublemenu(ThemeChanger);
            break;
          // detached
          case "detached":
            if (theme.dataToggled === "detached-close") {
              ThemeChanger({ ...theme, dataToggled: "", iconOverlay: "" });
            } else {
              ThemeChanger({
                ...theme,
                dataToggled: "detached-close",
                iconOverlay: "",
              });
            }

            break;

          // default
          case "default":
            ThemeChanger({ ...theme, dataToggled: "" });
        }
        switch (navStyle) {
          case "menu-click":
            if (theme.dataToggled === "menu-click-closed") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "menu-click-closed" });
            }
            break;
          // icon-overlay
          case "menu-hover":
            if (theme.dataToggled === "menu-hover-closed") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "menu-hover-closed" });
            }
            break;
          case "icon-click":
            if (theme.dataToggled === "icon-click-closed") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "icon-click-closed" });
            }
            break;
          case "icon-hover":
            if (theme.dataToggled === "icon-hover-closed") {
              ThemeChanger({ ...theme, dataToggled: "" });
            } else {
              ThemeChanger({ ...theme, dataToggled: "icon-hover-closed" });
            }
            break;
        }
      }
    } else {
      if (theme.dataToggled === "close") {
        ThemeChanger({ ...theme, dataToggled: "open" });

        setTimeout(() => {
          if (theme.dataToggled == "open") {
            const overlay = document.querySelector("#responsive-overlay");

            if (overlay) {
              overlay.classList.add("active");
              overlay.addEventListener("click", () => {
                const overlay = document.querySelector("#responsive-overlay");

                if (overlay) {
                  overlay.classList.remove("active");
                  menuClose();
                }
              });
            }
          }

          window.addEventListener("resize", () => {
            if (window.screen.width >= 992) {
              const overlay = document.querySelector("#responsive-overlay");

              if (overlay) {
                overlay.classList.remove("active");
              }
            }
          });
        }, 100);
      } else {
        ThemeChanger({ ...theme, dataToggled: "close" });
      }
    }
  };

  useEffect(() => {
    const navbar = document?.querySelector(".header");
    const navbar1 = document?.querySelector(".app-sidebar");
    const sticky: any = navbar?.clientHeight;
    // const sticky1 = navbar1.clientHeight;

    function stickyFn() {
      if (window.pageYOffset >= sticky) {
        navbar?.classList.add("sticky-pin");
        navbar1?.classList.add("sticky-pin");
      } else {
        navbar?.classList.remove("sticky-pin");
        navbar1?.classList.remove("sticky-pin");
      }
    }

    window.addEventListener("scroll", stickyFn);
    window.addEventListener("DOMContentLoaded", stickyFn);

    // Cleanup event listeners when the component unmounts
    return () => {
      window.removeEventListener("scroll", stickyFn);
      window.removeEventListener("DOMContentLoaded", stickyFn);
    };
  }, []);

  return (
    <Fragment>
      <div className="app-header">
        <nav className="main-header !h-[3.75rem]" aria-label="Global">
          <div className="main-header-container ps-[0.725rem] pe-[1rem] ">
            <div className="header-content-left">
              <div
                className="header-element md:px-[0.325rem] !items-center"
                onClick={() => {
                  toggleSidebar();
                }}
              >
                <Link
                  aria-label="Hide Sidebar"
                  className="`sidemenu`-toggle animated-arrow  hor-toggle horizontal-navtoggle inline-flex items-center"
                  href="#!"
                >
                  <span></span>
                </Link>
              </div>
              <UpdatesButton />
            </div>
            <div className="header-content-right">
              {canReadCaisse && (
                <button
                  className="flex items-center ms-2 font-medium"
                  data-hs-overlay={
                    canOpenCloseCaisse ? "#open-close-caisse" : undefined
                  }
                >
                  <div
                    className={cn(
                      "border  p-2 rounded-md   hover:text-white",
                      caisseStatus?.isCaisseOpen
                        ? "border-danger text-danger hover:bg-danger"
                        : "border-primary text-primary hover:bg-primary"
                    )}
                  >
                    {canOpenCloseCaisse
                      ? caisseStatus?.isCaisseOpen
                        ? "Close "
                        : "Open "
                      : ""}
                    {"Caisse "}: {caisseStatus?.caisse}$
                  </div>
                </button>
              )}
              <button
                className="flex items-center ms-2 font-medium"
                data-hs-overlay="#edit-rate"
              >
                <div className="border text-primary p-2 rounded-md border-primary hover:bg-primary hover:text-white">
                  <span>1$=</span>
                  <span>{data?.usdRate}</span>
                </div>
              </button>

              <div className="header-element header-fullscreen py-[1rem] md:px-[0.65rem] px-2">
                <Link
                  aria-label="anchor"
                  onClick={() => toggleFullscreen()}
                  href="#!"
                  className="inline-flex flex-shrink-0 justify-center items-center gap-2  !rounded-full font-medium dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                >
                  {isFullscreen ? (
                    <i className="bx bx-exit-fullscreen full-screen-close header-link-icon"></i>
                  ) : (
                    <i className="bx bx-fullscreen full-screen-open header-link-icon"></i>
                  )}
                </Link>
              </div>
              {isAdmin && (
                <button data-hs-overlay="#backup-db-modal">
                  <MdOutlineBackup size={27} />
                </button>
              )}
              <div className="header-element md:!px-[0.65rem] px-2 !items-center [--placement:bottom-left]">
                <div className="md:block hidden dropdown-profile me-3">
                  <p className="font-semibold mb-0 leading-none text-[#536485] text-[0.813rem] ">
                    {user?.username}
                  </p>
                  <span className="opacity-[0.7] font-normal text-[#536485] block text-[0.6875rem] ">
                    {user?.role}
                  </span>
                </div>
                <button
                  className={`ti-btn ti-btn-primary-full ti-btn-wave rounded-md`}
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <UsdRateModal triggerModalId={"edit-rate"} title={"Edit Rate"} />
      <BackupDBModal />
      <OpenCloseCaisseModal
        triggerModalId={"open-close-caisse"}
        title={caisseStatus?.isCaisseOpen ? "Close Caisse" : "Open Caisse"}
      />
    </Fragment>
  );
};

const mapStateToProps = (state: any) => ({
  local_varaiable: state,
});
export default connect(mapStateToProps, { ThemeChanger })(Header);
