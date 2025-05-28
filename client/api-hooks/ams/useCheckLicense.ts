import { useEffect, useState } from "react";
import { useReadData } from "../../api-service/useReadData";
import { API } from "@/constants/apiEndpoints";

export const useCheckLicenseQuery = ({ enabled }: { enabled: boolean }) => {
  return useReadData<{ isValid: true }>({
    queryKey: ["ams-license"],
    endpoint: API.checkLicense,
    enabled,
  });
};

const LOCAL_STORAGE_KEY = "licenseCheckTimestamp";
const DAYS_LIMIT = 20;

const msInOneDay = 1000 * 60 * 60 * 24;

export const useCheckLicense = () => {
  const [shouldFetch, setShouldFetch] = useState(false);

  // Get the license check result hook, but disable query by default
  const licenseQuery = useCheckLicenseQuery({ enabled: shouldFetch });

  useEffect(() => {
    const savedTimestampStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!savedTimestampStr) {
      // No timestamp found, so allow fetching and save current time after fetch
      setShouldFetch(true);
      return;
    }

    const savedTimestamp = parseInt(savedTimestampStr, 10);
    if (isNaN(savedTimestamp)) {
      // Invalid timestamp, allow fetching and reset
      setShouldFetch(true);
      return;
    }

    const now = Date.now();
    const diffDays = (now - savedTimestamp) / msInOneDay;

    if (diffDays > DAYS_LIMIT) {
      setShouldFetch(true);
    } else {
      setShouldFetch(false);
    }
  }, []);

  useEffect(() => {
    if (shouldFetch && licenseQuery.data) {
      // Update timestamp in localStorage only if fetch happened and succeeded
      localStorage.setItem(LOCAL_STORAGE_KEY, Date.now().toString());
    }
  }, [shouldFetch, licenseQuery.data]);

  // Return the licenseQuery but disable fetching when shouldFetch is false
  return {
    ...licenseQuery,
    isFetching: shouldFetch && licenseQuery.isFetching,
    refetch: () => {
      // Allow manual refetch even if shouldFetch is false
      if (shouldFetch) {
        licenseQuery.refetch();
      }
    },
  };
};
