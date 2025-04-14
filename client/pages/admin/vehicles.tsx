import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import TableVehicles from "../components/pages/admin/vehicles/VehicleTalbe";

const vehicles = () => {
  return (
    <div>
      <Seo title={"Inventory List"} />
      <Pageheader
        buttonTitle="Add New Vehicle"
        currentpage="Vehicles List"
        withBreadCrumbs={false}
        triggerModalId="add-vehicle-modal"
      />
      <TableVehicles />
    </div>
  );
};

vehicles.layout = "Contentlayout";
export default vehicles;
