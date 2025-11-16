import { Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
export default function Auth() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Outlet />
    </>
  );
}
