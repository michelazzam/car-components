import React, { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SimpleBar from "simplebar-react";
import Menuloop from "./menuloop";

import useMenuItems from "./useMenuItems";
import Image from "next/image";

const Sidebar = ({ local_varaiable }: any) => {
  const location = useRouter();

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

  useEffect(() => {
    // Select the target element
    const targetElement = document.documentElement;

    // Create a MutationObserver instance
    const observer = new MutationObserver(handleAttributeChange);

    // Configure the observer to watch for attribute changes
    const config = { attributes: true };

    // Start observing the target element
    observer.observe(targetElement, config);
    let currentPath = location.pathname.endsWith("/")
      ? location.pathname.slice(0, -1)
      : location.pathname;
    if (currentPath !== previousUrl) {
      setMenuUsingUrl(currentPath);
      setPreviousUrl(currentPath);
    }
  }, [location]);

  function closeMenu() {
    const closeMenudata = (items: any) => {
      items?.forEach((item: any) => {
        item.active = false;
        closeMenudata(item.children);
      });
    };
    closeMenudata(MenuItems);
    // setMenuItems((arr: any) => [...arr]);
  }

  function menuClose() {
    // const theme = store.getState();
    if (window.innerWidth <= 992) {
      // ThemeChanger({ ...theme, dataToggled: "close" });
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

  function switcherArrowFn(): void {
    // Used to remove is-expanded class and remove class on clicking arrow buttons
    function slideClick(): void {
      const slide = document.querySelectorAll<HTMLElement>(".slide");
      const slideMenu = document.querySelectorAll<HTMLElement>(".slide-menu");

      slide.forEach((element) => {
        if (element.classList.contains("is-expanded")) {
          element.classList.remove("is-expanded");
        }
      });

      slideMenu.forEach((element) => {
        if (element.classList.contains("open")) {
          element.classList.remove("open");
          element.style.display = "none";
        }
      });
    }

    slideClick();
  }

  function slideRight(): void {
    const menuNav = document.querySelector<HTMLElement>(".main-menu");
    const mainContainer1 = document.querySelector<HTMLElement>(".main-sidebar");

    if (menuNav && mainContainer1) {
      const marginLeftValue = Math.ceil(
        Number(
          window.getComputedStyle(menuNav).marginInlineStart.split("px")[0]
        )
      );
      const marginRightValue = Math.ceil(
        Number(window.getComputedStyle(menuNav).marginInlineEnd.split("px")[0])
      );
      const check = menuNav.scrollWidth - mainContainer1.offsetWidth;
      let mainContainer1Width = mainContainer1.offsetWidth;

      if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
        if (!(local_varaiable.dataVerticalStyle.dir === "rtl")) {
          if (Math.abs(check) > Math.abs(marginLeftValue)) {
            menuNav.style.marginInlineEnd = "0";

            if (
              !(
                Math.abs(check) >
                Math.abs(marginLeftValue) + mainContainer1Width
              )
            ) {
              mainContainer1Width = Math.abs(check) - Math.abs(marginLeftValue);
              const slideRightButton =
                document.querySelector<HTMLElement>("#slide-right");
              if (slideRightButton) {
                slideRightButton.classList.add("hidden");
              }
            }

            menuNav.style.marginInlineStart =
              Number(menuNav.style.marginInlineStart.split("px")[0]) -
              Math.abs(mainContainer1Width) +
              "px";

            const slideRightButton =
              document.querySelector<HTMLElement>("#slide-right");
            if (slideRightButton) {
              slideRightButton.classList.remove("hidden");
            }
          }
        } else {
          if (Math.abs(check) > Math.abs(marginRightValue)) {
            menuNav.style.marginInlineEnd = "0";

            if (
              !(
                Math.abs(check) >
                Math.abs(marginRightValue) + mainContainer1Width
              )
            ) {
              mainContainer1Width =
                Math.abs(check) - Math.abs(marginRightValue);
              const slideRightButton =
                document.querySelector<HTMLElement>("#slide-right");
              if (slideRightButton) {
                slideRightButton.classList.add("hidden");
              }
            }

            menuNav.style.marginInlineStart =
              Number(menuNav.style.marginInlineStart.split("px")[0]) -
              Math.abs(mainContainer1Width) +
              "px";

            const slideLeftButton =
              document.querySelector<HTMLElement>("#slide-left");
            if (slideLeftButton) {
              slideLeftButton.classList.remove("hidden");
            }
          }
        }
      }

      const element = document.querySelector<HTMLElement>(
        ".main-menu > .slide.open"
      );
      const element1 = document.querySelector<HTMLElement>(
        ".main-menu > .slide.open > ul"
      );
      if (element) {
        element.classList.remove("active");
      }
      if (element1) {
        element1.style.display = "none";
      }
    }

    switcherArrowFn();
  }

  function slideLeft(): void {
    const menuNav = document.querySelector<HTMLElement>(".main-menu");
    const mainContainer1 = document.querySelector<HTMLElement>(".main-sidebar");

    if (menuNav && mainContainer1) {
      const marginLeftValue = Math.ceil(
        Number(
          window.getComputedStyle(menuNav).marginInlineStart.split("px")[0]
        )
      );
      const marginRightValue = Math.ceil(
        Number(window.getComputedStyle(menuNav).marginInlineEnd.split("px")[0])
      );
      const check = menuNav.scrollWidth - mainContainer1.offsetWidth;
      let mainContainer1Width = mainContainer1.offsetWidth;

      if (menuNav.scrollWidth > mainContainer1.offsetWidth) {
        if (!(local_varaiable.dataVerticalStyle.dir === "rtl")) {
          if (Math.abs(check) <= Math.abs(marginLeftValue)) {
            menuNav.style.marginInlineStart = "0px";
          }
        } else {
          if (Math.abs(check) > Math.abs(marginRightValue)) {
            menuNav.style.marginInlineStart = "0";

            if (
              !(
                Math.abs(check) >
                Math.abs(marginRightValue) + mainContainer1Width
              )
            ) {
              mainContainer1Width =
                Math.abs(check) - Math.abs(marginRightValue);
              const slideRightButton =
                document.querySelector<HTMLElement>("#slide-right");
              if (slideRightButton) {
                slideRightButton.classList.add("hidden");
              }
            }

            menuNav.style.marginInlineStart =
              Number(menuNav.style.marginInlineStart.split("px")[0]) -
              Math.abs(mainContainer1Width) +
              "px";

            const slideLeftButton =
              document.querySelector<HTMLElement>("#slide-left");
            if (slideLeftButton) {
              slideLeftButton.classList.remove("hidden");
            }
          }
        }
      }

      const element = document.querySelector<HTMLElement>(
        ".main-menu > .slide.open"
      );
      const element1 = document.querySelector<HTMLElement>(
        ".main-menu > .slide.open > ul"
      );
      if (element) {
        element.classList.remove("active");
      }
      if (element1) {
        element1.style.display = "none";
      }
    }

    switcherArrowFn();
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
  let hasParent = false;
  let hasParentLevel = 0;

  function setSubmenu(event: any, targetObject: any, menuitems: any) {
    // if ((window.screen.availWidth <= 992 || theme.dataNavStyle != "icon-hover") && (window.screen.availWidth <= 992 || theme.dataNavStyle != "menu-hover")) {
    if (!event?.ctrlKey) {
      for (const item of menuitems) {
        if (item === targetObject) {
          item.active = true;
          item.selected = true;
          // setMenuAncestorsActive(MENUITEMS,item);
          setMenuAncestorsActive(item);
        } else if (!item.active && !item.selected) {
          item.active = false; // Set active to false for items not matching the target
          item.selected = false; // Set active to false for items not matching the target
        } else {
          // removeActiveOtherMenus(MENUITEMS,item);
          removeActiveOtherMenus(item);
        }
        if (item.children && item.children.length > 0) {
          setSubmenu(event, targetObject, item.children);
        }
      }

      //   }
    }

    // setMenuItems((arr: any) => [...arr]);
  }

  function getParentObject(obj: any, childObject: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (
          typeof obj[key] === "object" &&
          JSON.stringify(obj[key]) === JSON.stringify(childObject)
        ) {
          return obj; // Return the parent object
        }
        if (typeof obj[key] === "object") {
          const parentObject: any = getParentObject(obj[key], childObject);
          if (parentObject !== null) {
            return parentObject;
          }
        }
      }
    }
    return null; // Object not found
  }

  function setMenuAncestorsActive(targetObject: any) {
    const parent = getParentObject(MenuItems, targetObject);
    // const theme = store.getState();
    if (parent) {
      if (hasParentLevel > 2) {
        hasParent = true;
      }
      parent.active = true;
      parent.selected = true;
      hasParentLevel += 1;
      setMenuAncestorsActive(parent);
    } else if (!hasParent) {
      // if (theme.dataVerticalStyle == "doublemenu") {
      //   ThemeChanger({ ...theme, dataToggled: "double-menu-close" });
      // }
    }
  }

  function removeActiveOtherMenus(item: any) {
    if (item) {
      if (Array.isArray(item)) {
        for (const val of item) {
          val.active = false;
          val.selected = false;
        }
      }
      item.active = false;
      item.selected = false;

      if (item.children && item.children.length > 0) {
        removeActiveOtherMenus(item.children);
      }
    } else {
    }
  }

  function setMenuUsingUrl(currentPath: any) {
    hasParent = false;
    hasParentLevel = 1;
    // Check current url and trigger the setSidemenu method to active the menu.
    const setSubmenuRecursively = (items: any) => {
      items?.forEach((item: any) => {
        if (item.path == "") {
        } else if (item.path === currentPath) {
          setSubmenu(null, item, MenuItems);
        }
        setSubmenuRecursively(item.children);
      });
    };
    setSubmenuRecursively(MenuItems);
  }
  const [previousUrl, setPreviousUrl] = useState("/");

  const Sideclick = () => {
    if (window.innerWidth > 992) {
      let html = document.documentElement;
      if (html.getAttribute("icon-overlay") != "open") {
        html.setAttribute("icon-overlay", "open");
      }
    }
  };

  function handleAttributeChange(mutationsList: any) {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-nav-layout"
      ) {
        const newValue = mutation.target.getAttribute("data-nav-layout");
        if (newValue == "vertical") {
          let currentPath = location.pathname.endsWith("/")
            ? location.pathname.slice(0, -1)
            : location.pathname;
          currentPath = !currentPath ? "/dashboard/ecommerce" : currentPath;
          setMenuUsingUrl(currentPath);
        } else {
          closeMenu();
        }
      }
    }
  }

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
                alt="ams-logo"
                src="/assets/images/ams.ico"
              />
            </Link>
          </div>
        </div>

        <div className="main-sidebar " id="sidebar-scroll">
          <SimpleBar>
            <nav className="main-menu-container nav nav-pills flex-column sub-open">
              <div
                className="slide-left"
                id="slide-left"
                onClick={() => {
                  slideLeft();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7b8191"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
                </svg>
              </div>

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

              <div
                className="slide-right"
                onClick={() => {
                  slideRight();
                }}
                id="slide-right"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7b8191"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
                </svg>
              </div>
            </nav>
          </SimpleBar>
        </div>
      </aside>
    </Fragment>
  );
};

export default Sidebar;
