import { useReadData } from "@/api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export interface OrganizationInfoType {
  _id: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  tvaNumber: string;
  tvaPercentage: number;
  mdf: string;
  // landline: string;
}

export function useGetOrganization() {
  return useReadData<OrganizationInfoType>({
    queryKey: ["restaurant"],
    endpoint: API.getOrganization,
  });
}
