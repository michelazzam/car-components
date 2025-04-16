import { useState } from "react";

import UseAuth from "@/api-hooks/useAuth";
import OrganizationInfo from "../components/pages/admin/settings/OrganizationInfo";
import ChangePasswordPage from "../components/pages/admin/settings/ChangePassword";
import { useGetOrganization } from "@/api-hooks/restaurant/use-get-organization-info";
import EditProfile from "../components/pages/admin/settings/EditProfile";

const Settings = () => {
  const { data: organization } = useGetOrganization();

  //--------------------------------State----------------------------------
  const [showEditPasswordpage, setShowEditPasswordPage] = useState(false);

  //----------------------------API-----------------------------------
  const { refetch } = UseAuth();

  //-----------------------------Function-----------------------------

  return (
    <section className="mb-5">
      <div className="w-full">
        <div className="container mx-auto py-6">
          {!showEditPasswordpage ? (
            <EditProfile
              setShowEditPasswordPage={setShowEditPasswordPage}
              refetch={refetch}
            />
          ) : (
            <ChangePasswordPage
              setShowEditPasswordPage={setShowEditPasswordPage}
            />
          )}
        </div>
      </div>
      {organization && <OrganizationInfo organization={organization} />}
    </section>
  );
};
Settings.layout = "Contentlayout";

export default Settings;
