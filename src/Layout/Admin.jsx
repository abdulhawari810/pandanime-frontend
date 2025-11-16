import { Outlet, NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "../Components/Navbar";

export default function Admin() {
  return (
    <div className="pt-[70px]">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar layout={"admin"} />

      <div className="flex lg:pl-[20%] md:pl-[20%]">
        <aside
          className="border-slate-200/30 dark:border-slate-700/60
          bg-white/60 dark:bg-slate-900/70 w-[20%] h-screen hidden fixed top-0 left-0 lg:flex flex-col pt-[100px] px-2.5 gap-5 md:flex sm:hidden"
        >
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "w-full h-11 flex items-center px-5 gap-2.5 text-slate-100 bg-indigo-600/70 rounded-lg text-[18px] hover:bg-indigo-600/70 hover:text-slate-100"
                : "w-full h-11 flex items-center px-5 gap-2.5 text-slate-400  rounded-lg text-[18px] hover:bg-indigo-600/70 hover:text-slate-100"
            }
            to={"/Admin/Dashboard"}
          >
            <i className="ri-dashboard-line text-2xl"></i>
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "w-full h-11 flex items-center px-5 gap-2.5 text-slate-100 bg-indigo-600/70 rounded-lg text-[18px] hover:bg-indigo-600/70 hover:text-slate-100"
                : "w-full h-11 flex items-center px-5 gap-2.5 text-slate-400  rounded-lg text-[18px] hover:bg-indigo-600/70 hover:text-slate-100"
            }
            to={"/Admin/Users"}
          >
            <i className="ri-group-line text-2xl"></i>
            <span>Pengolaan users</span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "w-full h-11 flex items-center px-5 gap-2.5 text-slate-100 bg-indigo-600/70 rounded-lg text-[18px] hover:bg-indigo-600/70 hover:text-slate-100"
                : "w-full h-11 flex items-center px-5 gap-2.5 text-slate-400  rounded-lg text-[18px] hover:bg-indigo-600/70 hover:text-slate-100"
            }
            to={"/Admin/Anime"}
          >
            <i className="ri-database-line text-2xl"></i>
            <span>Pengolaan Anime</span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "w-full h-11 flex items-center px-5 gap-2.5 text-slate-100 bg-indigo-600/70 rounded-lg text-[18px] hover:bg-indigo-600/70 hover:text-slate-100"
                : "w-full h-11 flex items-center px-5 gap-2.5 text-slate-400  rounded-lg text-[18px] hover:bg-indigo-600/70 hover:text-slate-100"
            }
            to={"/Admin/Carousels"}
          >
            <i className="ri-multi-image-line text-2xl"></i>
            <span>Carousel</span>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "w-full h-11 flex items-center px-5 gap-2.5 text-slate-100 bg-indigo-600/70 rounded-lg text-[18px] hover:bg-indigo-600/70 hover:text-slate-100"
                : "w-full h-11 flex items-center px-5 gap-2.5 text-slate-400  rounded-lg text-[18px] hover:bg-indigo-600/70 hover:text-slate-100"
            }
            to={"/Admin/Report"}
          >
            <i className="ri-megaphone-line text-2xl"></i>
            <span>Laporan Bug</span>
          </NavLink>
        </aside>
        <Outlet />
      </div>
    </div>
  );
}
