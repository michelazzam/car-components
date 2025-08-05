import { useRouter } from "next/navigation";
import React, { Fragment } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiValidations } from "@/lib/apiValidations";
import TextFieldControlled from "../../components/admin/FormControlledFields/TextFieldControlled";
import { cn } from "@/utils/cn";
import bg from "../../../client/public/assets/images/signin_img.jpeg";
import { useValidateToken } from "@/api-hooks/ams/useValidateLicense";

const NoLicensePage = () => {
  let router = useRouter();

  const { mutate: validateToken, isPending } = useValidateToken();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(apiValidations.validateToken),
    defaultValues: {
      token: "",
    },
  });

  const onSubmit = (data: { token: string }) => {
    validateToken(
      {
        token: data.token,
      },
      {
        onSuccess: () => router.push("/"),
      }
    );
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
          <div className="w-[80%] sm:w-[70%] md:w-[60%]  lg:w-[50%] xl:w-[40%] xxl:w-[30%] ">
            <div className="box !p-[2rem]">
              <div
                className="box-body "
                role="tabpanel"
                id="pills-with-brand-color-01"
                aria-labelledby="pills-with-brand-color-item-1"
              >
                <p className="h5 font-semibold mb-2 text-center">
                  License Activation
                </p>

                <form onSubmit={handleSubmit(onSubmit, onError)}>
                  <div>
                    <TextFieldControlled
                      control={control}
                      dontCapitalize
                      name="token"
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxx..."
                      label="Token"
                      colSpan={12}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className={cn(
                      "ti-btn ti-btn-primary w-full",
                      isPending
                        ? " !bg-light !text-primary"
                        : "!bg-primary !text-white hover:bg-opacity-80"
                    )}
                  >
                    {isPending ? "Validating..." : "Validate"}
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

export default NoLicensePage;
