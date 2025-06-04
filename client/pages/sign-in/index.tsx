import { useRouter } from "next/navigation";
import React, { Fragment, useEffect } from "react";
import { useLoginUser } from "@/api-hooks/auth/useLoginUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations } from "@/lib/apiValidations";
import TextFieldControlled from "../../components/admin/FormControlledFields/TextFieldControlled";
import PasswordFieldControlled from "../../components/admin/FormControlledFields/PasswordFieldControlled";
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
              <div
                className="box-body "
                role="tabpanel"
                id="pills-with-brand-color-01"
                aria-labelledby="pills-with-brand-color-item-1"
              >
                <p className="h5 font-semibold mb-2 text-center">Sign In</p>

                <form onSubmit={handleSubmit(onSubmit, onError)} className="">
                  <div>
                    <TextFieldControlled
                      control={control}
                      dontCapitalize
                      name="username"
                      label="User Name"
                      colSpan={12}
                    />
                    <PasswordFieldControlled
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
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={"https://advanced-meta.com/"}
                className="flex items-center justify-center flex-wrap"
              >
                Designed & Developed by{" "}
                <span className="text-[#0076FA] mx-1">
                  <b> Advanced Meta Solutions</b>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Firebaselogin;
