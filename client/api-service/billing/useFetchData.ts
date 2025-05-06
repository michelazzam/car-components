import { Billing } from "@/pages/admin/ams/billing";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async () => {
  console.log("BILLING URL: ", process.env.NEXT_PUBLIC_BILLING_URL);
  console.log("BILLING TOKEN: ", process.env.NEXT_PUBLIC_BILLING_TOKEN);
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_BILLING_URL}/get-client-invoices`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_BILLING_TOKEN}`,
      },
    }
  );
  return data;
};

export const useFetchData = () => {
  return useQuery<Billing[]>({
    queryKey: ["fetchData"],
    queryFn: fetchData,
  });
};
