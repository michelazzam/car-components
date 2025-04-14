import { useUpdateData } from "@/api-service/useUpdateData";
import { API } from "@/constants/apiEndpoints";
import { OrganizationSchema } from "@/lib/apiValidations";

export function useEditOrganizationInfo({
  callBackOnSuccess,
}: {
  callBackOnSuccess?: () => void;
}) {
  return useUpdateData<OrganizationSchema>({
    queryKeysToInvalidate: [["organization"]],
    endpoint: API.editOrganization,
    callBackOnSuccess,
  });
}
