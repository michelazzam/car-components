import SingleModelPageComponent from "@/components/pages/admin/makes-models/SingleModelPageComponent";
import { useRouter } from "next/router";
import React from "react";

function SingleModelOfMakePage() {
  const router = useRouter();
  const { make_id } = router.query;

  // You may want to wait for make_id to be defined (since query is undefined on first render)
  if (!make_id || typeof make_id !== "string") {
    return <div>Loading...</div>;
  }

  return <SingleModelPageComponent makeId={make_id} />;
}

export default SingleModelOfMakePage;

SingleModelOfMakePage.layout = "Contentlayout";
