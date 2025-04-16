import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface Supplier {
  _id: string;
  name: string;
  phoneNumber:string;
  address?:string;
  loans?:number

}

const useListSupplier = () => {
  return useReadData<Supplier[]>({
    queryKey: ["supplier"],
    endpoint: API.listSupplier,
  });
};

export { useListSupplier };
