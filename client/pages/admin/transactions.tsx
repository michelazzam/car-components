import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import TransactionTable from "@/components/pages/admin/transactions/TransactionTable";

const Transactions = () => {
  return (
    <div>
      <Seo title={"Transactions List"} />
      <Pageheader currentpage="Transactions List" withBreadCrumbs={false} />

      <TransactionTable />
    </div>
  );
};
Transactions.layout = "Contentlayout";

export default Transactions;
