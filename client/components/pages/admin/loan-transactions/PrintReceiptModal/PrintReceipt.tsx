import React from "react";
import { dateTimeToDateFormat } from "@/lib/helpers/formatDate";
import { formatNumber } from "@/lib/helpers/formatNumber";
import { useGetOrganization } from "@/api-hooks/restaurant/use-get-organization-info";
import { LoanTransaction } from "@/api-hooks/money-transactions/use-list-loans-transactions";
import numWords from "num-words";

const formatCurrencyInWords = (amount: number) => {
  if (typeof amount !== "number" || isNaN(amount)) return "0.00";
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  const dollars = Math.floor(absoluteAmount);
  const cents = Math.round((absoluteAmount - dollars) * 100);
  return `${isNegative ? "minus " : ""}${numWords(dollars)} dollar${
    dollars !== 1 ? "s" : ""
  } ${
    cents > 0 ? `and ${numWords(cents)} cent${cents !== 1 ? "s" : ""}` : ""
  } only`;
};

function PrintReceipt({ transaction }: { transaction: LoanTransaction }) {
  const { data: organization } = useGetOrganization();

  if (!organization) {
    return <div className="p-5 text-center">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden max-w-full p-4">
      <div className="flex flex-col">
        <PrintHeader organization={organization} title="Receipt" />
        <PrintTransactionDetails transaction={transaction} />
        <TransactionSummary transaction={transaction} />
        <div className="px-4 py-2 flex justify-center text-xl font-medium text-center">
          <p>
            Transaction amount:{" "}
            <span className="underline capitalize">
              {formatCurrencyInWords(transaction.amount)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const PrintHeader = ({
  title,
  organization,
}: {
  title: string;
  organization: any;
}) => (
  <div className="grid grid-cols-10 px-4 py-2 border-b border-gray-200">
    <div className="col-span-6 flex items-start gap-x-2">
      <img
        src={"/assets/images/brand-logos/logo.jpg"}
        alt="logo"
        className="w-32"
      />
      <div>
        <h4 className="text-lg font-semibold">{organization?.name}</h4>
        <p className="text-sm space-y-1">
          {organization?.phoneNumber}
          <br />
          {organization?.email && (
            <>
              {organization?.email}
              <br />
            </>
          )}
          {organization?.address}
          <span className="block text-xs mt-2 font-bold">
            VAT # {organization?.tvaNumber}
          </span>
        </p>
      </div>
    </div>

    <div className="col-span-4 flex flex-col ">
      <h3 className="text-5xl font-bold">{title}</h3>
    </div>
  </div>
);

const PrintTransactionDetails = ({
  transaction,
}: {
  transaction: LoanTransaction;
}) => {
  const entity = transaction.customer || transaction.supplier;
  const entityType = transaction.customer ? "Customer" : "Supplier";

  return (
    <div className="grid grid-cols-12 px-4 py-2">
      <div className="col-span-8">
        <p>
          <span className="font-light text-gray-600">{entityType}:</span>
          <br />
          {entity?.name && (
            <h4 className="text-lg font-semibold">{entity.name}</h4>
          )}
          {entity?.address && (
            <h4 className="text-xs">
              Address <span className="font-bold">{entity.address}</span>
            </h4>
          )}
          {entity?.phoneNumber && (
            <h4 className="text-xs">
              Phone <span className="font-bold">{entity.phoneNumber}</span>
            </h4>
          )}
          {entity && "tvaNumber" in entity && entity.tvaNumber && (
            <h4 className="text-xs">
              TVA# <span className="font-bold">{entity.tvaNumber}</span>
            </h4>
          )}
        </p>
      </div>
      <div className="col-span-4">
        <div className="text-right">
          <p className="text-sm">
            <span className="font-light">Transaction #</span>
            <br />
            <span className="font-bold">{transaction.number}</span>
          </p>
          <p className="text-sm mt-2">
            <span className="font-light">Date:</span>
            <br />
            <span className="font-bold">
              {dateTimeToDateFormat(transaction.createdAt)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const TransactionSummary = ({
  transaction,
}: {
  transaction: LoanTransaction;
}) => {
  return (
    <div className="px-4 py-2 border-t border-gray-200">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Transaction Details</h4>
          <p className="text-sm">
            <span className="font-light">Type:</span>{" "}
            <span className="font-bold">
              {transaction.type === "new-invoice"
                ? "New Invoice"
                : transaction.type === "pay-invoice-loan"
                ? "Pay Invoice Loan"
                : transaction.type === "new-purchase"
                ? "New Purchase"
                : transaction.type === "pay-purchase-loan"
                ? "Pay Purchase Loan"
                : transaction.type}
            </span>
          </p>
          <p className="text-sm">
            <span className="font-light">Amount:</span>{" "}
            <span className="font-bold">
              {formatNumber(transaction.amount)} USD
            </span>
          </p>
          <p className="text-sm">
            <span className="font-light">Remaining Loan:</span>{" "}
            <span className="font-bold">
              {formatNumber(transaction.loanRemaining)} USD
            </span>
          </p>
        </div>
        {(transaction.invoice || transaction.expense) && (
          <div>
            <h4 className="font-semibold mb-2">
              {transaction.invoice ? "Invoice Details" : "Expense Details"}
            </h4>
            {transaction.invoice && (
              <>
                <p className="text-sm">
                  <span className="font-light">Invoice #:</span>{" "}
                  <span className="font-bold">
                    {transaction.invoice.number}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-light">Total:</span>{" "}
                  <span className="font-bold">
                    {formatNumber(transaction.invoice.accounting.totalUsd)} USD
                  </span>
                </p>
              </>
            )}
            {transaction.expense && (
              <>
                <p className="text-sm">
                  <span className="font-light">Date:</span>{" "}
                  <span className="font-bold">
                    {dateTimeToDateFormat(transaction.expense.date)}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-light">Amount:</span>{" "}
                  <span className="font-bold">
                    {formatNumber(transaction.expense.amount)} USD
                  </span>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintReceipt;
