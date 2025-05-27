import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import ExpenseTable from "@/components/pages/admin/expenses/ExpenseTable";

const Expenses = () => {
  return (
    <div>
      <Seo title={"Expenses List"} />
      <Pageheader
        currentpage="Expenses List"
        withBreadCrumbs={false}
        triggerModalId="add-expense-modal"
        buttonTitle="Add Expense"
      />

      <ExpenseTable />
    </div>
  );
};
Expenses.layout = "Contentlayout";

export default Expenses;
