import React from "react";
import { Table, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { FaTrash, FaTimes, FaEdit, FaCheck } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import Paginate from "../../components/Paginate";
import UserPaginate from "../../components/admin/UserPaginate";
import SearchForUser from "../../components/admin/SearchForUser";

const UserListScreen = () => {
  const { pageNumber } = useParams();
  const { keyword } = useParams();
  const {
    data: users,
    refetch,
    isLoading,
    error,
  } = useGetUsersQuery({
    pageNumber,
    keyword,
  });

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      <div
        style={{
          paddingLeft: "250px",
        }}
      >
        {loadingDelete && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data.message}</Message>
        ) : (
          <>
            <marquee >
              <h1 >Users List</h1>
            </marquee>
            <SearchForUser />
            <Table striped hover responsive className="table-sm">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ADMIN</th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users?.users?.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td>
                      {user.isAdmin ? (
                        <FaCheck style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}{" "}
                    </td>

                    <td>
                      <Link to={`/admin/user/${user._id}/edit`}>
                        <Button variant="light" className="btn-sm">
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        style={{ color: "white" }}
                        onClick={() => {
                          deleteHandler(user._id);
                        }}
                      >
                        <FaTrash style={{ color: "white" }} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <UserPaginate
              pages={users.pages}
              page={users.page}
              isAdmin={true}
            />
          </>
        )}
      </div>
    </>
  );
};

export default UserListScreen;
