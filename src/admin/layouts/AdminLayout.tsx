import { Outlet } from "react-router";

export const AdminLayout = () => {
  return (
    <>
      <div className="bg-blue-500 min-h-screen">
        <h1>Admin Layout</h1>
        <Outlet />
      </div>
    </>
  );
};
