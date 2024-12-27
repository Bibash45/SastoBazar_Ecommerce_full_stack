import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./admin/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      {userInfo && userInfo.isAdmin ? (
        <div className="d-flex  min-vh-100 layout">
          {/* Sidebar */}
          <Sidebar />

          {/* Content Section */}
          <div className="content  overflow-auto w-100">
            <Outlet />
          </div>
        </div>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};

export default AdminRoute;
