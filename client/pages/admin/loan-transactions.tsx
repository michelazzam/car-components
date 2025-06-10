import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import LoanTransactionsTable from "@/components/pages/admin/loan-transactions/LoanTransactionTable";
const Transactions = () => {
  return (
    <div>
      <Seo title={"Loan Transactions List"} />
      <Pageheader
        currentpage="Loan Transactions List"
        withBreadCrumbs={false}
      />

      <LoanTransactionsTable />
    </div>
  );
};
Transactions.layout = "Contentlayout";

export default Transactions;
