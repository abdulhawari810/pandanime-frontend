import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="pt-[100px]">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar layout={"home"} />
      <Outlet />
    </div>
  );
}
