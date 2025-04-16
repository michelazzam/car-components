import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface Category {
  _id: string;
  name: string;
}

const useListCategories = () => {
  return useReadData<Category[]>({
    queryKey: ["categories"],
    endpoint: API.listCategory,
  });
};

export { useListCategories };
