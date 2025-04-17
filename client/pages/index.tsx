"use client";
import UseAuth from "@/api-hooks/useAuth";
import { useRouter } from "next/router";
import React, { Fragment, useEffect } from "react";

const Main = () => {
  // const [loading, setLoading] = useState(true);
  const { user, isLoading } = UseAuth();
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) {
        console.log("I AM A USER");
        if (user.role === "employee") {
          router.push("/add-invoice");
        } else {
          router.push("/admin/balance");
        }
      } else {
        console.log("I AM NOT A USER");
        console.log("IS LOADING ", isLoading);
        router.push("/sign-in");
      }
      // setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [user, router]);

  const Spinner = () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
    </div>
  );
  return (
    <Fragment>
      <Spinner />
    </Fragment>
  );
};
Main.layout = "Contentlayout";

export default Main;
