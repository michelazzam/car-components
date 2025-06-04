import React, { Fragment, useEffect } from "react";
import Link from "next/link";
import SimpleBar from "simplebar-react";
import Menuloop from "./menuloop";

import useMenuItems from "./useMenuItems";
import Image from "next/image";

const Sidebar = () => {
  const MenuItems = useMenuItems();

  useEffect(() => {
    const mainContent = document.querySelector(".main-content");
    if (window.innerWidth <= 992) {
      if (mainContent) {
      } else if (
        document.documentElement.getAttribute("data-nav-layout") == "horizontal"
      ) {
        closeMenu();
      }
    }
    mainContent!.addEventListener("click", menuClose);
    window.addEventListener("resize", menuResizeFn);
  }, []);

  function closeMenu() {
    const closeMenudata = (items: any) => {
      items?.forEach((item: any) => {
        item.active = false;
        closeMenudata(item.children);
      });
    };
    closeMenudata(MenuItems);
  }

  function menuClose() {
    if (window.innerWidth <= 992) {
    }
    const overlayElement = document.querySelector(
      "#responsive-overlay"
    ) as HTMLElement | null;
    if (overlayElement) {
      overlayElement.classList.remove("active");
    }
  }

  const WindowPreSize =
    typeof window !== "undefined" ? [window.innerWidth] : [];

  function menuResizeFn() {
    if (typeof window === "undefined") {
      // Handle the case where window is not available (server-side rendering)
      return;
    }

    WindowPreSize.push(window.innerWidth);
    if (WindowPreSize.length > 2) {
      WindowPreSize.shift();
    }

    // const theme = store.getState();
    const currentWidth = WindowPreSize[WindowPreSize.length - 1];
    const prevWidth = WindowPreSize[WindowPreSize.length - 2];

    if (WindowPreSize.length > 1) {
      if (currentWidth < 992 && prevWidth >= 992) {
        // less than 992;
        console.log("Width is less than 992");
        // ThemeChanger({ ...theme, dataToggled: "close" });
      }

      if (currentWidth >= 992 && prevWidth < 992) {
        // greater than 992
        console.log("Width is greater than or equal to 992");
      }
    }
  }

  const Topup = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > 30 && document.querySelector(".app-sidebar")) {
        const Scolls = document.querySelectorAll(".app-sidebar");
        Scolls.forEach((e) => {
          e.classList.add("sticky-pin");
        });
      } else {
        const Scolls = document.querySelectorAll(".app-sidebar");
        Scolls.forEach((e) => {
          e.classList.remove("sticky-pin");
        });
      }
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", Topup);
  }

  const level = 0;

  const Sideclick = () => {
    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute("icon-overlay") != "open") {
        html.setAttribute("icon-overlay", "open");
      }
    }
  };

  return (
    <Fragment>
      <div
        id="responsive-overlay"
        onClick={() => {
          menuClose();
        }}
      ></div>
      <aside
        className="app-sidebar sticky"
        id="sidebar"
        onMouseOver={() => {}}
        onMouseLeave={() => {}}
      >
        <div className="main-sidebar-header ">
          <div className="flex items-center space-x-2">
            <Link href="/add-invoice">
              <Image
                width={30}
                height={30}
                alt="car-components-logo"
                src="/assets/images/brand-logos/logo.jpg"
              />
            </Link>
          </div>
        </div>

        <div className="main-sidebar " id="sidebar-scroll">
          <SimpleBar>
            <nav className="main-menu-container nav nav-pills flex-column sub-open">
              <ul className="main-menu" onClick={() => Sideclick()}>
                {MenuItems.map((levelone: any) => (
                  <Fragment key={Math.random()}>
                    <li
                      className={`${
                        levelone.menutitle ? "slide__category" : ""
                      } ${levelone.type === "link" ? "slide" : ""}
                       ${levelone.type === "sub" ? "slide has-sub" : ""} ${
                        levelone?.active ? "open" : ""
                      } ${levelone?.selected ? "active" : ""}`}
                    >
                      {levelone.menutitle ? (
                        <span className="category-name">
                          {levelone.menutitle}
                        </span>
                      ) : (
                        ""
                      )}
                      {levelone.type === "link" ? (
                        <Link
                          href={levelone.path + "/"}
                          className={`side-menu__item ${
                            levelone.selected ? "active" : ""
                          }`}
                        >
                          <div>{levelone.icon}</div>
                          <span className="side-menu__label">
                            {levelone.title}{" "}
                            {levelone.badgetxt ? (
                              <span className={levelone.class}>
                                {" "}
                                {levelone.badgetxt}
                              </span>
                            ) : (
                              ""
                            )}
                          </span>
                        </Link>
                      ) : (
                        ""
                      )}
                      {levelone.type === "empty" ? (
                        <Link href="#" className="side-menu__item">
                          {levelone.icon}
                          <span>
                            {" "}
                            {levelone.title}{" "}
                            {levelone.badgetxt ? (
                              <span className={levelone.class}>
                                {levelone.badgetxt}{" "}
                              </span>
                            ) : (
                              ""
                            )}
                          </span>
                        </Link>
                      ) : (
                        ""
                      )}
                      {levelone.type === "sub" ? (
                        <Menuloop MenuItems={levelone} level={level + 1} />
                      ) : (
                        ""
                      )}
                    </li>
                  </Fragment>
                ))}
              </ul>
            </nav>
          </SimpleBar>
          <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 w-full">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://advanced-meta.com/"
              className="flex items-center justify-center flex-wrap text-center text-gray-50"
            >
              Designed & Developed by{" "}
              <span className="text-[#FFC433]"> Advanced Meta Solutions</span>
            </a>
          </div>
        </div>
      </aside>
    </Fragment>
  );
};

export default Sidebar;
