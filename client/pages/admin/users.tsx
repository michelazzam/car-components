import Pageheader from "@/shared/layout-components/page-header/pageheader";
import React, { useState } from "react";
import { ReactTabulator } from "react-tabulator";
import { useListUsers, User } from "@/api-hooks/users/use-list-users";
import TableWrapper from "@/shared/Table/TableWrapper";
import ReactDOMServer from "react-dom/server";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import UserModal from "../components/pages/admin/users/UserModal";
import DeleteRecord from "../components/admin/DeleteRecord";
import { API } from "@/constants/apiEndpoints";
import { LuUserCog2 } from "react-icons/lu";
import EditUserPermissionsModal from "../components/pages/admin/users/EditUserPermissionsModal";

const Users = () => {
  const [userEditing, setUserEditing] = useState<User>();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const columns: any = [
    {
      title: "User",
      field: "username",
      sorter: "string",
      headerSort: false,
    },
    {
      title: "Salary",
      field: "salary",
      headerSort: false,
    },
    { title: "Email", field: "email", sorter: "string" },
    { title: "Role", field: "role", sorter: "string" },
    {
      title: "Created Date",
      field: "createdAt",
      sorter: "string",
      formatter: (cell: any) => {
        const date = new Date(cell.getValue());
        return date.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      title: "Actions",
      field: "actions",
      align: "center",
      width: 150,
      formatter: () => {
        return ReactDOMServer.renderToString(
          <div
            className="flex align-middle gap-2"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <button
              id="edit-permissions-btn"
              data-hs-overlay="#edit-permissions-modal"
              className="btn btn-sm btn-danger delete-btn text-success border border-success rounded-md p-1 hover:bg-success hover:text-white"
            >
              <LuUserCog2 />
            </button>
            <button
              id="edit-btn"
              className="btn btn-sm btn-primary edit-btn text-secondary border border-secondary rounded-md p-1 hover:bg-secondary hover:text-white"
              data-hs-overlay="#edit-user-modal"
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

            {/* <button
              id="edit-permissions-btn"
              data-hs-overlay="#edit-permissions-modal"
              className="btn btn-sm btn-danger delete-btn text-success border border-success rounded-md p-1 hover:bg-success hover:text-white"
            >
              <LuUserCog />
            </button> */}
          </div>
        );
      },
      cellClick: (e: any, cell: any) => {
        const rowData = cell.getRow().getData();
        const clickedButton = e.target.closest("button");

        if (clickedButton) {
          const buttonId = clickedButton.id;
          if (buttonId === "edit-btn") {
            setUserEditing(rowData);
          } else if (buttonId === "delete-btn") {
            setSelectedUserId(rowData._id);
            // return (
            //   <DeleteRecord
            //     endpoint={API.deleteUser(rowData._id)}
            //     queryKeysToInvalidate={[["users"]]}
            //   />
            // );
          } else if (buttonId === "edit-permissions-btn") {
            setUserEditing(rowData);
          }
        }
      },
    },
  ];

  //------------------API HOOKS-----------------
  const { data: users } = useListUsers();

  //--------------------------Functions----------------------------

  const onSearchValueChange = (value: string) => {
    setSearchValue(value);
  };
  const filteredUsers = users?.filter((user) => {
    const isActive = user?.isActive;

    const matchSearch =
      searchValue === ""
        ? true
        : user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.role.toLowerCase().includes(searchValue.toLowerCase());

    return matchSearch && isActive;
  });

  return (
    <div>
      {/* <Seo title={"User List"} /> */}
      <Pageheader
        currentpage="User List"
        withBreadCrumbs={false}
        triggerModalId="add-user-modal"
        buttonTitle="Add User"
      />

      <TableWrapper
        id="sort-table"
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
      >
        <ReactTabulator
          className="table-hover table-bordered"
          data={filteredUsers}
          columns={columns}
        />
      </TableWrapper>

      {/* modal */}
      {/* Add User */}
      <UserModal
        title="Add User"
        triggerModalId="add-user-modal"
        setUserEditing={() => setUserEditing(undefined)}
      />
      {/* Edit Modal */}
      <UserModal
        title="Edit User"
        triggerModalId="edit-user-modal"
        userEditing={userEditing}
        setUserEditing={setUserEditing}
      />

      {/* Edit User Permissions Modal */}
      <EditUserPermissionsModal
        title="Edit User Permissions"
        triggerModalId="edit-permissions-modal"
        editingUser={userEditing}
      />

      <DeleteRecord
        endpoint={API.deleteUser(selectedUserId)}
        queryKeysToInvalidate={[["users"]]}
      />
    </div>
  );
};
Users.layout = "Contentlayout";

export default Users;
