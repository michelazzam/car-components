import { useCheckLicense } from "@/api-hooks/ams/useCheckLicense";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LicenseValidatorWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading } = useCheckLicense();

  const router = useRouter();

  useEffect(() => {
    if (data) if (!data.isValid) router.push("/no-license");
  }, [data]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return <div>{children}</div>;
}
