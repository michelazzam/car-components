import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import TableWrapper from "@/shared/Table/TableWrapper";
import React, { useState } from "react";
import { ReactTabulator } from "react-tabulator";
import { FaRegEdit } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import {
  Category,
  useListCategories,
} from "@/api-hooks/categories/use-list-categories";
import AddEditCategoryModal from "../components/pages/admin/categories/AddEditCategoryModal";
import DeleteRecord from "../components/admin/DeleteRecord";
import { API } from "@/constants/apiEndpoints";
import { FaRegTrashCan } from "react-icons/fa6";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useRouter } from "next/router";

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();

  const { data: categories } = useListCategories();
  const columns = [
    {
      title: "Name",
      field: "name",
      headerSort: false,
    },
    {
      title: "Actions",
      field: "actions",
      width: 150,
      formatter: () =>
        ReactDOMServer.renderToString(
          <div
            className="flex align-middle gap-2"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <button
              id="edit-btn"
              className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
              data-hs-overlay="#edit-category-modal"
            >
              <FaRegEdit />
            </button>
            <button
              id="delete-btn"
              className="btn btn-sm btn-danger delete-btn text-danger border border-danger rounded-md p-1 hover:bg-danger hover:text-white"
              data-hs-overlay="#delete-record-modal"
            >
              <FaRegTrashCan />
            </button>
          </div>
        ),

      cellClick: (e: any, cell: any) => {
        const rowData = cell.getRow().getData() as Category;
        const clickedButton = e.target.closest("button");

        if (clickedButton) {
          const buttonId = clickedButton.id;
          if (buttonId === "edit-btn") setSelectedCategory(rowData);
          else if (buttonId === "delete-btn") setSelectedCategory(rowData);
        }
      },
    },
  ];

  const [searchValue, setSearchValue] = useState("");
  const onSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  const filteredCategories = categories?.filter((printer) => {
    return searchValue === ""
      ? true
      : printer.name.toLowerCase().includes(searchValue.toLowerCase());
  });

  const router = useRouter();

  return (
    <div>
      <Seo title={"Categories List"} />
      {/* back btn to the products list */}
      <button
        onClick={() => router.back()}
        className="mt-2 flex space-x-1 items-center"
      >
        <AiOutlineArrowLeft />
        <span>Back to Products</span>
      </button>

      <Pageheader
        buttonTitle="Add Category"
        currentpage="Categories List"
        withBreadCrumbs={false}
        triggerModalId="add-category-modal"
      />

      <TableWrapper
        id="categories-table"
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
      >
        <ReactTabulator
          className="table-hover table-bordered"
          data={filteredCategories}
          columns={columns}
        />
      </TableWrapper>

      <AddEditCategoryModal triggerModalId="add-category-modal" />
      <AddEditCategoryModal
        triggerModalId="edit-category-modal"
        category={selectedCategory}
      />

      {selectedCategory && (
        <DeleteRecord
          endpoint={API.deleteCategory(selectedCategory._id)}
          queryKeysToInvalidate={[["categories"]]}
        />
      )}
    </div>
  );
};

Categories.layout = "Contentlayout";
export default Categories;
