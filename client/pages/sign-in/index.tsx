import { basePath } from "@/next.config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect } from "react";
import { useLoginUser } from "@/api-hooks/auth/useLoginUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations } from "@/lib/apiValidations";
import TextField from "../components/admin/FormFields/TextField";
import PasswordField from "../components/admin/FormFields/PasswordField";
import { cn } from "@/utils/cn";
import bg from "../../../client/public/assets/images/signin_img.jpeg";

const Firebaselogin = () => {
  useEffect(() => {
    import("preline");
  }, []);

  let navigate = useRouter();
  const { mutate: loginUser, isPending } = useLoginUser({
    callBackOnSuccess: () => {
      navigate.push("/");
    },
  });

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(apiValidations.Login),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: any) => {
    loginUser({
      username: data.username,
      password: data.password,
    });
  };
  const onError = (error: any) => {
    console.log(error);
  };
  return (
    <Fragment>
      <div
        className=" min-h-screen w-full bg-cover bg-center bg-no-repeat object-cover"
        style={{
          backgroundImage: `url(${bg.src})`,
          width: "100%",
          height: "100%",
        }}
      >
        <div className="flex justify-center authentication authentication-basic items-center h-full text-defaultsize text-defaulttextcolor">
          <div className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%] xxl:w-[30%] ">
            <div className="box !p-[2rem]">
              <div className="my-[2.5rem] flex justify-center">
                <Link href="/components/dashboards/crm/">
                  <img
                    src={`${
                      process.env.NODE_ENV === "production" ? basePath : ""
                    }/assets/images/brand-logos/thermobox-nobg.png`}
                    alt="logo"
                    className="desktop-logo w-20 h-20"
                  />
                  <img
                    src={`${
                      process.env.NODE_ENV === "production" ? basePath : ""
                    }/assets/images/brand-logos/thermobox-nobg.png`}
                    alt="logo"
                    className="desktop-dark"
                  />
                </Link>
              </div>

              <div
                className="box-body "
                role="tabpanel"
                id="pills-with-brand-color-01"
                aria-labelledby="pills-with-brand-color-item-1"
              >
                <p className="h5 font-semibold mb-2 text-center">Sign In</p>

                <form onSubmit={handleSubmit(onSubmit, onError)} className="">
                  <div>
                    <TextField
                      control={control}
                      name="username"
                      label="User Name"
                      colSpan={12}
                    />
                    <PasswordField
                      control={control}
                      name="password"
                      label="Password"
                      colSpan={12}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className={cn(
                      "ti-btn ti-btn-primary   w-full ",
                      isPending
                        ? " !bg-light !text-primary"
                        : "!bg-primary !text-white hover:bg-opacity-80"
                    )}
                  >
                    {isPending ? "Signing In..." : "Sign In"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Firebaselogin;
